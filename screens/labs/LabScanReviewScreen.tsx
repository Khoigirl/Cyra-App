
import React, { useState } from 'react';
import Screen from '../../components/Screen';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { ParsedCandidate } from '../../labs/reportParser';
import { useLabs } from '../../context/LabContext';

interface LabScanReviewScreenProps {
  candidates: ParsedCandidate[];
  onBack: () => void;
  onConfirm: (confirmed: ParsedCandidate[]) => void;
}

const LabScanReviewScreen: React.FC<LabScanReviewScreenProps> = ({ candidates: initialCandidates, onBack, onConfirm }) => {
  // Defensive check: ensure candidates is always an array
  const safeCandidates = initialCandidates || [];
  const [candidates, setCandidates] = useState<ParsedCandidate[]>(safeCandidates);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const { markers } = useLabs();

  const updateCandidate = (index: number, updates: Partial<ParsedCandidate>) => {
    const next = [...candidates];
    next[index] = { ...next[index], ...updates };
    setCandidates(next);
  };

  const removeCandidate = (index: number) => {
    setCandidates(candidates.filter((_, i) => i !== index));
  };

  const addEmptyRow = () => {
    setCandidates([...candidates, {
      markerId: "unknown",
      markerName: "Choose Marker",
      category: "Other",
      confidence: 1,
      needsReview: true,
      value: 0
    }]);
  };

  const isReadyToSummarize = candidates.length > 0 && candidates.every(c => c.markerId !== "unknown" && (c.value || 0) > 0);

  return (
    <Screen hideHeader title="Review Data">
      <div className="pt-4 pb-20">
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Cancel Scan
        </button>

        <div className="mb-8 px-1">
          <h2 className="text-2xl font-bold text-[#1F2937]">Verify Data</h2>
          <p className="text-sm text-[#6B7280] mt-1">Check that the extraction matches your paper report.</p>
        </div>

        <div className="bg-white rounded-[28px] border border-[#E5E7EB] overflow-hidden shadow-sm mb-6">
          <div className="grid grid-cols-12 gap-2 px-5 py-3 bg-[#F7F4F1] border-b border-[#E5E7EB]">
             <div className="col-span-7"><span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest">Marker & Category</span></div>
             <div className="col-span-3 text-center"><span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest">Value</span></div>
             <div className="col-span-2 text-right"><span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest">Action</span></div>
          </div>

          <div className="divide-y divide-[#F7F4F1]">
            {candidates.map((c, idx) => {
              const isUnmapped = c.markerId === "unknown";
              return (
                <div key={idx} className={`p-5 grid grid-cols-12 gap-2 items-center group transition-colors ${isUnmapped ? 'bg-amber-50/30' : 'bg-white'}`}>
                  <div className="col-span-7 min-w-0">
                    <select 
                      value={c.markerId}
                      onChange={(e) => {
                        const m = markers.find(mark => mark.id === e.target.value);
                        if (m) updateCandidate(idx, { markerId: m.id, markerName: m.name, category: m.category, unit: m.defaultUnit, needsReview: false });
                      }}
                      className={`w-full bg-transparent text-sm font-bold outline-none truncate pr-2 appearance-none ${isUnmapped ? 'text-amber-600' : 'text-[#1F2937]'}`}
                    >
                      <option value="unknown">Unknown Marker — Tap to Map</option>
                      {markers.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                    <p className={`text-[9px] font-bold uppercase tracking-tight mt-1 ${isUnmapped ? 'text-amber-500' : 'text-[#8FAF9D]'}`}>
                      {isUnmapped ? 'Needs Mapping' : c.category}
                    </p>
                  </div>
                  
                  <div className="col-span-3 flex flex-col items-center">
                    <div className="flex flex-col items-center gap-0.5">
                       <input 
                        type="number"
                        step="any"
                        value={c.value}
                        onChange={(e) => updateCandidate(idx, { value: parseFloat(e.target.value) || 0 })}
                        className="w-16 h-9 bg-[#F7F4F1] border-none rounded-xl text-center text-sm font-bold text-[#1F2937] outline-none focus:ring-2 focus:ring-[#8FAF9D]/20"
                      />
                      <span className="text-[8px] font-bold text-[#6B7280] uppercase tracking-tighter">{c.unit}</span>
                    </div>
                  </div>

                  <div className="col-span-2 text-right">
                    <button 
                      onClick={() => removeCandidate(idx)} 
                      className="p-2 text-red-200 hover:text-red-400 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button 
          onClick={addEmptyRow}
          className="w-full py-5 border-2 border-dashed border-[#E5E7EB] rounded-[24px] text-[11px] font-bold text-[#6B7280] uppercase tracking-widest mb-10 hover:bg-white active:scale-95 transition-all"
        >
          + Manually Add Marker
        </button>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#F7F4F1] via-[#F7F4F1] to-transparent pt-12 max-w-md mx-auto z-20">
          <Button 
            label={isReadyToSummarize ? "Confirm & Generate Summary" : "Complete Mapping to Continue"} 
            onPress={() => isReadyToSummarize && onConfirm(candidates)} 
            className={`w-full shadow-xl h-14 ${!isReadyToSummarize ? 'opacity-50 pointer-events-none' : ''}`}
          />
        </div>

        {showDisclaimer && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
            <Card className="max-w-xs animate-in zoom-in-95 duration-300 shadow-2xl p-8 text-center">
               <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">👁️</div>
               <h3 className="text-xl font-bold text-[#1F2937] mb-2">Final Verification</h3>
               <p className="text-sm text-[#6B7280] leading-relaxed mb-8">
                 OCR can sometimes miss decimals (e.g. 1.4 becomes 14). Please review the values against your report before proceeding.
               </p>
               <Button label="I've Double Checked" onPress={() => setShowDisclaimer(false)} className="w-full" />
            </Card>
          </div>
        )}
      </div>
    </Screen>
  );
};

export default LabScanReviewScreen;
