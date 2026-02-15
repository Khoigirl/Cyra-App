
import { DailyLog } from '../context/WellnessContext';

export const generateMockHistory = (): DailyLog[] => {
  return [
    {
      steps: 4200,
      workouts: [],
      water: 1.2,
      meals: [],
      symptomLogs: [{ id: 'm1', symptoms: ['Cravings', 'Fatigue'], intensity: 4, notes: 'Strong sugar pull' }],
      supplements: []
    },
    {
      steps: 3100,
      workouts: [],
      water: 1.5,
      meals: [],
      symptomLogs: [{ id: 'm2', symptoms: ['Fatigue'], intensity: 5, notes: 'Very tired' }],
      supplements: []
    },
    {
      steps: 6500,
      workouts: [{ id: 'w1', type: 'Walk', duration: '30', intensity: 'Light', notes: '' }],
      water: 2.0,
      meals: [],
      symptomLogs: [{ id: 'm3', symptoms: ['Cravings'], intensity: 3, notes: '' }],
      supplements: []
    },
    {
      steps: 2800,
      workouts: [],
      water: 1.0,
      meals: [],
      symptomLogs: [{ id: 'm4', symptoms: ['Cravings', 'Bloating'], intensity: 4, notes: '' }],
      supplements: []
    },
    {
      steps: 4000,
      workouts: [],
      water: 1.4,
      meals: [],
      symptomLogs: [{ id: 'm5', symptoms: ['Acne', 'Cravings'], intensity: 4, notes: '' }],
      supplements: []
    },
    {
      steps: 5200,
      workouts: [],
      water: 1.8,
      meals: [],
      symptomLogs: [{ id: 'm6', symptoms: ['Acne'], intensity: 3, notes: '' }],
      supplements: []
    },
    {
      steps: 3800,
      workouts: [],
      water: 1.5,
      meals: [],
      symptomLogs: [{ id: 'm7', symptoms: ['Acne', 'Fatigue'], intensity: 5, notes: '' }],
      supplements: []
    }
  ];
};
