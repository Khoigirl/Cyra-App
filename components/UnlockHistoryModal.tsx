
import React from 'react';
import Button from './Button';

interface UnlockHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: () => void;
}

const UnlockHistoryModal: React.FC<UnlockHistoryModalProps> = ({ isOpen, onClose, onAuthenticate }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 animate-in fade-in duration-300">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="w-full max-w-md bg-white rounded-t-[28px] p-8 pb-12 shadow-2xl animate-in slide-in-from-bottom-full duration-300 relative z-[101]">
        <div className="w-12 h-1.5 bg-[#E5E7EB] rounded-full mx-auto mb-8" />
        
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#8FAF9D]/10 flex items-center justify-center text-3xl mb-6">
            🔒
          </div>
          
          <h3 className="text-xl font-bold text-[#1F2937] mb-3">Unlock your full history</h3>
          <p className="text-sm text-[#6B7280] leading-relaxed mb-8 px-4">
            Create an account to access your full calendar history, secure backups, and personalized health trends.
          </p>

          <div className="w-full space-y-3">
            <Button 
              label="Create account" 
              onPress={onAuthenticate} 
              className="w-full"
            />
            <Button 
              label="Sign in" 
              variant="secondary" 
              onPress={onAuthenticate} 
              className="w-full"
            />
            <button 
              onClick={onClose}
              className="w-full text-xs font-bold text-[#6B7280] uppercase tracking-widest py-3"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnlockHistoryModal;
