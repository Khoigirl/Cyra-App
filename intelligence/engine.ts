
import { IntelligenceData, IntelligenceOutput, DailyBriefing, Recommendation } from './types';
import { runRules } from './rules';
import { getSupplementBasedRecommendations } from './supplementRules';
import { BRIEFING_TITLES } from './messages';

export const generateIntelligence = (data: IntelligenceData): IntelligenceOutput => {
  const { recommendations = [], alerts = [] } = runRules(data);
  
  // Incorporate supplement-based intelligence
  const rawSupplementRecs = getSupplementBasedRecommendations(data.recentLogs) || [];
  const supplementRecs = rawSupplementRecs.map(r => ({
    ...r,
    whyItMatters: "Consistency with evidence-based supplements supports long-term metabolic health."
  }));
  
  const finalRecommendations = [...recommendations, ...supplementRecs];

  // Sort by priority (1 is highest)
  finalRecommendations.sort((a, b) => a.priority - b.priority);

  // Generate Briefing
  const briefing = generateBriefing(data, finalRecommendations);

  return {
    briefing,
    recommendations: (finalRecommendations || []).slice(0, 3), 
    alerts: alerts || []
  };
};

const adjustBriefingBulletsByPhase = (phase: string, bullets: string[], isPeriod: boolean): string[] => {
  const newBullets = [...(bullets || [])];
  const p = (phase || '').toLowerCase();

  if (isPeriod) {
    newBullets.unshift("Focus on iron-rich leafy greens and warm fluids.");
    newBullets.push("Gentle stretching may ease any tension today.");
  } else if (p === 'follicular') {
    newBullets.unshift("Energy rising: a great window for creative focus.");
    newBullets.push("Consider a protein-rich lunch to support rising estrogen.");
  } else if (p === 'ovulatory') {
    newBullets.unshift("Peak vitality: you might feel more confident today.");
    newBullets.push("Include fiber-rich greens to help process peak hormones.");
  } else if (p === 'luteal') {
    newBullets.unshift("Gentle transition: prioritize steady, grounding meals.");
    newBullets.push("Magnesium-rich snacks can help with mood shifts.");
  }

  return newBullets.slice(0, 4);
};

const generateBriefing = (data: IntelligenceData, recs: Recommendation[]): DailyBriefing => {
  const { cycleInfo } = data;
  const phase = cycleInfo.phase;
  
  let title = BRIEFING_TITLES.default;
  let hormoneTrend = "Steadying baseline";
  let expectedPattern = "Maintaining daily rituals";
  let tone: 'calm' | 'empowering' | 'restful' = 'calm';
  let bullets: string[] = [];

  if (cycleInfo.isPeriod) {
    title = BRIEFING_TITLES.menstrual;
    hormoneTrend = "Low Estrogen & Progesterone";
    expectedPattern = "Renewal & Replenishment";
    tone = 'restful';
  } else if (phase === 'Follicular') {
    title = BRIEFING_TITLES.follicular;
    hormoneTrend = "Estrogen Rising";
    expectedPattern = "Increasing Energy & Creativity";
    tone = 'empowering';
  } else if (phase === 'Ovulatory') {
    title = BRIEFING_TITLES.ovulatory;
    hormoneTrend = "LH & Estrogen Peak";
    expectedPattern = "Peak Sensation & Vitality";
    tone = 'empowering';
  } else if (phase === 'Luteal') {
    title = BRIEFING_TITLES.luteal;
    hormoneTrend = "Progesterone Dominant";
    expectedPattern = "Slowing Down & Grounding";
    tone = 'calm';
  }

  if ((recs || []).length > 0 && recs[0].priority === 1) {
    bullets.push(recs[0].title);
  } else {
    bullets.push("Logging small changes helps Cyra learn your rhythm.");
  }

  bullets = adjustBriefingBulletsByPhase(phase, bullets, cycleInfo.isPeriod);

  return { title, phase, hormoneTrend, expectedPattern, bullets, tone };
};
