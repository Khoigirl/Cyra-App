
import React, { useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Button from '../components/Button';
import PhaseChip from '../components/PhaseChip';
import { useWellness } from '../context/WellnessContext';
import { useSupplements } from '../context/SupplementContext';
import { generateIntelligence } from '../intelligence/engine';
import { useOnboarding } from '../context/OnboardingContext';

const StyledView = styled(View);
const StyledText = styled(Text);

const Today: React.FC = () => {
  const { logs, getCycleInfo, lastPeriodStart, cycleLength } = useWellness();
  const { getCompletionForDate } = useSupplements();
  const { answers } = useOnboarding();

  const todayStr = new Date().toISOString().split('T')[0];
  const activeLog = logs[todayStr] || { steps: 0, water: 0, meals: [], symptomLogs: [], supplements: [] };
  const cycleInfo = getCycleInfo(todayStr);
  const completion = getCompletionForDate(todayStr);

  const intelligence = useMemo(() => generateIntelligence({
    profile: answers,
    todayLog: activeLog as any,
    recentLogs: Object.values(logs),
    cycleInfo,
    cycleConfig: { lastPeriodStart, cycleLength, regularity: answers.periodRegularity || 'Regular' }
  }), [activeLog, logs, cycleInfo, answers]);

  return (
    <Screen>
      <StyledView className="mt-4 mb-8 px-1">
        <StyledText className="text-[10px] font-bold text-[#8FAF9D] uppercase tracking-[0.25em]">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </StyledText>
        <StyledText className="text-4xl font-bold text-[#1F2937] mt-1 tracking-tight">Today's Rhythm</StyledText>
      </StyledView>

      {/* Intelligence Briefing */}
      <Card className="bg-[#8FA899]/10 border-none mb-8 p-6">
        <StyledView className="flex-row justify-between items-start mb-4">
          <StyledView>
            <StyledText className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest">{intelligence.briefing.title}</StyledText>
            <StyledText className="text-2xl font-bold text-[#4A5D4E] mt-1">{cycleInfo.phase}</StyledText>
          </StyledView>
          <PhaseChip phase={cycleInfo.phase} />
        </StyledView>
        
        <StyledView className="space-y-3">
          {intelligence.briefing.bullets.map((bullet, i) => (
            <StyledView key={i} className="flex-row items-start pr-4">
              <StyledText className="text-[#4A5D4E] text-sm mr-2">•</StyledText>
              <StyledText className="text-sm text-[#4A5D4E] leading-relaxed font-medium">
                {bullet}
              </StyledText>
            </StyledView>
          ))}
        </StyledView>

        <StyledView className="flex-row gap-3 mt-8">
          <Button label="Log Detail" className="flex-1 h-12 rounded-2xl" />
          <Button label="Trends" variant="secondary" className="flex-1 h-12 rounded-2xl" />
        </StyledView>
      </Card>

      {/* Real-time Momentum */}
      <StyledView className="mb-10">
        <StyledText className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest mb-4 px-1">Live Momentum</StyledText>
        <StyledView className="flex-row flex-wrap justify-between">
          <MomentumCard 
            icon="💧" 
            label="Hydration" 
            value={`${activeLog.water}L`} 
            target="/ 2.0L" 
            progress={activeLog.water / 2}
          />
          <MomentumCard 
            icon="🌿" 
            label="Ritual" 
            value={`${completion.taken}/${completion.total}`} 
            target="taken" 
            progress={completion.total > 0 ? completion.taken / completion.total : 0}
          />
          <MomentumCard 
            icon="👟" 
            label="Activity" 
            value={activeLog.steps.toLocaleString()} 
            target="steps" 
            progress={activeLog.steps / 10000}
          />
          <MomentumCard 
            icon="✨" 
            label="Check-in" 
            value={activeLog.symptomLogs.length.toString()} 
            target="logged" 
            progress={activeLog.symptomLogs.length > 0 ? 1 : 0}
          />
        </StyledView>
      </StyledView>

      {/* Recommendations Feed */}
      {intelligence.recommendations.map(rec => (
        <Card key={rec.id} className="mb-4 p-5 flex-row items-center gap-4">
           <StyledView className="w-12 h-12 rounded-2xl bg-[#DDEEF4] items-center justify-center">
              <StyledText className="text-xl">
                {rec.category === 'food' ? '🥗' : rec.category === 'exercise' ? '💪' : '✨'}
              </StyledText>
           </StyledView>
           <StyledView className="flex-1">
              <StyledText className="text-[9px] font-bold text-[#8FAF9D] uppercase tracking-widest">{rec.title}</StyledText>
              <StyledText className="text-xs text-[#6B7280] font-medium leading-tight mt-1">{rec.action}</StyledText>
           </StyledView>
        </Card>
      ))}

      <StyledView className="h-10" />
    </Screen>
  );
};

const MomentumCard = ({ icon, label, value, target, progress }: any) => (
  <Card className="p-4 w-[48%] mb-4 h-32 justify-between overflow-hidden">
    <StyledView className="flex-row justify-between relative z-10">
      <StyledText className="text-xl">{icon}</StyledText>
      <StyledText className="text-[8px] font-bold text-gray-400 uppercase">{label}</StyledText>
    </StyledView>
    <StyledView className="relative z-10">
      <StyledText className="text-lg font-bold text-[#1F2937]">{value}</StyledText>
      <StyledText className="text-[9px] text-gray-400 font-medium">{target}</StyledText>
    </StyledView>
    <StyledView 
      className="absolute bottom-0 left-0 h-1 bg-[#8FAF9D]/20" 
      style={{ width: `${Math.min(progress * 100, 100)}%` }} 
    />
  </Card>
);

export default Today;
