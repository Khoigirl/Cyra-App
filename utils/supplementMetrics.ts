
import { Supplement, SupplementIntakeLog } from '../supplementTypes';

export const getWeeklyConsistencyAcrossAll = (
  activeSupplements: Supplement[],
  logs: Record<string, SupplementIntakeLog>
): number => {
  if (activeSupplements.length === 0) return 0;

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  });

  let totalTaken = 0;
  activeSupplements.forEach(sup => {
    last7Days.forEach(date => {
      if (logs[date]?.taken[sup.id]?.checked) {
        totalTaken++;
      }
    });
  });

  const avgPerSup = totalTaken / activeSupplements.length;
  return Number(avgPerSup.toFixed(1));
};

export const hasAnyZeroStreak = (
  activeSupplements: Supplement[],
  getStats: (id: string) => { currentStreak: number }
): boolean => {
  return activeSupplements.some(sup => getStats(sup.id).currentStreak === 0);
};
