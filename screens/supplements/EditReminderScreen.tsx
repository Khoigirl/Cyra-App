
import React, { useState } from 'react';
import Screen from '../../components/Screen';
import Button from '../../components/Button';
import Chip from '../../components/Chip';
import { useSupplements } from '../../context/SupplementContext';
import { SupplementReminder } from '../../supplementTypes';

interface EditReminderScreenProps {
  onBack: () => void;
  reminderId?: string;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const EditReminderScreen: React.FC<EditReminderScreenProps> = ({ onBack, reminderId }) => {
  const { reminders, supplements, addReminder, updateReminder, deleteReminder } = useSupplements();
  const editingRem = reminderId ? reminders.find(r => r.id === reminderId) : null;

  const [supplementId, setSupplementId] = useState(editingRem?.supplementId || supplements[0]?.id || '');
  const [selectedDays, setSelectedDays] = useState<number[]>(editingRem?.daysOfWeek || [1,2,3,4,5]);
  const [timeStr, setTimeStr] = useState(editingRem ? `${String(editingRem.times[0]?.hour).padStart(2, '0')}:${String(editingRem.times[0]?.minute).padStart(2, '0')}` : '09:00');

  const toggleDay = (day: number) => {
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const handleSave = () => {
    if (!supplementId) return;
    const [h, m] = timeStr.split(':').map(Number);
    
    const payload = {
      supplementId,
      daysOfWeek: selectedDays,
      times: [{ hour: h, minute: m }],
      enabled: true
    };

    if (reminderId) {
      updateReminder(reminderId, payload);
    } else {
      addReminder(payload);
    }
    onBack();
  };

  return (
    <Screen hideHeader title="Notification">
      <div className="pt-4 pb-12">
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Cancel
        </button>

        <h2 className="text-2xl font-bold text-[#1F2937] mb-8">{reminderId ? "Refine Nudge" : "Set Nudge"}</h2>

        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest pl-1">For which supplement?</label>
            <div className="grid grid-cols-2 gap-2">
              {supplements.filter(s => s.isActive).map(s => (
                <button 
                  key={s.id} 
                  onClick={() => setSupplementId(s.id)}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    supplementId === s.id ? 'bg-[#8FAF9D] text-white border-[#8FAF9D] shadow-md' : 'bg-white text-gray-500 border-gray-100'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest pl-1">What time?</label>
            <input 
              type="time"
              value={timeStr}
              onChange={(e) => setTimeStr(e.target.value)}
              className="w-full h-16 bg-white border border-[#E5E7EB] rounded-[22px] px-6 text-2xl font-bold text-[#1F2937] outline-none focus:border-[#8FAF9D] text-center"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest pl-1">Which days?</label>
            <div className="flex justify-between">
              {DAYS.map((d, i) => (
                <button 
                  key={d} 
                  onClick={() => toggleDay(i)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    selectedDays.includes(i) ? 'bg-[#8FAF9D] text-white shadow-sm' : 'bg-white text-gray-400 border border-gray-50'
                  }`}
                >
                  {d[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 space-y-3">
            <Button label="Save Reminder" onPress={handleSave} className="w-full" />
            {reminderId && (
              <Button 
                label="Delete Reminder" 
                variant="tertiary" 
                onPress={() => { deleteReminder(reminderId); onBack(); }} 
                className="w-full text-red-400" 
              />
            )}
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default EditReminderScreen;
