
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ProgramProgress {
  programId: string;
  startedAt: string; // ISO Date
  completedDays: number[];
  totalDays: number;
}

interface LearnContextType {
  savedItemIds: string[];
  readItemIds: string[];
  activeProgram: ProgramProgress | null;
  programHistory: Record<string, ProgramProgress>;
  
  toggleSaved: (id: string) => void;
  markRead: (id: string) => void;
  startProgram: (id: string, totalDays: number) => void;
  completeProgramDay: (programId: string, dayNumber: number) => void;
  isSaved: (id: string) => boolean;
  isRead: (id: string) => boolean;
  getProgramProgress: (id: string) => ProgramProgress | undefined;
  getLearningStreak: () => number; // Days active this week
}

const LearnContext = createContext<LearnContextType | undefined>(undefined);

export const LearnProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [savedItemIds, setSavedItemIds] = useState<string[]>([]);
  const [readItemIds, setReadItemIds] = useState<string[]>([]);
  const [activeProgram, setActiveProgram] = useState<ProgramProgress | null>(null);
  const [programHistory, setProgramHistory] = useState<Record<string, ProgramProgress>>({});

  // Hydrate from Storage
  useEffect(() => {
    const saved = localStorage.getItem('cyra_learn_store_v2');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSavedItemIds(parsed.savedItemIds || []);
      setReadItemIds(parsed.readItemIds || []);
      setActiveProgram(parsed.activeProgram || null);
      setProgramHistory(parsed.programHistory || {});
    }
  }, []);

  // Persist to Storage
  useEffect(() => {
    localStorage.setItem('cyra_learn_store_v2', JSON.stringify({ 
      savedItemIds, 
      readItemIds, 
      activeProgram, 
      programHistory 
    }));
  }, [savedItemIds, readItemIds, activeProgram, programHistory]);

  const toggleSaved = (id: string) => {
    setSavedItemIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [id, ...prev]);
  };

  const markRead = (id: string) => {
    if (!readItemIds.includes(id)) {
      setReadItemIds(prev => [id, ...prev]);
    }
  };

  const startProgram = (id: string, totalDays: number) => {
    const newProg: ProgramProgress = {
      programId: id,
      startedAt: new Date().toISOString(),
      completedDays: [],
      totalDays
    };
    setActiveProgram(newProg);
    setProgramHistory(prev => ({ ...prev, [id]: newProg }));
  };

  const completeProgramDay = (programId: string, dayNumber: number) => {
    setProgramHistory(prev => {
      const existing = prev[programId] || { programId, startedAt: new Date().toISOString(), completedDays: [], totalDays: 0 };
      const updated = {
        ...existing,
        completedDays: existing.completedDays.includes(dayNumber) 
          ? existing.completedDays 
          : [...existing.completedDays, dayNumber].sort((a, b) => a - b)
      };
      
      if (activeProgram?.programId === programId) {
        setActiveProgram(updated);
      }
      
      return { ...prev, [programId]: updated };
    });
  };

  const isSaved = (id: string) => savedItemIds.includes(id);
  const isRead = (id: string) => readItemIds.includes(id);
  const getProgramProgress = (id: string) => programHistory[id];

  const getLearningStreak = () => {
    // Basic mock logic: count unique days in program history and read items
    // In a real app, readItemIds would be an object with timestamps
    return Math.min(readItemIds.length + (activeProgram?.completedDays.length || 0), 7);
  };

  return (
    <LearnContext.Provider value={{
      savedItemIds, readItemIds, activeProgram, programHistory,
      toggleSaved, markRead, startProgram, completeProgramDay,
      isSaved, isRead, getProgramProgress, getLearningStreak
    }}>
      {children}
    </LearnContext.Provider>
  );
};

export const useLearn = () => {
  const context = useContext(LearnContext);
  if (!context) throw new Error('useLearn must be used within LearnProvider');
  return context;
};
