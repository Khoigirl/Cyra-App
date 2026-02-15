
import React, { useMemo } from 'react';
import Screen from '../components/Screen';
import Card from '../components/Card';
import PhaseChip from '../components/PhaseChip';
import CollapsibleSection from '../components/CollapsibleSection';
import Button from '../components/Button';
import { useWellness, Workout, Meal, SymptomLog } from '../context/WellnessContext';
import { useOnboarding } from '../context/OnboardingContext';
import { useSupplements } from '../context/SupplementContext';
import { usePhaseTheme } from '../hooks/usePhaseTheme';
import { generateIntelligence } from '../intelligence/engine';
import { getPhaseEducation } from '../intelligence/phaseCopy';
import { calculate7DayAverages, calculateSymptomPatterns, calculateLoggingStreak } from '../utils/metrics';
import { getWeeklyConsistencyAcrossAll, hasAnyZeroStreak } from '../utils/supplementMetrics';
import { getSupplementsTakenNamesForDate } from '../intelligence/supplementsBridge';
import { RECIPES } from '../data/recipes';
import { triggerHaptic } from '../utils/haptics';

interface DetailsScreenProps {
  onBack: () => void;
  onNavigateToSupplements?: () => void;
}

// Curated Unsplash IDs for high-quality food variety
const FOOD_IMAGE_IDS = [
  '1490645935967-10de6ba17061', // Salad
  '1546069901-ba9599a7e63c', // Grain bowl
  '1467003909585-2f8a72700288', // Salmon
  '1504674900247-0877df9cc836', // Platter
  '1512621776951-a57141f2eefd', // Healthy bowl
  '1540189549336-e6e99c3679fe'  // Plated dish
];

const DetailsScreen: React.FC<DetailsScreenProps> = ({ onBack, onNavigateToSupplements }) => {
  const { logs, lastPeriodStart, periodDuration, cycleLength, getCycleInfo } = useWellness();
  const { supplements, logs: suppLogs, getStats, getCompletionForDate } = useSupplements();
  const { answers } = useOnboarding();
  
  const realToday = new Date().toISOString().split('T')[0];
  const activeLog = logs[realToday] || { steps: 0, workouts: [], water: 0, meals: [], symptomLogs: [], supplements: [] };
  
  const cycleInfo = useMemo(() => getCycleInfo(realToday), [realToday, lastPeriodStart, periodDuration, cycleLength]);
  const { theme } = usePhaseTheme(cycleInfo.phase);

  const integratedSupplements = useMemo(() => {
    return getSupplementsTakenNamesForDate(realToday, supplements, suppLogs);
  }, [supplements, suppLogs, realToday]);

  const sortedRecentLogs = useMemo(() => {
    return Object.keys(logs)
      .sort()
      .map(key => logs[key]);
  }, [logs]);

  const intelligenceOutput = useMemo(() => generateIntelligence({
    profile: answers,
    todayLog: { ...activeLog, supplements: integratedSupplements as any },
    recentLogs: sortedRecentLogs,
    cycleInfo,
    cycleConfig: { lastPeriodStart, cycleLength, regularity: answers.periodRegularity || 'Regular' }
  }), [answers, activeLog, integratedSupplements, sortedRecentLogs, cycleInfo, lastPeriodStart, cycleLength]);

  const averages = useMemo(() => calculate7DayAverages(sortedRecentLogs), [sortedRecentLogs]);
  const topSymptoms = useMemo(() => calculateSymptomPatterns(sortedRecentLogs), [sortedRecentLogs]);
  const streak = useMemo(() => calculateLoggingStreak(sortedRecentLogs), [sortedRecentLogs]);
  const education = useMemo(() => getPhaseEducation(cycleInfo.phase), [cycleInfo.phase]);

  const activeSupps = useMemo(() => supplements.filter(s => s.isActive), [supplements]);
  const todayCompletion = getCompletionForDate(realToday);
  const avgWeeklyConsistency = useMemo(() => getWeeklyConsistencyAcrossAll(activeSupps, suppLogs), [activeSupps, suppLogs]);
  const supplementRec = useMemo(() => intelligenceOutput.recommendations.find(r => r.id.startsWith('supp_')), [intelligenceOutput.recommendations]);

  const recommendedRecipes = useMemo(() => {
    return RECIPES.filter(r => 
      answers.restrictions.every(res => r.dietary_tags.includes(res as any)) || 
      r.dietary_tags.includes(answers.dietStyle as any)
    ).slice(0, 6);
  }, [answers.restrictions, answers.dietStyle]);

  const expandedStates = useMemo(() => {
    return {
      patterns: true,
      support: true,
      supplements: true,
      movement: false
    };
  }, []);

  return (
    <Screen hasTabBar={true} hideHeader={false} title="Hormonal Insights">
      <div className="pt-4 pb-20 space-y-10">
        <button 
          onClick={() => { triggerHaptic('light'); onBack(); }}
          className="flex items-center gap-2 text-[10px] font-bold text-[#828282] uppercase tracking-[0.25em] px-1 group active:text-[#8FA899] transition-colors"
        >
          <svg className="w-3.5 h-3.5 transition-transform group-active:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
          </svg>
          Return
        </button>

        <Card 
          className="border-none p-8 relative overflow-hidden transition-all duration-1000 shadow-[0_20px_50px_rgba(0,0,0,0.02)]"
          style={{ backgroundColor: theme.tintBg }}
        >
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-[#3A3A3A]">Day {cycleInfo.day}</h2>
                <p className="text-[9px] font-bold text-[#828282] uppercase tracking-[0.2em] mt-1">Current Cycle State</p>
              </div>
              <PhaseChip phase={cycleInfo.phase} />
            </div>
            
            <p className="text-sm text-[#555555] leading-relaxed mb-8 font-medium italic opacity-90">
              "{education.explanation}"
            </p>

            <div className="space-y-4">
              <p className="text-[9px] font-bold text-[#8FA899] uppercase tracking-[0.2em]">Guided Focus</p>
              <div className="space-y-3">
                {education.whatHelps.map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-1 h-1 rounded-full bg-[#8FA899] mt-2 opacity-40" />
                    <span className="text-xs text-[#828282] font-medium leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <CollapsibleSection 
          title="Behavioral Trends" 
          subtitle="Insight based on recent logs"
          leftIcon="📈"
          rightMeta={`${streak}d streak`}
          defaultExpanded={expandedStates.patterns}
        >
          <div className="space-y-6 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#FBFBF9] p-4 rounded-[20px] border border-[#F0EFEA]">
                <p className="text-[8px] font-extrabold text-[#828282] uppercase tracking-[0.2em] mb-1.5">Avg Movement</p>
                <p className="text-lg font-semibold text-[#3A3A3A]">{averages.steps.toLocaleString()} <span className="text-[10px] font-medium text-[#D1D1D1]">steps</span></p>
              </div>
              <div className="bg-[#FBFBF9] p-4 rounded-[20px] border border-[#F0EFEA]">
                <p className="text-[8px] font-extrabold text-[#828282] uppercase tracking-[0.2em] mb-1.5">Avg Hydration</p>
                <p className="text-lg font-semibold text-[#3A3A3A]">{averages.water} <span className="text-[10px] font-medium text-[#D1D1D1]">liters</span></p>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection 
          title="Phase Nutrition" 
          subtitle="Fueling your current energy"
          leftIcon="🥗"
          defaultExpanded={expandedStates.support}
        >
          <div className="space-y-8 py-2">
            <p className="text-[9px] font-bold text-[#828282] uppercase tracking-[0.2em] mb-4 px-1">Suggested Menu Items</p>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-4">
              {recommendedRecipes.map((recipe, index) => {
                // FIXED: Use the curated image ID list for variety
                const imageId = FOOD_IMAGE_IDS[index % FOOD_IMAGE_IDS.length];
                const imageUrl = `https://images.unsplash.com/photo-${imageId}?auto=format&fit=crop&q=80&w=800`;
                
                return (
                  <div key={recipe.id} className="w-40 flex-shrink-0 group active:scale-[0.98] transition-all">
                    <div className="h-28 rounded-[20px] bg-[#F4F4F1] overflow-hidden mb-3 shadow-sm border border-[#F0EFEA]">
                      <img 
                        src={imageUrl} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        alt={recipe.name} 
                      />
                    </div>
                    <p className="text-[11px] font-semibold text-[#3A3A3A] leading-snug line-clamp-2">{recipe.name}</p>
                    <p className="text-[9px] text-[#D1D1D1] font-bold uppercase tracking-widest mt-1">{recipe.total_time_minutes} min</p>
                  </div>
                );
              })}
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection 
          title="Habits & Rituals" 
          subtitle="Consistency markers"
          leftIcon="🌿"
          defaultExpanded={expandedStates.supplements}
        >
          <div className="space-y-8 py-2">
            <div className="bg-[#FBFBF9] p-5 rounded-[24px] border border-[#F0EFEA]">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-[9px] font-bold text-[#828282] uppercase tracking-[0.2em]">Completion</p>
                  <p className="text-sm font-semibold text-[#3A3A3A]">{todayCompletion.taken} of {todayCompletion.total} habits logged</p>
                </div>
              </div>
              <div className="w-full h-1 bg-[#F0EFEA] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#8FA899] transition-all duration-1000" 
                  style={{ width: `${todayCompletion.total > 0 ? (todayCompletion.taken / todayCompletion.total) * 100 : 0}%` }} 
                />
              </div>
            </div>
          </div>
        </CollapsibleSection>
      </div>
    </Screen>
  );
};

export default DetailsScreen;
