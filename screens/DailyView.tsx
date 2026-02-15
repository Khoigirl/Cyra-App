
import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import { ArrowLeft, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react-native';
import Screen from '../components/Screen';
import SectionCard from '../components/SectionCard';
import Chip from '../components/Chip';
import ModalShell from '../components/ModalShell';
import LogWorkoutModal from '../components/LogWorkoutModal';
import LogSymptomModal from '../components/LogSymptomModal';
import LogMealModal from '../components/LogMealModal';
import LogWaterModal from '../components/LogWaterModal';
import LogPeriodModal from '../components/LogPeriodModal';
import { DAILY_LOG_DATA } from '../data/mock';
import { useWellness, Meal, FoodItem } from '../context/WellnessContext';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);

interface DailyViewProps {
  onBack?: () => void;
}

const DailyView: React.FC<DailyViewProps> = ({ onBack }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [workoutModalOpen, setWorkoutModalOpen] = useState(false);
  const [symptomModalOpen, setSymptomModalOpen] = useState(false);
  const [mealModalOpen, setMealModalOpen] = useState(false);
  const [waterModalOpen, setWaterModalOpen] = useState(false);
  const [periodModalOpen, setPeriodModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  
  const { 
    logs, 
    isHealthConnected, 
    connectHealth, 
    addWorkout, 
    addSymptomLog, 
    addMeal, 
    addWater, 
    liveSteps, 
    pedometerAvailable,
    logPeriod,
    getCycleInfo,
    lastPeriodStart,
    periodDuration
  } = useWellness();

  const currentDateKey = DAILY_LOG_DATA.date;
  const activeLog = logs[currentDateKey] || { steps: 0, workouts: [], water: 0, meals: [], symptomLogs: [] };

  const cycleInfo = useMemo(() => getCycleInfo(currentDateKey), [currentDateKey, lastPeriodStart, periodDuration]);

  const allSymptoms = activeLog.symptomLogs.flatMap(log => log.symptoms);
  const totalCalories = (activeLog.meals as Meal[]).reduce((acc, meal) => 
    acc + meal.items.reduce((sum, item) => sum + item.calories, 0), 0
  );

  const openModal = (title: string) => {
    if (title === 'Log Exercise') setWorkoutModalOpen(true);
    else if (title === 'Log Symptoms') setSymptomModalOpen(true);
    else if (title === 'Log Meal') setMealModalOpen(true);
    else if (title === 'Log Water') setWaterModalOpen(true);
    else if (title === 'Log Cycle') setPeriodModalOpen(true);
    else {
      setModalTitle(title);
      setModalOpen(true);
    }
  };

  const formattedDate = new Date(DAILY_LOG_DATA.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <Screen hasTabBar={true} hideHeader={true}>
      <StyledView className="pt-12 pb-6 flex-row items-center justify-between px-1">
        <StyledView className="flex-row items-center gap-4">
          <StyledPressable 
            onPress={onBack}
            className="w-10 h-10 rounded-full bg-white border border-[#E5E7EB] items-center justify-center active:scale-95"
          >
            <ArrowLeft size={20} color="#1F2937" />
          </StyledPressable>
          <StyledView>
            <StyledView className="flex-row items-center gap-2">
              <StyledText className="text-xl font-bold text-[#1F2937]">{formattedDate}</StyledText>
              {DAILY_LOG_DATA.isToday && (
                <StyledView className="px-2 py-0.5 rounded-full bg-[#8FAF9D]">
                  <StyledText className="text-[10px] font-bold text-white uppercase">Today</StyledText>
                </StyledView>
              )}
            </StyledView>
            <StyledText className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mt-0.5">Your Wellness Log</StyledText>
          </StyledView>
        </StyledView>
        <StyledPressable className="w-10 h-10 rounded-full bg-white border border-[#E5E7EB] items-center justify-center">
          <CalendarIcon size={20} color="#1F2937" />
        </StyledPressable>
      </StyledView>

      <StyledView className="space-y-4 pb-10">
        <SectionCard 
          title="Cycle / Period" 
          icon="🌙" 
          onAdd={() => openModal('Log Cycle')}
          emptyStateText="No cycle details logged."
        >
          <StyledView className="bg-[#8FAF9D]/5 rounded-2xl p-4 border border-[#8FAF9D]/10">
            <StyledView className="flex-row justify-between items-center">
              <StyledView>
                <StyledText className="text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest">Phase</StyledText>
                <StyledText className="text-lg font-bold text-[#1F2937] uppercase">{cycleInfo.phase}</StyledText>
              </StyledView>
              <StyledView className="text-right">
                <StyledText className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Day</StyledText>
                <StyledText className="text-lg font-bold text-[#1F2937] text-right">{cycleInfo.day}</StyledText>
              </StyledView>
            </StyledView>
            <StyledView className="mt-3 flex-row items-center gap-2">
              <StyledView className={`w-2 h-2 rounded-full ${cycleInfo.isPeriod ? 'bg-red-400' : 'bg-[#8FAF9D]'}`} />
              <StyledText className="text-xs font-medium text-[#6B7280]">{cycleInfo.status}</StyledText>
            </StyledView>
          </StyledView>
        </SectionCard>

        <SectionCard 
          title="Symptoms" 
          icon="✨" 
          onAdd={() => openModal('Log Symptoms')}
          emptyStateText="How are you feeling? Tap + to log."
          isEmpty={allSymptoms.length === 0}
        >
          <StyledView className="flex-row flex-wrap gap-2">
            {allSymptoms.map((s, idx) => (
              <Chip key={idx} label={s} selected />
            ))}
          </StyledView>
        </SectionCard>

        <SectionCard 
          title="Meals" 
          icon="🥗" 
          onAdd={() => openModal('Log Meal')}
          emptyStateText="Fuel your rhythm. Tap + to log a meal."
          isEmpty={activeLog.meals.length === 0}
        >
          <StyledView className="space-y-4">
            <StyledView className="flex-row items-baseline gap-1">
              <StyledText className="text-2xl font-bold text-[#1F2937]">{totalCalories}</StyledText>
              <StyledText className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">kcal today</StyledText>
            </StyledView>
            {activeLog.meals.map((meal: Meal) => (
              <StyledView key={meal.id} className="bg-white border border-[#E5E7EB] rounded-[18px] p-4 shadow-sm">
                <StyledView className="flex-row justify-between items-center mb-2">
                  <StyledText className="text-xs font-bold text-[#1F2937] uppercase">{meal.type}</StyledText>
                  <StyledText className="text-[10px] font-bold text-[#8FAF9D] uppercase">
                    {meal.items.reduce((s, i) => s + i.calories, 0)} kcal
                  </StyledText>
                </StyledView>
                {meal.items.map((item: FoodItem) => (
                  <StyledView key={item.id} className="flex-row justify-between items-center mb-1">
                    <StyledText className="text-xs text-[#6B7280]">{item.name}</StyledText>
                    <StyledText className="text-xs text-[#6B7280]">{item.calories}</StyledText>
                  </StyledView>
                ))}
              </StyledView>
            ))}
          </StyledView>
        </SectionCard>

        <SectionCard 
          title="Water" 
          icon="💧" 
          onAdd={() => openModal('Log Water')}
          emptyStateText="Stay hydrated."
          isEmpty={activeLog.water === 0}
        >
          <StyledView className="flex-row items-center gap-4">
            <StyledView className="flex-1 h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
              <StyledView 
                className="h-full bg-blue-400 rounded-full" 
                style={{ width: `${Math.min((activeLog.water / 2) * 100, 100)}%` }} 
              />
            </StyledView>
            <StyledText className="text-xl font-bold text-[#1F2937]">{activeLog.water}L</StyledText>
          </StyledView>
        </SectionCard>
      </StyledView>

      <ModalShell isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle} />
      <LogWorkoutModal isOpen={workoutModalOpen} onClose={() => setWorkoutModalOpen(false)} onSave={(w) => addWorkout(currentDateKey, w)} />
      <LogSymptomModal isOpen={symptomModalOpen} onClose={() => setSymptomModalOpen(false)} onSave={(s) => addSymptomLog(currentDateKey, s)} />
      <LogMealModal isOpen={mealModalOpen} onClose={() => setMealModalOpen(false)} onSave={(m) => addMeal(currentDateKey, m)} />
      <LogWaterModal isOpen={waterModalOpen} onClose={() => setWaterModalOpen(false)} onSave={(a) => addWater(currentDateKey, a)} />
      <LogPeriodModal isOpen={periodModalOpen} onClose={() => setPeriodModalOpen(false)} onSave={logPeriod} currentStartDate={lastPeriodStart} currentDuration={periodDuration} />
    </Screen>
  );
};

export default DailyView;
