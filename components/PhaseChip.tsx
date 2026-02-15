
import React from 'react';
import { View, Text } from 'react-native';
import { styled } from 'nativewind';
import { usePhaseTheme } from '../hooks/usePhaseTheme';

const StyledView = styled(View);
const StyledText = styled(Text);

interface PhaseChipProps {
  phase: string;
  className?: string;
}

const PhaseChip: React.FC<PhaseChipProps> = ({ phase, className = '' }) => {
  const { theme, phase: phaseKey } = usePhaseTheme(phase);

  return (
    <StyledView 
      className={`px-4 py-1.5 rounded-full border ${className}`}
      style={{ 
        backgroundColor: theme.chipBg, 
        borderColor: `${theme.accent}30`,
      }}
    >
      <StyledText 
        className="text-[10px] font-bold uppercase tracking-widest"
        style={{ color: theme.text }}
      >
        {phaseKey}
      </StyledText>
    </StyledView>
  );
};

export default PhaseChip;
