
import React from 'react';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';
import Chip from '../../components/Chip';
import { useOnboarding } from '../../context/OnboardingContext';

interface SymptomsScreenProps {
  onNext: () => void;
  onBack: () => void;
  step: number;
  totalSteps: number;
}

const SYMPTOMS = [
  "Acne",
  "Fatigue",
  "Cravings",
  "Bloating",
  "Mood swings",
  "Hair growth",
  "Hair thinning",
  "Irregular periods"
];

const SymptomsScreen: React.FC<SymptomsScreenProps> = ({ onNext, onBack, step, totalSteps }) => {
  const { answers, updateAnswers } = useOnboarding();

  const toggleSymptom = (symptom: string) => {
    const current = answers.symptoms;
    if (current.includes(symptom)) {
      updateAnswers({ symptoms: current.filter(s => s !== symptom) });
    } else if (current.length < 2) {
      updateAnswers({ symptoms: [...current, symptom] });
    }
    // If length is 2 and user tries to add another, we do nothing (enforcing max 2)
  };

  return (
    <OnboardingLayout
      title="Common symptoms"
      subtitle="Pick your top 1–2 symptoms you're experiencing most often."
      onNext={onNext}
      onBack={onBack}
      currentStep={step}
      totalSteps={totalSteps}
      isNextDisabled={answers.symptoms.length === 0}
    >
      <div className="flex flex-wrap gap-3">
        {SYMPTOMS.map((symptom) => (
          <Chip 
            key={symptom}
            label={symptom}
            selected={answers.symptoms.includes(symptom)}
            onPress={() => toggleSymptom(symptom)}
          />
        ))}
      </div>
      {answers.symptoms.length === 2 && (
        <p className="text-[10px] text-[#8FAF9D] font-bold mt-6 uppercase tracking-widest">
          Max symptoms reached
        </p>
      )}
    </OnboardingLayout>
  );
};

export default SymptomsScreen;
