
import React from 'react';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';
import Toggle from '../../components/Toggle';
import Card from '../../components/Card';
import { useOnboarding } from '../../context/OnboardingContext';

interface ConsentScreenProps {
  onNext: () => void;
  onBack: () => void;
  step: number;
  totalSteps: number;
}

const ConsentScreen: React.FC<ConsentScreenProps> = ({ onNext, onBack, step, totalSteps }) => {
  const { answers, updateAnswers } = useOnboarding();

  return (
    <OnboardingLayout
      title="Your data, protected"
      subtitle="Cyra is your private space. We prioritize transparency in how your wellness data is handled."
      onNext={onNext}
      onBack={onBack}
      currentStep={step}
      totalSteps={totalSteps}
      isNextDisabled={!answers.hasConsented}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <ConsentItem icon="🔒" label="You control what you log" description="Only share what feels comfortable. You can delete individual logs or your entire profile at any time." />
          <ConsentItem icon="🛡️" label="Your data is not for sale" description="We never sell your personal or health data to third parties or advertisers." />
          <ConsentItem icon="☁️" label="Secure by design" description="Logs are stored locally. If you create an account, they sync to a secure cloud for backup." />
        </div>

        <Card className="bg-white border-none shadow-sm p-4 mt-4">
          <Toggle 
            label="I consent to Cyra securely storing my wellness logs to provide personalized insights." 
            isEnabled={answers.hasConsented} 
            onToggle={(val) => updateAnswers({ hasConsented: val })} 
          />
        </Card>

        <p className="text-[10px] text-[#6B7280] italic text-center leading-relaxed px-4">
          By continuing, you agree to our processing of your health-related information as described in our Privacy Policy.
        </p>
      </div>
    </OnboardingLayout>
  );
};

const ConsentItem = ({ icon, label, description }: { icon: string; label: string; description: string }) => (
  <div className="flex gap-4 items-start">
    <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center text-xl flex-shrink-0 shadow-sm">
      {icon}
    </div>
    <div>
      <h4 className="text-sm font-bold text-[#1F2937]">{label}</h4>
      <p className="text-xs text-[#6B7280] leading-relaxed mt-0.5">{description}</p>
    </div>
  </div>
);

export default ConsentScreen;
