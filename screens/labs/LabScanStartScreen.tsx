
import React, { useState, useRef, useEffect } from 'react';
import Screen from '../../components/Screen';
import Card from '../../components/Card';
import Button from '../../components/Button';
import PermissionModal from '../../components/PermissionModal';
import { extractTextFromImage } from '../../labs/ocrService';
import { triggerHaptic } from '../../utils/haptics';

interface LabScanStartScreenProps {
  onBack: () => void;
  onTextExtracted: (text: string) => void;
}

const LabScanStartScreen: React.FC<LabScanStartScreenProps> = ({ onBack, onTextExtracted }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const steps = ["Opening scanner...", "Analyzing ink...", "Extracting markers...", "Digitizing values..."];

  useEffect(() => {
    let interval: any;
    if (isProcessing) {
      setProcessingStep(0);
      interval = setInterval(() => {
        setProcessingStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  // Handle stream cleanup
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Attach stream to video element once it is rendered
  useEffect(() => {
    if (isCameraActive && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraActive, stream]);

  const handleStartCamera = () => {
    triggerHaptic('light');
    const granted = localStorage.getItem('cyra_perm_camera');
    if (granted === 'true') {
      executeStartCamera();
    } else {
      setShowPermissionModal(true);
    }
  };

  const executeStartCamera = async () => {
    setShowPermissionModal(false);
    localStorage.setItem('cyra_perm_camera', 'true');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      });
      setStream(mediaStream);
      setIsCameraActive(true);
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      alert(`Could not access camera: ${err.name}. Please ensure permissions are granted.`);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Safety check for video readiness
      if (video.videoWidth === 0) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        triggerHaptic('medium');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        stopCamera();
        processImage(dataUrl);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      triggerHaptic('light');
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        processImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (dataUrl: string) => {
    setIsProcessing(true);
    try {
      const text = await extractTextFromImage(dataUrl);
      triggerHaptic('success');
      onTextExtracted(text);
    } catch (error: any) {
      triggerHaptic('error');
      alert(error.message || "An unexpected error occurred during digitization.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isCameraActive) {
    return (
      <Screen hideHeader title="Capture Report" scrollable={false}>
        <div className="flex flex-col h-full bg-black -mx-8">
          <div className="relative flex-1 flex items-center justify-center overflow-hidden">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover" 
            />
            {/* Viewport Overlay */}
            <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
               <div className="w-full h-full border-2 border-white/30 rounded-3xl" />
            </div>
          </div>
          <div className="bg-[#1F2937] p-8 pb-12 flex flex-col items-center gap-6">
            <div className="flex items-center justify-between w-full max-w-xs">
               <button onClick={stopCamera} className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition-transform">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </button>
               <button onClick={capturePhoto} className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center p-1">
                 <div className="w-full h-full rounded-full bg-white active:scale-90 transition-transform" />
               </button>
               <div className="w-12 h-12" />
            </div>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">Center the page and hold still</p>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </Screen>
    );
  }

  return (
    <Screen hideHeader title="Scan Report">
      <div className="pt-4 pb-12">
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Cancel
        </button>

        <div className="text-center mb-10 px-4">
          <div className="w-20 h-20 bg-[#8FAF9D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📄</span>
          </div>
          <h2 className="text-2xl font-bold text-[#1F2937]">Lab Intelligence</h2>
          <p className="text-sm text-[#6B7280] mt-2 leading-relaxed">
            Digitize your paper results to see patterns across cycles and prepare for your next clinic visit.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
            <Card onClick={handleStartCamera} className="border-dashed border-[#8FAF9D]/30 bg-white p-6 flex flex-col items-center justify-center gap-3 active:scale-[0.98] transition-all h-40">
              <div className="w-12 h-12 bg-[#8FAF9D] rounded-2xl flex items-center justify-center text-white shadow-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-[#1F2937]">Use Camera</p>
            </Card>

            <Card onClick={() => fileInputRef.current?.click()} className="border-dashed border-[#DDEEF4] bg-white p-6 flex flex-col items-center justify-center gap-3 active:scale-[0.98] transition-all h-40">
              <div className="w-12 h-12 bg-[#DDEEF4] rounded-2xl flex items-center justify-center text-[#1F2937] shadow-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <p className="text-sm font-bold text-[#1F2937]">Upload File</p>
            </Card>
        </div>
        
        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />

        <div className="bg-[#F7F4F1] p-6 rounded-3xl border border-[#E5E7EB]">
           <div className="flex items-center gap-3 mb-3">
             <span className="text-lg">🛡️</span>
             <h4 className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Privacy Guarantee</h4>
           </div>
           <p className="text-xs text-[#6B7280] leading-relaxed">
             Images are analyzed in real-time by secure AI models. Your photos are never stored. Cyra only keeps the extracted numbers for your history.
           </p>
        </div>

        <PermissionModal isOpen={showPermissionModal} onClose={() => setShowPermissionModal(false)} onConfirm={executeStartCamera} type="camera" />

        {isProcessing && (
          <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-10 text-center animate-in fade-in duration-300">
            <div className="w-16 h-16 border-4 border-[#8FAF9D]/20 border-t-[#8FAF9D] rounded-full animate-spin mb-8" />
            <h3 className="text-2xl font-bold text-[#1F2937]">{steps[processingStep]}</h3>
            <p className="text-sm text-[#6B7280] mt-3 font-medium italic opacity-60">This may take up to 30 seconds...</p>
          </div>
        )}
      </div>
    </Screen>
  );
};

export default LabScanStartScreen;
