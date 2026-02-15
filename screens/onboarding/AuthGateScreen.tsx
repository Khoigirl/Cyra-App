
import React, { useState } from 'react';
import Screen from '../../components/Screen';
import Button from '../../components/Button';
import CyraLogo from '../../components/CyraLogo';
import CollapsibleSection from '../../components/CollapsibleSection';
import Card from '../../components/Card';
import { AuthStatus } from '../../types';
import { useWellness } from '../../context/WellnessContext';

interface AuthGateScreenProps {
  onEmailAuth: () => void;
  onSuccess: () => void;
  onBack: () => void;
}

const AuthGateScreen: React.FC<AuthGateScreenProps> = ({ onEmailAuth, onSuccess, onBack }) => {
  const { setAuthStatus } = useWellness();
  const [showGuestModal, setShowGuestModal] = useState(false);

  const handleSuccess = (status: AuthStatus) => {
    setAuthStatus(status);
    onSuccess();
  };

  return (
    <Screen hideHeader scrollable={true}>
      <div className="flex flex-col h-full pt-16 pb-12 px-2">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="mb-6">
            <CyraLogo size={48} />
          </div>
          <h2 className="text-3xl font-bold text-[#1F2937] mb-3 px-4">Secure Your Plan</h2>
          <p className="text-[#6B7280] text-sm leading-relaxed max-w-xs px-2">
            Your data is private and secure. You can delete your account and all associated data at any time.
          </p>
        </div>

        <div className="flex-1 space-y-4">
          {/* PRIMARY: Continue with Apple */}
          <button 
            onClick={() => handleSuccess(AuthStatus.Authenticated)}
            className="w-full h-[56px] bg-[#1F2937] text-white rounded-[16px] flex items-center justify-center gap-3 font-semibold shadow-md active:scale-[0.98] transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.152 6.896c-.548 0-1.411-.516-2.438-.516-1.357 0-2.714.789-3.41 1.996-1.42 2.457-.365 6.088 1.01 8.077.673.975 1.47 2.071 2.51 2.033 1.002-.04 1.38-.644 2.593-.644 1.213 0 1.554.644 2.613.623 1.077-.021 1.763-1.003 2.427-1.977.767-1.12 1.085-2.203 1.103-2.261-.024-.01-2.12-.814-2.144-3.235-.018-2.023 1.66-2.992 1.738-3.037-.945-1.385-2.403-1.543-2.922-1.576-1.306-.104-2.545.789-3.08 0zm2.254-4.896c-.596.726-.998 1.737-.887 2.748 1.006.078 2.016-.543 2.635-1.27.619-.727 1.037-1.758.913-2.748-.908.037-1.958.623-2.661 1.27z"/>
            </svg>
            Continue with Apple
          </button>

          {/* SECONDARY: Continue with Google */}
          <button 
            onClick={() => handleSuccess(AuthStatus.Authenticated)}
            className="w-full h-[56px] bg-white border border-[#E5E7EB] rounded-[16px] flex items-center justify-center gap-3 font-semibold text-[#1F2937] shadow-sm active:scale-[0.98] transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* OUTLINE: Continue with Email */}
          <button 
            onClick={onEmailAuth}
            className="w-full h-[56px] bg-transparent border-2 border-[#8FAF9D] text-[#8FAF9D] rounded-[16px] flex items-center justify-center gap-3 font-bold active:scale-[0.98] transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L22 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Continue with Email
          </button>

          <div className="pt-6">
            <CollapsibleSection title="Why create an account?" variant="flat" leftIcon="✨">
              <div className="space-y-4 py-2">
                <BenefitItem icon="📱" text="Save and sync data across all your devices." />
                <BenefitItem icon="☁️" text="Secure cloud backup so you never lose history." />
                <BenefitItem icon="🔓" text="Unlock advanced premium features and programs." />
                <BenefitItem icon="🛡️" text="Protect your sensitive wellness history with a login." />
              </div>
            </CollapsibleSection>
          </div>
        </div>

        <div className="pt-10 text-center space-y-6">
          <div className="space-y-1">
            <button 
              onClick={() => setShowGuestModal(true)}
              className="text-xs font-bold text-[#8FAF9D] uppercase tracking-widest underline underline-offset-4"
            >
              Continue without account
            </button>
            <p className="text-[10px] text-gray-400 font-medium italic">Limited features and no backup support</p>
          </div>

          <p className="text-[10px] text-[#6B7280] leading-relaxed max-w-[280px] mx-auto opacity-70">
            By continuing, you agree to Cyra's <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>.
          </p>
        </div>

        {/* Guest Confirmation Modal */}
        {showGuestModal && (
          <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
            <Card className="max-w-xs w-full p-8 text-center animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">⚠️</div>
              <h3 className="text-xl font-bold text-[#1F2937] mb-3">Continue as Guest?</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed mb-8">
                Your data will only be stored on this device. If you delete the app or switch phones, your <strong>history will be lost permanently</strong>.
              </p>
              <div className="space-y-3">
                <Button label="Create Account" onPress={() => setShowGuestModal(false)} className="w-full" />
                <button 
                  onClick={() => handleSuccess(AuthStatus.Guest)} 
                  className="w-full text-xs font-bold text-gray-400 uppercase tracking-widest py-2"
                >
                  Continue as Guest
                </button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Screen>
  );
};

const BenefitItem = ({ icon, text }: { icon: string; text: string }) => (
  <div className="flex items-start gap-3">
    <span className="text-lg leading-none">{icon}</span>
    <p className="text-xs text-[#6B7280] leading-relaxed">{text}</p>
  </div>
);

export default AuthGateScreen;
