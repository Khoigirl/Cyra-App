
import React from 'react';
import Screen from '../components/Screen';
import Card from '../components/Card';
import { useLearn } from '../context/LearnContext';
import { LEARN_ITEMS } from '../learn/data';

interface LearningProgressScreenProps {
  onBack: () => void;
  onOpenItem: (id: string) => void;
}

const LearningProgressScreen: React.FC<LearningProgressScreenProps> = ({ onBack, onOpenItem }) => {
  const { activeProgram, readItemIds, savedItemIds, programHistory } = useLearn();

  const recentlyRead = readItemIds.slice(0, 5).map(id => LEARN_ITEMS.find(i => i.id === id)).filter(Boolean);
  const topSaved = savedItemIds.slice(0, 5).map(id => LEARN_ITEMS.find(i => i.id === id)).filter(Boolean);

  return (
    <Screen hideHeader title="Your Progress" hasTabBar={true}>
      <div className="pt-4 pb-20">
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest mb-8">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Profile
        </button>

        <h2 className="text-2xl font-bold text-[#1F2937] mb-8">Learning Journey</h2>

        {/* Active Program */}
        {activeProgram && (
          <section className="mb-10">
            <h3 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest mb-4 px-1">Active Program</h3>
            {(() => {
               const p = LEARN_ITEMS.find(i => i.id === activeProgram.programId);
               if (!p) return null;
               const progress = (activeProgram.completedDays.length / activeProgram.totalDays) * 100;
               return (
                 <Card className="p-5 border-none shadow-sm bg-white" onClick={() => onOpenItem(p.id)}>
                   <div className="flex justify-between items-start mb-4">
                     <div className="w-10 h-10 rounded-xl bg-[#8FAF9D]/10 flex items-center justify-center text-lg">🎓</div>
                     <span className="text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest">In Progress</span>
                   </div>
                   <h4 className="text-lg font-bold text-[#1F2937] mb-1">{p.title}</h4>
                   <p className="text-xs text-[#6B7280] mb-4">Day {activeProgram.completedDays.length + 1} of {activeProgram.totalDays}</p>
                   
                   <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                     <div className="h-full bg-[#8FAF9D] transition-all duration-700" style={{ width: `${progress}%` }} />
                   </div>
                 </Card>
               );
            })()}
          </section>
        )}

        {/* Recent History */}
        <section className="mb-10">
           <h3 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest mb-4 px-1">Recently Read</h3>
           <div className="space-y-3">
             {recentlyRead.length > 0 ? recentlyRead.map(item => item && (
               <Card key={item.id} className="p-4 border-gray-50 flex items-center gap-4 group" onClick={() => onOpenItem(item.id)}>
                 <div className="w-8 h-8 rounded-lg bg-[#F7F4F1] flex items-center justify-center text-sm opacity-60">📖</div>
                 <div className="flex-1">
                   <p className="text-sm font-bold text-[#1F2937] line-clamp-1">{item.title}</p>
                   <p className="text-[9px] text-[#6B7280] uppercase tracking-tighter">Completed</p>
                 </div>
                 <svg className="w-4 h-4 text-gray-200 group-hover:text-[#8FAF9D] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                 </svg>
               </Card>
             )) : (
               <p className="text-xs text-[#6B7280] italic px-1">No history yet.</p>
             )}
           </div>
        </section>

        {/* Saved List */}
        <section>
           <h3 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest mb-4 px-1">Your Library</h3>
           <div className="space-y-3">
             {topSaved.length > 0 ? topSaved.map(item => item && (
               <Card key={item.id} className="p-4 border-gray-50 flex items-center gap-4 group" onClick={() => onOpenItem(item.id)}>
                 <div className="w-8 h-8 rounded-lg bg-[#FADADD]/30 flex items-center justify-center text-sm">🔖</div>
                 <div className="flex-1">
                   <p className="text-sm font-bold text-[#1F2937] line-clamp-1">{item.title}</p>
                   <p className="text-[9px] text-[#D89CA4] font-bold uppercase tracking-tighter">{item.readTimeMin} min read</p>
                 </div>
                 <svg className="w-4 h-4 text-gray-200 group-hover:text-[#8FAF9D] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                 </svg>
               </Card>
             )) : (
               <p className="text-xs text-[#6B7280] italic px-1">Save articles to access them here.</p>
             )}
           </div>
        </section>
      </div>
    </Screen>
  );
};

export default LearningProgressScreen;
