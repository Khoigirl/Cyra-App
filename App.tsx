
import React, { useState, useMemo } from 'react';
import { Tab, OnboardingScreen } from './types';
import Layout from './components/Layout';
import Today from './screens/Today';
import Recipes from './screens/Recipes';
import Track from './screens/Track'; 
import Profile from './screens/Profile';
import WelcomeScreen from './screens/onboarding/WelcomeScreen';
import GoalsScreen from './screens/onboarding/GoalsScreen';
import SymptomsScreen from './screens/onboarding/SymptomsScreen';
import CycleInfoScreen from './screens/onboarding/CycleInfoScreen';
import DietPrefsScreen from './screens/onboarding/DietPrefsScreen';
import RemindersScreen from './screens/onboarding/RemindersScreen';
import HealthSyncScreen from './screens/onboarding/HealthSyncScreen';
import ConsentScreen from './screens/onboarding/ConsentScreen';
import SummaryScreen from './screens/onboarding/SummaryScreen';
import PersonalizedOverviewScreen from './screens/onboarding/PersonalizedOverviewScreen';
import AuthGateScreen from './screens/onboarding/AuthGateScreen';
import EmailAuthScreen from './screens/onboarding/EmailAuthScreen';
import SupplementsScreen from './screens/supplements/SupplementsScreen';
import ManageSupplementsScreen from './screens/supplements/ManageSupplementsScreen';
import AddEditSupplementScreen from './screens/supplements/AddEditSupplementScreen';
import SupplementRemindersScreen from './screens/supplements/SupplementRemindersScreen';
import EditReminderScreen from './screens/supplements/EditReminderScreen';
import LabsScreen from './screens/labs/LabsScreen';
import AddLabResultScreen from './screens/labs/AddLabResultScreen';
import LabMarkerDetailScreen from './screens/labs/LabMarkerDetailScreen';
import AddCustomMarkerScreen from './screens/labs/AddCustomMarkerScreen';
import LabScanStartScreen from './screens/labs/LabScanStartScreen';
import LabScanReviewScreen from './screens/labs/LabScanReviewScreen';
import LabScanSummaryScreen from './screens/labs/LabScanSummaryScreen';
import LearnScreen from './screens/LearnScreen';
import LearnLibraryScreen from './screens/LearnLibraryScreen';
import LearnDetailsScreen from './screens/LearnDetailsScreen';
import LearningProgressScreen from './screens/LearningProgressScreen';
import ProgramDayScreen from './screens/ProgramDayScreen';
import PaywallScreen from './screens/PaywallScreen';
import LegalScreen, { LegalType } from './screens/LegalScreen';
import SupportScreen from './screens/SupportScreen';
import DeleteAccountScreen from './screens/DeleteAccountScreen';
import { OnboardingProvider } from './context/OnboardingContext';
import { WellnessProvider } from './context/WellnessContext';
import { SupplementProvider } from './context/SupplementContext';
import { LabProvider } from './context/LabContext';
import { LearnProvider } from './context/LearnContext';
import { SubscriptionProvider, useSubscription } from './context/SubscriptionContext';
import { parseReportText, ParsedCandidate } from './labs/reportParser';

enum SupplementStack { Main = 'Main', Library = 'Library', Form = 'Form', Reminders = 'Reminders', ReminderForm = 'ReminderForm' }
enum LabStack { Main = 'Main', AddResult = 'AddResult', Detail = 'Detail', AddCustom = 'AddCustom', ScanStart = 'ScanStart', ScanReview = 'ScanReview', ScanSummary = 'ScanSummary' }
enum LearnStack { Main = 'Main', Library = 'Library', Details = 'Details', Progress = 'Progress', ProgramDay = 'ProgramDay' }
enum ProfileStack { Main = 'Main', Legal = 'Legal', Support = 'Support', Delete = 'Delete' }

const AppContent: React.FC = () => {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Today);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingScreen>(OnboardingScreen.Welcome);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallSource, setPaywallSource] = useState<string | undefined>();
  const { isSubscribed } = useSubscription();

  const [showSupplements, setShowSupplements] = useState(false);
  const [suppStack, setSuppStack] = useState<SupplementStack>(SupplementStack.Main);
  
  const [showLabs, setShowLabs] = useState(false);
  const [labStack, setLabStack] = useState<LabStack>(LabStack.Main);
  const [activeMarkerId, setActiveMarkerId] = useState<string | undefined>();
  const [scanCandidates, setScanCandidates] = useState<ParsedCandidate[]>([]);

  const [learnStack, setLearnStack] = useState<LearnStack>(LearnStack.Main);
  const [activeLearnItemId, setActiveLearnItemId] = useState<string | null>(null);

  const questionnaireSteps = [
    OnboardingScreen.Goals,
    OnboardingScreen.Symptoms,
    OnboardingScreen.CycleInfo,
    OnboardingScreen.DietPrefs,
    OnboardingScreen.Reminders,
    OnboardingScreen.HealthSync,
    OnboardingScreen.Consent
  ];
  
  const currentStepNum = questionnaireSteps.indexOf(onboardingStep) + 1;
  const totalQuestionnaireSteps = questionnaireSteps.length;

  const handleNextOnboarding = () => {
    const steps = Object.values(OnboardingScreen);
    const currentIndex = steps.indexOf(onboardingStep);
    if (currentIndex < steps.length - 1) {
      setOnboardingStep(steps[currentIndex + 1] as OnboardingScreen);
    } else {
      setIsOnboarded(true);
    }
  };

  const handleBackOnboarding = () => {
    const steps = Object.values(OnboardingScreen);
    const currentIndex = steps.indexOf(onboardingStep);
    if (currentIndex > 0) {
      setOnboardingStep(steps[currentIndex - 1] as OnboardingScreen);
    }
  };

  const renderOnboarding = () => {
    const stepProps = { 
      onNext: handleNextOnboarding, 
      onBack: handleBackOnboarding, 
      step: currentStepNum, 
      totalSteps: totalQuestionnaireSteps 
    };

    switch (onboardingStep) {
      case OnboardingScreen.Welcome: return <WelcomeScreen onNext={handleNextOnboarding} />;
      case OnboardingScreen.Goals: return <GoalsScreen {...stepProps} />;
      case OnboardingScreen.Symptoms: return <SymptomsScreen {...stepProps} />;
      case OnboardingScreen.CycleInfo: return <CycleInfoScreen {...stepProps} />;
      case OnboardingScreen.DietPrefs: return <DietPrefsScreen {...stepProps} />;
      case OnboardingScreen.Reminders: return <RemindersScreen {...stepProps} />;
      case OnboardingScreen.HealthSync: return <HealthSyncScreen {...stepProps} />;
      case OnboardingScreen.Consent: return <ConsentScreen {...stepProps} />;
      case OnboardingScreen.PersonalizedOverview: return <PersonalizedOverviewScreen onNext={handleNextOnboarding} />;
      case OnboardingScreen.Summary: return <SummaryScreen onNext={handleNextOnboarding} />;
      case OnboardingScreen.AuthGate: return <AuthGateScreen onEmailAuth={handleNextOnboarding} onSuccess={() => setIsOnboarded(true)} onBack={handleBackOnboarding} />;
      case OnboardingScreen.EmailAuth: return <EmailAuthScreen onSuccess={() => setIsOnboarded(true)} onBack={handleBackOnboarding} />;
      default: return <WelcomeScreen onNext={handleNextOnboarding} />;
    }
  };

  const renderLabs = () => {
    switch (labStack) {
      case LabStack.Main:
        return <LabsScreen 
          onBack={() => setShowLabs(false)} 
          onAddResult={() => setLabStack(LabStack.AddResult)} 
          onDetail={(id) => { setActiveMarkerId(id); setLabStack(LabStack.Detail); }} 
          onAddCustom={() => setLabStack(LabStack.AddCustom)} 
          onScan={() => setLabStack(LabStack.ScanStart)} 
        />;
      case LabStack.AddResult:
        return <AddLabResultScreen onBack={() => setLabStack(LabStack.Main)} />;
      case LabStack.Detail:
        return <LabMarkerDetailScreen markerId={activeMarkerId!} onBack={() => setLabStack(LabStack.Main)} onAddResult={() => setLabStack(LabStack.AddResult)} />;
      case LabStack.AddCustom:
        return <AddCustomMarkerScreen onBack={() => setLabStack(LabStack.Main)} />;
      case LabStack.ScanStart:
        return <LabScanStartScreen 
          onBack={() => setLabStack(LabStack.Main)} 
          onTextExtracted={(text) => {
            const candidates = parseReportText(text);
            setScanCandidates(candidates);
            setLabStack(LabStack.ScanReview);
          }} 
        />;
      case LabStack.ScanReview:
        return <LabScanReviewScreen 
          candidates={scanCandidates} 
          onBack={() => setLabStack(LabStack.ScanStart)} 
          onConfirm={(confirmed) => {
            setScanCandidates(confirmed);
            setLabStack(LabStack.ScanSummary);
          }} 
        />;
      case LabStack.ScanSummary:
        return <LabScanSummaryScreen 
          confirmedResults={scanCandidates} 
          onBack={() => setLabStack(LabStack.ScanReview)} 
          onFinish={() => {
            setLabStack(LabStack.Main);
          }} 
        />;
      default:
        return <LabsScreen onBack={() => setShowLabs(false)} onAddResult={() => {}} onDetail={() => {}} onAddCustom={() => {}} onScan={() => {}} />;
    }
  };

  const renderMainApp = () => {
    if (showPaywall) return <PaywallScreen source={paywallSource} onBack={() => setShowPaywall(false)} />;
    if (showSupplements) return <SupplementsScreen onBack={() => setShowSupplements(false)} onManage={() => setSuppStack(SupplementStack.Library)} onReminders={() => setSuppStack(SupplementStack.Reminders)} />;
    if (showLabs) return renderLabs();

    switch (activeTab) {
      case Tab.Today: return <Today onGoToSupplements={() => setShowSupplements(true)} onOpenLearnItem={(id) => { setActiveLearnItemId(id); setActiveTab(Tab.Learn); setLearnStack(LearnStack.Details); }} onContinueProgram={(id) => { setActiveLearnItemId(id); setActiveTab(Tab.Learn); setLearnStack(LearnStack.ProgramDay); }} onOpenPaywall={(s) => { setPaywallSource(s); setShowPaywall(true); }} />;
      case Tab.Recipes: return <Recipes onOpenPaywall={(s) => { setPaywallSource(s); setShowPaywall(true); }} />;
      case Tab.Track: return <Track onGoToAuth={() => setOnboardingStep(OnboardingScreen.AuthGate)} onGoToSupplements={() => setShowSupplements(true)} onOpenPaywall={(s) => { setPaywallSource(s); setShowPaywall(true); }} />; 
      case Tab.Learn: return <LearnScreen onSelectItem={(id) => { setActiveLearnItemId(id); setLearnStack(LearnStack.Details); }} onSelectPillar={() => {}} onViewAllLibrary={() => {}} />;
      case Tab.Profile: return <Profile onGoToLabs={() => { setShowLabs(true); setLabStack(LabStack.Main); }} onOpenPaywall={(s) => { setPaywallSource(s); setShowPaywall(true); }} />;
      default: return <Today onGoToSupplements={() => setShowSupplements(true)} onOpenPaywall={(s) => { setPaywallSource(s); setShowPaywall(true); }} />;
    }
  };

  if (!isOnboarded) return <div className="flex flex-col h-screen max-w-md mx-auto bg-[#F7F4F1] relative overflow-hidden border-x border-gray-100 shadow-xl">{renderOnboarding()}</div>;

  return <Layout activeTab={activeTab} setActiveTab={setActiveTab}><div className="animate-in fade-in slide-in-from-bottom-4 duration-500">{renderMainApp()}</div></Layout>;
};

const App: React.FC = () => (
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
);

export default App;
