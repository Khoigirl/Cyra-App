
import React from 'react';
import Card from './Card';
import Button from './Button';

interface WhyThisModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  detail: string;
}

const WhyThisModal: React.FC<WhyThisModalProps> = ({ isOpen, onClose, title, detail }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-6 animate-in fade-in duration-300">
      <div className="fixed inset-0" onClick={onClose} />
      <Card className="w-full max-w-sm p-8 shadow-2xl relative z-10 animate-in zoom-in-95 duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-[#8FAF9D]/10 rounded-full flex items-center justify-center text-xl mb-6">
            ✨
          </div>
          <h3 className="text-xl font-bold text-[#1F2937] mb-3">Personalized for you</h3>
          <p className="text-[11px] font-bold text-[#8FAF9D] uppercase tracking-widest mb-4">Focusing on {title}</p>
          
          <div className="bg-[#F7F4F1] p-5 rounded-2xl border border-[#E5E7EB] w-full text-left mb-8">
            <p className="text-xs text-[#6B7280] leading-relaxed italic">
              {detail}
            </p>
          </div>

          <p className="text-[10px] text-[#9CA3AF] mb-8 leading-relaxed">
            Cyra matches your logs with evidence-based strategies to find what your body needs most this week.
          </p>

          <Button label="Got it" onPress={onClose} className="w-full" />
        </div>
      </Card>
    </div>
  );
};

export default WhyThisModal;
