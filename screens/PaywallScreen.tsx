
import React from 'react';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Button from '../components/Button';
import CyraLogo from '../components/CyraLogo';
import { useSubscription } from '../context/SubscriptionContext';

// Fix: Moved sub-components above PaywallScreen and used React.FC to ensure proper type hoisting and children recognition
const FeatureGroup: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-4">
    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] px-2">{title}</h3>
    <div className="space-y-3">
      {children}
    </div>
  </div>
);

const BenefitRow: React.FC<{ icon: string, title: string, detail: string }> = ({ icon, title, detail }) => (
  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-50 shadow-sm">
    <div className="w-10 h-10 rounded-xl bg-[#F7F4F1] flex items-center justify-center text-lg shadow-inner">{icon}</div>
    <div className="flex-1 pt-0.5">
      <h4 className="text-sm font-bold text-[#1F2937] tracking-tight">{title}</h4>
      <p className="text-[11px] text-[#6B7280] mt-0.5 leading-snug font-medium">{detail}</p>
    </div>
  </div>
);

const TrustSignal: React.FC<{ icon: string, label: string }> = ({ icon, label }) => (
  <div className="flex flex-col items-center text-center gap-1.5 opacity-60">
    <span className="text-sm">{icon}</span>
    <span className="text-[8px] font-bold uppercase tracking-wider text-gray-500">{label}</span>
  </div>
);

interface PaywallScreenProps {
  onBack: () => void;
  source?: string;
}

const PaywallScreen: React.FC<PaywallScreenProps> = ({ onBack, source }) => {
  const { startTrial, setPremium, restorePurchases } = useSubscription();

  const handleAnnual = () => {
    startTrial(7);
    onBack();
  };

  const handleMonthly = () => {
    setPremium();
    onBack();
  };

  return (
    <Screen hideHeader scrollable={true}>
      <div className="flex flex-col h-full pt-12 pb-16">
        <div className="flex justify-between items-center mb-8 px-2">
          <button onClick={onBack} className="p-2 -ml-2 text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button onClick={restorePurchases} className="text-[10px] font-bold text-[#8FAF9D] uppercase tracking-[0.15em]">
            Restore
          </button>
        </div>

        <div className="flex flex-col items-center text-center mb-12">
          <div className="mb-6 scale-125">
            <CyraLogo size={32} />
          </div>
          <h2 className="text-3xl font-bold text-[#1F2937] leading-tight px-4">Unlock Your Full<br />Hormone Intelligence</h2>
          <p className="text-sm text-[#6B7280] mt-4 px-10 font-medium leading-relaxed italic opacity-80">
            "See patterns. Understand your data. Make confident decisions."
          </p>
        </div>

        <div className="space-y-8 px-1 mb-12">
          {/* Fix: Explicitly ensuring children are recognized by defined FeatureGroup component */}
          <FeatureGroup title="Intelligence">
            <BenefitRow icon="📅" title="Unlimited Timeline" detail="Unlock years of cycle history and long-term pattern detection." />
            <BenefitRow icon="📈" title="Advanced Trends" detail="Visualize correlations between symptoms and habits over months." />
          </FeatureGroup>

          {/* Fix: Explicitly ensuring children are recognized by defined FeatureGroup component */}
          <FeatureGroup title="Insight">
            <BenefitRow icon="🧪" title="Lab Report Synthesis" detail="Upload results for AI-powered educational summaries in context." />
            <BenefitRow icon="📖" title="Masterclass Hub" detail="Access the full clinical curriculum for PCOS management." />
          </FeatureGroup>

          {/* Fix: Explicitly ensuring children are recognized by defined FeatureGroup component */}
          <FeatureGroup title="Action">
            <BenefitRow icon="📋" title="Clinical Reports" detail="Export structured wellness timelines ready for your doctor." />
            <BenefitRow icon="📅" title="Smart Planning" detail="Weekly adaptive meal plans and automated grocery lists." />
          </FeatureGroup>
        </div>

        <div className="space-y-4 px-1">
          {/* ANNUAL PLAN */}
          <Card 
            onClick={handleAnnual}
            className="p-6 border-[#8FAF9D] border-2 bg-white shadow-xl relative overflow-hidden ring-4 ring-[#8FAF9D]/5"
          >
            <div className="flex justify-between items-center relative z-10">
              <div>
                <p className="text-[9px] font-bold text-[#8FAF9D] uppercase tracking-[0.2em] mb-1">Most Popular • 7-Day Free Trial</p>
                <h4 className="text-lg font-bold text-[#1F2937]">Annual Membership</h4>
                <p className="text-xs text-[#6B7280] mt-0.5 font-medium">Just $4.99 / month, billed annually</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#1F2937]">$59.99</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase">/ year</p>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#8FAF9D]/5 rounded-full -mr-10 -mt-10" />
          </Card>

          {/* MONTHLY PLAN */}
          <button 
            onClick={handleMonthly}
            className="w-full p-6 rounded-[22px] bg-[#F7F4F1] border border-[#E5E7EB] flex justify-between items-center active:scale-[0.99] transition-all"
          >
            <div className="text-left">
              <h4 className="text-sm font-bold text-[#1F2937]">Monthly Subscription</h4>
              <p className="text-xs text-[#6B7280]">Flexible month-to-month access</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-[#1F2937]">$9.99</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase">/ mo</p>
            </div>
          </button>

          <div className="pt-6">
            <Button 
              label="Start 7-Day Free Trial" 
              onPress={handleAnnual} 
              className="w-full shadow-2xl shadow-[#8FAF9D]/20 h-16 text-sm tracking-[0.15em] font-bold uppercase" 
            />
            <p className="text-[10px] text-[#6B7280] text-center mt-4 font-semibold italic">
              Cancel anytime in your App Store settings.
            </p>
          </div>
        </div>

        {/* TRUST SIGNALS */}
        <div className="mt-12 pt-10 border-t border-[#E5E7EB]/50 grid grid-cols-3 gap-2 px-2">
           <TrustSignal icon="🔒" label="Secure Payment" />
           <TrustSignal icon="🛡️" label="Private Data" />
           <TrustSignal icon="✨" label="No Advertisers" />
        </div>

        <div className="text-center mt-10 px-8">
          <p className="text-[9px] text-gray-400 leading-relaxed font-medium">
            Payments are handled securely via the App Store. The trial converts to a paid subscription unless canceled at least 24 hours before the end of the trial period.
          </p>
          <div className="flex justify-center gap-6 mt-4 opacity-40">
             <button className="text-[8px] font-bold uppercase tracking-widest text-gray-500 underline">Privacy Policy</button>
             <button className="text-[8px] font-bold uppercase tracking-widest text-gray-500 underline">Terms of Use</button>
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default PaywallScreen;
