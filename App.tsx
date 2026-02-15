
import React, { useState } from 'react';
import { View, Text, Pressable, StatusBar } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Tab } from './types';
import Today from './screens/Today';
import WelcomeScreen from './screens/onboarding/WelcomeScreen';
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
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Today);

  const renderTab = () => {
    switch (activeTab) {
      case Tab.Today: return <Today />;
      default: return (
        <StyledView className="flex-1 items-center justify-center bg-[#FBFBF9]">
          <StyledText className="text-[#828282] italic font-medium">Coming Soon</StyledText>
        </StyledView>
      );
    }
  };

  if (!isOnboarded) {
    return <WelcomeScreen onNext={() => setIsOnboarded(true)} />;
  }

  return (
    <StyledSafeAreaView className="flex-1 bg-[#FBFBF9]">
      <StatusBar barStyle="dark-content" />
      
      <StyledView className="flex-1">
        {renderTab()}
      </StyledView>
      
      <StyledView className="h-24 bg-white border-t border-[#F0EFEA] flex-row justify-around items-center px-4 pb-6">
        <NavItem label="Today" icon="☀️" active={activeTab === Tab.Today} onPress={() => setActiveTab(Tab.Today)} />
        <NavItem label="Recipes" icon="🥗" active={activeTab === Tab.Recipes} onPress={() => setActiveTab(Tab.Recipes)} />
        <NavItem label="Track" icon="📅" active={activeTab === Tab.Track} onPress={() => setActiveTab(Tab.Track)} />
        <NavItem label="Learn" icon="📖" active={activeTab === Tab.Learn} onPress={() => setActiveTab(Tab.Learn)} />
        <NavItem label="Profile" icon="👤" active={activeTab === Tab.Profile} onPress={() => setActiveTab(Tab.Profile)} />
      </StyledView>
    </StyledSafeAreaView>
  );
};

const NavItem = ({ label, icon, active, onPress }: any) => (
  <StyledPressable onPress={onPress} className="items-center justify-center py-2 px-3 active:opacity-60">
    <StyledText className={`text-xl ${active ? 'opacity-100' : 'opacity-30'}`}>{icon}</StyledText>
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
