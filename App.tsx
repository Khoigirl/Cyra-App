
import React, { useState } from 'react';
import { View, Text, Pressable, StatusBar } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Tab } from './types';

// Screens
import Today from './screens/Today';
import Recipes from './screens/Recipes';
import Track from './screens/Track';
import LearnScreen from './screens/LearnScreen';
import Profile from './screens/Profile';
import WelcomeScreen from './screens/onboarding/WelcomeScreen';
import GoalsScreen from './screens/onboarding/GoalsScreen';
import SymptomsScreen from './screens/onboarding/SymptomsScreen';
import CycleInfoScreen from './screens/onboarding/CycleInfoScreen';
import PersonalizedOverviewScreen from './screens/onboarding/PersonalizedOverviewScreen';
import PaywallScreen from './screens/PaywallScreen';

// Context
import { LabProvider } from './context/LabContext';
import { WellnessProvider } from './context/WellnessContext';
import { SupplementProvider } from './context/SupplementContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { LearnProvider } from './context/LearnContext';
import { OnboardingProvider } from './context/OnboardingContext';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);
const StyledSafeAreaView = styled(SafeAreaView);

const AppContent: React.FC = () => {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Today);
  const [showPaywall, setShowPaywall] = useState(false);

  // Onboarding Stack
  if (!isOnboarded) {
    const next = () => setOnboardingStep(s => s + 1);
    const back = () => setOnboardingStep(s => Math.max(0, s - 1));
    const finish = () => setIsOnboarded(true);

    switch (onboardingStep) {
      case 0: return <WelcomeScreen onNext={next} />;
      case 1: return <GoalsScreen step={1} totalSteps={4} onNext={next} onBack={back} />;
      case 2: return <SymptomsScreen step={2} totalSteps={4} onNext={next} onBack={back} />;
      case 3: return <CycleInfoScreen step={3} totalSteps={4} onNext={next} onBack={back} />;
      case 4: return <PersonalizedOverviewScreen onNext={finish} />;
      default: return <WelcomeScreen onNext={next} />;
    }
  }

  const renderTab = () => {
    switch (activeTab) {
      case Tab.Today: return <Today />;
      case Tab.Recipes: return <Recipes onOpenPaywall={() => setShowPaywall(true)} />;
      case Tab.Track: return <Track onGoToAuth={() => {}} onOpenPaywall={() => setShowPaywall(true)} />;
      case Tab.Learn: return <LearnScreen onSelectItem={() => {}} onSelectPillar={() => {}} onViewAllLibrary={() => {}} />;
      case Tab.Profile: return <Profile onOpenPaywall={() => setShowPaywall(true)} />;
      default: return <Today />;
    }
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-[#FBFBF9]" edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />
      
      <StyledView className="flex-1">
        {renderTab()}
      </StyledView>
      
      {/* Native Bottom Navigation */}
      <StyledView className="h-24 bg-white border-t border-[#F0EFEA] flex-row justify-around items-center px-4 pb-6">
        <NavItem label="Today" icon="☀️" active={activeTab === Tab.Today} onPress={() => setActiveTab(Tab.Today)} />
        <NavItem label="Eat" icon="🥗" active={activeTab === Tab.Recipes} onPress={() => setActiveTab(Tab.Recipes)} />
        <NavItem label="Log" icon="📅" active={activeTab === Tab.Track} onPress={() => setActiveTab(Tab.Track)} />
        <NavItem label="Learn" icon="📖" active={activeTab === Tab.Learn} onPress={() => setActiveTab(Tab.Learn)} />
        <NavItem label="Me" icon="👤" active={activeTab === Tab.Profile} onPress={() => setActiveTab(Tab.Profile)} />
      </StyledView>

      {showPaywall && <PaywallScreen onBack={() => setShowPaywall(false)} />}
    </StyledSafeAreaView>
  );
};

const NavItem = ({ label, icon, active, onPress }: any) => (
  <StyledPressable onPress={onPress} className="items-center justify-center py-2 px-3 active:opacity-60">
    <StyledText className={`text-xl ${active ? 'opacity-100' : 'opacity-20'}`}>{icon}</StyledText>
    <StyledText className={`text-[10px] font-bold mt-1 uppercase tracking-tighter ${active ? 'text-[#8FAF9D]' : 'text-[#828282]'}`}>
      {label}
    </StyledText>
  </StyledPressable>
);

const App: React.FC = () => (
  <SafeAreaProvider>
    <SubscriptionProvider>
      <OnboardingProvider>
        <WellnessProvider>
          <SupplementProvider>
            <LabProvider>
              <LearnProvider>
                <AppContent />
              </LearnProvider>
            </LabProvider>
          </SupplementProvider>
        </WellnessProvider>
      </OnboardingProvider>
    </SubscriptionProvider>
  </SafeAreaProvider>
);

export default App;
