
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LabMarkerDefinition, LabResult, LabMarkerId } from '../labs/types';
import { DEFAULT_MARKERS } from '../labs/defaultMarkers';

interface LabContextType {
  markers: LabMarkerDefinition[];
  results: LabResult[];
  addLabResult: (result: Omit<LabResult, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLabResult: (id: string, updates: Partial<LabResult>) => void;
  deleteLabResult: (id: string) => void;
  addCustomMarker: (marker: Omit<LabMarkerDefinition, 'isCustom'>) => void;
  getLatestResultByMarker: (markerId: LabMarkerId) => LabResult | undefined;
  getTrendByMarker: (markerId: LabMarkerId) => "up" | "down" | "stable" | "none";
}

const LabContext = createContext<LabContextType | undefined>(undefined);

export const LabProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [markers, setMarkers] = useState<LabMarkerDefinition[]>(DEFAULT_MARKERS);
  const [results, setResults] = useState<LabResult[]>([]);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const savedMarkers = await AsyncStorage.getItem('cyra_labs_markers');
        const savedResults = await AsyncStorage.getItem('cyra_labs_results');

        if (savedMarkers) setMarkers(JSON.parse(savedMarkers));
        if (savedResults) setResults(JSON.parse(savedResults));
      } catch (e) {
        console.error("Labs hydration error", e);
      }
    };
    hydrate();
  }, []);

  useEffect(() => {
    const persist = async () => {
      try {
        if (markers.length > 0) {
          await AsyncStorage.setItem('cyra_labs_markers', JSON.stringify(markers));
        }
        await AsyncStorage.setItem('cyra_labs_results', JSON.stringify(results));
      } catch (e) {}
    };
    persist();
  }, [markers, results]);

  const addLabResult = (resultData: Omit<LabResult, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newResult: LabResult = {
      ...resultData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setResults(prev => [newResult, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const updateLabResult = (id: string, updates: Partial<LabResult>) => {
    setResults(prev => prev.map(r => r.id === id ? { ...r, ...updates, updatedAt: Date.now() } : r));
  };

  const deleteLabResult = (id: string) => {
    setResults(prev => prev.filter(r => r.id !== id));
  };

  const addCustomMarker = (markerData: Omit<LabMarkerDefinition, 'isCustom'>) => {
    const newMarker: LabMarkerDefinition = {
      ...markerData,
      isCustom: true,
    };
    setMarkers(prev => [...prev, newMarker]);
  };

  const getLatestResultByMarker = (markerId: LabMarkerId) => {
    return results.find(r => r.markerId === markerId);
  };

  const getTrendByMarker = (markerId: LabMarkerId) => {
    const markerResults = results
      .filter(r => r.markerId === markerId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (markerResults.length < 2) return "none";
    const latest = markerResults[0].value;
    const previous = markerResults[1].value;

    if (latest > previous) return "up";
    if (latest < previous) return "down";
    return "stable";
  };

  return (
    <LabContext.Provider value={{
      markers, results, addLabResult, updateLabResult, deleteLabResult,
      addCustomMarker, getLatestResultByMarker, getTrendByMarker
    }}>
      {children}
    </LabContext.Provider>
  );
};

export const useLabs = () => {
  const context = useContext(LabContext);
  if (!context) throw new Error('useLabs must be used within LabProvider');
  return context;
};
