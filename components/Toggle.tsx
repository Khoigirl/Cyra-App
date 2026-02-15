
import React from 'react';

interface ToggleProps {
  label: string;
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ label, isEnabled, onToggle }) => {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm font-medium text-[#1F2937]">{label}</span>
      <button
        onClick={() => onToggle(!isEnabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
          isEnabled ? 'bg-[#8FAF9D]' : 'bg-[#E5E7EB]'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
            isEnabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

export default Toggle;
