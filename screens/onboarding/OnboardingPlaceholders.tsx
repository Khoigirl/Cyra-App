
import React from 'react';
import Screen from '../../components/Screen';
import Button from '../../components/Button';
import { OnboardingScreen } from '../../types';

interface PlaceholderProps {
  screen: OnboardingScreen;
  onNext: () => void;
}

const OnboardingPlaceholder: React.FC<PlaceholderProps> = ({ screen, onNext }) => {
  return (
    <Screen title={screen.replace(/([A-Z])/g, ' $1').trim()}>
      <div className="flex flex-col h-full justify-between pb-12">
        <div className="pt-8">
          <div className="w-full h-64 bg-white rounded-[18px] border border-[#E5E7EB] flex items-center justify-center border-dashed">
            <span className="text-[#6B7280] font-medium">Configuring {screen}...</span>
          </div>
          <p className="text-[#6B7280] mt-6 text-sm leading-relaxed">
            This step helps us personalize your Cyra experience for your specific PCOS journey.
          </p>
        </div>
        
        <Button label="Continue" onPress={onNext} className="w-full mt-12" />
      </div>
    </Screen>
  );
};

export default OnboardingPlaceholder;
