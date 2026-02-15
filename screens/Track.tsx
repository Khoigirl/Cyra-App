
import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import Screen from '../components/Screen';
import CalendarGrid from '../components/CalendarGrid';
import Card from '../components/Card';
import DayDetailSheet from '../components/DayDetailSheet';
import PhaseChip from '../components/PhaseChip';
import { useWellness } from '../context/WellnessContext';
import { useSubscription } from '../context/SubscriptionContext';
import { triggerHaptic } from '../utils/haptics';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);

const Track: React.FC<any> = ({ onOpenPaywall, onGoToSupplements }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [viewMonth, setViewMonth] = useState(new Date(2024, 1, 1));
  const { logs: wellnessLogs, isDateLocked, cycleLength, getCycleInfo } = useWellness();
  const { isSubscribed } = useSubscription();

  const todayStr = '2024-02-14';
  const cycleInfo = useMemo(() => getCycleInfo(todayStr), [getCycleInfo]);

  return (
    <Screen hasTabBar={true} title="Journey History">
      <StyledView className="pt-4 gap-y-10">
        
        <StyledView>
          <StyledView className="flex-row justify-between items-baseline mb-4 px-1">
            <StyledText className="text-[10px] font-bold text-[#828282] uppercase tracking-[0.2em]">Cycle Progress</StyledText>
            <StyledText className="text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest">Day {cycleInfo.day} of {cycleLength}</StyledText>
          </StyledView>
          
          <Card className="p-6 border-none bg-white shadow-sm">
            <StyledView className="flex-row items-center justify-between mb-6">
              <StyledView>
                <StyledText className="text-xl font-bold text-[#3A3A3A] tracking-tight">{cycleInfo.phase} Phase</StyledText>
                <StyledText className="text-xs text-[#828282] font-medium mt-1">{cycleInfo.status}</StyledText>
              </StyledView>
              <PhaseChip phase={cycleInfo.phase} />
            </StyledView>

            <StyledView className="h-2 w-full bg-[#F4F4F1] rounded-full overflow-hidden">
               <StyledView className="absolute inset-0 flex-row">
                 <StyledView className="h-full border-r border-white/50 bg-[#D89CA4]/30" style={{ width: '18%' }} />
                 <StyledView className="h-full border-r border-white/50 bg-[#8FAF9D]/30" style={{ width: '28%' }} />
                 <StyledView className="h-full border-r border-white/50 bg-[#A4B4D8]/30" style={{ width: '10%' }} />
                 <StyledView className="h-full bg-[#D8BFA4]/30" style={{ width: '44%' }} />
               </StyledView>
               <StyledView 
                className="absolute top-0 bottom-0 w-1 bg-[#3A3A3A] shadow-sm"
                style={{ left: `${(cycleInfo.day / cycleLength) * 100}%` }}
               />
            </StyledView>
          </Card>
        </StyledView>

        <StyledView>
          <StyledView className="flex-row justify-between items-center mb-6 px-1">
             <StyledPressable 
              onPress={() => { triggerHaptic('light'); setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1)); }}
              className="w-10 h-10 rounded-full bg-white border border-[#F0EFEA] items-center justify-center active:opacity-50"
             >
               <StyledText className="text-[#D1D1D1] text-lg font-bold">‹</StyledText>
             </StyledPressable>
             <StyledText className="text-lg font-bold text-[#3A3A3A] tracking-tight">
               {viewMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
             </StyledText>
             <StyledPressable 
              onPress={() => { triggerHaptic('light'); setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1)); }}
              className="w-10 h-10 rounded-full bg-white border border-[#F0EFEA] items-center justify-center active:opacity-50"
             >
               <StyledText className="text-[#D1D1D1] text-lg font-bold">›</StyledText>
             </StyledPressable>
          </StyledView>

          <CalendarGrid 
            currentDate={viewMonth} 
            onSelectDate={(d) => {
              triggerHaptic('light');
              if (isDateLocked(d)) onOpenPaywall?.('history_lock');
              else setSelectedDate(d);
            }} 
            filter="All"
            selectedDate={selectedDate}
          />
        </StyledView>

        <StyledView className="flex-row gap-4 mb-20">
          <StatCard label="Consistency" value="84%" blur={!isSubscribed} />
          <StatCard label="Logged Days" value="12" blur={!isSubscribed} />
        </StyledView>
      </StyledView>

      <DayDetailSheet 
        date={selectedDate || ''} 
        isOpen={!!selectedDate} 
        onClose={() => setSelectedDate(null)} 
        onPressLogSymptoms={() => {}} 
        onPressAddMeal={() => {}} 
        onPressSupplements={() => onGoToSupplements?.()} 
        onPressUpdatePeriod={() => {}} 
      />
    </Screen>
  );
};

const StatCard = ({ label, value, blur }: any) => (
  <Card className="p-6 flex-1 items-center bg-white shadow-sm overflow-hidden">
    <StyledText className="text-[9px] font-bold text-[#828282] uppercase tracking-[0.2em] mb-2">{label}</StyledText>
    <StyledText className={`text-3xl font-bold text-[#3A3A3A] ${blur ? 'opacity-20' : 'opacity-100'}`}>{value}</StyledText>
    {blur && (
      <StyledView className="absolute inset-0 items-center justify-center bg-white/40">
        <StyledText className="text-[8px] font-bold text-[#8FAF9D] uppercase tracking-widest bg-white px-2 py-1 rounded-full border border-gray-100">Premium</StyledText>
      </StyledView>
    )}
  </Card>
);

export default Track;
