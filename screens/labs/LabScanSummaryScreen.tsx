
import React, { useEffect, useState } from 'react';
import Screen from '../../components/Screen';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { generateLabsSummary, LabSummary } from '../../labs/geminiSummaryService';
import { ParsedCandidate } from '../../labs/reportParser';
import { useLabs } from '../../context/LabContext';

interface LabScanSummaryScreenProps {
  confirmedResults: ParsedCandidate[];
  onBack: () => void;
  onFinish: () => void;
}

const LabScanSummaryScreen: React.FC<LabScanSummaryScreenProps> = ({ confirmedResults, onBack, onFinish }) => {
  const { addLabResult } = useLabs();
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState<LabSummary | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      const data = await generateLabsSummary(confirmedResults as any);
      setSummaryData(data);
      setLoading(false);
    };
    fetchSummary();
  }, [confirmedResults]);

  const handleSave = () => {
    confirmedResults.forEach(res => {
      if (res.markerId === "unknown" || !res.value) return;
      addLabResult({
        markerId: res.markerId,
        markerName: res.markerName,
        category: res.category,
        value: res.value,
        unit: res.unit!,
        date: new Date().toISOString().split('T')[0],
        fasting: false,
      });
    });
    onFinish();
  };

  return (
    <Screen hideHeader title="Lab Intelligence">
      <div className="pt-4 pb-20">
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Edit
        </button>

        {loading ? (
          <div className="py-20 flex flex-col items-center text-center">
            <div className="w-12 h-12 border-4 border-[#8FAF9D]/20 border-t-[#8FAF9D] rounded-full animate-spin mb-6" />
            <h3 className="text-lg font-bold text-[#1F2937]">Synthesizing Insights...</h3>
            <p className="text-sm text-[#6B7280] mt-2 italic px-8">Identifying educational patterns across your markers.</p>
          </div>
        ) : summaryData ? (
          <div className="space-y-6 animate-in fade-in duration-700">
            <section>
               <div className="flex justify-between items-baseline mb-2">
                 <h3 className="text-2xl font-bold text-[#1F2937]">Cyra Summary</h3>
                 <span className="text-[9px] font-extrabold text-[#8FAF9D] uppercase tracking-widest px-2 py-0.5 rounded bg-[#8FAF9D]/10">Educational</span>
               </div>
               <Card className="bg-[#8FAF9D]/5 border-none p-6">
                 <p className="text-sm text-[#4A5D4E] leading-relaxed font-medium">
                   {summaryData.summary}
                 </p>
               </Card>
            </section>

            <section>
              <h4 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest mb-4 px-1">Patterns to Note</h4>
              <div className="space-y-3">
                {(summaryData.highlights || []).map((h, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-50">
                    <span className="text-lg">✨</span>
                    <p className="text-xs text-[#1F2937] font-medium leading-relaxed italic">"{h}"</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
               <Card className="bg-[#DDEEF4]/40 border-none p-5 flex flex-col gap-3 group active:scale-[0.99] transition-all">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📊</span>
                    <h4 className="text-sm font-bold text-[#1F2937]">Symptoms Correlation</h4>
                  </div>
                  <p className="text-xs text-[#2D3436] leading-relaxed font-medium">
                    Cyra Premium: See how this marker may correlate with your logged symptoms over the last 90 days →
                  </p>
               </Card>
            </section>

            <section>
              <h4 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest mb-4 px-1">Gentle Next Steps</h4>
              <div className="bg-[#DDEEF4]/20 p-5 rounded-2xl border border-[#DDEEF4]/40">
                <ul className="space-y-3">
                   {(summaryData.gentleNextSteps || []).map((step, i) => (
                     <li key={i} className="text-xs text-[#2D3436] flex items-center gap-3">
                       <span className="w-1.5 h-1.5 rounded-full bg-[#8FAF9D] flex-shrink-0" /> 
                       <span className="leading-tight">{step}</span>
                     </li>
                   ))}
                </ul>
              </div>
            </section>

            <section>
              <h4 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest mb-4 px-1">Clinic Discussion Guide</h4>
              <div className="space-y-2">
                {(summaryData.questionsForClinician || []).map((q, i) => (
                  <div key={i} className="p-3 bg-white rounded-lg border border-gray-100 flex gap-3 italic">
                    <span className="text-gray-300 font-bold text-xs">{i+1}</span>
                    <p className="text-[11px] text-[#6B7280]">{q}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="p-6 bg-red-50/40 border border-red-100 rounded-2xl">
               <p className="text-[10px] text-red-700/60 leading-relaxed text-center font-medium">
                 {summaryData.disclaimer} Educational interpretation only. Not a medical diagnosis. Cyra analysis should never replace the advice of your qualified healthcare provider.
               </p>
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <Button label="Log confirmed results" onPress={handleSave} className="w-full shadow-lg h-14" />
              <button 
                onClick={onBack}
                className="w-full text-center text-[10px] font-bold text-[#6B7280] uppercase tracking-widest py-2"
              >
                Back to Edit
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </Screen>
  );
};

export default LabScanSummaryScreen;
