
import React from 'react';
import { Supplement, ColorKey } from '../supplementTypes';
import { triggerHaptic } from '../utils/haptics';

interface SupplementItemProps {
  supplement: Supplement;
  checked: boolean;
  onToggle: () => void;
  streak: number;
  weeklyCount: number;
}

const COLOR_MAP: Record<ColorKey, string> = {
  sage: 'bg-[#8FAF9D]',
  rose: 'bg-[#FADADD]',
  lavender: 'bg-[#E1D5E7]',
  blue: 'bg-[#DDEEF4]',
  neutral: 'bg-[#F7F4F1]'
};

const SupplementItem: React.FC<SupplementItemProps> = ({ supplement, checked, onToggle, streak, weeklyCount }) => {
  const handleToggle = () => {
    triggerHaptic(checked ? 'light' : 'medium');
    onToggle();
  };

  return (
    <button 
      onClick={handleToggle}
      className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm active:scale-[0.98] transition-all mb-3 text-left"
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl ${COLOR_MAP[supplement.colorKey]} flex items-center justify-center text-lg`}>
          {supplement.form === 'tea' ? '🍵' : supplement.form === 'powder' ? '🥄' : '💊'}
        </div>
        <div>
          <h4 className={`font-bold text-sm ${checked ? 'text-gray-400 line-through' : 'text-[#1F2937]'}`}>
            {supplement.name}
          </h4>
          <div className="flex gap-2 mt-1">
            <span className="text-[9px] font-bold text-[#8FAF9D] uppercase tracking-tighter">
              Streak: {streak}d
            </span>
            <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-tighter">
              This week: {weeklyCount}/7
            </span>
          </div>
        </div>
      </div>

      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
        checked ? 'bg-[#8FAF9D] border-[#8FAF9D]' : 'border-gray-200'
      }`}>
        {checked && (
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
    </button>
  );
};

export default SupplementItem;
