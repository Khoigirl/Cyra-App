
import React from 'react';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Button from '../components/Button';
import { LEARN_ITEMS, PILLARS } from '../learn/data';
import { useLearn } from '../context/LearnContext';
import { useSubscription } from '../context/SubscriptionContext';

interface LearnDetailsScreenProps {
  itemId: string;
  onBack: () => void;
  onOpenPaywall?: (source: string) => void;
}

const LearnDetailsScreen: React.FC<LearnDetailsScreenProps> = ({ itemId, onBack, onOpenPaywall }) => {
  const { isSaved, toggleSaved, markRead, isRead, startProgram, getProgramProgress } = useLearn();
  const { isSubscribed } = useSubscription();
  const item = LEARN_ITEMS.find(i => i.id === itemId);

  if (!item) return null;

  const pillar = PILLARS.find(p => p.id === item.pillarId);
  const bookmarked = isSaved(item.id);
  const read = isRead(item.id);
  const progress = getProgramProgress(item.id);
  const isLocked = item.isPremium && !isSubscribed;

  const handleStart = () => {
    if (isLocked) {
      onOpenPaywall?.(`learn_${item.id}`);
      return;
    }

    if (item.type === 'article') {
      markRead(item.id);
      alert('Article marked as read!');
    } else {
      startProgram(item.id, item.days || 0);
    }
  };

  const phaseTag = item.tags.find(t => ['Menstrual', 'Follicular', 'Ovulatory', 'Luteal', 'Syncing'].includes(t));

  return (
    <Screen hideHeader title={item.type === 'article' ? 'Article' : 'Program'} hasTabBar={true}>
      <div className="pt-4 pb-20">
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <button onClick={() => toggleSaved(item.id)} className="w-10 h-10 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center shadow-sm">
            <svg className={`w-5 h-5 ${bookmarked ? 'fill-[#8FAF9D] text-[#8FAF9D]' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-3">
             <div className="bg-[#8FAF9D]/10 px-3 py-1 rounded-full flex items-center gap-2 border border-[#8FAF9D]/20">
               <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest opacity-60">Focus Area:</span>
               <span className="text-[9px] font-extrabold text-[#8FAF9D] uppercase tracking-widest">{pillar?.title || 'General'}</span>
             </div>
             {phaseTag && (
                <div className="bg-[#FADADD]/30 px-3 py-1 rounded-full flex items-center gap-2 border border-[#FADADD]/50">
                  <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest opacity-60">Phase relevance:</span>
                  <span className="text-[9px] font-extrabold text-[#D89CA4] uppercase tracking-widest">{phaseTag}</span>
                </div>
             )}
          </div>

          <h1 className="text-3xl font-bold text-[#1F2937] leading-tight">{item.title}</h1>
          
          <div className="flex items-center gap-3 border-y border-gray-100 py-4">
             <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">
               {item.type === 'article' ? '📖' : '🎓'}
             </div>
             <div>
                <p className="text-xs font-bold text-[#1F2937]">Cyra Health Team</p>
                <p className="text-[10px] text-[#6B7280] font-medium">
                  {item.type === 'article' ? `${item.readTimeMin} min read` : `${item.lessonsCount} lessons • ${item.days} days`}
                </p>
             </div>
          </div>

          <div className="space-y-6">
            <p className="text-base text-[#4B5563] leading-relaxed font-medium italic bg-[#F7F4F1] p-5 rounded-2xl border-l-4 border-[#8FAF9D]">
              {item.description}
            </p>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#1F2937] px-1">Curriculum Preview</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed px-1">
                {item.body}
              </p>
            </div>

            {item.type === 'program' && (
              <section className="space-y-3 pt-2">
                <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest px-1 mb-1">Coming Lessons</p>
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-50 shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-400">{i}</div>
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-[#1F2937]">Lesson {i} {isLocked ? 'Overview' : ''}</span>
                    </div>
                    {isLocked && <span className="text-xs">🔒</span>}
                  </div>
                ))}
              </section>
            )}

            <div className="pt-6">
              <button 
                onClick={handleStart}
                className={`w-full h-14 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 ${
                  isLocked 
                  ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                  : (read || progress ? 'bg-[#6E9482] text-white' : 'bg-[#8FAF9D] text-white')
                }`}
              >
                {isLocked && <span className="text-base">🔒</span>}
                {item.type === 'article' ? (read ? 'Article Read ✓' : 'Finish Article') : (progress ? `Continue Day ${progress.completedDays.length + 1}` : (isLocked ? 'Upgrade to Start' : 'Begin Program'))}
              </button>
              
              {isLocked && (
                <p className="text-[10px] text-amber-600/70 text-center mt-3 font-medium">
                  Cyra Premium is required to access full clinical masterclasses.
                </p>
              )}
            </div>
          </div>

          <div className="mt-12 p-6 bg-red-50/20 rounded-2xl border border-red-100/50">
             <p className="text-[10px] text-red-700/60 leading-relaxed text-center italic font-medium">
               Educational only. Not medical advice. Cyra provides wellness education and tracking. If you are experiencing medical symptoms, please consult a qualified healthcare professional.
             </p>
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default LearnDetailsScreen;
