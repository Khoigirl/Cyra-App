
export const TODAY_TASKS = [
  { id: '1', title: 'Spearmint Tea', category: 'Supplements', time: 'Morning' },
  { id: '2', title: '15 min Strength', category: 'Movement', time: 'Anytime' },
  { id: '3', title: 'Seed Cycling Log', category: 'Nutrition', time: 'Evening' },
];

export const RECIPES = [
  { id: '1', title: 'Avocado Quinoa Bowl', time: '15 min', tag: 'High Protein', icon: '🥗' },
  { id: '2', title: 'Hormone Balancer Smoothie', time: '5 min', tag: 'Anti-inflammatory', icon: '🥤' },
];

export const ARTICLES = [
  { id: '1', title: 'Understanding Insulin Resistance', readTime: '6 min', icon: '🧬' },
  { id: '2', title: 'Cycle Syncing 101', readTime: '4 min', icon: '🌙' },
];

export const DASHBOARD_METRICS = [
  { id: 'cal', label: 'Calories', value: '1,450', unit: 'kcal', icon: '🔥', color: 'bg-orange-50' },
  { id: 'water', label: 'Water', value: '1.2', unit: 'liters', icon: '💧', color: 'bg-blue-50' },
  { id: 'steps', label: 'Steps', value: '6,432', unit: 'steps', icon: '👟', color: 'bg-green-50' },
  { id: 'symptoms', label: 'Symptoms', value: '2', unit: 'logged', icon: '✨', color: 'bg-purple-50' },
];

export const DAILY_LOG_DATA = {
  date: '2024-02-14',
  isToday: true,
  cycle: {
    day: 12,
    phase: 'Follicular',
    status: 'High Fertility',
    isPeriod: false
  },
  symptoms: ['Cravings', 'Bloating'],
  meals: {
    calories: 1450,
    items: ['Avocado Toast', 'Quinoa Salad', 'Grilled Salmon']
  },
  exercise: {
    steps: 6432,
    workouts: ['15 min Yoga']
  },
  water: 1.2, // liters
};

// Mock logs for the current month
// dots: red (period), green (meals), blue (symptoms), gray (workout)
export const CALENDAR_LOGS: Record<string, { period?: boolean; meals?: boolean; symptoms?: boolean; workout?: boolean }> = {
  '2024-02-01': { period: true, meals: true },
  '2024-02-02': { period: true, symptoms: true },
  '2024-02-03': { period: true, workout: true },
  '2024-02-04': { period: true },
  '2024-02-10': { meals: true, workout: true },
  '2024-02-12': { meals: true, symptoms: true, workout: true },
  '2024-02-13': { meals: true, symptoms: true },
  '2024-02-14': { meals: true, symptoms: true, workout: true }, // Today
  '2024-02-15': { meals: true },
};
