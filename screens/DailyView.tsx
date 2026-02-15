// Added missing imports for React, hooks, components and mock data
import React, { useState, useMemo } from 'react';
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

  const data = DAILY_LOG_DATA;
  const currentDateKey = data.date;
  const activeLog = logs[currentDateKey] || { steps: 0, workouts: [], water: 0, meals: [], symptomLogs: [] };

  const cycleInfo = useMemo(() => getCycleInfo(currentDateKey), [currentDateKey, lastPeriodStart, periodDuration]);

  const allSymptoms = activeLog.symptomLogs.flatMap(log => log.symptoms);
  // Fix: Explicitly typing reduce accumulators to resolve inference errors
  const totalCalories = (activeLog.meals as Meal[]).reduce((acc: number, meal: Meal) => 
    acc + meal.items.reduce((sum: number, item: FoodItem) => sum + item.calories, 0), 0
  );

  const openModal = (title: string) => {
    if (title === 'Log Exercise') {
      setWorkoutModalOpen(true);
    } else if (title === 'Log Symptoms') {
      setSymptomModalOpen(true);
    } else if (title === 'Log Meal') {
      setMealModalOpen(true);
    } else if (title === 'Log Water') {
      setWaterModalOpen(true);
    } else if (title === 'Log Cycle') {
      setPeriodModalOpen(true);
    } else {
      setModalTitle(title);
      setModalOpen(true);
    }
  };

  const formattedDate = new Date(data.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <Screen hasTabBar={true} hideHeader={true}>
      <div className="pt-12 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#1F2937] active:scale-95 transition-transform"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#1F2937]">{formattedDate}</h1>
              {data.isToday && (
                <span className="px-2 py-0.5 rounded-full bg-[#8FAF9D] text-[10px] font-bold text-white uppercase tracking-tighter">
                  Today
                </span>
              )}
            </div>
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mt-0.5">Your Wellness Log</p>
          </div>
        </div>
        <button className="w-10 h-10 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-lg">
          📅
        </button>
      </div>

      <div className="space-y-2 pb-10">
        <SectionCard 
          title="Cycle / Period" 
          icon="🌙" 
          onAdd={() => openModal('Log Cycle')}
          emptyStateText="No cycle details logged for this day."
          isEmpty={false}
        >
          <div className="bg-[#8FAF9D]/5 rounded-2xl p-4 border border-[#8FAF9D]/10">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest">Phase</p>
                <h4 className="text-lg font-bold text-[#1F2937] uppercase">{cycleInfo.phase}</h4>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Day</p>
                <p className="text-lg font-bold text-[#1F2937]">{cycleInfo.day}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${cycleInfo.isPeriod ? 'bg-red-400' : 'bg-[#8FAF9D]'}`}></span>
              <p className="text-xs font-medium text-[#6B7280]">{cycleInfo.status}</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard 
          title="Symptoms" 
          icon="✨" 
          onAdd={() => openModal('Log Symptoms')}
          emptyStateText="How are you feeling? Tap + to log."
          isEmpty={allSymptoms.length === 0}
        >
          <div className="flex flex-wrap gap-2">
            {allSymptoms.map((s, idx) => (
              <Chip key={`${s}-${idx}`} label={s} selected />
            ))}
          </div>
          {activeLog.symptomLogs.length > 0 && (
            <div className="mt-4 space-y-2">
               {activeLog.symptomLogs.map(log => (
                 <div key={log.id} className="text-[10px] text-[#6B7280] bg-[#F7F4F1] p-2 rounded-lg italic">
                   Avg Intensity: {log.intensity}/5 {log.notes && `• "${log.notes}"`}
                 </div>
               ))}
            </div>
          )}
        </SectionCard>

        <SectionCard 
          title="Meals" 
          icon="🥗" 
          onAdd={() => openModal('Log Meal')}
          emptyStateText="Fuel your rhythm. Tap + to log a meal."
          isEmpty={activeLog.meals.length === 0}
        >
          <div className="space-y-4">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-[#1F2937]">{totalCalories}</span>
              <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">total kcal today</span>
            </div>
            
            <div className="space-y-3">
              {activeLog.meals.map((meal) => {
                const mealCals = meal.items.reduce((sum, item) => sum + item.calories, 0);
                return (
                  <div key={meal.id} className="bg-white border border-[#E5E7EB] rounded-[18px] p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">{meal.type}</h4>
                      <span className="text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest">{mealCals} kcal</span>
                    </div>
                    <div className="space-y-1">
                      {meal.items.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-xs text-[#6B7280]">
                          <span>{item.name}</span>
                          <span>{item.calories}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </SectionCard>

        <SectionCard 
          title="Exercise" 
          icon="💪" 
          onAdd={() => openModal('Log Exercise')}
          emptyStateText="Gentle movement helps balance hormones."
          isEmpty={activeLog.steps === 0 && activeLog.workouts.length === 0 && liveSteps === 0}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="bg-[#F7F4F1] px-4 py-3 rounded-2xl flex-1 mr-2">
                <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-1">
                  Steps Today {pedometerAvailable ? '(Live)' : ''}
                </p>
                <div className="flex items-baseline gap-1">
                  <p className="text-lg font-bold text-[#1F2937]">
                    {pedometerAvailable ? liveSteps.toLocaleString() : activeLog.steps.toLocaleString()}
                  </p>
                  {!pedometerAvailable && (
                    <span className="text-[8px] text-[#E26D6D] font-bold uppercase tracking-tighter">
                      No Sensor
                    </span>
                  )}
                </div>
              </div>
              {!isHealthConnected && (
                <button 
                  onClick={connectHealth}
                  className="bg-[#8FAF9D]/10 text-[#8FAF9D] text-[10px] font-bold px-3 py-2 rounded-xl border border-[#8FAF9D]/20 uppercase tracking-widest active:scale-95 transition-all"
                >
                  Connect Health
                </button>
              )}
              {isHealthConnected && (
                <div className="flex items-center gap-1 text-[#8FAF9D]">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Linked</span>
                </div>
              )}
            </div>

            {activeLog.workouts.length > 0 && (
              <div className="space-y-3 pt-2">
                <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Logged Activities</p>
                {activeLog.workouts.map((w) => (
                  <div key={w.id} className="bg-[#F7F4F1] p-4 rounded-xl flex justify-between items-center animate-in fade-in duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm shadow-sm">
                        {w.type === 'Yoga' ? '🧘‍♀️' : w.type === 'Walk' ? '🚶‍♀️' : '🏃‍♀️'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#1F2937]">{w.type}</p>
                        <p className="text-[10px] text-[#6B7280] font-medium">{w.duration} mins • {w.intensity}</p>
                      </div>
                    </div>
                    {w.notes && (
                      <div className="w-6 h-6 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[10px] cursor-help group relative">
                        📝
                        <div className="hidden group-hover:block absolute bottom-full mb-2 right-0 bg-white shadow-xl p-2 rounded-lg w-32 border border-gray-100 z-10">
                          <p className="text-[10px] text-[#1F2937]">{w.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </SectionCard>

        <SectionCard 
          title="Water Intake" 
          icon="💧" 
          onAdd={() => openModal('Log Water')}
          emptyStateText="Stay hydrated for better metabolic health."
          isEmpty={activeLog.water === 0}
        >
          <div className="flex items-center gap-4">
            <div className="flex-1 h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-400 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min((activeLog.water / 2) * 100, 100)}%` }} 
              />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-[#1F2937]">{activeLog.water}</span>
              <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">/ 2.0L</span>
            </div>
          </div>
        </SectionCard>
      </div>

      <ModalShell 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={modalTitle} 
      />

      <LogWorkoutModal 
        isOpen={workoutModalOpen} 
        onClose={() => setWorkoutModalOpen(false)}
        onSave={(w) => addWorkout(currentDateKey, w)}
      />

      <LogSymptomModal 
        isOpen={symptomModalOpen} 
        onClose={() => setSymptomModalOpen(false)}
        onSave={(s) => addSymptomLog(currentDateKey, s)}
      />

      <LogMealModal 
        isOpen={mealModalOpen}
        onClose={() => setMealModalOpen(false)}
        onSave={(m) => addMeal(currentDateKey, m)}
      />

      <LogWaterModal 
        isOpen={waterModalOpen}
        onClose={() => setWaterModalOpen(false)}
        onSave={(amount) => addWater(currentDateKey, amount)}
      />

      <LogPeriodModal 
        isOpen={periodModalOpen}
        onClose={() => setPeriodModalOpen(false)}
        onSave={logPeriod}
        currentStartDate={lastPeriodStart}
        currentDuration={periodDuration}
      />
    </Screen>
  );
};

export default DailyView;