
import React from 'react';
import Screen from '../../components/Screen';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useSupplements } from '../../context/SupplementContext';

interface SupplementRemindersScreenProps {
  onBack: () => void;
  onAdd: () => void;
  onEdit: (id: string) => void;
}

const SupplementRemindersScreen: React.FC<SupplementRemindersScreenProps> = ({ onBack, onAdd, onEdit }) => {
  const { reminders, supplements, updateReminder } = useSupplements();

  return (
    <Screen hideHeader title="Reminders">
      <div className="pt-4 pb-12">
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <h2 className="text-2xl font-bold text-[#1F2937] mb-2">Gentle Nudges</h2>
        <p className="text-sm text-[#6B7280] mb-8">We'll help you remember your nourishing habits.</p>

        <div className="space-y-3 mb-8">
          {reminders.length > 0 ? (
            reminders.map(rem => {
              const sup = supplements.find(s => s.id === rem.supplementId);
              if (!sup) return null;
              return (
                <div key={rem.id} className="flex items-center gap-3">
                  <button 
                    onClick={() => onEdit(rem.id)}
                    className="flex-1 flex items-center justify-between p-5 bg-white rounded-[22px] border border-gray-100 shadow-sm"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-[#1F2937]">{sup.name}</h4>
                      <p className="text-xs text-[#6B7280] mt-1">
                        {(rem.times || []).map(t => `${String(t.hour).padStart(2, '0')}:${String(t.minute).padStart(2, '0')}`).join(', ')}
                      </p>
                      <div className="flex gap-1 mt-2">
                        {(rem.daysOfWeek || []).map(d => (
                          <span key={d} className="text-[8px] font-bold text-[#8FAF9D] uppercase">
                            {['S','M','T','W','T','F','S'][d]}
                          </span>
                        ))}
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>

                  <button 
                    onClick={() => updateReminder(rem.id, { enabled: !rem.enabled })}
                    className={`w-12 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                      rem.enabled ? 'bg-[#8FAF9D] text-white shadow-md' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </button>
                </div>
              );
            })
          ) : (
            <div className="py-12 bg-white rounded-3xl border border-dashed border-gray-200 text-center">
              <p className="text-sm text-[#6B7280] italic">No reminders set yet.</p>
            </div>
          )}
        </div>

        <Button label="Set New Reminder" onPress={onAdd} className="w-full" />
      </div>
    </Screen>
  );
};

export default SupplementRemindersScreen;
