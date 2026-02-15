
export type CyclePhase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';

export interface CycleConfig {
  lastPeriodDate?: string;
  typicalCycleLength: number;
}

export const parseDate = (dateStr: string) => new Date(dateStr + 'T00:00:00');

export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const addDays = (dateStr: string, n: number) => {
  const d = parseDate(dateStr);
  d.setDate(d.getDate() + n);
  return formatDate(d);
};

export const differenceInDays = (dateStrA: string, dateStrB: string) => {
  const a = parseDate(dateStrA);
  const b = parseDate(dateStrB);
  const diffTime = a.getTime() - b.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Derives cycle day for a specific date based on a known period start.
 */
export const getCycleDayForDate = (date: string, lastPeriodStart: string, cycleLength: number): number => {
  const diff = differenceInDays(date, lastPeriodStart);
  if (diff < 0) return -1; // Date is before tracking started
  return (diff % cycleLength) + 1;
};

/**
 * Determines phase based on day of cycle.
 */
export const getPhaseFromCycleDay = (day: number, cycleLength: number): CyclePhase => {
  if (day >= 1 && day <= 5) return 'menstrual';
  if (day >= 6 && day <= 13) return 'follicular';
  if (day >= 14 && day <= 16) return 'ovulatory';
  return 'luteal';
};

/**
 * Estimates the next predicted period window.
 */
export const getPredictedNextPeriodWindow = (config: CycleConfig, logs: Record<string, any>) => {
  const baseDate = config.lastPeriodDate;
  if (!baseDate) return null;

  const start = addDays(baseDate, config.typicalCycleLength);
  const dates = [];
  for (let i = 0; i < 5; i++) {
    dates.push(addDays(start, i));
  }

  return {
    start,
    end: dates[4],
    dates
  };
};

/**
 * Estimates the fertile window based on next predicted period.
 */
export const getFertileWindow = (nextPeriodStart: string) => {
  // Simple rule: Ovulation is approx 14 days before next period
  const ovulationDate = addDays(nextPeriodStart, -14);
  const dates = [];
  // Window: 5 days before through 1 day after
  for (let i = -5; i <= 1; i++) {
    dates.push(addDays(ovulationDate, i));
  }

  return {
    ovulationDate,
    dates
  };
};
