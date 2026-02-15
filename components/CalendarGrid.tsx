
import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { styled } from 'nativewind';
import { Lock } from 'lucide-react-native';
import { CALENDAR_LOGS } from '../data/mock';
import { useWellness } from '../context/WellnessContext';
import { 
  getCycleDayForDate, 
  getPhaseFromCycleDay, 
  getPredictedNextPeriodWindow, 
  getFertileWindow 
} from '../utils/cyclePrediction';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);

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
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const numDays = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const todayStr = new Date().toISOString().split('T')[0];

  const predictions = useMemo(() => {
    if (!lastPeriodStart) return null;
    const nextPeriod = getPredictedNextPeriodWindow({ lastPeriodDate: lastPeriodStart, typicalCycleLength: cycleLength }, {});
    const fertile = nextPeriod ? getFertileWindow(nextPeriod.start) : null;
    return { nextPeriod, fertile };
  }, [lastPeriodStart, cycleLength]);

  const renderCells = () => {
    const cells = [];
    for (let i = 0; i < startDay; i++) {
      cells.push(<StyledView key={`empty-${i}`} className="flex-1 h-16" />);
    }

    for (let d = 1; d <= numDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const mockLogs = CALENDAR_LOGS[dateStr] || {};
      const isToday = dateStr === todayStr;
      const isSelected = selectedDate === dateStr;
      const locked = isDateLocked(dateStr);
      
      const cycleDay = getCycleDayForDate(dateStr, lastPeriodStart, cycleLength);
      const phase = cycleDay !== -1 ? getPhaseFromCycleDay(cycleDay, cycleLength) : null;
      const bgTint = phase ? PHASE_COLORS[phase] : 'transparent';

      cells.push(
        <StyledPressable
          key={d}
          onPress={() => onSelectDate(dateStr)}
          style={{ 
            backgroundColor: isSelected ? 'white' : bgTint,
            borderColor: isSelected ? '#8FAF9D' : 'transparent',
            borderWidth: isSelected ? 2 : 0,
          }}
          className={`flex-1 h-16 items-center pt-2 rounded-xl relative ${locked ? 'opacity-40' : ''}`}
        >
          <StyledText className={`text-[13px] font-bold ${isSelected ? 'text-[#8FAF9D]' : 'text-[#1F2937]'}`}>
            {d}
          </StyledText>
          
          <StyledView className="flex-row flex-wrap justify-center gap-0.5 mt-1">
            {mockLogs.period && <StyledView className="w-1 h-1 rounded-full bg-[#E26D6D]" />}
            {(mockLogs.meals || mockLogs.symptoms) && !locked && (
              <StyledView className="w-1 h-1 rounded-full bg-[#8FAF9D]" />
            )}
          </StyledView>

          {locked && (
            <StyledView className="absolute bottom-1">
              <Lock size={8} color="#9CA3AF" />
            </StyledView>
          )}
        </StyledPressable>
      );
    }
    return cells;
  };

  return (
    <StyledView className="bg-white/40 rounded-[24px] p-4 border border-white/60">
      <StyledView className="flex-row mb-4">
        {weekDays.map((wd, i) => (
          <StyledView key={i} className="flex-1 items-center">
            <StyledText className="text-[10px] font-bold text-[#6B7280] uppercase">{wd}</StyledText>
          </StyledView>
        ))}
      </StyledView>
      <StyledView className="flex-row flex-wrap">
        {renderCells()}
      </StyledView>
    </StyledView>
  );
};

export default CalendarGrid;
