
import { DailyLog } from '../context/WellnessContext';

export const calculate7DayAverages = (logs: DailyLog[]) => {
  const last7 = logs.slice(-7);
  if (last7.length === 0) return { steps: 0, water: 0, calories: 0 };

  const totals = last7.reduce((acc, log) => {
    const dayCals = log.meals.reduce((sum, meal) => 
      sum + meal.items.reduce((iSum, item) => iSum + item.calories, 0), 0
    );
    return {
      steps: acc.steps + log.steps,
      water: acc.water + log.water,
      calories: acc.calories + dayCals
    };
  }, { steps: 0, water: 0, calories: 0 });

  return {
    steps: Math.round(totals.steps / last7.length),
    water: Number((totals.water / last7.length).toFixed(1)),
    calories: Math.round(totals.calories / last7.length)
  };
};

export const calculateSymptomPatterns = (logs: DailyLog[]) => {
  const counts: Record<string, number> = {};
  logs.forEach(log => {
    log.symptomLogs.forEach(sl => {
      sl.symptoms.forEach(s => {
        counts[s] = (counts[s] || 0) + 1;
      });
    });
  });

  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([name, count]) => ({ name, count }));
};

export const calculateSupplementConsistency = (logs: DailyLog[]) => {
  const last7 = logs.slice(-7);
  if (last7.length === 0) return [];

  const counts: Record<string, number> = {};
  
  last7.forEach(log => {
    // Fix: log.supplements is string[] containing names of taken supplements
    log.supplements.forEach(name => {
      // If the name is in the array, it means it was taken on this day.
      counts[name] = (counts[name] || 0) + 1;
    });
  });

  return Object.entries(counts)
    .map(([name, count]) => ({
      name,
      count,
      total: last7.length
    }))
    .sort((a, b) => b.count - a.count);
};

export const calculateLoggingStreak = (logs: DailyLog[]) => {
  let streak = 0;
  const reversed = [...logs].reverse();
  for (const log of reversed) {
    // Fix: log.supplements is string[] where entries exist if taken
    const hasData = log.steps > 0 || 
                    log.water > 0 || 
                    log.meals.length > 0 || 
                    log.symptomLogs.length > 0 ||
                    log.supplements.length > 0;
    if (hasData) streak++;
    else break;
  }
  return streak;
};
