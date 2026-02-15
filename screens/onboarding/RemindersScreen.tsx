
import React from 'react';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';
import Toggle from '../../components/Toggle';
import Card from '../../components/Card';
import { useOnboarding } from '../../context/OnboardingContext';

interface RemindersScreenProps {
  onNext: () => void;
  onBack: () => void;
  step: number;
  totalSteps: number;
}

const PRESET_TIMES = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

const RemindersScreen: React.FC<RemindersScreenProps> = ({ onNext, onBack, step, totalSteps }) => {
  const { answers, updateAnswers } = useOnboarding();

  const handleToggle = (key: keyof typeof answers.reminders) => {
    updateAnswers({
      reminders: {
        ...answers.reminders,
        [key]: !answers.reminders[key]
      }
    });
  };

  const cycleTime = (key: keyof typeof answers.reminderTimes) => {
    const currentTime = answers.reminderTimes[key];
    const currentIndex = PRESET_TIMES.indexOf(currentTime);
    const nextIndex = (currentIndex + 1) % PRESET_TIMES.length;
    updateAnswers({
      reminderTimes: {
        ...answers.reminderTimes,
        [key]: PRESET_TIMES[nextIndex]
      }
    });
  };

  const ReminderRow = ({ label, icon, reminderKey }: { label: string, icon: string, reminderKey: keyof typeof answers.reminders }) => (
    <Card className="mb-4 p-4 border-none shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#F7F4F1] flex items-center justify-center text-xl">
          {icon}
        </div>
        <div>
          <h4 className="font-semibold text-[#1F2937] text-sm">{label}</h4>
          {answers.reminders[reminderKey] && (
            <button 
              onClick={() => cycleTime(reminderKey)}
              className="mt-1 px-2 py-0.5 rounded-lg border border-[#8FAF9D]/30 text-[10px] font-bold text-[#8FAF9D] uppercase tracking-wider hover:bg-[#8FAF9D]/5 transition-colors"
            >
              Time: {answers.reminderTimes[reminderKey]}
            </button>
          )}
        </div>
      </div>
      <Toggle 
        label="" 
        isEnabled={answers.reminders[reminderKey]} 
        onToggle={() => handleToggle(reminderKey)} 
      />
    </Card>
  );

  return (
    <OnboardingLayout
      title="Stay consistent"
      subtitle="Cyra's gentle reminders help you find your rhythm and stick to your wellness goals."
      onNext={onNext}
      onBack={onBack}
      currentStep={step}
      totalSteps={totalSteps}
    >
      <div className="space-y-2">
        <ReminderRow label="Period predictions" icon="🌙" reminderKey="period" />
        <ReminderRow label="Symptom check-in" icon="✍️" reminderKey="symptoms" />
        <ReminderRow label="Water intake" icon="💧" reminderKey="water" />
        <ReminderRow label="Meal logging" icon="🥗" reminderKey="meal" />
        
        <div className="pt-6">
          <Card className="bg-[#8FAF9D]/10 border-none p-4 flex gap-3 items-start">
             <span className="text-lg">✨</span>
             <p className="text-[11px] text-[#6B7280] leading-relaxed italic">
               Consistency is key to understanding PCOS patterns. We'll only send the essentials.
             </p>
          </Card>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default RemindersScreen;
