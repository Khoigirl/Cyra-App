
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { OnboardingAnswers } from '../types';

interface OnboardingContextType {
  answers: OnboardingAnswers;
  updateAnswers: (newAnswers: Partial<OnboardingAnswers>) => void;
  resetAnswers: () => void;
}

// Added missing 'isHealthSynced' property to initialAnswers
const initialAnswers: OnboardingAnswers = {
  goals: [],
  symptoms: [],
  restrictions: [],
  allergies: '',
  hasConsented: false,
  isHealthSynced: false,
  reminders: {
    period: true,
    symptoms: true,
    water: false,
    meal: false,
  },
  reminderTimes: {
    period: '09:00',
    symptoms: '20:00',
    water: '10:00',
    meal: '12:00',
  }
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [answers, setAnswers] = useState<OnboardingAnswers>(initialAnswers);

  const updateAnswers = (newAnswers: Partial<OnboardingAnswers>) => {
    setAnswers((prev) => ({ ...prev, ...newAnswers }));
  };

  const resetAnswers = () => setAnswers(initialAnswers);

  return (
    <OnboardingContext.Provider value={{ answers, updateAnswers, resetAnswers }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
