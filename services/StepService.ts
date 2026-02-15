
/**
 * In a real Expo environment, you would import { Pedometer } from 'expo-sensors';
 * This service handles the bridge between Native HealthKit/Google Fit and the Cyra UI.
 */

export interface PedometerResult {
  steps: number;
}

export type PedometerUpdateCallback = (result: PedometerResult) => void;

// Simulated Pedometer for Web/Preview environments
const MockPedometer = {
  isAvailableAsync: async () => {
    return typeof window !== 'undefined';
  },
  requestPermissionsAsync: async () => {
    // Bridges to native HealthKit prompt
    return { status: 'granted' };
  },
  getStepCountAsync: async (start: Date, end: Date) => {
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return { steps: Math.floor(hours * 500) }; 
  },
  watchStepCount: (callback: PedometerUpdateCallback) => {
    let currentSteps = 0;
    const interval = setInterval(() => {
      currentSteps += Math.floor(Math.random() * 10);
      callback({ steps: currentSteps });
    }, 5000);
    return {
      remove: () => clearInterval(interval)
    };
  }
};

export const StepService = {
  async isAvailable(): Promise<boolean> {
    try {
      return await MockPedometer.isAvailableAsync();
    } catch (e) {
      return false;
    }
  },

  async requestPermissions(): Promise<boolean> {
    const { status } = await MockPedometer.requestPermissionsAsync();
    return status === 'granted';
  },

  async getTodaySteps(): Promise<number> {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    const result = await MockPedometer.getStepCountAsync(start, end);
    return result.steps;
  },

  subscribe(callback: PedometerUpdateCallback) {
    return MockPedometer.watchStepCount(callback);
  }
};
