
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type PlanType = 'free' | 'premium';

export interface Entitlements {
  calendarHistoryDays: number;
  premiumPrograms: boolean;
  labsScan: boolean;
  exportPDF: boolean;
}

interface TrialState {
  isActive: boolean;
  startedAt: string | null;
  days: number;
}

interface SubscriptionContextType {
  plan: PlanType;
  isSubscribed: boolean;
  trial: TrialState;
  entitlements: Entitlements;
  startTrial: (days: number) => void;
  setPremium: () => void;
  setFree: () => void;
  restorePurchases: () => void;
  isFeatureLocked: (feature: keyof Entitlements) => boolean;
}

const FREE_ENTITLEMENTS: Entitlements = {
  calendarHistoryDays: 7,
  premiumPrograms: false,
  labsScan: false,
  exportPDF: false,
};

const PREMIUM_ENTITLEMENTS: Entitlements = {
  calendarHistoryDays: 3650,
  premiumPrograms: true,
  labsScan: true,
  exportPDF: true,
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [plan, setPlan] = useState<PlanType>('free');
  const [trial, setTrial] = useState<TrialState>({ isActive: false, startedAt: null, days: 0 });

  useEffect(() => {
    const saved = localStorage.getItem('cyra_subscription_v1');
    if (saved) {
      const parsed = JSON.parse(saved);
      setPlan(parsed.plan || 'free');
      setTrial(parsed.trial || { isActive: false, startedAt: null, days: 0 });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cyra_subscription_v1', JSON.stringify({ plan, trial }));
  }, [plan, trial]);

  const isSubscribed = plan === 'premium';

  const entitlements = isSubscribed ? PREMIUM_ENTITLEMENTS : FREE_ENTITLEMENTS;

  const startTrial = (days: number) => {
    // TODO: Integrate with Stripe/RevenueCat trial logic
    setTrial({ isActive: true, startedAt: new Date().toISOString(), days });
    setPlan('premium');
  };

  const setPremium = () => {
    // TODO: Real purchase flow
    setPlan('premium');
    setTrial({ isActive: false, startedAt: null, days: 0 });
  };

  const setFree = () => {
    setPlan('free');
    setTrial({ isActive: false, startedAt: null, days: 0 });
  };

  const restorePurchases = () => {
    // TODO: Call store restore
    alert("Restore will be available soon. Checking your account...");
  };

  const isFeatureLocked = (feature: keyof Entitlements) => {
    if (isSubscribed) return false;
    const val = entitlements[feature];
    return typeof val === 'boolean' ? !val : false;
  };

  return (
    <SubscriptionContext.Provider value={{
      plan, isSubscribed, trial, entitlements,
      startTrial, setPremium, setFree, restorePurchases, isFeatureLocked
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) throw new Error('useSubscription must be used within SubscriptionProvider');
  return context;
};
