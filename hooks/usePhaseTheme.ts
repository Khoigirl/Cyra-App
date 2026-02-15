
import { useMemo } from 'react';
import { getPhaseTheme, PhaseTheme, CyclePhase } from '../theme/phaseTokens';

export const usePhaseTheme = (phaseName?: string): { phase: CyclePhase; theme: PhaseTheme } => {
  return useMemo(() => getPhaseTheme(phaseName), [phaseName]);
};
