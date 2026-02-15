
import React, { useMemo, useEffect, useState } from 'react';
import Card from './Card';
import PhaseChip from './PhaseChip';
import { useWellness, Workout, Meal, SymptomLog } from '../context/WellnessContext';
import { useSupplements } from '../context/SupplementContext';
import { usePhaseTheme } from '../hooks/usePhaseTheme';

interface DayDetailSheetProps {
  date: string;
  isOpen: boolean;
  onClose: () => void;
  onPressLogSymptoms: () => void;
  onPressAddMeal: () => void;
  onPressSupplements: () => void;
  onPressUpdatePeriod: () => void;
}

const DayDetailSheet: React.FC<DayDetailSheetProps> = ({ 
  date, 
  isOpen, 
  onClose,
  onPressLogSymptoms,
  onPressAddMeal,
  onPressSupplements,
  onPressUpdatePeriod
}) => {
  const { logs, getCycleInfo, lastPeriodStart, periodDuration } = useWellness();
  const { supplements, logs: suppLogs } = useSupplements();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const activeLog = useMemo(() => logs[date] || { 
    steps: 0, 
    workouts: [] as Workout[], 
    water: 0, 
    meals: [] as Meal[], 
    symptomLogs: [] as SymptomLog[] 
  }, [logs, date]);

  const cycleInfo = useMemo(() => getCycleInfo(date), [date, lastPeriodStart, periodDuration]);
  const { theme } = usePhaseTheme(cycleInfo.phase);

  const formattedDate = useMemo(() => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  }, [date]);

  const takenSuppNames = useMemo(() => {
    const daySuppLogs = suppLogs[date]?.taken || {};
    return supplements
      .filter(s => daySuppLogs[s.id]?.checked)
      .map(s => s.name);
  }, [supplements, suppLogs, date]);

  const miniInsight = useMemo(() => {
    if (activeLog.symptomLogs.length > 0) {
      const symptoms = activeLog.symptomLogs.flatMap(l => l.symptoms);
      if (symptoms.includes('Cravings') && cycleInfo.phase === 'Luteal') {
        return "Rising progesterone can drive cravings. Prioritize steady, grounding snacks.";
      }
      if (symptoms.includes('Fatigue')) {
        return "Nourish your nervous system with extra rest and magnesium today.";
      }
    }
    if (cycleInfo.isPeriod) {
      return "Focus on iron-rich foods and restorative, slow movement.";
    }
    return "Consistently logging small details helps Cyra reveal your unique patterns.";
  }, [activeLog.symptomLogs, cycleInfo]);

  if (!isOpen && !isAnimating) return null;

  return (
    <div className={`fixed inset-0 z-[60] flex items-end justify-center transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      
      <div className={`w-full max-w-md bg-[#F7F4F1] rounded-t-[32px] p-6 pb-12 shadow-2xl transition-transform duration-500 transform relative z-10 max-h-[85vh] overflow-y-auto hide-scrollbar ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="w-12 h-1.5 bg-[#E5E7EB] rounded-full mx-auto mb-6" />
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-[#1F2937]">{formattedDate}</h3>
            <div className="mt-1">
              <PhaseChip phase={cycleInfo.phase} />
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-gray-400 active:scale-95 transition-transform shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Insight Highlight */}
        <Card className="bg-white border-none shadow-sm p-5 mb-6 relative overflow-hidden">
           <div className="flex items-center gap-3 mb-2">
             <span className="text-lg">💡</span>
             <h4 className="text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest">Mini Insight</h4>
           </div>
           <p className="text-sm text-[#4B5563] font-medium leading-relaxed italic relative z-10">"{miniInsight}"</p>
           <div className="absolute top-[-10px] right-[-10px] w-20 h-20 rounded-full bg-[#8FAF9D]/5" />
        </Card>

        <div className="space-y-4">
          <DetailSection title="Cycle Details" icon="🌙" actionLabel="Update" onAction={onPressUpdatePeriod}>
            <p className="text-xs text-[#6B7280] font-medium">
              Cycle Day <span className="text-[#1F2937] font-bold">{cycleInfo.day}</span> • {cycleInfo.status}
            </p>
          </DetailSection>

          <DetailSection title="Symptoms Logged" icon="✨" actionLabel="Log" onAction={onPressLogSymptoms}>
            {activeLog.symptomLogs.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {activeLog.symptomLogs.flatMap(l => l.symptoms).map((s, i) => (
                  <span key={i} className="px-2 py-1 rounded-lg bg-[#8FAF9D]/10 text-[#8FAF9D] text-[10px] font-bold uppercase border border-[#8FAF9D]/10">{s}</span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-300 italic">No symptoms tracked for this day.</p>
            )}
          </DetailSection>

          <DetailSection title="Supplements" icon="🌿" actionLabel="Track" onAction={onPressSupplements}>
            {takenSuppNames.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {takenSuppNames.map((name, i) => (
                  <span key={i} className="px-2 py-1 rounded-lg bg-[#DDEEF4] text-[#4B5563] text-[10px] font-bold border border-[#DDEEF4]">{name}</span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-300 italic">No supplements logged as taken.</p>
            )}
          </DetailSection>

          <DetailSection title="Nutrition" icon="🥗" actionLabel="Add" onAction={onPressAddMeal}>
             {activeLog.meals.length > 0 ? (
              <div className="space-y-2">
                {activeLog.meals.map(m => (
                  <div key={m.id} className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-[#1F2937]">{m.type}</span>
                    <span className="text-[10px] text-[#6B7280]">{m.items.reduce((sum, i) => sum + i.calories, 0)} kcal</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-300 italic">No meals logged for this day.</p>
            )}
          </DetailSection>
        </div>
      </div>
    </div>
  );
};

const DetailSection: React.FC<{ title: string, icon: string, actionLabel: string, onAction: () => void, children: React.ReactNode }> = ({ title, icon, actionLabel, onAction, children }) => (
  <div className="bg-white rounded-[22px] p-4 shadow-sm border border-white">
    <div className="flex justify-between items-center mb-3">
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <h4 className="text-[11px] font-bold text-gray-700 uppercase tracking-widest">{title}</h4>
      </div>
      <button 
        onClick={onAction}
        className="text-[9px] font-bold text-[#8FAF9D] uppercase tracking-wider py-1 px-3 bg-[#8FAF9D]/5 hover:bg-[#8FAF9D]/10 rounded-full transition-colors border border-[#8FAF9D]/10"
      >
        {actionLabel}
      </button>
    </div>
    {children}
  </div>
);

export default DayDetailSheet;
