
import React, { useState } from 'react';
import Screen from '../../components/Screen';
import Button from '../../components/Button';
import { AuthStatus } from '../../types';
import { useWellness } from '../../context/WellnessContext';

interface EmailAuthScreenProps {
  onSuccess: () => void;
  onBack: () => void;
}

const EmailAuthScreen: React.FC<EmailAuthScreenProps> = ({ onSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const { setAuthStatus } = useWellness();

  const isEmailValid = email.includes('@') && email.includes('.');

  const handleSuccess = () => {
    setAuthStatus(AuthStatus.Authenticated);
    onSuccess();
  };

  return (
    <Screen hideHeader scrollable={false}>
      <div className="flex flex-col h-full pt-20 pb-12 px-2">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#1F2937] mb-8"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex-1">
          <h2 className="text-3xl font-bold text-[#1F2937] mb-3">What's your email?</h2>
          <p className="text-[#6B7280] text-sm leading-relaxed mb-8">
            We'll send you a secure magic link to sign in or create your account instantly.
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest pl-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full h-[54px] bg-white border border-[#E5E7EB] rounded-[16px] px-5 text-[#1F2937] outline-none focus:border-[#8FAF9D] transition-all placeholder-[#6B7280]/40"
                autoFocus
              />
            </div>
            
            <p className="text-[11px] text-[#6B7280] pl-1">
              No password needed. We'll send a sign-in link to your inbox.
            </p>
          </div>
        </div>

        <div className="pt-6">
          <Button 
            label="Continue" 
            onPress={handleSuccess} 
            className={`w-full shadow-lg ${!isEmailValid ? 'opacity-50 pointer-events-none' : ''}`}
          />
        </div>
      </div>
    </Screen>
  );
};

export default EmailAuthScreen;
