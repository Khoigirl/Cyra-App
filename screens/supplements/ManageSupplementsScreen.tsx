
import React from 'react';
import Screen from '../../components/Screen';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useSupplements } from '../../context/SupplementContext';

interface ManageSupplementsScreenProps {
  onBack: () => void;
  onAdd: () => void;
  onEdit: (id: string) => void;
}

const ManageSupplementsScreen: React.FC<ManageSupplementsScreenProps> = ({ onBack, onAdd, onEdit }) => {
  const { supplements, toggleSupplementActive } = useSupplements();

  return (
    <Screen hideHeader title="Manage">
      <div className="pt-4 pb-12">
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Tracking
        </button>

        <h2 className="text-2xl font-bold text-[#1F2937] mb-2">Supplement Library</h2>
        <p className="text-sm text-[#6B7280] mb-8">Customize your list of herbal support and vitamins.</p>

        <div className="space-y-3 mb-8">
          {supplements.map(sup => (
            <div key={sup.id} className="flex items-center gap-3">
              <button 
                onClick={() => onEdit(sup.id)}
                className={`flex-1 flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm ${!sup.isActive ? 'opacity-50 grayscale' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-lg">
                    {sup.form === 'tea' ? '🍵' : '💊'}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#1F2937]">{sup.name}</h4>
                    <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-tighter">{sup.defaultDoseText || 'No dose set'}</p>
                  </div>
                </div>
                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <button 
                onClick={() => toggleSupplementActive(sup.id)}
                className={`w-12 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                  sup.isActive ? 'bg-[#8FAF9D]/10 text-[#8FAF9D]' : 'bg-gray-100 text-gray-400'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <Button label="Add Custom Supplement" onPress={onAdd} className="w-full" />
      </div>
    </Screen>
  );
};

export default ManageSupplementsScreen;
