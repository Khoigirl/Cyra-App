
import React, { useMemo } from 'react';
import Screen from '../../components/Screen';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useLabs } from '../../context/LabContext';

interface LabsScreenProps {
  onBack: () => void;
  onAddResult: () => void;
  onDetail: (markerId: string) => void;
  onAddCustom: () => void;
  onScan: () => void;
}

const LabsScreen: React.FC<LabsScreenProps> = ({ onBack, onAddResult, onDetail, onAddCustom, onScan }) => {
  const { results, getTrendByMarker } = useLabs();

  // Test Timeline: Sort results chronologically (newest first)
  const timelineResults = useMemo(() => {
    return [...results].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [results]);

  return (
    <Screen hideHeader title="Lab Intelligence">
      <div className="pt-4 pb-20">
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest mb-6 px-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Profile
        </button>

        <div className="flex justify-between items-end mb-8 px-1">
          <div>
            <h2 className="text-2xl font-bold text-[#1F2937]">Lab Results</h2>
            <p className="text-sm text-[#6B7280]">Track your clinical markers over time.</p>
          </div>
          <button 
            onClick={onAddResult}
            className="w-12 h-12 rounded-2xl bg-white border border-[#E5E7EB] text-[#8FAF9D] flex items-center justify-center shadow-sm active:scale-95 transition-transform"
            title="Manual Entry"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* AI SCAN CTA */}
        <section className="mb-10">
          <Card 
            onClick={onScan}
            className="p-6 border-none bg-gradient-to-br from-[#8FAF9D] to-[#6E9482] text-white shadow-xl shadow-[#8FAF9D]/20 relative overflow-hidden active:scale-[0.98] transition-all"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl">
                  📄
                </div>
                <div>
                  <h4 className="font-bold text-lg leading-tight">Scan Lab Report</h4>
                  <p className="text-white/80 text-xs mt-0.5 uppercase tracking-widest font-bold">AI Digitizer</p>
                </div>
              </div>
              <p className="text-sm text-white/90 leading-relaxed font-medium">
                Snap a photo of your results to automatically extract values and generate an educational summary.
              </p>
              <div className="mt-6 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest bg-black/10 self-start px-3 py-1.5 rounded-lg w-fit">
                <span>Start Extraction</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10" />
          </Card>
        </section>

        <section className="mb-8 px-1">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">Test Timeline</h3>
            <span className="text-[9px] font-bold text-gray-400 uppercase">{results.length} Records</span>
          </div>
          
          {timelineResults.length > 0 ? (
            <div className="space-y-3">
              {timelineResults.map(res => {
                const trend = getTrendByMarker(res.markerId);
                return (
                  <Card 
                    key={res.id} 
                    onClick={() => onDetail(res.markerId)}
                    className="p-4 flex items-center justify-between group active:bg-gray-50 border-gray-100 shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#F7F4F1] flex items-center justify-center text-lg">
                        {res.category === 'Hormones' ? '🧬' : '🧪'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#1F2937]">{res.markerName}</p>
                        <p className="text-[10px] text-[#6B7280] font-medium mt-0.5">
                          {new Date(res.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="text-sm font-bold text-[#1F2937]">{res.value} <span className="text-[10px] text-[#6B7280] font-medium">{res.unit}</span></p>
                        {trend !== 'none' && (
                          <span className={`text-[8px] font-bold uppercase tracking-tighter ${trend === 'up' ? 'text-red-400' : trend === 'down' ? 'text-green-400' : 'text-gray-300'}`}>
                            {trend === 'up' ? '▲ trend' : trend === 'down' ? '▼ trend' : 'stable'}
                          </span>
                        )}
                      </div>
                      <svg className="w-4 h-4 text-gray-200 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="py-12 bg-white rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center px-8">
               <span className="text-3xl mb-3 opacity-30">📉</span>
               <p className="text-sm text-[#6B7280] italic leading-relaxed">
                 Your lab history is currently empty. Scan a report or add a result manually to begin.
               </p>
               <Button label="Enter Manually" variant="secondary" onPress={onAddResult} className="mt-6 w-full" />
            </div>
          )}
        </section>

        <div className="mt-12 space-y-4">
          <Button label="New Custom Marker" variant="tertiary" onPress={onAddCustom} className="w-full text-xs font-bold uppercase tracking-widest" />
          
          <div className="p-6 bg-[#DDEEF4]/20 rounded-2xl border border-[#DDEEF4]/40">
            <p className="text-[10px] text-[#2D3436]/60 leading-relaxed text-center font-medium italic">
              Lab tracking is for educational use only. Cyra identifies historical trends to help you prepare for clinical discussions. Discuss all results with your doctor.
            </p>
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default LabsScreen;
