
import React, { useState, useMemo } from 'react';
import Screen from '../components/Screen';
import CalendarGrid, { CalendarFilter } from '../components/CalendarGrid';
import Card from '../components/Card';
import Chip from '../components/Chip';
import DayDetailSheet from '../components/DayDetailSheet';
import LogSymptomModal from '../components/LogSymptomModal';
import LogMealModal from '../components/LogMealModal';
import LogPeriodModal from '../components/LogPeriodModal';
import Button from '../components/Button';
import PhaseChip from '../components/PhaseChip';
import { useWellness } from '../context/WellnessContext';
import { useSubscription } from '../context/SubscriptionContext';
import { usePhaseTheme } from '../hooks/usePhaseTheme';
import { triggerHaptic } from '../utils/haptics';

const REFERENCE_TODAY = '2024-02-14';

const Track: React.FC<{ onGoToAuth: () => void; onGoToSupplements?: () => void; onOpenPaywall?: (source: string) => void; }> = ({ onOpenPaywall, onGoToSupplements }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [viewMonth, setViewMonth] = useState(new Date(2024, 1, 1)); // Feb 2024
  const [isHistoryGatedModalOpen, setIsHistoryGatedModalOpen] = useState(false);
  const [symptomModalOpen, setSymptomModalOpen] = useState(false);
  const [mealModalOpen, setMealModalOpen] = useState(false);
  const [periodModalOpen, setPeriodModalOpen] = useState(false);

  const { logs: wellnessLogs, isDateLocked, addSymptomLog, addMeal, logPeriod, lastPeriodStart, periodDuration, cycleLength, getCycleInfo } = useWellness();
  const { isSubscribed } = useSubscription();

  const cycleInfo = useMemo(() => getCycleInfo(REFERENCE_TODAY), [getCycleInfo]);
  const { theme } = usePhaseTheme(cycleInfo.phase);

  const monthlyStats = useMemo(() => {
    const prefix = `${viewMonth.getFullYear()}-${String(viewMonth.getMonth() + 1).padStart(2, '0')}`;
    const monthKeys = Object.keys(wellnessLogs).filter(k => k.startsWith(prefix));
    const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
    
    // Count days with actual content
    const activeDays = monthKeys.filter(k => {
      const l = wellnessLogs[k];
      return l.symptomLogs.length > 0 || l.meals.length > 0 || l.workouts.length > 0;
    });

    return {
      daysLogged: activeDays.length,
      consistency: Math.round((activeDays.length / daysInMonth) * 100),
      totalEntries: monthKeys.length
    };
  }, [wellnessLogs, viewMonth]);

  const recentTimeline = useMemo(() => {
    return Object.keys(wellnessLogs)
      .sort((a, b) => b.localeCompare(a))
      .slice(0, 5)
      .map(date => ({
        date,
        data: wellnessLogs[date],
        info: getCycleInfo(date)
      }));
  }, [wellnessLogs, getCycleInfo]);

  return (
    <Screen hasTabBar={true} hideHeader={false} title="Journey History">
      <div className="pt-4 space-y-12">
        
        {/* Phase Progress Dashboard */}
        <section>
          <div className="flex justify-between items-baseline mb-6 px-1">
            <h3 className="text-[10px] font-bold text-[#828282] uppercase tracking-[0.2em]">Cycle Progress</h3>
            <span className="text-[10px] font-bold text-[#8FA899] uppercase tracking-widest">Day {cycleInfo.day} of {cycleLength}</span>
          </div>
          
          <Card className="p-6 border-none bg-white shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-xl font-semibold text-[#3A3A3A] tracking-tight">{cycleInfo.phase} Phase</h4>
                <p className="text-xs text-[#828282] font-medium mt-1">{cycleInfo.status}</p>
              </div>
              <PhaseChip phase={cycleInfo.phase} />
            </div>

            <div className="relative h-2 w-full bg-[#F4F4F1] rounded-full overflow-hidden">
               {/* Phase segments viz */}
               <div className="absolute inset-0 flex">
                 <div className="h-full border-r border-white/50" style={{ width: '18%', backgroundColor: '#D89CA430' }} />
                 <div className="h-full border-r border-white/50" style={{ width: '28%', backgroundColor: '#8FA89930' }} />
                 <div className="h-full border-r border-white/50" style={{ width: '10%', backgroundColor: '#A4B4D830' }} />
                 <div className="h-full" style={{ width: '44%', backgroundColor: '#D8BFA430' }} />
               </div>
               {/* Current Day Pointer */}
               <div 
                className="absolute top-0 bottom-0 w-1 bg-[#3A3A3A] transition-all duration-1000 shadow-sm"
                style={{ left: `${(cycleInfo.day / cycleLength) * 100}%` }}
               />
            </div>
            <div className="flex justify-between mt-3">
               <span className="text-[8px] font-extrabold text-[#D1D1D1] uppercase tracking-widest">Start</span>
               <span className="text-[8px] font-extrabold text-[#D1D1D1] uppercase tracking-widest">Next Period</span>
            </div>
          </Card>
        </section>

        {/* Calendar Visualization */}
        <section>
          <div className="flex justify-between items-center mb-6 px-1">
             <button 
              onClick={() => { triggerHaptic('light'); setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1)); }}
              className="w-10 h-10 rounded-full bg-white border border-[#F0EFEA] flex items-center justify-center text-[#D1D1D1] active:scale-90 transition-all"
             >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
             </button>
             <h2 className="text-lg font-semibold text-[#3A3A3A] tracking-tight">{viewMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
             <button 
              onClick={() => { triggerHaptic('light'); setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1)); }}
              className="w-10 h-10 rounded-full bg-white border border-[#F0EFEA] flex items-center justify-center text-[#D1D1D1] active:scale-90 transition-all"
             >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
             </button>
          </div>

          <CalendarGrid 
            currentDate={viewMonth} 
            onSelectDate={(d) => {
              triggerHaptic('light');
              if (isDateLocked(d)) setIsHistoryGatedModalOpen(true);
              else setSelectedDate(d);
            }} 
            filter="All"
            selectedDate={selectedDate}
          />

          <div className="flex justify-center gap-8 mt-8">
            <LegendItem color="#D89CA4" label="Period" />
            <LegendItem color="#8FA899" label="Activity" />
            <LegendItem color="#D1D1D1" label="Prediction" isDashed />
          </div>
        </section>

        {/* Statistics Grid */}
        <section>
           <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 border-none shadow-sm text-center relative overflow-hidden group active:bg-[#FBFBF9]">
              <p className="text-[9px] font-bold text-[#828282] uppercase tracking-[0.2em] mb-2">Consistency</p>
              <div className={`transition-all duration-700 ${!isSubscribed ? 'blur-md' : ''}`}>
                <p className="text-3xl font-semibold text-[#3A3A3A]">{monthlyStats.consistency}%</p>
                <p className="text-[10px] text-[#8FA899] font-bold mt-1 uppercase tracking-tighter">Current Month</p>
              </div>
              {!isSubscribed && <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-[2px]"><span className="text-[9px] font-bold text-[#8FA899] uppercase tracking-widest bg-white/80 px-3 py-1.5 rounded-full shadow-sm border border-[#F0EFEA]">Premium</span></div>}
            </Card>

            <Card className="p-6 border-none shadow-sm text-center relative overflow-hidden group active:bg-[#FBFBF9]">
              <p className="text-[9px] font-bold text-[#828282] uppercase tracking-[0.2em] mb-2">Logged Days</p>
              <div className={`transition-all duration-700 ${!isSubscribed ? 'blur-md' : ''}`}>
                <p className="text-3xl font-semibold text-[#3A3A3A]">{monthlyStats.daysLogged}</p>
                <p className="text-[10px] text-[#8FA899] font-bold mt-1 uppercase tracking-tighter">Total Entries</p>
              </div>
              {!isSubscribed && <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-[2px]"><span className="text-[9px] font-bold text-[#8FA899] uppercase tracking-widest bg-white/80 px-3 py-1.5 rounded-full shadow-sm border border-[#F0EFEA]">Premium</span></div>}
            </Card>
          </div>
        </section>

        {/* Recent Timeline Feed */}
        <section className="pb-12">
          <div className="flex justify-between items-baseline mb-6 px-1">
            <h3 className="text-[10px] font-bold text-[#828282] uppercase tracking-[0.2em]">Recent Check-ins</h3>
            <button className="text-[10px] font-bold text-[#8FA899] uppercase tracking-widest">See All</button>
          </div>

          <div className="space-y-4">
            {recentTimeline.length > 0 ? recentTimeline.map((item, idx) => {
              const hasSymptoms = item.data.symptomLogs.length > 0;
              const hasMeals = item.data.meals.length > 0;
              const hasWorkouts = item.data.workouts.length > 0;
              
              return (
                <Card 
                  key={item.date} 
                  onClick={() => { triggerHaptic('light'); setSelectedDate(item.date); }}
                  className="p-5 flex items-center gap-5 group border-none shadow-sm animate-in fade-in slide-in-from-bottom-2"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex flex-col items-center min-w-[44px]">
                    <span className="text-[10px] font-extrabold text-[#D1D1D1] uppercase tracking-tighter">
                      {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <span className="text-lg font-bold text-[#3A3A3A]">
                      {new Date(item.date).getDate()}
                    </span>
                  </div>
                  
                  <div className="w-px h-10 bg-[#F4F4F1]" />
                  
                  <div className="flex-1">
                    <div className="flex gap-1.5 mb-1.5">
                      {hasSymptoms && <div className="w-1.5 h-1.5 rounded-full bg-[#A4B4D8]" />}
                      {hasMeals && <div className="w-1.5 h-1.5 rounded-full bg-[#8FA899]" />}
                      {hasWorkouts && <div className="w-1.5 h-1.5 rounded-full bg-[#D8BFA4]" />}
                    </div>
                    <p className="text-xs font-bold text-[#3A3A3A]">
                      {item.info.phase} Phase
                    </p>
                    <p className="text-[10px] text-[#828282] font-medium leading-tight">
                      {hasSymptoms ? `${item.data.symptomLogs.flatMap(l => l.symptoms).length} symptoms` : 'No symptoms'} • {item.data.steps.toLocaleString()} steps
                    </p>
                  </div>

                  <svg className="w-4 h-4 text-[#D1D1D1] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                  </svg>
                </Card>
              );
            }) : (
              <div className="py-12 bg-[#FBFBF9] rounded-[24px] border border-dashed border-[#F0EFEA] text-center">
                 <p className="text-xs text-[#D1D1D1] italic">Your journey logs will appear here.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <DayDetailSheet 
        date={selectedDate || ''} 
        isOpen={!!selectedDate} 
        onClose={() => setSelectedDate(null)} 
        onPressLogSymptoms={() => setSymptomModalOpen(true)} 
        onPressAddMeal={() => setMealModalOpen(true)} 
        onPressSupplements={() => onGoToSupplements?.()} 
        onPressUpdatePeriod={() => setPeriodModalOpen(true)} 
      />

      {isHistoryGatedModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-8 animate-in fade-in duration-300">
          <div className="fixed inset-0" onClick={() => setIsHistoryGatedModalOpen(false)} />
          <Card className="max-w-xs p-10 text-center relative z-10 border-none shadow-2xl">
            <div className="w-16 h-16 rounded-3xl bg-[#F4F4F1] flex items-center justify-center text-3xl mx-auto mb-6">🔒</div>
            <h3 className="text-xl font-semibold text-[#3A3A3A] mb-4">Historical Access</h3>
            <p className="text-sm text-[#828282] leading-relaxed mb-8">Unlock your full timeline and multi-cycle trend analysis with Cyra Premium.</p>
            <Button label="Unlock Now" onPress={() => { triggerHaptic('medium'); onOpenPaywall?.('history_lock'); }} className="w-full" />
          </Card>
        </div>
      )}

      <LogSymptomModal isOpen={symptomModalOpen} onClose={() => setSymptomModalOpen(false)} onSave={(s) => selectedDate && addSymptomLog(selectedDate, s)} />
      <LogMealModal isOpen={mealModalOpen} onClose={() => setMealModalOpen(false)} onSave={(m) => selectedDate && addMeal(selectedDate, m)} />
      <LogPeriodModal isOpen={periodModalOpen} onClose={() => setPeriodModalOpen(false)} onSave={logPeriod} currentStartDate={lastPeriodStart} currentDuration={periodDuration} />
    </Screen>
  );
};

const LegendItem = ({ color, label, isDashed = false }: { color: string, label: string, isDashed?: boolean }) => (
  <div className="flex items-center gap-2">
    <div 
      className={`w-2 h-2 rounded-full ${isDashed ? 'border border-dashed' : ''}`} 
      style={{ backgroundColor: isDashed ? 'transparent' : color, borderColor: color }} 
    />
    <span className="text-[9px] font-bold text-[#828282] uppercase tracking-widest">{label}</span>
  </div>
);

export default Track;
