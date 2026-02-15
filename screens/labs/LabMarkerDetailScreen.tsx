
import React, { useMemo } from 'react';
import Screen from '../../components/Screen';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useLabs } from '../../context/LabContext';

interface LabMarkerDetailScreenProps {
  markerId: string;
  onBack: () => void;
  onAddResult: (markerId: string) => void;
}

const LabMarkerDetailScreen: React.FC<LabMarkerDetailScreenProps> = ({ markerId, onBack, onAddResult }) => {
  const { markers, results, deleteLabResult } = useLabs();
  const marker = markers.find(m => m.id === markerId);
  const markerResults = results
    .filter(r => r.markerId === markerId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const latestResult = markerResults[markerResults.length - 1];

  // Simple Visualisation Logic (Vertical Bars)
  const chartData = useMemo(() => {
    if (markerResults.length === 0) return [];
    const maxVal = Math.max(...markerResults.map(r => r.value)) * 1.2;
    return markerResults.slice(-5).map(r => ({
      ...r,
      height: (r.value / maxVal) * 100
    }));
  }, [markerResults]);

  if (!marker) return null;

  return (
    <Screen hideHeader title={marker.name}>
      <div className="pt-4 pb-20">
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#1F2937]">{marker.name}</h2>
            <span className="text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest">{marker.category}</span>
          </div>
        </div>

        <p className="text-sm text-[#6B7280] leading-relaxed mb-6 px-1 italic">
          {marker.description}
        </p>

        {/* CHART SECTION */}
        {markerResults.length > 0 ? (
          <Card className="p-6 border-none bg-white shadow-md mb-8">
            <h4 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest mb-8">Trend History</h4>
            <div className="h-40 flex items-end justify-around gap-2 mb-4 border-b border-[#F7F4F1]">
              {chartData.map(d => (
                <div key={d.id} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full max-w-[20px] bg-[#8FAF9D]/20 rounded-t-lg relative group transition-all"
                    style={{ height: `${d.height}%`, backgroundColor: '#8FAF9D' }}
                  >
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-[9px] px-1.5 py-0.5 rounded pointer-events-none">
                      {d.value}
                    </div>
                  </div>
                  <span className="text-[8px] text-gray-400 mt-2 rotate-45 origin-left whitespace-nowrap">
                    {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-1">Latest Insight</p>
              <p className="text-sm text-[#1F2937] font-medium leading-relaxed">
                {marker.whyItMatters}
              </p>
            </div>
          </Card>
        ) : (
          <Card className="p-8 text-center bg-white border border-dashed border-[#E5E7EB] mb-8">
             <span className="text-3xl block mb-2">📉</span>
             <p className="text-xs text-[#6B7280] italic">Add results to start visualizing your data over time.</p>
          </Card>
        )}

        {/* TIPS SECTION */}
        {marker.tips && (
          <section className="mb-8">
            <h3 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest mb-4 px-1">Support Tips</h3>
            <div className="space-y-3">
              {marker.tips.map((tip, i) => (
                <div key={i} className="bg-[#8FAF9D]/5 p-4 rounded-xl border border-[#8FAF9D]/10 flex gap-3 items-center">
                  <span className="text-lg">🌿</span>
                  <p className="text-xs font-medium text-[#4A5D4E]">{tip}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* HISTORY LIST */}
        <section className="mb-8">
          <h3 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest mb-4 px-1">All Records</h3>
          <div className="space-y-3">
            {markerResults.slice().reverse().map(res => (
              <div key={res.id} className="bg-white p-4 rounded-2xl border border-gray-50 flex justify-between items-center shadow-sm group">
                <div>
                  <p className="text-sm font-bold text-[#1F2937]">{res.value} {res.unit}</p>
                  <p className="text-[10px] text-[#6B7280] font-medium mt-0.5">{new Date(res.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  {res.fasting && <span className="text-[8px] font-extrabold text-[#8FAF9D] uppercase border border-[#8FAF9D] px-1 rounded mt-1 inline-block">Fasting</span>}
                </div>
                <button 
                  onClick={() => {
                    if (window.confirm('Delete this record?')) deleteLabResult(res.id);
                  }}
                  className="w-8 h-8 rounded-full bg-red-50 text-red-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </section>

        <Button label="Log New Result" onPress={() => onAddResult(markerId)} className="w-full" />
      </div>
    </Screen>
  );
};

export default LabMarkerDetailScreen;
