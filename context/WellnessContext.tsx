
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { StepService } from '../services/StepService';
import { AuthStatus, OnboardingAnswers } from '../types';
import { useSubscription } from './SubscriptionContext';

export interface Workout {
  id: string;
  type: string;
  duration: string;
  intensity: string;
  notes: string;
}

export interface SymptomLog {
  id: string;
  symptoms: string[];
  intensity: number;
  notes: string;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  fiber_g?: number;
}

export interface Meal {
  id: string;
  type: string;
  items: FoodItem[];
}

export interface Supplement {
  id: string;
  name: string;
  taken: boolean;
}

export interface DailyLog {
  steps: number;
  workouts: Workout[];
  water: number;
  meals: Meal[];
  symptomLogs: SymptomLog[];
  supplements: Supplement[];
}

export interface CycleInfo {
  day: number;
  phase: string;
  status: string;
  isPeriod: boolean;
  daysUntilNext: number;
}

const DEFAULT_SUPPLEMENTS: Supplement[] = [
  { id: 'inositol', name: 'Inositol', taken: false },
  { id: 'magnesium', name: 'Magnesium', taken: false },
  { id: 'omega3', name: 'Omega-3', taken: false },
  { id: 'vitd', name: 'Vitamin D', taken: false },
  { id: 'spearmint', name: 'Spearmint Tea', taken: false },
];

interface WellnessContextType {
  logs: Record<string, DailyLog>;
  liveSteps: number;
  pedometerAvailable: boolean;
  lastStepUpdate: Date | null;
  isHealthConnected: boolean;
  authStatus: AuthStatus;
  guestHistoryLimitDays: number;
  lastPeriodStart: string;
  periodDuration: number;
  cycleLength: number;
  setAuthStatus: (status: AuthStatus) => void;
  connectHealth: () => void;
  addWorkout: (date: string, workout: Omit<Workout, 'id'>) => void;
  addSymptomLog: (date: string, symptomLog: Omit<SymptomLog, 'id'>) => void;
  addMeal: (date: string, meal: Omit<Meal, 'id'>) => void;
  addWater: (date: string, amount: number) => void;
  toggleSupplement: (date: string, supplementId: string) => void;
  addCustomSupplement: (date: string, name: string) => void;
  logPeriod: (startDate: string, duration: number) => void;
  setCycleLength: (length: number) => void;
  isDateLocked: (dateStr: string) => boolean;
  getCycleInfo: (targetDate: string) => CycleInfo;
  importOnboardingData: (answers: OnboardingAnswers) => void;
}

const WellnessContext = createContext<WellnessContextType | undefined>(undefined);

export const WellnessProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isSubscribed, entitlements } = useSubscription();
  const [isHealthConnected, setIsHealthConnected] = useState(false);
  const [liveSteps, setLiveSteps] = useState(0);
  const [pedometerAvailable, setPedometerAvailable] = useState(false);
  const [lastStepUpdate, setLastStepUpdate] = useState<Date | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.Unauthenticated);
  
  // FIX: Initialize with a dynamic fallback instead of hardcoded 02/02/2024
  const [lastPeriodStart, setLastPeriodStart] = useState<string>(() => {
    const saved = localStorage.getItem('cyra_cycle_start');
    if (saved) return saved;
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() - 14); // Default to mid-cycle
    return defaultDate.toISOString().split('T')[0];
  });
  
  const [periodDuration, setPeriodDuration] = useState<number>(() => Number(localStorage.getItem('cyra_period_duration')) || 5);
  const [cycleLength, setCycleLength] = useState<number>(() => Number(localStorage.getItem('cyra_cycle_length')) || 28);
  
  const guestHistoryLimitDays = 7;
  
  const [logs, setLogs] = useState<Record<string, DailyLog>>(() => {
    const saved = localStorage.getItem('cyra_wellness_logs');
    if (saved) return JSON.parse(saved);
    return {};
  });

  useEffect(() => {
    localStorage.setItem('cyra_cycle_start', lastPeriodStart);
    localStorage.setItem('cyra_period_duration', periodDuration.toString());
    localStorage.setItem('cyra_cycle_length', cycleLength.toString());
  }, [lastPeriodStart, periodDuration, cycleLength]);

  useEffect(() => {
    localStorage.setItem('cyra_wellness_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    const initSteps = async () => {
      const available = await StepService.isAvailable();
      setPedometerAvailable(available);
      if (available) {
        const initialSteps = await StepService.getTodaySteps();
        setLiveSteps(initialSteps);
        setLastStepUpdate(new Date());
        const subscription = StepService.subscribe((result) => {
          setLiveSteps(prev => prev + result.steps);
          setLastStepUpdate(new Date());
        });
        return () => subscription.remove();
      }
    };
    initSteps();
  }, []);

  const importOnboardingData = (answers: OnboardingAnswers) => {
    if (answers.lastPeriodDate) {
      setLastPeriodStart(answers.lastPeriodDate);
      // Ensure local storage is immediately updated
      localStorage.setItem('cyra_cycle_start', answers.lastPeriodDate);
    }
    if (answers.cycleLength && answers.cycleLength !== 'Varies') {
      const len = parseInt(answers.cycleLength);
      setCycleLength(len);
      localStorage.setItem('cyra_cycle_length', len.toString());
    }
  };

  const connectHealth = () => setIsHealthConnected(true);

  const createInitialLog = (): DailyLog => ({
    steps: 0,
    workouts: [],
    water: 0,
    meals: [],
    symptomLogs: [],
    supplements: [...DEFAULT_SUPPLEMENTS],
  });

  const isDateLocked = (dateStr: string) => {
    if (isSubscribed) return false;
    const today = new Date();
    const targetDate = new Date(dateStr);
    const diffTime = today.getTime() - targetDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > entitlements.calendarHistoryDays;
  };

  const getCycleInfo = (targetDate: string): CycleInfo => {
    const target = new Date(targetDate);
    const start = new Date(lastPeriodStart);
    const diffTime = target.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    const day = ((diffDays - 1) % cycleLength) + 1;
    let phase = 'Follicular';
    let status = 'Increasing Energy';
    let isPeriod = false;

    if (day <= periodDuration) {
      phase = 'Menstrual';
      status = 'Rest & Reflect';
      isPeriod = true;
    } else if (day <= Math.floor(cycleLength / 2) - 1) {
      phase = 'Follicular';
      status = 'Growth & Creativity';
    } else if (day <= Math.floor(cycleLength / 2) + 1) {
      phase = 'Ovulatory';
      status = 'High Fertility';
    } else {
      phase = 'Luteal';
      status = 'PMS Management';
    }

    const daysUntilNext = cycleLength - day + 1;
    return { day, phase, status, isPeriod, daysUntilNext };
  };

  const addWorkout = (date: string, workoutData: Omit<Workout, 'id'>) => {
    setLogs(prev => {
      const dayLog = prev[date] || createInitialLog();
      return { ...prev, [date]: { ...dayLog, workouts: [...dayLog.workouts, { ...workoutData, id: Math.random().toString(36).substr(2, 9) }] } };
    });
  };

  const addSymptomLog = (date: string, symptomData: Omit<SymptomLog, 'id'>) => {
    setLogs(prev => {
      const dayLog = prev[date] || createInitialLog();
      return { ...prev, [date]: { ...dayLog, symptomLogs: [...dayLog.symptomLogs, { ...symptomData, id: Math.random().toString(36).substr(2, 9) }] } };
    });
  };

  const addMeal = (date: string, mealData: Omit<Meal, 'id'>) => {
    setLogs(prev => {
      const dayLog = prev[date] || createInitialLog();
      return { ...prev, [date]: { ...dayLog, meals: [...dayLog.meals, { ...mealData, id: Math.random().toString(36).substr(2, 9) }] } };
    });
  };

  const addWater = (date: string, amount: number) => {
    setLogs(prev => {
      const dayLog = prev[date] || createInitialLog();
      const newAmount = Math.round((dayLog.water + amount) * 10) / 10;
      return { ...prev, [date]: { ...dayLog, water: newAmount } };
    });
  };

  const toggleSupplement = (date: string, supplementId: string) => {
    setLogs(prev => {
      const dayLog = prev[date] || createInitialLog();
      const newSupplements = dayLog.supplements.map(s => s.id === supplementId ? { ...s, taken: !s.taken } : s);
      return { ...prev, [date]: { ...dayLog, supplements: newSupplements } };
    });
  };

  const addCustomSupplement = (date: string, name: string) => {
    setLogs(prev => {
      const dayLog = prev[date] || createInitialLog();
      const newSupplement: Supplement = { id: Math.random().toString(36).substr(2, 9), name, taken: false };
      return { ...prev, [date]: { ...dayLog, supplements: [...dayLog.supplements, newSupplement] } };
    });
  };

  const logPeriod = (startDate: string, duration: number) => {
    setLastPeriodStart(startDate);
    setPeriodDuration(duration);
  };

  return (
    <WellnessContext.Provider value={{ 
      logs, liveSteps, pedometerAvailable, lastStepUpdate, isHealthConnected, authStatus, guestHistoryLimitDays,
      lastPeriodStart, periodDuration, cycleLength, setAuthStatus, connectHealth, addWorkout, addSymptomLog, addMeal, 
      addWater, toggleSupplement, addCustomSupplement, logPeriod, setCycleLength, isDateLocked, getCycleInfo, importOnboardingData
    }}>
      {children}
    </WellnessContext.Provider>
  );
};

export const useWellness = () => {
  const context = useContext(WellnessContext);
  if (context === undefined) throw new Error('useWellness must be used within an WellnessProvider');
  return context;
};
