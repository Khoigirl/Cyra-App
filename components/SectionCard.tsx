
import React from 'react';
import Card from './Card';

interface SectionCardProps {
  title: string;
  icon: string;
  onAdd: () => void;
  children: React.ReactNode;
  emptyStateText: string;
  isEmpty?: boolean;
}

const SectionCard: React.FC<SectionCardProps> = ({ 
  title, 
  icon, 
  onAdd, 
  children, 
  emptyStateText, 
  isEmpty = false 
}) => {
  return (
    <Card className="mb-4 border-none shadow-sm overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <h3 className="text-sm font-bold text-[#1F2937] uppercase tracking-widest">{title}</h3>
        </div>
        <button 
          onClick={onAdd}
          className="w-8 h-8 rounded-full bg-[#8FAF9D]/10 flex items-center justify-center text-[#8FAF9D] transition-transform active:scale-90"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      {isEmpty ? (
        <div className="py-4 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-[#F7F4F1] flex items-center justify-center mb-2 opacity-50">
            <span className="text-xl">⚪</span>
          </div>
          <p className="text-xs text-[#6B7280] font-medium italic">{emptyStateText}</p>
        </div>
      ) : (
        <div className="animate-in fade-in duration-500">
          {children}
        </div>
      )}
    </Card>
  );
};

export default SectionCard;
