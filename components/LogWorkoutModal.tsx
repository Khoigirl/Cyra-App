
import React, { useState } from 'react';
import Button from './Button';
import Chip from './Chip';

interface LogWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workout: { type: string; duration: string; intensity: string; notes: string }) => void;
}

const WORKOUT_TYPES = ['Walk', 'Strength', 'Yoga', 'Cardio', 'HIIT'];
const INTENSITY_LEVELS = ['Light', 'Moderate', 'Hard'];

const LogWorkoutModal: React.FC<LogWorkoutModalProps> = ({ isOpen, onClose, onSave }) => {
  const [type, setType] = useState('Walk');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState('Moderate');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!duration) return;
    onSave({ type, duration, intensity, notes });
    setType('Walk');
    setDuration('');
    setIntensity('Moderate');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 animate-in fade-in duration-300">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="w-full max-w-md bg-white rounded-t-[28px] p-8 pb-12 shadow-2xl animate-in slide-in-from-bottom-full duration-300 relative z-50 overflow-y-auto max-h-[90vh] hide-scrollbar">
        <div className="w-12 h-1.5 bg-[#E5E7EB] rounded-full mx-auto mb-8" />
        
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-[#1F2937]">Log Workout</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#F7F4F1] flex items-center justify-center text-[#6B7280]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-3 block">Type</label>
            <div className="flex flex-wrap gap-2">
              {WORKOUT_TYPES.map(t => (
                <Chip key={t} label={t} selected={type === t} onPress={() => setType(t)} />
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-3 block">Duration (minutes)</label>
            <input 
              type="number" 
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 30"
              className="w-full bg-[#F7F4F1] border border-[#E5E7EB] rounded-[14px] px-5 py-3.5 text-sm outline-none focus:border-[#8FAF9D]"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-3 block">Intensity</label>
            <div className="flex flex-wrap gap-2">
              {INTENSITY_LEVELS.map(l => (
                <Chip key={l} label={l} selected={intensity === l} onPress={() => setIntensity(l)} />
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-3 block">Notes</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did it feel?"
              className="w-full bg-[#F7F4F1] border border-[#E5E7EB] rounded-[14px] px-5 py-3.5 text-sm outline-none focus:border-[#8FAF9D] h-24 resize-none"
            />
          </div>

          <Button label="Save Workout" onPress={handleSave} className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default LogWorkoutModal;
