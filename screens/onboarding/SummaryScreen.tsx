
import React, { useMemo } from 'react';
import Screen from '../../components/Screen';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { useOnboarding } from '../../context/OnboardingContext';
import { useWellness } from '../../context/WellnessContext';
import { triggerHaptic } from '../../utils/haptics';

interface SummaryScreenProps {
  onNext: () => void;
}

const SummaryScreen: React.FC<SummaryScreenProps> = ({ onNext }) => {
  const { answers } = useOnboarding();
  const { importOnboardingData } = useWellness();

  const handleFinish = () => {
    triggerHaptic('success');
    // Bridge onboarding answers to real wellness tracker settings
    importOnboardingData(answers);
    onNext();
  };

  const recommendations = useMemo(() => {
    const items = [];

    // Symptom-based recs
    if (answers.symptoms.includes('Cravings')) {
      items.push({
        title: 'Manage Cravings',
        text: 'Adding extra fiber and protein to your snacks will help stabilize blood sugar.',
        icon: '🥑'
      });
    }
    if (answers.symptoms.includes('Fatigue')) {
      items.push({
        title: 'Morning Energy',
        text: 'Try 5 mins of sunlight exposure before caffeine to help reset cortisol.',
        icon: '☀️'
      });
    }

    // Goal-based recs
    if (answers.goals.includes('Regular cycles')) {
      items.push({
        title: 'Cycle Tracking',
        text: 'Daily symptom logging helps Cyra find your unique hormonal windows.',
        icon: '📊'
      });
    }

    // Default rec
    items.push({
        title: 'Balanced Meals',
        text: `Your ${answers.dietStyle || 'Balanced'} plan is ready with tailored recipes.`,
        icon: '🍽️'
    });

    return items.slice(0, 4); // Show top 4
  }, [answers]);

  return (
    <Screen hideHeader scrollable={false}>
      <div className="flex flex-col h-full pt-16 pb-12 px-2">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-full bg-[#8FAF9D]/10 flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-[#8FAF9D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-[#1F2937] text-center mb-3">Your plan is ready</h2>
          <p className="text-[#6B7280] text-sm text-center leading-relaxed max-w-xs">
            We've tailored Cyra to support your journey with {answers.symptoms.join(' & ')}.
          </p>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto hide-scrollbar pb-6 px-1">
          <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest px-1">Personalized Focus</p>
          {recommendations.map((rec, i) => (
            <Card key={i} className="flex gap-4 items-center p-5 border-none shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${i * 150}ms` }}>
              <div className="text-3xl">{rec.icon}</div>
              <div className="flex-1">
                <h4 className="font-bold text-[#1F2937] text-sm">{rec.title}</h4>
                <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">{rec.text}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="pt-6 space-y-3">
          <Button 
            label="Save my plan" 
            onPress={handleFinish} 
            className="w-full shadow-lg shadow-[#8FAF9D]/20"
          />
          <button 
            onClick={handleFinish}
            className="w-full text-center text-xs font-semibold text-[#6B7280] py-2 hover:text-[#8FAF9D] transition-colors"
          >
            Continue as guest
          </button>
        </div>
      </div>
    </Screen>
  );
};

export default SummaryScreen;
