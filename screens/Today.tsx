
import React, { useState, useMemo } from 'react';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Button from '../components/Button';
import DateStrip from '../components/DateStrip';
import LogWorkoutModal from '../components/LogWorkoutModal';
import LogSymptomModal from '../components/LogSymptomModal';
import LogMealModal from '../components/LogMealModal';
import LogWaterModal from '../components/LogWaterModal';
import LogPeriodModal from '../components/LogPeriodModal';
import PhaseChip from '../components/PhaseChip';
import DetailsScreen from './DetailsScreen';
import { useWellness } from '../context/WellnessContext';
import { useOnboarding } from '../context/OnboardingContext';
import { useSupplements } from '../context/SupplementContext';
import { useLearn } from '../context/LearnContext';
import { useSubscription } from '../context/SubscriptionContext';
import { LEARN_ITEMS } from '../learn/data';
import { generateIntelligence } from '../intelligence/engine';
import { IntelligenceData, Recommendation } from '../intelligence/types';
import { usePhaseTheme } from '../hooks/usePhaseTheme';
import { getSupplementsTakenNamesForDate } from '../intelligence/supplementsBridge';
import { triggerHaptic } from '../utils/haptics';

interface TodayProps {
  onGoToSupplements?: () => void;
  onOpenLearnItem?: (id: string) => void;
  onContinueProgram?: (id: string) => void;
  onOpenPaywall?: (source: string) => void;
}

const Today: React.FC<TodayProps> = ({ 
  onGoToSupplements, 
  onOpenLearnItem, 
  onContinueProgram,
  onOpenPaywall 
}) => {
  const [workoutModalOpen, setWorkoutModalOpen] = useState(false);
  const [symptomModalOpen, setSymptomModalOpen] = useState(false);
  const [mealModalOpen, setMealModalOpen] = useState(false);
  const [waterModalOpen, setWaterModalOpen] = useState(false);
  const [periodModalOpen, setPeriodModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedRec, setSelectedRec] = useState<Recommendation | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  const { 
    logs, addWorkout, addSymptomLog, addMeal, addWater,
    logPeriod, getCycleInfo, lastPeriodStart, periodDuration, cycleLength,
    liveSteps, pedometerAvailable, isHealthConnected
  } = useWellness();
  
  const { supplements, logs: suppLogs, getCompletionForDate } = useSupplements();
  const { answers } = useOnboarding();
  const { activeProgram, savedItemIds } = useLearn();
  const { plan } = useSubscription();

  const todayKey = '2024-02-14'; 
  const realToday = new Date().toISOString().split('T')[0];
  const activeLog = logs[todayKey] || { steps: 0, workouts: [], water: 0, meals: [], symptomLogs: [], supplements: [] };
  const cycleInfo = useMemo(() => getCycleInfo(todayKey), [todayKey, lastPeriodStart, periodDuration, cycleLength]);

  const { theme } = usePhaseTheme(cycleInfo.phase);

  const intelligenceData: IntelligenceData = {
    profile: answers,
    todayLog: { ...activeLog, supplements: getSupplementsTakenNamesForDate(realToday, supplements, suppLogs) as any },
    recentLogs: Object.keys(logs).sort().map(key => logs[key]), 
    cycleInfo,
    cycleConfig: { lastPeriodStart, cycleLength, regularity: answers.periodRegularity || 'Regular' }
  };

  const { briefing, recommendations } = useMemo(() => generateIntelligence(intelligenceData), [intelligenceData]);

  const todayCalories = useMemo(() => {
    return activeLog.meals.reduce((acc, meal) => 
      acc + meal.items.reduce((sum, item) => sum + item.calories, 0), 0
    );
  }, [activeLog.meals]);

  const todaySymptoms = useMemo(() => {
    return activeLog.symptomLogs.flatMap(l => l.symptoms);
  }, [activeLog.symptomLogs]);

  const completion = getCompletionForDate(realToday);

  const handleRecommendationClick = (rec: Recommendation) => {
    if (plan === 'free') {
      triggerHaptic('medium');
      onOpenPaywall?.(`insight_${rec.id}`);
    } else {
      triggerHaptic('light');
      setSelectedRec(rec);
      setInfoModalOpen(true);
    }
  };

  if (showDetails) {
    return <DetailsScreen onBack={() => setShowDetails(false)} onNavigateToSupplements={onGoToSupplements} />;
  }

  return (
    <Screen hasTabBar={true}>
      <div className="mb-4">
        <DateStrip />
      </div>

      <div className="flex justify-between items-center mb-6 px-1">
        {isHealthConnected ? (
          <div className="flex items-center gap-2 bg-[#8FAF9D]/10 px-3 py-1.5 rounded-full border border-[#8FAF9D]/10">
            <div className="w-2 h-2 rounded-full bg-[#8FAF9D] animate-pulse" />
            <span className="text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest">Hormone-Sync Active</span>
          </div>
        ) : (
          <div className="w-1" />
        )}
        <div className="text-right">
          <p className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest opacity-60">Status</p>
          <p className="text-xs font-bold text-[#1F2937]">{isHealthConnected ? 'Synced with Watch' : 'Manual Tracking'}</p>
        </div>
      </div>

      <Card 
        className="border-none mb-10 relative overflow-hidden transition-all duration-700"
        style={{ backgroundColor: theme.tintBg }}
      >
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[#828282] text-[9px] font-bold uppercase tracking-[0.2em] mb-1">{briefing.title}</p>
              <h3 className="text-2xl font-semibold text-[#3A3A3A]">Cycle Day {cycleInfo.day}</h3>
            </div>
            <PhaseChip phase={cycleInfo.phase} />
          </div>

          <div className="space-y-4 mb-8">
            {briefing.bullets.map((bullet, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-[#555555] font-medium leading-relaxed">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: theme.accent }} />
                {bullet}
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => { triggerHaptic('light'); setPeriodModalOpen(true); }}
              className="h-10 px-6 rounded-[14px] text-[11px] font-bold text-white shadow-sm transition-all active:scale-95"
              style={{ backgroundColor: theme.accent }}
            >
              Update Period
            </button>
            <button 
              onClick={() => { triggerHaptic('light'); setShowDetails(true); }}
              className="h-10 px-4 rounded-[14px] text-[11px] font-bold text-[#828282] hover:bg-white/40 transition-colors"
            >
              Learn More
            </button>
          </div>
        </div>
      </Card>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6 px-1">
          <h4 className="text-[10px] font-bold text-[#828282] uppercase tracking-[0.2em]">Daily Momentum</h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <MomentumCard 
            icon="💧" label="Hydration" value={`${activeLog.water}L`} target="/ 2.0L" progress={Math.min((activeLog.water / 2) * 100, 100)}
            onClick={() => { triggerHaptic('light'); setWaterModalOpen(true); }}
          />
          <MomentumCard 
            icon="🥗" label="Nutrition" value={todayCalories.toString()} target="kcal" progress={Math.min((todayCalories / 2200) * 100, 100)}
            onClick={() => { triggerHaptic('light'); setMealModalOpen(true); }}
          />
          <MomentumCard 
            icon="🏃‍♀️" label="Movement" value={isHealthConnected ? liveSteps.toLocaleString() : activeLog.steps.toLocaleString()} target="steps" progress={Math.min(((isHealthConnected ? liveSteps : activeLog.steps) / 8000) * 100, 100)}
            onClick={() => { triggerHaptic('light'); setWorkoutModalOpen(true); }}
          />
          <MomentumCard 
            icon="✨" label="Wellness" value={todaySymptoms.length > 0 ? "Logged" : "Empty"} target=""
            onClick={() => { triggerHaptic('light'); setSymptomModalOpen(true); }}
          />
        </div>
      </section>

      <section className="mb-12">
        <h4 className="text-[10px] font-bold text-[#828282] uppercase tracking-[0.2em] mb-6 px-1">Morning Ritual</h4>
        <Card onClick={() => { triggerHaptic('light'); onGoToSupplements?.(); }} className="flex items-center justify-between group active:bg-[#FBFBF9] border-[#F0EFEA]">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-[18px] bg-[#8FA899]/10 flex items-center justify-center text-xl shadow-inner">🌿</div>
            <div>
              <p className="text-sm font-semibold text-[#3A3A3A]">Supplement Adherence</p>
              <p className="text-[10px] text-[#828282] font-medium mt-0.5 tracking-wide">{completion.taken} of {completion.total} habits completed</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#FBFBF9] flex items-center justify-center border border-[#F0EFEA] group-hover:translate-x-1 transition-transform">
             <svg className="w-4 h-4 text-[#D1D1D1]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
          </div>
        </Card>
      </section>

      <section className="mb-8 pb-12">
        <div className="flex justify-between items-baseline mb-6 px-1">
          <h4 className="text-[10px] font-bold text-[#828282] uppercase tracking-[0.2em]">Clinical Insights</h4>
          {plan === 'free' && <span className="text-[8px] font-bold text-[#8FA899] uppercase tracking-widest animate-pulse">Unlock Premium</span>}
        </div>
        <div className="space-y-4">
          {(recommendations || []).map((rec, i) => (
            <Card key={rec.id} onClick={() => handleRecommendationClick(rec)} className="p-5 flex flex-col gap-4 group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-[16px] bg-[#F4F4F1] flex items-center justify-center text-lg">
                  {rec.category === 'food' ? '🥗' : '✨'}
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-semibold text-[#3A3A3A] tracking-tight">{rec.title}</h5>
                  <p className="text-[11px] text-[#828282] mt-0.5 leading-relaxed">
                    {plan === 'free' ? "Premium insight waiting for unlock..." : rec.explanation}
                  </p>
                </div>
                {plan === 'free' && <span className="text-xs opacity-20">🔒</span>}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <LogWorkoutModal isOpen={workoutModalOpen} onClose={() => setWorkoutModalOpen(false)} onSave={(w) => addWorkout(todayKey, w)} />
      <LogSymptomModal isOpen={symptomModalOpen} onClose={() => setSymptomModalOpen(false)} onSave={(s) => addSymptomLog(todayKey, s)} />
      <LogMealModal isOpen={mealModalOpen} onClose={() => setMealModalOpen(false)} onSave={(m) => addMeal(todayKey, m)} />
      <LogWaterModal isOpen={waterModalOpen} onClose={() => setWaterModalOpen(false)} onSave={(amount) => addWater(todayKey, amount)} />
      <LogPeriodModal isOpen={periodModalOpen} onClose={() => setPeriodModalOpen(false)} onSave={logPeriod} currentStartDate={lastPeriodStart} currentDuration={periodDuration} />
    </Screen>
  );
};

const MomentumCard = ({ icon, label, value, target, progress, onClick }: any) => (
  <Card onClick={onClick} className="p-5 flex flex-col justify-between h-32 border-[#F0EFEA] hover:border-[#8FA899]/30 transition-colors cursor-pointer">
    <div className="flex justify-between items-start">
      <span className="text-xl">{icon}</span>
      <span className="text-[8px] font-extrabold text-[#828282] uppercase tracking-[0.2em]">{label}</span>
    </div>
    <div className="mt-auto">
      <p className="text-lg font-semibold text-[#3A3A3A]">{value} <span className="text-[10px] text-[#D1D1D1] font-medium">{target}</span></p>
      {progress !== undefined && (
        <div className="w-full h-1 bg-[#FBFBF9] rounded-full mt-2 overflow-hidden border border-[#F0EFEA]/50">
          <div className="h-full bg-[#8FA899] transition-all duration-1000" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  </Card>
);

export default Today;
