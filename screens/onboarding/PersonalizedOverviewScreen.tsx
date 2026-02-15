
import React, { useMemo } from 'react';
import Screen from '../../components/Screen';
import Button from '../../components/Button';
import Card from '../../components/Card';
import PhaseChip from '../../components/PhaseChip';
import { useOnboarding } from '../../context/OnboardingContext';

interface PersonalizedOverviewScreenProps {
  onNext: () => void;
}

const PersonalizedOverviewScreen: React.FC<PersonalizedOverviewScreenProps> = ({ onNext }) => {
  const { answers } = useOnboarding();

  const cycleStats = useMemo(() => {
    if (!answers.lastPeriodDate || !answers.cycleLength) return null;
    
    const lastStart = new Date(answers.lastPeriodDate);
    const today = new Date('2024-02-14'); // System reference today
    const cycleLen = parseInt(answers.cycleLength) || 28;
    
    const diffTime = today.getTime() - lastStart.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const currentDay = ((diffDays - 1) % cycleLen) + 1;
    
    let phase = 'Follicular';
    if (currentDay <= 5) phase = 'Menstrual';
    else if (currentDay <= 13) phase = 'Follicular';
    else if (currentDay <= 16) phase = 'Ovulatory';
    else phase = 'Luteal';

    const nextPeriodDate = new Date(lastStart);
    nextPeriodDate.setDate(lastStart.getDate() + cycleLen);
    const nextPeriodStr = nextPeriodDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return { currentDay, phase, nextPeriodStr };
  }, [answers.lastPeriodDate, answers.cycleLength]);

  const thisWeekBullets = useMemo(() => {
    const bullets = [];
    if (cycleStats?.phase === 'Luteal') {
      bullets.push("Steady snacks to manage rising progesterone hunger.");
      bullets.push("Lower intensity movement like walking or yin yoga.");
    } else {
      bullets.push(`Hormone-focused recipes for your ${cycleStats?.phase} phase.`);
      bullets.push("Focus on strength or dynamic movement as energy rises.");
    }

    if (answers.symptoms.includes('Cravings')) {
      bullets.push("Blood-sugar balancing meal pairings.");
    }
    
    if (answers.goals.includes('Less acne')) {
      bullets.push("Skin-supportive antioxidant guidance.");
    }

    if (bullets.length < 3) {
      bullets.push("Daily habit tracking for long-term consistency.");
    }

    return bullets.slice(0, 4);
  }, [cycleStats, answers]);

  return (
    <Screen hideHeader scrollable={true}>
      <div className="flex flex-col h-full pt-16 pb-12 px-2">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-[#1F2937] mb-2">✨ Your Plan is Ready</h2>
          <p className="text-[#6B7280] text-sm leading-relaxed max-w-xs mx-auto">
            Here’s how Cyra will support you based on your unique profile.
          </p>
        </div>

        <div className="space-y-6">
          {/* Cycle Snapshot */}
          <section>
            <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest px-1 mb-3">Cycle Snapshot</p>
            <Card className="bg-white border-none shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest">Current Status</p>
                  <h4 className="text-xl font-bold text-[#1F2937]">Day {cycleStats?.currentDay || '--'}</h4>
                </div>
                {cycleStats && <PhaseChip phase={cycleStats.phase} />}
              </div>
              <div className="pt-4 border-t border-gray-50 flex items-center gap-2">
                <span className="text-lg">📅</span>
                <p className="text-xs text-[#6B7280]">
                  Next period predicted around <span className="font-bold text-[#1F2937]">{cycleStats?.nextPeriodStr || '--'}</span>.
                </p>
              </div>
            </Card>
          </section>

          {/* Focus Areas */}
          <section>
            <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest px-1 mb-3">Your Focus Areas</p>
            <div className="grid grid-cols-2 gap-3">
              {answers.goals.map((goal, idx) => (
                <Card key={idx} className="p-4 border-none shadow-sm flex items-center gap-3 bg-white">
                  <div className="w-8 h-8 rounded-full bg-[#8FAF9D]/10 flex items-center justify-center text-xs">
                    🎯
                  </div>
                  <span className="text-xs font-bold text-[#1F2937] leading-tight">{goal}</span>
                </Card>
              ))}
            </div>
          </section>

          {/* This Week */}
          <section>
            <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest px-1 mb-3">What You’ll See This Week</p>
            <Card className="bg-white border-none shadow-sm p-6 space-y-4">
              {thisWeekBullets.map((bullet, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#8FAF9D] mt-1.5 flex-shrink-0" />
                  <p className="text-sm text-[#4B5563] font-medium leading-relaxed">{bullet}</p>
                </div>
              ))}
            </Card>
          </section>

          <div className="pt-4 pb-4">
            <p className="text-[10px] text-gray-400 text-center leading-relaxed italic">
              Cyra Premium members unlock advanced clinical insights, lab report digitization, and full cycle history.
            </p>
          </div>
        </div>

        <div className="pt-6">
          <Button 
            label="Continue" 
            onPress={onNext} 
            className="w-full shadow-lg shadow-[#8FAF9D]/20 h-14"
          />
        </div>
      </div>
    </Screen>
  );
};

export default PersonalizedOverviewScreen;
