
import React from 'react';
import { View, Text } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);

interface ProgressHeaderProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressHeader: React.FC<ProgressHeaderProps> = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <StyledView className="w-full pt-12 px-6">
      <StyledView className="flex-row justify-between items-center mb-3">
        <StyledText className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">
          Step {currentStep} of {totalSteps}
        </StyledText>
      </StyledView>
      <StyledView className="h-1.5 w-full bg-[#E5E7EB] rounded-full overflow-hidden">
        <StyledView 
          className="h-full bg-[#8FAF9D] rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </StyledView>
    </StyledView>
  );
};

export default ProgressHeader;
