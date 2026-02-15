
import React from 'react';
import Screen from '../../components/Screen';
import CyraLogo from '../../components/CyraLogo';
import Button from '../../components/Button';
import Card from '../../components/Card';

interface WelcomeScreenProps {
  onNext: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext }) => {
  return (
    <Screen scrollable={false} hideHeader={true}>
      <div className="flex flex-col h-full items-center justify-between pt-20 pb-12">
        <div className="flex flex-col items-center text-center">
          <div className="mb-12">
            <CyraLogo size={64} />
          </div>
          
          <h1 className="text-3xl font-bold text-[#1F2937] mb-4">
            Your rhythm,<br />understood.
          </h1>
          
          <p className="text-[#6B7280] text-base px-4 leading-relaxed max-w-xs">
            A personalized space to manage PCOS, sync with your cycle, and find balance through nutrition and mindfulness.
          </p>
        </div>

        <div className="w-full space-y-8">
          <Card className="bg-white border-[#E5E7EB] border-dashed text-center p-6">
            <p className="text-[11px] font-bold text-[#6E9482] uppercase tracking-widest mb-1">Disclaimer</p>
            <p className="text-xs text-[#6B7280] leading-normal">
              Cyra is built for tracking and cycle education. We provide insights based on your data, not medical diagnoses.
            </p>
          </Card>

          <div className="space-y-4">
            <Button 
              label="Get started" 
              onPress={onNext} 
              className="w-full shadow-sm"
            />
            <Button 
              label="I already have an account" 
              variant="tertiary" 
              className="w-full text-xs font-semibold"
            />
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default WelcomeScreen;
