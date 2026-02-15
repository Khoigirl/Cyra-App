
import React, { useState } from 'react';
import Button from './Button';
import Chip from './Chip';
import { triggerHaptic } from '../utils/haptics';

interface LogSymptomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (log: { symptoms: string[]; intensity: number; notes: string }) => void;
}

const SYMPTOMS_LIST = [
  "Acne", "Fatigue", "Cravings", "Bloating", "Mood swings", 
  "Hair growth", "Hair thinning", "Irregular periods", "Cramps", "Headache"
];

const LogSymptomModal: React.FC<LogSymptomModalProps> = ({ isOpen, onClose, onSave }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [intensity, setIntensity] = useState(3);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const toggleSymptom = (symptom: string) => {
    triggerHaptic('light');
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom) 
        : [...prev, symptom]
    );
  };

  const handleSave = () => {
    if (selectedSymptoms.length === 0) return;
    triggerHaptic('success');
    onSave({ symptoms: selectedSymptoms, intensity, notes });
    setSelectedSymptoms([]);
    setIntensity(3);
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 animate-in fade-in duration-300">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="w-full max-w-md bg-white rounded-t-[28px] p-8 pb-12 shadow-2xl animate-in slide-in-from-bottom-full duration-300 relative z-50 overflow-y-auto max-h-[90vh] hide-scrollbar">
        <div className="w-12 h-1.5 bg-[#E5E7EB] rounded-full mx-auto mb-8" />
        
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-[#1F2937]">Log Symptoms</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#F7F4F1] flex items-center justify-center text-[#6B7280]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-8">
          <div>
            <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-4 block text-center">How are you feeling?</label>
            <div className="flex flex-wrap justify-center gap-2">
              {SYMPTOMS_LIST.map(s => (
                <Chip 
                  key={s} 
                  label={s} 
                  selected={selectedSymptoms.includes(s)} 
                  onPress={() => toggleSymptom(s)} 
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-4 block text-center">Intensity (1-5)</label>
            <div className="flex justify-between items-center px-4">
              {[1, 2, 3, 4, 5].map(level => (
                <button
                  key={level}
                  onClick={() => { triggerHaptic('light'); setIntensity(level); }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    intensity === level 
                      ? "bg-[#8FAF9D] text-white scale-110 shadow-md" 
                      : "bg-[#F7F4F1] text-[#6B7280] hover:bg-gray-100"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-3 block">Additional Notes</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific triggers or details?"
              className="w-full bg-[#F7F4F1] border border-[#E5E7EB] rounded-[14px] px-5 py-3.5 text-sm outline-none focus:border-[#8FAF9D] h-24 resize-none transition-all"
            />
          </div>

          <Button 
            label="Save Symptoms" 
            onPress={handleSave} 
            className={`w-full ${selectedSymptoms.length === 0 ? 'opacity-50 pointer-events-none' : ''}`} 
          />
        </div>
      </div>
    </div>
  );
};

export default LogSymptomModal;
