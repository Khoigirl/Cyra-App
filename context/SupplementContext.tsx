
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Supplement, SupplementReminder, SupplementIntakeLog, SupplementForm, ColorKey } from '../supplementTypes';

interface SupplementContextType {
  supplements: Supplement[];
  reminders: SupplementReminder[];
  logs: Record<string, SupplementIntakeLog>;
  addSupplement: (sup: Omit<Supplement, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSupplement: (id: string, updates: Partial<Supplement>) => void;
  toggleSupplementActive: (id: string) => void;
  setTaken: (date: string, supplementId: string, checked: boolean) => void;
  addReminder: (rem: Omit<SupplementReminder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateReminder: (id: string, updates: Partial<SupplementReminder>) => void;
  deleteReminder: (id: string) => void;
  getStats: (supplementId: string) => { weeklyConsistency: number; currentStreak: number; bestStreak: number };
  getCompletionForDate: (date: string) => { taken: number; total: number };
}

const SupplementContext = createContext<SupplementContextType | undefined>(undefined);

const DEFAULT_SUPPS: Omit<Supplement, 'id' | 'createdAt' | 'updatedAt'>[] = [
  { name: 'Inositol', form: 'powder', defaultDoseText: '2g', colorKey: 'sage', isActive: true },
  { name: 'Magnesium', form: 'capsule', defaultDoseText: '400mg', colorKey: 'lavender', isActive: true },
  { name: 'Omega-3', form: 'capsule', defaultDoseText: '1000mg', colorKey: 'blue', isActive: true },
  { name: 'Vitamin D', form: 'capsule', defaultDoseText: '2000IU', colorKey: 'rose', isActive: true },
  { name: 'Spearmint Tea', form: 'tea', defaultDoseText: '1 cup', colorKey: 'neutral', isActive: true },
];

export const SupplementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [reminders, setReminders] = useState<SupplementReminder[]>([]);
  const [logs, setLogs] = useState<Record<string, SupplementIntakeLog>>({});

  // Hydrate from Storage
  useEffect(() => {
    const savedSupps = localStorage.getItem('cyra_supplements');
    const savedReminders = localStorage.getItem('cyra_reminders');
    const savedLogs = localStorage.getItem('cyra_logs');

    if (savedSupps) {
      setSupplements(JSON.parse(savedSupps));
    } else {
      // Seed defaults
      const seeded = DEFAULT_SUPPS.map(s => ({
        ...s,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: Date.now(),
        updatedAt: Date.now()
      }));
      setSupplements(seeded);
    }

    if (savedReminders) setReminders(JSON.parse(savedReminders));
    if (savedLogs) setLogs(JSON.parse(savedLogs));
  }, []);

  // Persistence
  useEffect(() => {
    if (supplements.length > 0) localStorage.setItem('cyra_supplements', JSON.stringify(supplements));
  }, [supplements]);

  useEffect(() => {
    localStorage.setItem('cyra_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('cyra_logs', JSON.stringify(logs));
  }, [logs]);

  const addSupplement = (sup: Omit<Supplement, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSup: Supplement = {
      ...sup,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setSupplements(prev => [...prev, newSup]);
  };

  const updateSupplement = (id: string, updates: Partial<Supplement>) => {
    setSupplements(prev => prev.map(s => s.id === id ? { ...s, ...updates, updatedAt: Date.now() } : s));
  };

  const toggleSupplementActive = (id: string) => {
    setSupplements(prev => prev.map(s => s.id === id ? { ...s, isActive: !s.isActive, updatedAt: Date.now() } : s));
  };

  const setTaken = (date: string, supplementId: string, checked: boolean) => {
    setLogs(prev => {
      const dayLog = prev[date] || { date, taken: {} };
      return {
        ...prev,
        [date]: {
          ...dayLog,
          taken: {
            ...dayLog.taken,
            [supplementId]: { checked, takenAt: checked ? [...(dayLog.taken[supplementId]?.takenAt || []), Date.now()] : [] }
          }
        }
      };
    });
  };

  const addReminder = (rem: Omit<SupplementReminder, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRem: SupplementReminder = {
      ...rem,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setReminders(prev => [...prev, newRem]);
  };

  const updateReminder = (id: string, updates: Partial<SupplementReminder>) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, ...updates, updatedAt: Date.now() } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const getStats = (supplementId: string) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    });

    const weeklyConsistency = last7Days.filter(d => logs[d]?.taken[supplementId]?.checked).length;
    
    // Streak calculation (simple implementation)
    let currentStreak = 0;
    const sortedDates = Object.keys(logs).sort().reverse();
    for (const d of sortedDates) {
      if (logs[d]?.taken[supplementId]?.checked) currentStreak++;
      else break;
    }

    return { weeklyConsistency, currentStreak, bestStreak: currentStreak }; // Best streak mock
  };

  const getCompletionForDate = (date: string) => {
    const activeIds = supplements.filter(s => s.isActive).map(s => s.id);
    const takenCount = activeIds.filter(id => logs[date]?.taken[id]?.checked).length;
    return { taken: takenCount, total: activeIds.length };
  };

  return (
    <SupplementContext.Provider value={{
      supplements, reminders, logs,
      addSupplement, updateSupplement, toggleSupplementActive,
      setTaken, addReminder, updateReminder, deleteReminder,
      getStats, getCompletionForDate
    }}>
      {children}
    </SupplementContext.Provider>
  );
};

export const useSupplements = () => {
  const context = useContext(SupplementContext);
  if (!context) throw new Error('useSupplements must be used within SupplementProvider');
  return context;
};
