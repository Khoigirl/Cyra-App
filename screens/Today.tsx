
import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { styled } from 'nativewind';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Button from '../components/Button';

const StyledView = styled(View);
const StyledText = styled(Text);

const Today: React.FC = () => {
  return (
    <Screen>
      <StyledView className="mt-4 mb-8">
        <StyledText className="text-[10px] font-bold text-[#8FAF9D] uppercase tracking-[0.25em]">Wednesday, Feb 14</StyledText>
        <StyledText className="text-4xl font-bold text-[#1F2937] mt-1">Hello, Emma</StyledText>
      </StyledView>

      <Card className="bg-[#8FA899]/10 border-none mb-8">
        <StyledView className="flex-row justify-between items-start mb-4">
          <StyledView>
            <StyledText className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest">Current Phase</StyledText>
            <StyledText className="text-2xl font-bold text-[#4A5D4E] mt-1">Follicular</StyledText>
          </StyledView>
          <StyledView className="bg-[#8FA899] px-3 py-1 rounded-full">
            <StyledText className="text-[9px] font-bold text-white uppercase">Day 12</StyledText>
          </StyledView>
        </StyledView>
        <StyledText className="text-sm text-[#4A5D4E] leading-relaxed font-medium">
          Your estrogen is peaking. Energy levels are likely rising—a great window for creative focus and movement.
        </StyledText>
        <StyledView className="flex-row gap-3 mt-6">
          <Button label="Log Detail" className="flex-1 h-12" />
          <Button label="Education" variant="secondary" className="flex-1 h-12" />
        </StyledView>
      </Card>

      <StyledView className="mb-10">
        <StyledText className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest mb-4">Daily Momentum</StyledText>
        <StyledView className="flex-row flex-wrap justify-between">
          <MomentumCard icon="💧" label="Hydration" value="1.2L" target="/ 2.0L" />
          <MomentumCard icon="🥗" label="Nutrition" value="1,450" target="kcal" />
          <MomentumCard icon="👟" label="Activity" value="6,432" target="steps" />
          <MomentumCard icon="✨" label="Wellness" value="2" target="logged" />
        </StyledView>
      </StyledView>

      <Card className="flex-row items-center justify-between mb-20">
        <StyledView className="flex-row items-center">
          <StyledView className="w-12 h-12 bg-[#DDEEF4] rounded-2xl items-center justify-center mr-4">
            <StyledText className="text-xl">🌿</StyledText>
          </StyledView>
          <StyledView>
            <StyledText className="font-bold text-[#1F2937]">Supplement Ritual</StyledText>
            <StyledText className="text-[10px] text-[#6B7280] font-medium mt-0.5">3 of 5 habits completed today</StyledText>
          </StyledView>
        </StyledView>
        <StyledText className="text-gray-300">❯</StyledText>
      </Card>
    </Screen>
  );
};

const MomentumCard = ({ icon, label, value, target }: any) => (
  <Card className="p-4 w-[48%] mb-4 h-32 justify-between">
    <StyledView className="flex-row justify-between">
      <StyledText className="text-xl">{icon}</StyledText>
      <StyledText className="text-[8px] font-bold text-gray-400 uppercase">{label}</StyledText>
    </StyledView>
    <StyledView>
      <StyledText className="text-lg font-bold text-[#1F2937]">{value}</StyledText>
      <StyledText className="text-[9px] text-gray-400 font-medium">{target}</StyledText>
    </StyledView>
  </Card>
);

export default Today;
