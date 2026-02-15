
import React, { useState } from 'react';

interface DropdownProps {
  label?: string;
  options: string[];
  value?: string;
  onSelect: (value: string) => void;
  placeholder?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, value, onSelect, placeholder = "Select option" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2 relative">
      {label && <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">{label}</p>}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white border border-[#E5E7EB] rounded-[14px] px-5 py-3.5 text-left transition-all active:bg-gray-50"
      >
        <span className={value ? "text-[#1F2937] font-medium" : "text-[#6B7280]"}>
          {value || placeholder}
        </span>
        <svg 
          className={`w-5 h-5 text-[#8FAF9D] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E7EB] rounded-[18px] shadow-lg z-30 max-h-48 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-5 py-3 text-sm transition-colors ${
                  value === option 
                    ? "bg-[#F7F4F1] text-[#8FAF9D] font-bold" 
                    : "text-[#1F2937] hover:bg-gray-50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dropdown;
