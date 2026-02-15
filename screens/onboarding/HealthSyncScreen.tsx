
import React, { useState } from 'react';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useOnboarding } from '../../context/OnboardingContext';
import { useWellness } from '../../context/WellnessContext';
import { triggerHaptic } from '../../utils/haptics';

interface HealthSyncScreenProps {
  onNext: () => void;
  onBack: () => void;
  step: number;
  totalSteps: number;
}

const HealthSyncScreen: React.FC<HealthSyncScreenProps> = ({ onNext, onBack, step, totalSteps }) => {
  const { updateAnswers } = useOnboarding();
  const { connectHealth } = useWellness();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    triggerHaptic('medium');
    
    // Simulate iOS HealthKit permission request
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    connectHealth();
    updateAnswers({ isHealthSynced: true });
    setIsSyncing(false);
    triggerHaptic('success');
    onNext();
  };

  return (
    <OnboardingLayout
      title="Live Sync"
      subtitle="Cyra connects with Apple Health and Apple Watch to provide real-time movement and recovery data."
      onNext={onNext}
      onBack={onBack}
      currentStep={step}
      totalSteps={totalSteps}
    >
      <div className="space-y-8">
        <div className="flex flex-col items-center py-6">
          <div className="w-24 h-24 bg-white rounded-[32px] shadow-xl flex items-center justify-center text-4xl mb-6 relative overflow-hidden border border-[#F0EFEA]">
            ⌚
            {isSyncing && (
              <div className="absolute inset-0 bg-[#8FAF9D]/10 flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-t-[#8FAF9D] border-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          <h3 className="text-xl font-bold text-[#1F2937]">Apple Watch</h3>
          <p className="text-xs text-[#6B7280] font-medium mt-1 uppercase tracking-widest">Supports HealthKit</p>
        </div>

        <div className="space-y-4">
          <SyncBenefit icon="👟" title="Automatic Steps" text="Sync your daily activity without manual entry." />
          <SyncBenefit icon="💓" title="Heart Rate Variability" text="Understand how your nervous system responds to your cycle." />
          <SyncBenefit icon="🛌" title="Sleep Architecture" text="Optimize rest during your luteal and menstrual phases." />
        </div>

        <div className="pt-4">
          <Button 
            label={isSyncing ? "Connecting..." : "Connect Apple Health"} 
            onPress={handleSync} 
            className="w-full shadow-lg shadow-[#8FAF9D]/20"
          />
        </div>
      </div>
    </OnboardingLayout>
  );
};

const SyncBenefit = ({ icon, title, text }: { icon: string; title: string; text: string }) => (
  <Card className="flex items-center gap-4 p-4 border-none shadow-sm bg-white">
    <div className="w-10 h-10 rounded-xl bg-[#F7F4F1] flex items-center justify-center text-xl">{icon}</div>
    <div className="flex-1">
      <h4 className="text-sm font-bold text-[#1F2937]">{title}</h4>
      <p className="text-[11px] text-[#6B7280] leading-relaxed mt-0.5">{text}</p>
    </div>
  </Card>
);

export default HealthSyncScreen;
