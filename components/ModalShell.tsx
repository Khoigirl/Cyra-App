
import React from 'react';
import Button from './Button';

interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
}

const ModalShell: React.FC<ModalShellProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 animate-in fade-in duration-300">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />
      <div className="w-full max-w-md bg-white rounded-t-[28px] p-8 pb-12 shadow-2xl animate-in slide-in-from-bottom-full duration-300 relative z-50">
        <div className="w-12 h-1.5 bg-[#E5E7EB] rounded-full mx-auto mb-8" />
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-[#1F2937]">{title}</h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F7F4F1] flex items-center justify-center text-[#6B7280]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="min-h-[200px] flex flex-col justify-center items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#F7F4F1] flex items-center justify-center text-3xl">
            🏗️
          </div>
          <div>
            <p className="text-[#1F2937] font-semibold">Under Construction</p>
            <p className="text-sm text-[#6B7280]">The logging feature for {title.toLowerCase()} is coming soon.</p>
          </div>
          {children}
        </div>
        <Button label="Close" onPress={onClose} className="w-full mt-8" />
      </div>
    </div>
  );
};

export default ModalShell;
