
import React from 'react';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';
import Chip from '../../components/Chip';
import Toggle from '../../components/Toggle';
import { useOnboarding } from '../../context/OnboardingContext';

interface DietPrefsScreenProps {
  onNext: () => void;
  onBack: () => void;
  step: number;
  totalSteps: number;
}

const DIET_STYLES = ["Balanced", "Low GI", "Anti-inflammatory", "High Protein", "Mediterranean", "Plant-based"];
const RESTRICTIONS = ["Gluten-free", "Dairy-free", "Vegetarian", "Vegan"];
const COOKING_TIMES = ["<15 min", "15–30", "30–45", "Any"];

const DietPrefsScreen: React.FC<DietPrefsScreenProps> = ({ onNext, onBack, step, totalSteps }) => {
  const { answers, updateAnswers } = useOnboarding();

  const toggleRestriction = (restriction: string) => {
    const current = answers.restrictions || [];
    if (current.includes(restriction)) {
      updateAnswers({ restrictions: current.filter(r => r !== restriction) });
    } else {
      updateAnswers({ restrictions: [...current, restriction] });
    }
  };

  const isFormValid = !!answers.dietStyle && !!answers.cookingTime;

  return (
    <OnboardingLayout
      title="Nourish your body"
      subtitle="Cyra personalizes your recipe recommendations based on your dietary needs and lifestyle."
      onNext={onNext}
      onBack={onBack}
      currentStep={step}
      totalSteps={totalSteps}
      isNextDisabled={!isFormValid}
    >
      <div className="space-y-8">
        {/* Dietary Style */}
        <div className="space-y-3">
          <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">Dietary Style</p>
          <div className="flex flex-wrap gap-2">
            {DIET_STYLES.map((style) => (
              <Chip 
                key={style}
                label={style}
                selected={answers.dietStyle === style}
                onPress={() => updateAnswers({ dietStyle: style })}
              />
            ))}
          </div>
        </div>

        {/* Restrictions */}
        <div className="space-y-3">
          <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">Restrictions</p>
          <div className="bg-white border border-[#E5E7EB] rounded-[18px] px-5 py-2">
            {RESTRICTIONS.map((res, index) => (
              <div key={res}>
                <Toggle 
                  label={res}
                  isEnabled={answers.restrictions.includes(res)}
                  onToggle={() => toggleRestriction(res)}
                />
                {index < RESTRICTIONS.length - 1 && <div className="h-[1px] bg-[#F7F4F1] w-full" />}
              </div>
            ))}
          </div>
        </div>

        {/* Allergies */}
        <div className="space-y-3">
          <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">Any Allergies?</p>
          <input
            type="text"
            className="w-full bg-white border border-[#E5E7EB] rounded-[14px] px-5 py-3.5 text-sm text-[#1F2937] placeholder-[#6B7280]/50 outline-none focus:border-[#8FAF9D] transition-colors"
            placeholder="e.g., nuts, shellfish"
            value={answers.allergies}
            onChange={(e) => updateAnswers({ allergies: e.target.value })}
          />
        </div>

        {/* Cooking Time */}
        <div className="space-y-3 pb-4">
          <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">Preferred Cooking Time</p>
          <div className="flex flex-wrap gap-2">
            {COOKING_TIMES.map((time) => (
              <Chip 
                key={time}
                label={time}
                selected={answers.cookingTime === time}
                onPress={() => updateAnswers({ cookingTime: time })}
              />
            ))}
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default DietPrefsScreen;
