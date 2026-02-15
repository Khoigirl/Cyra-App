
import React, { useState, useMemo } from 'react';
import Screen from '../components/Screen';
import Card from '../components/Card';
import WhyThisModal from '../components/WhyThisModal';
import { PILLARS, LEARN_ITEMS } from '../learn/data';
import { LearnPillar, LearnAccent } from '../learn/types';
import { useLearn } from '../context/LearnContext';
import { useWellness } from '../context/WellnessContext';
import { useSupplements } from '../context/SupplementContext';
import { generateWeeklyFocus, WeeklyFocusCard } from '../learn/personalizationEngine';
import { generateMockHistory } from '../learn/mockLogs';

interface LearnScreenProps {
  onSelectItem: (itemId: string) => void;
  onSelectPillar: (pillarId: string) => void;
  onViewAllLibrary: () => void;
}

const ACCENT_BG: Record<LearnAccent, string> = {
  sage: 'bg-[#8FAF9D]/10',
  rose: 'bg-[#FADADD]/30',
  lavender: 'bg-[#E1D5E7]/40',
  blue: 'bg-[#DDEEF4]/40',
};

const ACCENT_TEXT: Record<LearnAccent, string> = {
  sage: 'text-[#6E9482]',
  rose: 'text-[#D89CA4]',
  lavender: 'text-[#735E8E]',
  blue: 'text-[#5E8E8E]',
};

const LearnScreen: React.FC<LearnScreenProps> = ({ onSelectItem, onSelectPillar, onViewAllLibrary }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [whyModal, setWhyModal] = useState<{ open: boolean, title: string, detail: string }>({ open: false, title: '', detail: '' });
  
  const { getProgramProgress } = useLearn();
  const { logs, getCycleInfo } = useWellness();
  const { supplements, logs: suppLogs } = useSupplements();

  const userLogs = useMemo(() => {
    const keys = Object.keys(logs);
    return keys.length > 3 ? keys.map(k => logs[k]) : generateMockHistory();
  }, [logs]);

  const cyclePhase = useMemo(() => getCycleInfo(new Date().toISOString().split('T')[0]).phase, [getCycleInfo]);

  const focusCards = useMemo(() => generateWeeklyFocus({
    recentLogs: userLogs,
    supplements,
    suppLogs,
    cyclePhase
  }), [userLogs, supplements, suppLogs, cyclePhase]);

  const libraryPreview = useMemo(() => {
    return LEARN_ITEMS.filter(item => item.type === 'article').slice(0, 5);
  }, []);

  const guidedPrograms = useMemo(() => {
    return LEARN_ITEMS.filter(item => item.type === 'program');
  }, []);

  return (
    <Screen hideHeader={true} hasTabBar={true}>
      <div className="pt-16 pb-12 space-y-10">
        
        {/* Authoritative Header */}
        <div className="px-1">
          <h2 className="text-3xl font-bold text-[#1F2937]">Hormone Intelligence</h2>
          <p className="text-sm text-[#6B7280] mt-1 font-medium">Science-backed guidance for PCOS support.</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-[18px] px-4 flex items-center gap-3 border border-[#E5E7EB] shadow-sm focus-within:border-[#8FAF9D]/50 transition-all">
          <svg className="w-5 h-5 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            className="bg-transparent py-4 flex-1 text-sm outline-none placeholder-[#9CA3AF]" 
            placeholder="Search PCOS insights..."
            onFocus={onViewAllLibrary}
          />
        </div>

        {/* 1. Personalized "For You This Week" */}
        <section>
          <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">Personalized Focus</h3>
            <span className="text-[9px] font-bold text-[#8FAF9D] uppercase tracking-tighter bg-[#8FAF9D]/10 px-2 py-0.5 rounded">Adaptive</span>
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-6 px-6">
            {focusCards.map(card => (
              <Card 
                key={card.id} 
                className={`w-[280px] flex-shrink-0 border-none shadow-md ${ACCENT_BG[card.accentKey]} p-6 flex flex-col h-[230px]`}
              >
                <div onClick={() => onSelectItem(card.targetId)} className="cursor-pointer flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-[#1F2937] text-lg leading-tight">{card.title}</h4>
                    <span className="text-lg">
                      {card.type === 'program' ? '🎓' : '📖'}
                    </span>
                  </div>
                  <p className="text-xs text-[#4B5563] font-medium leading-relaxed line-clamp-2 mb-3">
                    {card.subtitle}
                  </p>
                  
                  <div className="bg-white/40 rounded-xl p-2.5 border border-white/50">
                    <p className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest mb-1">Why this is showing</p>
                    <p className="text-[10px] text-[#1F2937]/70 font-medium italic leading-snug line-clamp-2">
                      {card.reasonShort}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <button 
                    onClick={() => onSelectItem(card.targetId)}
                    className={`h-9 px-4 rounded-full bg-white shadow-sm flex items-center gap-2 group transition-all active:scale-95`}
                  >
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${ACCENT_TEXT[card.accentKey]}`}>{card.ctaLabel}</span>
                    <svg className={`w-3 h-3 transition-transform group-hover:translate-x-0.5 ${ACCENT_TEXT[card.accentKey]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  <button 
                    onClick={() => setWhyModal({ open: true, title: card.title, detail: card.reasonDetail })}
                    className="text-[9px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
                  >
                    Details
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 2. Pillars */}
        <section>
          <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">Scientific Pillars</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {PILLARS.map(pillar => (
              <Card 
                key={pillar.id} 
                className="p-4 border-gray-100 flex flex-col items-center text-center group active:bg-gray-50 transition-colors"
                onClick={() => onSelectPillar(pillar.id)}
              >
                <div className={`w-12 h-12 rounded-2xl ${ACCENT_BG[pillar.accentKey]} flex items-center justify-center text-2xl mb-3`}>
                  {pillar.icon}
                </div>
                <h4 className="text-sm font-bold text-[#1F2937]">{pillar.title}</h4>
                <p className="text-[9px] text-[#6B7280] uppercase font-bold tracking-tighter mt-1">{pillar.subtitle}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* 3. Guided Programs */}
        <section>
          <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">Masterclasses</h3>
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-6 px-6">
            {guidedPrograms.map(program => {
              const progress = getProgramProgress(program.id);
              return (
                <Card 
                  key={program.id} 
                  className="w-64 flex-shrink-0 p-5 border-gray-100 flex flex-col justify-between h-48 shadow-sm"
                  onClick={() => onSelectItem(program.id)}
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div className={`px-2 py-0.5 rounded-md ${ACCENT_BG[program.accentKey]} text-[8px] font-extrabold uppercase tracking-widest ${ACCENT_TEXT[program.accentKey]}`}>
                        {/* Fix: use progress existence and completedDays length for tracking current program status */}
                        {progress ? `Day ${progress.completedDays.length + 1} of ${program.days}` : 'Program'}
                      </div>
                      {program.isPremium && (
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-600 text-[8px] font-bold uppercase tracking-widest">Premium</span>
                      )}
                    </div>
                    <h4 className="font-bold text-[#1F2937] text-lg leading-tight">{program.title}</h4>
                    <p className="text-[11px] text-[#6B7280] mt-1.5 font-medium line-clamp-2 leading-relaxed">{program.description}</p>
                  </div>
                  <div className="flex justify-between items-center border-t border-gray-50 pt-3">
                    <div className="flex gap-3">
                      <span className="text-[9px] font-bold text-[#9CA3AF] uppercase">{program.lessonsCount} Lessons</span>
                      <span className="text-[9px] font-bold text-[#9CA3AF] uppercase">{program.days} Days</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* 4. Library */}
        <section className="pb-10">
          <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">Research & Evidence</h3>
            <button onClick={onViewAllLibrary} className="text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest underline underline-offset-4">Browse All</button>
          </div>
          <div className="space-y-3">
            {libraryPreview.map(item => (
              <Card 
                key={item.id} 
                className="p-4 flex gap-4 items-center group active:bg-gray-50 shadow-sm border-gray-50"
                onClick={() => onSelectItem(item.id)}
              >
                <div className="flex-1">
                  <div className="flex gap-2 mb-1">
                    {item.tags.slice(0, 1).map(tag => (
                      <span key={tag} className="text-[8px] font-extrabold text-[#8FAF9D] uppercase tracking-tighter">#{tag}</span>
                    ))}
                    {item.isPremium && <span className="text-[8px] font-extrabold text-amber-500 uppercase tracking-tighter">Premium</span>}
                  </div>
                  <h4 className="text-sm font-bold text-[#1F2937] group-hover:text-[#8FAF9D] transition-colors">{item.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] text-[#9CA3AF] font-bold uppercase tracking-widest">{item.readTimeMin} min read</span>
                  </div>
                </div>
                <svg className="w-4 h-4 text-gray-200 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </Card>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 text-center italic px-8">
            Educational only. Not medical advice. Content is for informational purposes for PCOS management.
          </p>
        </div>
      </div>

      <WhyThisModal 
        isOpen={whyModal.open} 
        onClose={() => setWhyModal(prev => ({ ...prev, open: false }))} 
        title={whyModal.title}
        detail={whyModal.detail}
      />
    </Screen>
  );
};

export default LearnScreen;
