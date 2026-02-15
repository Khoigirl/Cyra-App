
import React, { useState } from 'react';
import Button from './Button';
import { useWellness } from '../context/WellnessContext';

interface LogPeriodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (startDate: string, duration: number) => void;
  currentStartDate: string;
  currentDuration: number;
}

const LogPeriodModal: React.FC<LogPeriodModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  currentStartDate, 
  currentDuration 
}) => {
  const { cycleLength, setCycleLength } = useWellness();
  const [startDate, setStartDate] = useState(currentStartDate);
  const [duration, setDuration] = useState(currentDuration);
  const [localCycleLength, setLocalCycleLength] = useState(cycleLength);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(startDate, duration);
    setCycleLength(localCycleLength);
    onClose();
  };

  const DURATION_OPTIONS = [3, 4, 5, 6, 7, 8];
  const CYCLE_LENGTH_OPTIONS = [21, 24, 28, 30, 32, 35, 40, 45];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 animate-in fade-in duration-300">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="w-full max-w-md bg-white rounded-t-[28px] p-8 pb-12 shadow-2xl animate-in slide-in-from-bottom-full duration-300 relative z-50 overflow-y-auto max-h-[90vh] hide-scrollbar">
        <div className="w-12 h-1.5 bg-[#E5E7EB] rounded-full mx-auto mb-8" />
        
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-[#1F2937]">Period Settings</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#F7F4F1] flex items-center justify-center text-[#6B7280]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-8">
          <div>
            <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-3 block px-1">Last Period Start Date</label>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full h-14 bg-[#F7F4F1] border border-[#E5E7EB] rounded-[18px] px-5 text-sm outline-none focus:border-[#8FAF9D] font-medium"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-4 block px-1">Typical Duration (Days)</label>
            <div className="flex justify-between gap-2">
              {DURATION_OPTIONS.map(d => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                    duration === d 
                      ? "bg-[#8FAF9D] text-white shadow-md scale-110" 
                      : "bg-[#F7F4F1] text-[#6B7280] hover:bg-gray-100"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-4 block px-1">Typical Cycle Length (Days)</label>
            <div className="flex flex-wrap gap-2">
              {CYCLE_LENGTH_OPTIONS.map(cl => (
                <button
                  key={cl}
                  onClick={() => setLocalCycleLength(cl)}
                  className={`px-4 py-2 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                    localCycleLength === cl 
                      ? "bg-[#8FAF9D] text-white shadow-md" 
                      : "bg-[#F7F4F1] text-[#6B7280] border border-[#E5E7EB]"
                  }`}
                >
                  {cl}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-[#FADADD]/20 rounded-2xl border border-[#FADADD]/40 flex items-start gap-3">
            <span className="text-lg">🌸</span>
            <p className="text-[10px] text-[#C2185B]/70 leading-relaxed font-medium">
              Updating these values helps Cyra refine your hormonal predictions and wellness insights.
            </p>
          </div>

          <div className="pt-2">
            <Button label="Save Details" onPress={handleSave} className="w-full" />
            <Button label="Cancel" variant="tertiary" onPress={onClose} className="w-full mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogPeriodModal;
