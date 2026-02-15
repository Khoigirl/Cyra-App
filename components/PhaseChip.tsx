
import React from 'react';
import { usePhaseTheme } from '../hooks/usePhaseTheme';

interface PhaseChipProps {
  phase: string;
  className?: string;
}

const PhaseChip: React.FC<PhaseChipProps> = ({ phase, className = '' }) => {
  const { theme, phase: phaseKey } = usePhaseTheme(phase);

  return (
    <div 
      className={`px-4 py-1.5 rounded-full border text-[9px] font-bold uppercase tracking-[0.15em] ${className}`}
      style={{ 
        backgroundColor: theme.chipBg, 
        borderColor: `${theme.accent}30`,
        color: theme.text 
      }}
    >
      {phaseKey}
    </div>
  );
};

export default PhaseChip;
