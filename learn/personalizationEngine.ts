
import { LEARN_ITEMS } from './data';
import { LearnItem, LearnAccent } from './types';
import { DailyLog } from '../context/WellnessContext';
// Fix: Import Supplement from supplementTypes to match the data being passed in from SupplementContext
import { Supplement, SupplementIntakeLog } from '../supplementTypes';

export interface WeeklyFocusCard {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  targetId: string;
  accentKey: LearnAccent;
  reasonShort: string;
  reasonDetail: string;
  type: 'article' | 'program';
}

interface EngineInput {
  recentLogs: DailyLog[];
  supplements: Supplement[];
  suppLogs: Record<string, SupplementIntakeLog>;
  cyclePhase: string;
}

export const generateWeeklyFocus = (input: EngineInput): WeeklyFocusCard[] => {
  const { recentLogs, supplements, suppLogs, cyclePhase } = input;
  const cards: WeeklyFocusCard[] = [];

  // Helper: Aggregate Symptom Data
  const getSymptomStats = (name: string) => {
    const logsWithSymptom = recentLogs.filter(log => 
      log.symptomLogs.some(s => s.symptoms.includes(name))
    );
    const avgIntensity = logsWithSymptom.length > 0 
      ? logsWithSymptom.reduce((acc, log) => {
          const sLog = log.symptomLogs.find(s => s.symptoms.includes(name));
          return acc + (sLog?.intensity || 0);
        }, 0) / logsWithSymptom.length
      : 0;
    return { count: logsWithSymptom.length, avg: avgIntensity };
  };

  // Helper: Get Supplement Adherence (days taken in last 7)
  const getSuppAdherence = (name: string) => {
    const dates = Object.keys(suppLogs).slice(-7);
    const supp = supplements.find(s => s.name.toLowerCase().includes(name.toLowerCase()));
    if (!supp) return 7; // Assume consistent if not tracked
    return dates.filter(d => suppLogs[d]?.taken[supp.id]?.checked).length;
  };

  const stepsAvg = recentLogs.length > 0 
    ? recentLogs.reduce((acc, log) => acc + log.steps, 0) / recentLogs.length 
    : 0;

  // RULE 1: Cravings
  const cravings = getSymptomStats('Cravings');
  const inositolAdherence = getSuppAdherence('Inositol');
  if (cravings.avg >= 7 || cravings.count >= 3) {
    cards.push({
      id: 'focus_cravings',
      title: 'Manage Cravings',
      subtitle: inositolAdherence < 4 
        ? 'Steadying your inositol ritual can help balance blood sugar peaks.' 
        : 'Learn how specific fiber pairings can quiet hormonal hunger.',
      ctaLabel: 'READ',
      targetId: 'art_low_gi_diet',
      accentKey: 'sage',
      reasonShort: 'Based on your recent cravings logs...',
      reasonDetail: `You logged cravings ${cravings.count} times this week with a high intensity. ${inositolAdherence < 4 ? `Inositol was logged ${inositolAdherence}/7 days.` : ''}`,
      type: 'article'
    });
  }

  // RULE 2: Stress / Fatigue
  const stress = getSymptomStats('Mood swings');
  const fatigue = getSymptomStats('Fatigue');
  const magAdherence = getSuppAdherence('Magnesium');
  if (stress.avg >= 7 || fatigue.avg >= 7 || fatigue.count >= 3) {
    cards.push({
      id: 'focus_stress',
      title: 'Stress Recovery',
      subtitle: magAdherence < 4 
        ? 'Magnesium in the evening supports cortisol clearance.'
        : 'Identify your adrenal triggers to reclaim your energy.',
      ctaLabel: 'JOIN',
      targetId: 'prog_cortisol_fix',
      accentKey: 'rose',
      reasonShort: 'Based on your fatigue & mood logs...',
      reasonDetail: `Your fatigue intensity averaged ${fatigue.avg.toFixed(1)}/5 this week. Magnesium adherence: ${magAdherence}/7 days.`,
      type: 'program'
    });
  }

  // RULE 3: Acne
  const acne = getSymptomStats('Acne');
  if (acne.count >= 3 || acne.avg >= 4) {
    cards.push({
      id: 'focus_acne',
      title: 'Clear Skin Basics',
      subtitle: 'Addressing the androgen root of hormonal breakouts.',
      ctaLabel: 'READ',
      targetId: 'art_acne_protocol',
      accentKey: 'lavender',
      reasonShort: 'Based on your skin check-ins...',
      reasonDetail: `You tracked acne breakouts on ${acne.count} days this week. This guide focuses on internal androgen support.`,
      type: 'article'
    });
  }

  // RULE 4: Bloating
  const bloating = getSymptomStats('Bloating');
  if (bloating.count >= 3) {
    cards.push({
      id: 'focus_bloat',
      title: 'Anti-Bloat & Gut Calm',
      subtitle: 'Gentle support for your progesterone-phase digestion.',
      ctaLabel: 'READ',
      targetId: 'art_luteal_rest', // Assuming this covers it
      accentKey: 'blue',
      reasonShort: 'Based on your digestion logs...',
      reasonDetail: `Bloating was noted ${bloating.count} times. We recommend reviewing phase-specific nutrition.`,
      type: 'article'
    });
  }

  // RULE 5: Movement
  if (stepsAvg < 5000 && cards.length < 2) {
    cards.push({
      id: 'focus_movement',
      title: 'Gentle Movement Reset',
      subtitle: 'Simple flows to improve insulin response without the stress.',
      ctaLabel: 'READ',
      targetId: 'art_insulin_101',
      accentKey: 'sage',
      reasonShort: 'Based on your activity levels...',
      reasonDetail: `Your average daily steps were ${Math.round(stepsAvg)}. Light movement is a powerful tool for metabolic health.`,
      type: 'article'
    });
  }

  // FALLBACKS
  if (cards.length < 2) {
    // Fix: Explicitly typing fallback1 as WeeklyFocusCard to prevent TypeScript from widening literal types like 'blue' and 'article' to 'string'
    const fallback1: WeeklyFocusCard = {
      id: 'fallback_basics',
      title: 'PCOS Basics',
      subtitle: 'A 10-minute reset on hormonal foundations.',
      ctaLabel: 'READ',
      targetId: 'art_insulin_101',
      accentKey: 'blue',
      reasonShort: 'Essential for every journey',
      reasonDetail: 'Welcome! We suggest starting with the core pillars of insulin and androgen balance.',
      type: 'article'
    };
    if (!cards.find(c => c.targetId === 'art_insulin_101')) cards.push(fallback1);
  }

  if (cards.length < 2) {
    cards.push({
      id: 'fallback_sync',
      title: 'Cycle Syncing 101',
      subtitle: 'Learning to live in flow with your natural rhythm.',
      ctaLabel: 'JOIN',
      targetId: 'prog_sync_mastery',
      accentKey: 'lavender',
      reasonShort: 'A foundational strategy',
      reasonDetail: 'Mastering your four phases is the most effective way to manage symptoms long-term.',
      type: 'program'
    });
  }

  return cards.slice(0, 2);
};
