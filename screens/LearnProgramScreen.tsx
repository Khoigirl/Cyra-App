import React from 'react';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Button from '../components/Button';
// Fix: Import LEARN_ITEMS instead of non-existent PROGRAMS
import { LEARN_ITEMS } from '../learn/data';

interface LearnProgramScreenProps {
  programId: string;
  onBack: () => void;
}

const LearnProgramScreen: React.FC<LearnProgramScreenProps> = ({ programId, onBack }) => {
  // Fix: Use LEARN_ITEMS to find the relevant program
  const program = LEARN_ITEMS.find(p => p.id === programId && p.type === 'program');

  if (!program) return null;

  return (
    <Screen hideHeader title="Program" hasTabBar={true}>
      <div className="pt-4 pb-20">
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="space-y-8">
          <div className={`p-8 rounded-[32px] ${
            program.accentKey === 'rose' ? 'bg-[#FADADD]/30' : 
            program.accentKey === 'sage' ? 'bg-[#8FAF9D]/10' : 
            program.accentKey === 'lavender' ? 'bg-[#E1D5E7]/40' : 'bg-[#DDEEF4]/40'
          } relative overflow-hidden`}>
            <div className="relative z-10">
               <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-0.5 rounded bg-white/50 text-[9px] font-bold text-[#1F2937] uppercase tracking-widest">Guided Program</span>
                  {/* Fix: use 'isPremium' instead of 'premium' */}
                  {program.isPremium && <span className="text-xs">🔒</span>}
               </div>
               <h1 className="text-3xl font-bold text-[#1F2937] leading-tight mb-2">{program.title}</h1>
               {/* Fix: use 'description' instead of 'subtitle' */}
               <p className="text-base text-[#4B5563] font-medium">{program.description}</p>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/20" />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white p-4 rounded-2xl border border-gray-50 shadow-sm text-center">
                <p className="text-2xl font-bold text-[#1F2937]">{program.lessonsCount}</p>
                <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Lessons</p>
             </div>
             <div className="bg-white p-4 rounded-2xl border border-gray-50 shadow-sm text-center">
                {/* Fix: use 'days' instead of 'estimatedDays' */}
                <p className="text-2xl font-bold text-[#1F2937]">{program.days}</p>
                <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Days</p>
             </div>
          </div>

          <section className="space-y-4">
             <h3 className="text-lg font-bold text-[#1F2937] px-1">Curriculum Overview</h3>
             {[
               "Identifying your triggers",
               "Foundational habits for stability",
               "Daily micro-shifts",
               "Long-term management strategy"
             ].map((lesson, i) => (
               <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-50 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-400">{i+1}</div>
                  <span className="text-sm font-semibold text-[#1F2937]">{lesson}</span>
               </div>
             ))}
          </section>

          <div className="pt-6">
             {/* Fix: use 'isPremium' instead of 'premium' */}
             <Button label={program.isPremium ? "Unlock Program" : "Start Program"} onPress={() => alert('Starting program...')} className="w-full shadow-lg" />
             <p className="text-[10px] text-[#6B7280] text-center mt-4 italic leading-relaxed px-10">
                Programs are self-paced and designed to be integrated into your daily routine seamlessly.
             </p>
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default LearnProgramScreen;