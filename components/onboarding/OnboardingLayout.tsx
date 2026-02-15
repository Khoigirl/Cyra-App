
import React from 'react';
import Screen from '../Screen';
import ProgressHeader from './ProgressHeader';
import Button from '../Button';

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
  title,
  subtitle,
  children,
  onNext,
  onBack,
  currentStep,
  totalSteps,
  isNextDisabled = false,
}) => {
  return (
    <Screen scrollable={false}>
      <div className="flex flex-col h-full pb-8">
        <ProgressHeader currentStep={currentStep} totalSteps={totalSteps} />
        
        <div className="flex-1 mt-4 px-2 overflow-y-auto hide-scrollbar">
          <h2 className="text-2xl font-bold text-[#1F2937] mb-2">{title}</h2>
          <p className="text-[#6B7280] text-sm leading-relaxed mb-6">{subtitle}</p>
          
          <div className="pb-8">
            {children}
          </div>
        </div>

        <div className="pt-4 px-2 space-y-3">
          <Button 
            label="Continue" 
            onPress={onNext} 
            className={`w-full shadow-md ${isNextDisabled ? 'opacity-50 pointer-events-none' : ''}`}
          />
          {onBack && (
            <Button 
              label="Back" 
              variant="tertiary" 
              onPress={onBack} 
              className="w-full text-xs font-semibold py-2"
            />
          )}
        </div>
      </div>
    </Screen>
  );
};

export default OnboardingLayout;
