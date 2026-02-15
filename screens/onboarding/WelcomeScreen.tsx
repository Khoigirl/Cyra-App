
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import Screen from '../../components/Screen';
import CyraLogo from '../../components/CyraLogo';
import Button from '../../components/Button';
import Card from '../../components/Card';

const StyledView = styled(View);
const StyledText = styled(Text);

interface WelcomeScreenProps {
  onNext: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext }) => {
  return (
    <Screen scrollable={false} hideHeader={true}>
      <StyledView className="flex-1 items-center justify-between pt-20 pb-12">
        <StyledView className="items-center">
          <StyledView className="mb-12">
            {/* Logo rendered via Text/View in pure mobile */}
            <StyledView className="w-16 h-16 rounded-full border-2 border-[#8FAF9D] items-center justify-center">
              <StyledView className="w-4 h-4 rounded-full bg-[#8FAF9D] absolute top-1 right-1" />
              <StyledText className="text-[#8FAF9D] font-bold text-2xl">c</StyledText>
            </StyledView>
          </StyledView>
          
          <StyledText className="text-3xl font-bold text-[#1F2937] text-center mb-4 leading-tight">
            Your rhythm,{'\n'}understood.
          </StyledText>
          
          <StyledText className="text-[#6B7280] text-base px-6 leading-relaxed text-center max-w-xs">
            A personalized space to manage PCOS, sync with your cycle, and find balance.
          </StyledText>
        </StyledView>

        <StyledView className="w-full">
          <Card className="bg-white border-[#E5E7EB] border-dashed items-center p-6 mb-8">
            <StyledText className="text-[11px] font-bold text-[#6E9482] uppercase tracking-widest mb-1">Disclaimer</StyledText>
            <StyledText className="text-xs text-[#6B7280] text-center leading-normal">
              Cyra is built for tracking and cycle education. We provide insights based on your data, not medical diagnoses.
            </StyledText>
          </Card>

          <StyledView className="space-y-4">
            <Button 
              label="Get started" 
              onPress={onNext} 
              className="w-full"
            />
            <Button 
              label="I already have an account" 
              variant="tertiary" 
              className="w-full"
            />
          </StyledView>
        </StyledView>
      </StyledView>
    </Screen>
  );
};

export default WelcomeScreen;
