
import React, { useState } from 'react';
import Screen from '../../components/Screen';
import Button from '../../components/Button';
import Chip from '../../components/Chip';
import { Supplement, SupplementForm, ColorKey } from '../../supplementTypes';
import { useSupplements } from '../../context/SupplementContext';

interface AddEditSupplementScreenProps {
  onBack: () => void;
  supplementId?: string;
}

const FORMS: SupplementForm[] = ['capsule', 'powder', 'tea', 'liquid', 'other'];
const COLORS: ColorKey[] = ['sage', 'rose', 'lavender', 'blue', 'neutral'];

const AddEditSupplementScreen: React.FC<AddEditSupplementScreenProps> = ({ onBack, supplementId }) => {
  const { supplements, addSupplement, updateSupplement } = useSupplements();
  const editingSup = supplementId ? supplements.find(s => s.id === supplementId) : null;

  const [name, setName] = useState(editingSup?.name || '');
  const [form, setForm] = useState<SupplementForm>(editingSup?.form || 'capsule');
  const [dose, setDose] = useState(editingSup?.defaultDoseText || '');
  const [notes, setNotes] = useState(editingSup?.notes || '');
  const [colorKey, setColorKey] = useState<ColorKey>(editingSup?.colorKey || 'sage');

  const handleSave = () => {
    if (!name.trim()) return;

    const payload = {
      name: name.trim(),
      form,
      defaultDoseText: dose.trim(),
      notes: notes.trim(),
      colorKey,
      isActive: true
    };

    if (supplementId) {
      updateSupplement(supplementId, payload);
    } else {
      addSupplement(payload);
    }
    onBack();
  };

  return (
    <Screen hideHeader title={supplementId ? "Edit" : "New Support"}>
      <div className="pt-4 pb-12">
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Cancel
        </button>

        <h2 className="text-2xl font-bold text-[#1F2937] mb-8">{supplementId ? "Refine Support" : "Add New Support"}</h2>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest pl-1">Name</label>
            <input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Inositol"
              className="w-full h-14 bg-white border border-[#E5E7EB] rounded-[18px] px-5 text-sm outline-none focus:border-[#8FAF9D]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest pl-1">Form</label>
            <div className="flex flex-wrap gap-2">
              {FORMS.map(f => (
                <Chip key={f} label={f} selected={form === f} onPress={() => setForm(f)} />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest pl-1">Default Dose</label>
            <input 
              value={dose}
              onChange={(e) => setDose(e.target.value)}
              placeholder="e.g. 2g or 1 capsule"
              className="w-full h-14 bg-white border border-[#E5E7EB] rounded-[18px] px-5 text-sm outline-none focus:border-[#8FAF9D]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest pl-1">Accent Color</label>
            <div className="flex gap-4 px-2">
              {COLORS.map(c => (
                <button 
                  key={c} 
                  onClick={() => setColorKey(c)}
                  className={`w-8 h-8 rounded-full border-2 ${colorKey === c ? 'border-[#8FAF9D]' : 'border-transparent'}`}
                  style={{ backgroundColor: c === 'sage' ? '#8FAF9D' : c === 'rose' ? '#FADADD' : c === 'lavender' ? '#E1D5E7' : c === 'blue' ? '#DDEEF4' : '#F7F4F1' }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest pl-1">Notes</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Best taken with food..."
              className="w-full h-32 bg-white border border-[#E5E7EB] rounded-[18px] p-5 text-sm outline-none focus:border-[#8FAF9D] resize-none"
            />
          </div>

          <div className="pt-4">
            <Button label="Save Changes" onPress={handleSave} className="w-full" />
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default AddEditSupplementScreen;
