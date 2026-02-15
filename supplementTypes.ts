
export type SupplementForm = "capsule" | "powder" | "tea" | "liquid" | "other";
export type ColorKey = "sage" | "rose" | "lavender" | "blue" | "neutral";

export interface Supplement {
  id: string;
  name: string;
  form: SupplementForm;
  defaultDoseText?: string;
  notes?: string;
  colorKey: ColorKey;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface SupplementReminder {
  id: string;
  supplementId: string;
  enabled: boolean;
  times: { hour: number; minute: number }[];
  daysOfWeek: number[]; // 0-6 (Sun-Sat)
  notificationIds?: string[];
  createdAt: number;
  updatedAt: number;
}

export interface SupplementIntakeLog {
  date: string; // YYYY-MM-DD
  taken: Record<string, {
    checked: boolean;
    takenAt?: number[];
  }>;
}

export interface SupplementStats {
  weeklyConsistency: number; // days taken in last 7
  currentStreak: number;
  bestStreak: number;
}
