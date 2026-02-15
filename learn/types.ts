
export type LearnPillarId = "hormones" | "nutrition" | "cycle_syncing" | "labs_supplements";

export type LearnAccent = "sage" | "rose" | "lavender" | "blue";

export interface LearnPillar {
  id: LearnPillarId;
  title: string;
  subtitle: string;
  icon: string;
  accentKey: LearnAccent;
}

export type LearnItemType = "article" | "program";

export interface LearnItem {
  id: string;
  type: LearnItemType;
  pillarId: LearnPillarId;
  title: string;
  description: string;
  body: string;
  tags: string[];
  readTimeMin?: number;
  days?: number;
  lessonsCount?: number;
  isPremium?: boolean;
  accentKey: LearnAccent;
}

export interface LearnRecommendation {
  id: string;
  title: string;
  reason: string;
  ctaLabel: string;
  targetId: string;
  accentKey: LearnAccent;
}
