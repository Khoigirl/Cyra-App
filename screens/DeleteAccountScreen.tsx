
import React, { useState } from 'react';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Button from '../components/Button';

interface DeleteAccountScreenProps {
  onBack: () => void;
  onConfirmDelete: () => void;
}

const DeleteAccountScreen: React.FC<DeleteAccountScreenProps> = ({ onBack, onConfirmDelete }) => {
  const [confirmText, setConfirmText] = useState('');
  const [step, setStep] = useState<'info' | 'confirm'>('info');

  const handleDelete = () => {
    if (confirmText.toLowerCase() === 'delete') {
      onConfirmDelete();
    }
  };

  return (
    <Screen hideHeader title="Manage Account">
      <div className="pt-4 pb-20">
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest mb-8 px-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <h2 className="text-2xl font-bold text-[#1F2937] mb-6 px-1">Data & Privacy</h2>

        <section className="mb-8">
           <h3 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest mb-4 px-1">Your Export</h3>
           <Card className="bg-white border-gray-100 p-6 flex justify-between items-center opacity-60">
              <div>
                 <p className="text-sm font-bold text-[#1F2937]">Download Data</p>
                 <p className="text-xs text-[#6B7280]">Export your history in JSON format.</p>
              </div>
              <span className="text-[9px] font-bold text-[#8FAF9D] uppercase tracking-widest bg-[#8FAF9D]/10 px-2 py-0.5 rounded">Coming Soon</span>
           </Card>
        </section>

        {step === 'info' ? (
          <section>
            <h3 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest mb-4 px-1 text-red-400">Danger Zone</h3>
            <Card className="bg-white border-red-50 p-6 shadow-sm border">
               <h4 className="text-base font-bold text-[#1F2937] mb-2">Delete My Profile</h4>
               <p className="text-xs text-[#6B7280] leading-relaxed mb-6">
                 Deleting your account will permanently remove all logs, preferences, and personal insights. This action cannot be undone.
               </p>
               <Button 
                label="Request Deletion" 
                onPress={() => setStep('confirm')} 
                variant="tertiary" 
                className="!text-red-400 p-0 h-auto" 
               />
            </Card>
          </section>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2">
            <h3 className="text-[11px] font-bold text-red-500 uppercase tracking-widest mb-4 px-1">Are you sure?</h3>
            <Card className="bg-white border-red-200 p-6 shadow-md border">
               <p className="text-sm text-[#1F2937] font-medium mb-4">Please type <span className="font-bold">DELETE</span> to confirm permanent account removal.</p>
               <input 
                 value={confirmText}
                 onChange={(e) => setConfirmText(e.target.value)}
                 placeholder="Type here..."
                 className="w-full h-12 bg-red-50 border border-red-100 rounded-xl px-4 text-center text-sm font-bold text-red-500 mb-6 outline-none"
                 autoFocus
               />
               <div className="flex flex-col gap-3">
                 <Button 
                  label="Permanently Delete All Data" 
                  onPress={handleDelete} 
                  className={`w-full !bg-red-500 ${confirmText.toLowerCase() !== 'delete' ? 'opacity-40 pointer-events-none' : ''}`}
                 />
                 <button onClick={() => setStep('info')} className="text-xs font-bold text-gray-400 uppercase tracking-widest py-2">Cancel</button>
               </div>
            </Card>
          </div>
        )}
      </div>
    </Screen>
  );
};

export default DeleteAccountScreen;
