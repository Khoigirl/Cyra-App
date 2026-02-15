
export interface PhaseEducation {
  explanation: string;
  whatHelps: string[];
}

export const PHASE_EDUCATION: Record<string, PhaseEducation> = {
  menstrual: {
    explanation: "Your hormone levels are at their lowest point, and your body is focusing its energy on shedding and renewal. It's a natural time for inward reflection and restoration.",
    whatHelps: [
      "Prioritize iron-rich foods like lentils or spinach.",
      "Stay hydrated with warm, soothing infusions.",
      "Opt for restorative rest over intense activity."
    ]
  },
  follicular: {
    explanation: "Estrogen and FSH are beginning to rise, bringing a sense of renewal and fresh energy. This is a creative window where your brain is naturally more primed for new ideas.",
    whatHelps: [
      "Include fermented foods for gut-hormone health.",
      "Try new routines or creative hobbies.",
      "Support rising energy with light-to-moderate movement."
    ]
  },
  ovulatory: {
    explanation: "Estrogen peaks and testosterone rises, often bringing a boost in confidence, social energy, and physical strength. You're in your most vibrant metabolic window.",
    whatHelps: [
      "Focus on fiber to help your liver process peak hormones.",
      "Enjoy social activities and collaborative work.",
      "High-energy movement feels most natural now."
    ]
  },
  luteal: {
    explanation: "Progesterone takes the lead to prepare your body for the next cycle. You might notice a natural pull toward nesting, organization, and a slower pace.",
    whatHelps: [
      "Prioritize complex carbs for steady serotonin levels.",
      "Gentle, grounding movement like walking or yin yoga.",
      "Practice extra self-compassion if energy dips."
    ]
  }
};

export const getPhaseEducation = (phase?: string): PhaseEducation => {
  const p = (phase || 'follicular').toLowerCase();
  return PHASE_EDUCATION[p] || PHASE_EDUCATION.follicular;
};
