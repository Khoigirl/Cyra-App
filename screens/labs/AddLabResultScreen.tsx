
import React, { useState } from 'react';
import Screen from '../../components/Screen';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Dropdown from '../../components/Dropdown';
import Toggle from '../../components/Toggle';
import { useLabs } from '../../context/LabContext';
import { LabMarkerDefinition, LabResult, Unit } from '../../labs/types';

interface AddLabResultScreenProps {
  onBack: () => void;
  preselectedMarkerId?: string;
}

const AddLabResultScreen: React.FC<AddLabResultScreenProps> = ({ onBack, preselectedMarkerId }) => {
  const { markers, addLabResult } = useLabs();
  
  const [selectedMarker, setSelectedMarker] = useState<LabMarkerDefinition | null>(
    preselectedMarkerId ? markers.find(m => m.id === preselectedMarkerId) || null : null
  );
  const [searchValue, setSearchValue] = useState('');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState<Unit | string>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [fasting, setFasting] = useState(false);
  const [notes, setNotes] = useState('');
  const [labName, setLabName] = useState('');

  const filteredMarkers = markers.filter(m => 
    m.name.toLowerCase().includes(searchValue.toLowerCase()) || 
    m.category.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSelectMarker = (m: LabMarkerDefinition) => {
    setSelectedMarker(m);
    setUnit(m.defaultUnit);
    setSearchValue('');
  };

  const handleSave = () => {
    if (!selectedMarker || !value || !date) return;
    
    addLabResult({
      markerId: selectedMarker.id,
      markerName: selectedMarker.name,
      category: selectedMarker.category,
      value: parseFloat(value),
      unit: unit as Unit,
      date,
      fasting,
      notes,
      labName
    });
    onBack();
  };

  const isFormValid = selectedMarker && value && date && unit;

  return (
    <Screen hideHeader title="New Result">
      <div className="pt-4 pb-12">
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Cancel
        </button>

        <h2 className="text-2xl font-bold text-[#1F2937] mb-8">Record Result</h2>

        <div className="space-y-6">
          {!selectedMarker ? (
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest pl-1">Choose Marker</label>
              <div className="relative">
                <input 
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search e.g. Testosterone, Glucose..."
                  className="w-full h-14 bg-white border border-[#E5E7EB] rounded-[18px] px-5 text-sm outline-none focus:border-[#8FAF9D]"
                />
                {searchValue && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto">
                    {filteredMarkers.map(m => (
                      <button 
                        key={m.id} 
                        onClick={() => handleSelectMarker(m)}
                        className="w-full text-left p-4 hover:bg-[#F7F4F1] border-b border-gray-50 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-bold text-[#1F2937]">{m.name}</p>
                          <p className="text-[10px] text-[#6B7280] uppercase tracking-widest">{m.category}</p>
                        </div>
                        <svg className="w-4 h-4 text-[#8FAF9D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Card className="p-4 bg-[#8FAF9D]/5 border-none flex justify-between items-center">
              <div>
                <h4 className="text-sm font-bold text-[#1F2937]">{selectedMarker.name}</h4>
                <p className="text-[10px] text-[#8FAF9D] font-bold uppercase tracking-widest">{selectedMarker.category}</p>
              </div>
              <button onClick={() => setSelectedMarker(null)} className="text-[10px] font-bold text-[#6B7280] uppercase underline">Change</button>
            </Card>
          )}

          {selectedMarker && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex gap-3">
                <div className="flex-[2] space-y-2">
                  <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest pl-1">Value</label>
                  <input 
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="0.0"
                    className="w-full h-14 bg-white border border-[#E5E7EB] rounded-[18px] px-5 text-sm outline-none focus:border-[#8FAF9D]"
                  />
                </div>
                <div className="flex-1 space-y-2">
                   <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest pl-1">Unit</label>
                   <input 
                    value={unit}
                    readOnly
                    className="w-full h-14 bg-[#F7F4F1] border border-transparent rounded-[18px] px-4 text-xs font-bold text-[#6B7280]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest pl-1">Date of Test</label>
                <input 
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-14 bg-white border border-[#E5E7EB] rounded-[18px] px-5 text-sm outline-none focus:border-[#8FAF9D]"
                />
              </div>

              {selectedMarker.category === 'Metabolic' && (
                <Card className="p-3 border-none bg-white shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold text-[#1F2937]">Fasting Test</span>
                    <p className="text-[10px] text-[#6B7280] italic">Tested before eating in morning</p>
                  </div>
                  <Toggle isEnabled={fasting} onToggle={setFasting} label="" />
                </Card>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest pl-1">Lab / Provider (Optional)</label>
                <input 
                  value={labName}
                  onChange={(e) => setLabName(e.target.value)}
                  placeholder="e.g. Quest, City Lab"
                  className="w-full h-14 bg-white border border-[#E5E7EB] rounded-[18px] px-5 text-sm outline-none focus:border-[#8FAF9D]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest pl-1">Notes</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any context e.g. 'Cycle Day 3'"
                  className="w-full h-24 bg-white border border-[#E5E7EB] rounded-[18px] p-4 text-sm outline-none focus:border-[#8FAF9D] resize-none"
                />
              </div>

              <Button 
                label="Save Result" 
                onPress={handleSave} 
                className={`w-full mt-4 ${!isFormValid ? 'opacity-50 pointer-events-none' : ''}`} 
              />
            </div>
          )}
        </div>
      </div>
    </Screen>
  );
};

export default AddLabResultScreen;
