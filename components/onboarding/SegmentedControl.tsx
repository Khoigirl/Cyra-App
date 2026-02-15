
import React from 'react';

interface SegmentedControlProps {
  options: string[];
  selectedOption?: string;
  onSelect: (option: string) => void;
  label?: string;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({ options, selectedOption, onSelect, label }) => {
  return (
    <div className="flex flex-col gap-3">
      {label && <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">{label}</p>}
      <div className="flex flex-wrap gap-2 p-1.5 bg-white border border-[#E5E7EB] rounded-[18px]">
        {options.map((option) => {
          const isSelected = selectedOption === option;
          return (
            <button
              key={option}
              onClick={() => onSelect(option)}
              className={`flex-1 min-w-[60px] py-2.5 rounded-[14px] text-sm font-medium transition-all ${
                isSelected 
                ? "bg-[#8FAF9D] text-white shadow-sm" 
                : "text-[#6B7280] hover:bg-gray-50"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SegmentedControl;
