
import React from 'react';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Button from '../components/Button';
import { LEARN_ITEMS } from '../learn/data';
import { useLearn } from '../context/LearnContext';

interface ProgramDayScreenProps {
  programId: string;
  onBack: () => void;
  onComplete: () => void;
}

const ProgramDayScreen: React.FC<ProgramDayScreenProps> = ({ programId, onBack, onComplete }) => {
  const { getProgramProgress, completeProgramDay } = useLearn();
  const program = LEARN_ITEMS.find(p => p.id === programId);
  const progress = getProgramProgress(programId);

  if (!program || !progress) return null;

  const currentDay = progress.completedDays.length + 1;

  const handleComplete = () => {
    completeProgramDay(programId, currentDay);
    onComplete();
  };

  return (
    <Screen hideHeader title="Daily Lesson" hasTabBar={true}>
      <div className="pt-4 pb-20">
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest mb-8">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Hub
        </button>

        <div className="space-y-8">
          <div className="text-center">
            <div className="inline-block px-3 py-1 rounded-full bg-[#8FAF9D]/10 text-[#8FAF9D] text-[10px] font-bold uppercase tracking-widest mb-4">
              {program.title} • Day {currentDay}
            </div>
            <h1 className="text-3xl font-bold text-[#1F2937] px-4">Today's Focus</h1>
          </div>

          <Card className="p-8 border-none bg-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 text-center">
              <span className="text-4xl block mb-4">✨</span>
              <h3 className="text-lg font-bold text-[#1F2937] mb-3">Establish Your Ritual</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed mb-6">
                Take 2 minutes this morning to drink 8oz of water before your caffeine. This small shift supports your adrenal recovery and insulin response.
              </p>
              <div className="bg-[#F7F4F1] p-4 rounded-xl text-[11px] text-[#8FAF9D] font-bold uppercase tracking-wider">
                Action Required • 2-4 Min
              </div>
            </div>
            <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-[#8FAF9D]/5" />
          </Card>

          <section className="space-y-4 pt-4">
             <h4 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest px-1">Why it matters</h4>
             <p className="text-xs text-[#6B7280] leading-relaxed px-1">
               Morning hydration is the first signal to your endocrine system that it is safe to begin the day. For PCOS, steadying cortisol early prevents insulin spikes later.
             </p>
          </section>

          <div className="pt-10">
            <Button label="Mark Day Complete" onPress={handleComplete} className="w-full shadow-lg" />
            <p className="text-[10px] text-gray-400 text-center mt-4 italic">
              "Consistency, not perfection, creates lasting hormonal balance."
            </p>
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default ProgramDayScreen;
