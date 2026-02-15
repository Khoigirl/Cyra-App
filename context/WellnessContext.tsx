
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AuthStatus, OnboardingAnswers } from '../types';
import { useSubscription } from './SubscriptionContext';

// Added missing exports for types used by screens and components
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

export interface SymptomLog {
  id: string;
  symptoms: string[];
  intensity: number;
  notes: string;
}

export interface Workout {
  id: string;
  type: string;
  duration: string;
  intensity: string;
  notes: string;
}

export interface CycleInfo {
  day: number;
  phase: string;
  status: string;
  isPeriod: boolean;
  daysUntilNext: number;
}

export interface DailyLog {
  steps: number;
  workouts: Workout[];
  water: number;
  meals: Meal[];
  symptomLogs: SymptomLog[];
  supplements: string[];
}

interface WellnessContextType {
  logs: Record<string, DailyLog>;
  getCycleInfo: (date: string) => CycleInfo;
  lastPeriodStart: string;
  cycleLength: number;
  periodDuration: number;
  isHealthConnected: boolean;
  connectHealth: () => void;
  importOnboardingData: (answers: OnboardingAnswers) => void;
  addWorkout: (date: string, workout: Omit<Workout, 'id'>) => void;
  addSymptomLog: (date: string, log: Omit<SymptomLog, 'id'>) => void;
  addMeal: (date: string, meal: Omit<Meal, 'id'>) => void;
  addWater: (date: string, amount: number) => void;
  liveSteps: number;
  pedometerAvailable: boolean;
  logPeriod: (startDate: string, duration: number) => void;
  setCycleLength: (len: number) => void;
  isDateLocked: (date: string) => boolean;
}

const WellnessContext = createContext<WellnessContextType | undefined>(undefined);

export const WellnessProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isSubscribed } = useSubscription();
  const [lastPeriodStart, setLastPeriodStart] = useState<string>(new Date().toISOString().split('T')[0]);
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [periodDuration, setPeriodDuration] = useState<number>(5);
  const [logs, setLogs] = useState<Record<string, DailyLog>>({});
  const [isHealthConnected, setIsHealthConnected] = useState(false);
  const [liveSteps, setLiveSteps] = useState(0);
  const [pedometerAvailable, setPedometerAvailable] = useState(true);

  const connectHealth = () => {
    setIsHealthConnected(true);
  };

  const importOnboardingData = (answers: OnboardingAnswers) => {
    if (answers.lastPeriodDate) setLastPeriodStart(answers.lastPeriodDate);
    if (answers.cycleLength && answers.cycleLength !== 'Varies') {
      setCycleLength(parseInt(answers.cycleLength));
    }
  };

  // Fixed: Enhanced getCycleInfo to return more detailed cycle state matching application needs
  const getCycleInfo = (targetDate: string): CycleInfo => {
    const target = new Date(targetDate);
    const start = new Date(lastPeriodStart);
    const diffDays = Math.floor((target.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Simplistic logic for demonstration: day is diff from start, but we can detect 'late'
    let day = diffDays;
    let daysUntilNext = cycleLength - diffDays;
    
    let phase = 'Follicular';
    let status = 'Rest & Reflect';
    let isPeriod = false;

    if (diffDays > 0 && diffDays <= cycleLength) {
        if (diffDays <= periodDuration) {
            phase = 'Menstrual';
            isPeriod = true;
            status = 'Bleeding';
        } else if (diffDays <= 13) {
            phase = 'Follicular';
            status = 'Rising Energy';
        } else if (diffDays <= 16) {
            phase = 'Ovulatory';
            status = 'High Fertility';
        } else {
            phase = 'Luteal';
            status = 'PMS / Rest';
        }
    } else if (diffDays > cycleLength) {
        phase = 'Luteal';
        status = 'Late';
        isPeriod = false;
    }

    return { 
      day, 
      phase, 
      status, 
      isPeriod,
      daysUntilNext
    };
  };

  // Added: Logic for adding workout logs
  const addWorkout = (date: string, workout: Omit<Workout, 'id'>) => {
    setLogs(prev => {
      const dayLog = prev[date] || { steps: 0, workouts: [], water: 0, meals: [], symptomLogs: [], supplements: [] };
      return {
        ...prev,
        [date]: { ...dayLog, workouts: [...dayLog.workouts, { ...workout, id: Math.random().toString(36).substr(2, 9) } as Workout] }
      };
    });
  };

  // Added: Logic for adding symptom logs
  const addSymptomLog = (date: string, log: Omit<SymptomLog, 'id'>) => {
    setLogs(prev => {
      const dayLog = prev[date] || { steps: 0, workouts: [], water: 0, meals: [], symptomLogs: [], supplements: [] };
      return {
        ...prev,
        [date]: { ...dayLog, symptomLogs: [...dayLog.symptomLogs, { ...log, id: Math.random().toString(36).substr(2, 9) } as SymptomLog] }
      };
    });
  };

  // Added: Logic for adding meal logs
  const addMeal = (date: string, meal: Omit<Meal, 'id'>) => {
    setLogs(prev => {
      const dayLog = prev[date] || { steps: 0, workouts: [], water: 0, meals: [], symptomLogs: [], supplements: [] };
      return {
        ...prev,
        [date]: { ...dayLog, meals: [...dayLog.meals, { ...meal, id: Math.random().toString(36).substr(2, 9) } as Meal] }
      };
    });
  };

  // Added: Logic for adding water logs
  const addWater = (date: string, amount: number) => {
    setLogs(prev => {
      const dayLog = prev[date] || { steps: 0, workouts: [], water: 0, meals: [], symptomLogs: [], supplements: [] };
      return {
        ...prev,
        [date]: { ...dayLog, water: dayLog.water + amount }
      };
    });
  };

  // Added: Logic for logging periods manually
  const logPeriod = (startDate: string, duration: number) => {
    setLastPeriodStart(startDate);
    setPeriodDuration(duration);
  };

  // Added: Logic for determining if history is locked for non-subscribed users
  const isDateLocked = (date: string) => {
    if (isSubscribed) return false;
    const diff = Math.floor((new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    return diff > 7;
  };

  return (
    <WellnessContext.Provider value={{ 
      logs, 
      lastPeriodStart, 
      cycleLength, 
      periodDuration,
      isHealthConnected,
      connectHealth, 
      getCycleInfo, 
      importOnboardingData,
      addWorkout,
      addSymptomLog,
      addMeal,
      addWater,
      liveSteps,
      pedometerAvailable,
      logPeriod,
      setCycleLength,
      isDateLocked
    }}>
      {children}
    </WellnessContext.Provider>
  );
};

export const useWellness = () => {
  const context = useContext(WellnessContext);
  if (context === undefined) throw new Error('useWellness must be used within a WellnessProvider');
  return context;
};
