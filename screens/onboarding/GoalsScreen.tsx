
import React from 'react';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';
import Chip from '../../components/Chip';
import { useOnboarding } from '../../context/OnboardingContext';

interface GoalsScreenProps {
  onNext: () => void;
  onBack: () => void;
  step: number;
  totalSteps: number;
}

const GOALS = [
  "Regular cycles",
  "Weight management",
  "Less acne",
  "Better energy",
  "Manage cravings",
  "Fertility support"
];

const GoalsScreen: React.FC<GoalsScreenProps> = ({ onNext, onBack, step, totalSteps }) => {
  const { answers, updateAnswers } = useOnboarding();

  const toggleGoal = (goal: string) => {
    const current = answers.goals;
    if (current.includes(goal)) {
      updateAnswers({ goals: current.filter(g => g !== goal) });
    } else {
      updateAnswers({ goals: [...current, goal] });
    }
  };

  return (
    <OnboardingLayout
      title="What are your goals?"
      subtitle="Select the areas you'd like to focus on for your hormone health."
      onNext={onNext}
      onBack={onBack}
      currentStep={step}
      totalSteps={totalSteps}
      isNextDisabled={answers.goals.length === 0}
    >
      <div className="flex flex-wrap gap-3">
        {GOALS.map((goal) => (
          <Chip 
            key={goal}
            label={goal}
            selected={answers.goals.includes(goal)}
            onPress={() => toggleGoal(goal)}
          />
        ))}
      </div>
    </OnboardingLayout>
  );
};

export default GoalsScreen;
