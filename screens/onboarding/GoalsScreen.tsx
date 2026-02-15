
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { styled } from 'nativewind';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';
import { useOnboarding } from '../../context/OnboardingContext';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);

const GOALS = [
  "Regular cycles",
  "Weight management",
  "Less acne",
  "Better energy",
  "Manage cravings",
  "Fertility support"
];

const GoalsScreen: React.FC<any> = ({ onNext, onBack, step, totalSteps }) => {
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
      <StyledView className="flex-row flex-wrap gap-3">
        {GOALS.map((goal) => {
          const isSelected = answers.goals.includes(goal);
          return (
            <StyledPressable 
              key={goal}
              onPress={() => toggleGoal(goal)}
              className={`px-6 py-3 rounded-full border transition-all ${
                isSelected ? "bg-[#8FAF9D] border-[#8FAF9D]" : "bg-white border-[#E5E7EB]"
              }`}
            >
              <StyledText className={`text-sm font-bold ${isSelected ? "text-white" : "text-[#6B7280]"}`}>
                {goal}
              </StyledText>
            </StyledPressable>
          );
        })}
      </StyledView>
    </OnboardingLayout>
  );
};

export default GoalsScreen;
