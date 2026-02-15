
import { OnboardingAnswers } from '../types';
import { DailyLog, CycleInfo } from '../context/WellnessContext';

export interface IntelligenceProfile extends OnboardingAnswers {}

export interface IntelligenceData {
  profile: IntelligenceProfile;
  todayLog: DailyLog;
  recentLogs: DailyLog[];
  cycleInfo: CycleInfo;
  cycleConfig: {
    lastPeriodStart: string;
    cycleLength: number;
    regularity: string;
  };
}

export interface Recommendation {
  id: string;
  category: 'cycle' | 'food' | 'exercise' | 'hydration' | 'sleep' | 'stress';
  title: string;
  explanation: string;
  whyItMatters: string;
  action: string;
  priority: 1 | 2 | 3; // 1 is highest
  triggeredBy?: string;
}

export interface Alert {
  id: string;
  severity: 'info' | 'gentle' | 'important';
  title: string;
  message: string;
}

export interface DailyBriefing {
  title: string;
  phase?: string;
  hormoneTrend: string;
  expectedPattern: string;
  bullets: string[];
  tone: 'calm' | 'empowering' | 'restful';
}

export interface IntelligenceOutput {
  briefing: DailyBriefing;
  recommendations: Recommendation[];
  alerts: Alert[];
}
