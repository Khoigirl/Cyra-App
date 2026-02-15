
import React, { useState } from 'react';
import Screen from '../../components/Screen';
import Button from '../../components/Button';
import Dropdown from '../../components/Dropdown';
import { useLabs } from '../../context/LabContext';
import { LabCategory, Unit } from '../../labs/types';

interface AddCustomMarkerScreenProps {
  onBack: () => void;
}

const CATEGORIES: LabCategory[] = ["Metabolic", "Hormones", "Lipids", "Thyroid", "Vitamins", "Inflammation", "Other"];
const UNITS: Unit[] = ["mg/dL", "mmol/L", "µIU/mL", "mIU/L", "ng/dL", "pg/mL", "nmol/L", "pmol/L", "IU/L", "ng/mL", "µg/dL", "%"];

const AddCustomMarkerScreen: React.FC<AddCustomMarkerScreenProps> = ({ onBack }) => {
  const { addCustomMarker } = useLabs();
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState<LabCategory>("Other");
  const [unit, setUnit] = useState<Unit>("mg/dL");
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!name.trim()) return;
    
    addCustomMarker({
      id: `custom_${Date.now()}`,
      name: name.trim(),
      category,
      defaultUnit: unit,
      description: description || `User-created custom marker in ${category}`,
      whyItMatters: "Tracked for personal health trends.",
    });
    onBack();
  };

  return (
    <Screen hideHeader title="New Marker">
      <div className="pt-4 pb-12">
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Cancel
        </button>

        <h2 className="text-2xl font-bold text-[#1F2937] mb-8">Custom Marker</h2>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest pl-1">Marker Name</label>
            <input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ferritin"
              className="w-full h-14 bg-white border border-[#E5E7EB] rounded-[18px] px-5 text-sm outline-none focus:border-[#8FAF9D]"
            />
          </div>

          <Dropdown 
            label="Category"
            options={CATEGORIES}
            value={category}
            onSelect={(val) => setCategory(val as LabCategory)}
          />

          <Dropdown 
            label="Measurement Unit"
            options={UNITS}
            value={unit}
            onSelect={(val) => setUnit(val as Unit)}
          />

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest pl-1">Brief Description (Optional)</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this marker used for?"
              className="w-full h-24 bg-white border border-[#E5E7EB] rounded-[18px] p-4 text-sm outline-none focus:border-[#8FAF9D] resize-none"
            />
          </div>

          <Button 
            label="Create Marker" 
            onPress={handleSave} 
            className={`w-full mt-4 ${!name.trim() ? 'opacity-50 pointer-events-none' : ''}`} 
          />
        </div>
      </div>
    </Screen>
  );
};

export default AddCustomMarkerScreen;
