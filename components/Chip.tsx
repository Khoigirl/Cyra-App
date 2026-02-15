
import React from 'react';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

const Chip: React.FC<ChipProps> = ({ label, selected = false, onPress }) => {
  return (
    <button 
      onClick={onPress}
      className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
        selected 
        ? "bg-[#8FAF9D] border-[#8FAF9D] text-white" 
        : "bg-white border-[#E5E7EB] text-[#6B7280]"
      }`}
    >
      {label}
    </button>
  );
};

export default Chip;
