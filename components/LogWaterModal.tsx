
import React, { useState } from 'react';
import Button from './Button';

interface LogWaterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (amount: number) => void;
}

const WATER_PRESETS = [
  { label: 'Glass', amount: 0.25, icon: '🥛' },
  { label: 'Bottle', amount: 0.5, icon: '🍶' },
  { label: 'Large Bottle', amount: 0.75, icon: '💧' },
];

const LogWaterModal: React.FC<LogWaterModalProps> = ({ isOpen, onClose, onSave }) => {
  const [customAmount, setCustomAmount] = useState('');

  if (!isOpen) return null;

  const handleSave = (amount: number) => {
    onSave(amount);
    onClose();
  };

  const handleCustomSave = () => {
    const amount = parseFloat(customAmount);
    if (isNaN(amount) || amount <= 0) return;
    handleSave(amount);
    setCustomAmount('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 animate-in fade-in duration-300">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="w-full max-w-md bg-white rounded-t-[28px] p-8 pb-12 shadow-2xl animate-in slide-in-from-bottom-full duration-300 relative z-50">
        <div className="w-12 h-1.5 bg-[#E5E7EB] rounded-full mx-auto mb-8" />
        
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-[#1F2937]">Log Water</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#F7F4F1] flex items-center justify-center text-[#6B7280]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {WATER_PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handleSave(preset.amount)}
                className="flex flex-col items-center justify-center p-4 bg-[#DDEEF4]/30 rounded-2xl border border-[#DDEEF4]/50 transition-all active:scale-95 hover:bg-[#DDEEF4]/50"
              >
                <span className="text-2xl mb-2">{preset.icon}</span>
                <span className="text-[10px] font-bold text-[#1F2937] uppercase tracking-wider">{preset.label}</span>
                <span className="text-[9px] text-[#6B7280] font-medium mt-0.5">{preset.amount}L</span>
              </button>
            ))}
          </div>

          <div className="bg-[#F7F4F1] p-5 rounded-[20px] border border-[#E5E7EB]">
            <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-3 block">Custom Amount (Liters)</label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 0.4"
                className="flex-1 bg-white border border-[#E5E7EB] rounded-[14px] px-4 py-3 text-sm outline-none focus:border-[#8FAF9D] transition-colors"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
              />
              <button
                onClick={handleCustomSave}
                className="bg-[#8FAF9D] text-white px-6 rounded-[14px] text-xs font-bold shadow-sm active:scale-95 transition-all"
              >
                Add
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
             <span className="text-lg">💧</span>
             <p className="text-[10px] text-blue-700/70 leading-relaxed font-medium italic">
               Aim for 2.0L daily for optimal hormone clearance.
             </p>
          </div>

          <Button label="Cancel" variant="tertiary" onPress={onClose} className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default LogWaterModal;
