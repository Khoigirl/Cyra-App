
export interface PhaseTheme {
  accent: string;
  tintBg: string;
  chipBg: string;
  text: string;
}

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';

export const PHASE_THEMES: Record<CyclePhase, PhaseTheme> = {
  menstrual: {
    accent: '#D89CA4',
    tintBg: '#F9F2F3', 
    chipBg: '#F3E9EA',
    text: '#8E5E63',
  },
  follicular: {
    accent: '#8FA899',
    tintBg: '#F4F7F5', 
    chipBg: '#EAEEEC',
    text: '#4A5D4E',
  },
  ovulatory: {
    accent: '#A4B4D8',
    tintBg: '#F2F5F9',
    chipBg: '#E9EEF3',
    text: '#5E6E8E',
  },
  luteal: {
    accent: '#D8BFA4',
    tintBg: '#F9F5F2',
    chipBg: '#F3EEE9',
    text: '#8E7E5E',
  },
};

export const getPhaseTheme = (phaseName?: string): { phase: CyclePhase; theme: PhaseTheme } => {
  const normalized = (phaseName || 'follicular').toLowerCase() as CyclePhase;
  const phase = PHASE_THEMES[normalized] ? normalized : 'follicular';
  return {
    phase,
    theme: PHASE_THEMES[phase],
  };
};
