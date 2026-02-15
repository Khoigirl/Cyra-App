
import { DailyLog } from '../context/WellnessContext';
import { Supplement, SupplementIntakeLog } from '../supplementTypes';

/**
 * Maps the new supplement intake logs to the naming format expected by the intelligence engine.
 */
export const getSupplementsTakenNamesForDate = (
  date: string, 
  allSupplements: Supplement[], 
  logs: Record<string, SupplementIntakeLog>
): string[] => {
  const dayLog = logs[date];
  if (!dayLog) return [];

  const takenIds = Object.entries(dayLog.taken)
    .filter(([_, data]) => data.checked)
    .map(([id]) => id);

  return allSupplements
    .filter(s => takenIds.includes(s.id))
    .map(s => s.name);
};
