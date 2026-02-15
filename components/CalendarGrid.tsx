
import React, { useMemo } from 'react';
import { CALENDAR_LOGS } from '../data/mock';
import { useWellness } from '../context/WellnessContext';
import { 
  getCycleDayForDate, 
  getPhaseFromCycleDay, 
  getPredictedNextPeriodWindow, 
  getFertileWindow 
} from '../utils/cyclePrediction';

export type CalendarFilter = 'All' | 'Period' | 'Symptoms' | 'Supplements' | 'Activity' | 'Meals';

interface CalendarGridProps {
  currentDate: Date;
  onSelectDate: (date: string) => void;
  filter?: CalendarFilter;
  selectedDate?: string | null;
  showFertileWindow?: boolean;
}

const PHASE_COLORS = {
  menstrual: 'rgba(216, 156, 164, 0.12)',
  follicular: 'rgba(143, 175, 157, 0.12)',
  ovulatory: 'rgba(157, 183, 216, 0.12)',
  luteal: 'rgba(199, 164, 216, 0.12)',
};

const CalendarGrid: React.FC<CalendarGridProps> = ({ 
  currentDate, 
  onSelectDate, 
  filter = 'All', 
  selectedDate,
  showFertileWindow = false,
}) => {
  const { isDateLocked, lastPeriodStart, cycleLength } = useWellness();
  
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const numDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayStr = '2024-02-14'; // Feb 14

  const predictions = useMemo(() => {
    if (!lastPeriodStart) return null;
    const nextPeriod = getPredictedNextPeriodWindow({ lastPeriodDate: lastPeriodStart, typicalCycleLength: cycleLength }, {});
    const fertile = nextPeriod ? getFertileWindow(nextPeriod.start) : null;
    return { nextPeriod, fertile };
  }, [lastPeriodStart, cycleLength]);

  const renderCells = () => {
    const cells = [];
    for (let i = 0; i < startDay; i++) {
      cells.push(<div key={`empty-${i}`} className="h-16" />);
    }

    for (let d = 1; d <= numDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const mockLogs = CALENDAR_LOGS[dateStr] || {};
      const isToday = dateStr === todayStr;
      const isSelected = selectedDate === dateStr;
      const locked = isDateLocked(dateStr);
      
      const cycleDay = getCycleDayForDate(dateStr, lastPeriodStart, cycleLength);
      const phase = cycleDay !== -1 ? getPhaseFromCycleDay(cycleDay, cycleLength) : null;

      const inPredictedPeriod = predictions?.nextPeriod?.dates.includes(dateStr);
      const inFertileWindow = showFertileWindow && predictions?.fertile?.dates.includes(dateStr);

      const hasPeriodLog = mockLogs.period;
      const hasAnyDailyLog = mockLogs.meals || mockLogs.symptoms || mockLogs.workout;
      
      const bgTint = phase ? PHASE_COLORS[phase] : 'transparent';

      const getBorderColor = () => {
        if (isSelected) return '#8FAF9D';
        if (hasPeriodLog) return '#E26D6D';
        if (inPredictedPeriod) return 'rgba(216, 156, 164, 0.35)';
        return 'transparent';
      };

      cells.push(
        <button
          key={d}
          onClick={() => onSelectDate(dateStr)}
          style={{ 
            backgroundColor: isSelected ? 'white' : bgTint,
            borderColor: getBorderColor(),
            borderStyle: (!isSelected && !hasPeriodLog && inPredictedPeriod) ? 'dashed' : 'solid',
          }}
          className={`h-16 flex flex-col items-center justify-start pt-2 rounded-[18px] transition-all active:scale-95 relative ${
            isSelected 
              ? 'shadow-[0_12px_28px_-5px_rgba(0,0,0,0.1),0_8px_12px_-6px_rgba(0,0,0,0.05)] z-20 scale-105 border-[2.5px]' 
              : 'border-2'
          } ${locked ? 'opacity-60' : ''}`}
        >
          <span className={`text-[13px] font-bold mb-1 z-10 transition-colors ${
            isSelected 
              ? 'text-[#8FAF9D]' 
              : (isToday ? 'text-[#1F2937] underline underline-offset-4 decoration-[#8FAF9D]' : 'text-[#1F2937]')
          }`}>
            {d}
          </span>
          
          <div className="flex flex-wrap justify-center gap-0.5 max-w-[28px] z-10">
            {hasPeriodLog && <div className="w-1.5 h-1.5 rounded-full bg-[#E26D6D]" />}
            {hasAnyDailyLog && (filter === 'All' || filter === 'Meals' || filter === 'Symptoms') && !locked && (
              <div className="w-1.5 h-1.5 rounded-full bg-[#8FAF9D]" />
            )}
          </div>

          {locked && !isSelected && (
            <div className="absolute bottom-1.5 text-gray-300">
               <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
            </div>
          )}

          {inFertileWindow && !isSelected && !locked && (
            <div className="absolute bottom-1 w-1 h-1 rounded-full bg-blue-300/60" />
          )}
        </button>
      );
    }
    return cells;
  };

  return (
    <div className="bg-white/40 rounded-[24px] p-4 backdrop-blur-sm border border-white/60">
      <div className="grid grid-cols-7 mb-4">
        {weekDays.map(wd => (
          <div key={wd} className="text-center">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">{wd[0]}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {renderCells()}
      </div>
    </div>
  );
};

export default CalendarGrid;
