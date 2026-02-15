
export enum Tab {
  Today = 'Today',
  Recipes = 'Recipes',
  Track = 'Track',
  Learn = 'Learn',
  Profile = 'Profile'
}

export enum AuthStatus {
  Guest = 'guest',
  Authenticated = 'authenticated',
  Unauthenticated = 'unauthenticated'
}

export enum AppFlow {
  Onboarding = 'Onboarding',
  Main = 'Main'
}

export enum OnboardingScreen {
  Welcome = 'Welcome',
  Goals = 'Goals',
  Symptoms = 'Symptoms',
  CycleInfo = 'CycleInfo',
  DietPrefs = 'DietPrefs',
  Reminders = 'Reminders',
  HealthSync = 'HealthSync',
  Consent = 'Consent',
  PersonalizedOverview = 'PersonalizedOverview',
  Summary = 'Summary',
  AuthGate = 'AuthGate',
  EmailAuth = 'EmailAuth'
}

export interface OnboardingAnswers {
  goals: string[];
  symptoms: string[];
  cycleLength?: string;
  periodRegularity?: string;
  lastPeriodDate?: string;
  dietStyle?: string;
  restrictions: string[];
  allergies: string;
  cookingTime?: string;
  hasConsented: boolean;
  isHealthSynced: boolean;
  reminders: {
    period: boolean;
    symptoms: boolean;
    water: boolean;
    meal: boolean;
  };
  reminderTimes: {
    period: string;
    symptoms: string;
    water: string;
    meal: string;
  };
}

export interface Article {
  id: string;
  title: string;
  readTime: string;
  category: string;
  image: string;
}

export interface Symptom {
  id: string;
  label: string;
  icon: string;
}
