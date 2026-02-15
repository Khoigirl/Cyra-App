
import React from 'react';
import { View, Text, TextInput, ScrollView, Pressable } from 'react-native';
import { styled } from 'nativewind';
import { Search, ChevronRight, Play } from 'lucide-react-native';
import Screen from '../components/Screen';
import Card from '../components/Card';
import { ARTICLES } from '../data/mock';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledPressable = styled(Pressable);

const Learn: React.FC = () => {
  return (
    <Screen title="Learn">
      <StyledView className="bg-white rounded-[18px] px-4 mb-8 flex-row items-center gap-3 border border-[#E5E7EB]">
        <Search size={20} color="#6B7280" />
        <StyledTextInput 
          className="flex-1 py-4 text-sm text-[#1F2937]" 
          placeholder="Search hormone health..." 
          placeholderTextColor="#9CA3AF"
        />
      </StyledView>

      <StyledView className="gap-y-4">
        {ARTICLES.map(art => (
          <Card key={art.id} className="flex-row gap-4 p-4 items-center active:bg-gray-50">
            <StyledView className="w-16 h-16 rounded-[14px] bg-[#DDEEF4] items-center justify-center">
              <StyledText className="text-3xl">{art.icon}</StyledText>
            </StyledView>
            <StyledView className="flex-1">
              <StyledText className="font-bold text-[#1F2937] text-base leading-tight">{art.title}</StyledText>
              <StyledText className="text-[10px] text-[#6B7280] font-bold uppercase tracking-widest mt-1">{art.readTime} read</StyledText>
            </StyledView>
            <ChevronRight size={20} color="#E5E7EB" />
          </Card>
        ))}
      </StyledView>

      <StyledView className="mt-10 mb-20">
        <StyledText className="text-lg font-bold text-[#1F2937] mb-4 px-1">Masterclasses</StyledText>
        <Card className="bg-[#FADADD] border-none p-6">
          <StyledView className="flex-row justify-between items-start">
            <StyledView className="flex-1 pr-4">
              <StyledText className="font-bold text-[#1F2937] text-xl">The Cortisol Fix</StyledText>
              <StyledText className="text-sm text-[#1F2937]/70 mt-2 font-medium">Reduce stress-driven PCOS symptoms.</StyledText>
            </StyledView>
            <StyledView className="bg-white p-3 rounded-full shadow-sm">
              <Play size={24} fill="#1F2937" color="#1F2937" />
            </StyledView>
          </StyledView>
        </Card>
      </StyledView>
    </Screen>
  );
};

export default Learn;
