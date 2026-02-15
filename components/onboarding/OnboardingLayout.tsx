
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import Screen from '../Screen';
import ProgressHeader from './ProgressHeader';
import Button from '../Button';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);

interface OnboardingLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onNext: () => void;
  onBack?: () => void;
  currentStep: number;
  totalSteps: number;
  isNextDisabled?: boolean;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  title, subtitle, children, onNext, onBack, currentStep, totalSteps, isNextDisabled = false,
}) => {
  return (
    <Screen scrollable={false} className="px-0">
      <StyledView className="flex-1 pb-8">
        <ProgressHeader currentStep={currentStep} totalSteps={totalSteps} />
        
        <StyledView className="flex-1 mt-6 px-6">
          <StyledText className="text-2xl font-bold text-[#1F2937] mb-2">{title}</StyledText>
          <StyledText className="text-[#6B7280] text-sm leading-relaxed mb-8">{subtitle}</StyledText>
          
          <StyledScrollView showsVerticalScrollIndicator={false} className="flex-1">
            {children}
          </StyledScrollView>
        </StyledView>

        <StyledView className="pt-4 px-6 gap-y-3">
          <Button label="Continue" onPress={onNext} className={`w-full ${isNextDisabled ? 'opacity-30' : 'opacity-100'}`} />
          {onBack && (
            <StyledPressable onPress={onBack} className="w-full py-2 items-center">
              <StyledText className="text-xs font-bold text-gray-400 uppercase tracking-widest">Back</StyledText>
            </StyledPressable>
          )}
        </StyledView>
      </StyledView>
    </Screen>
  );
};

const StyledPressable = styled(View); // Placeholder for internal use
export default OnboardingLayout;
