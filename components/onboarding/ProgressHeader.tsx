
import React from 'react';

interface ProgressHeaderProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressHeader: React.FC<ProgressHeaderProps> = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full pt-12 px-6">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
      <div className="h-1.5 w-full bg-[#E5E7EB] rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#8FAF9D] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressHeader;
