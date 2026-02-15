
import React, { useState, useMemo } from 'react';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Button from '../components/Button';
import CollapsibleSectionDemoScreen from './CollapsibleSectionDemoScreen';
import { useLearn } from '../context/LearnContext';
import { useSubscription } from '../context/SubscriptionContext';
import { useWellness } from '../context/WellnessContext';
import { useLabs } from '../context/LabContext';
import { LEARN_ITEMS } from '../learn/data';

interface ProfileProps {
  onGoToLabs?: () => void;
  onViewSaved?: () => void;
  onViewLearningProgress?: () => void;
  onOpenPaywall?: (source: string) => void;
  onOpenLegal?: (type: 'privacy' | 'terms' | 'disclaimer') => void;
  onOpenSupport?: () => void;
  onOpenDelete?: () => void;
}

const APP_VERSION = '1.2.0';
const BUILD_NUMBER = '104';

const Profile: React.FC<ProfileProps> = ({ 
  onGoToLabs, 
  onViewSaved, 
  onViewLearningProgress, 
  onOpenPaywall,
  onOpenLegal,
  onOpenSupport,
  onOpenDelete
}) => {
  const [showDemo, setShowDemo] = useState(false);
  const { savedItemIds, readItemIds, activeProgram } = useLearn();
  const { isSubscribed, restorePurchases } = useSubscription();
  const { logs } = useWellness();
  const { results: labResults } = useLabs();

  const progressStats = useMemo(() => {
    const daysWithLogs = Object.keys(logs).length;
    const labsCount = labResults.length;
    const programProgress = activeProgram ? Math.round((activeProgram.completedDays.length / activeProgram.totalDays) * 100) : 0;
    
    return {
      daysWithLogs,
      labsCount,
      programProgress,
      savedCount: savedItemIds.length,
      readCount: readItemIds.length
    };
  }, [logs, labResults, activeProgram, savedItemIds, readItemIds]);

  const handleLabsPress = () => {
    if (!isSubscribed) {
      onOpenPaywall?.('profile_labs_tracker');
    } else {
      onGoToLabs?.();
    }
  };

  if (showDemo) {
    return <CollapsibleSectionDemoScreen onBack={() => setShowDemo(false)} />;
  }

  return (
    <Screen title="Profile">
      <div className="pt-4 pb-20 space-y-10">
        
        {/* SECTION 1: YOUR ACCOUNT */}
        <section>
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100">
                <img src="https://i.pravatar.cc/150?u=cyra" alt="User" />
              </div>
              <div className={`absolute bottom-0 right-0 px-3 py-1 rounded-full border-2 border-white shadow-sm text-[8px] font-extrabold uppercase tracking-widest ${isSubscribed ? 'bg-amber-400 text-white' : 'bg-gray-400 text-white'}`}>
                {isSubscribed ? 'Premium' : 'Basic'}
              </div>
            </div>
            <h2 className="text-2xl font-bold text-[#1F2937] mt-4">Emma Jensen</h2>
            <p className="text-[#6B7280] text-sm font-medium">Luteal Phase Specialist</p>
          </div>
        </section>

        {/* SECTION 2: YOUR PROGRESS */}
        <section>
          <div className="flex justify-between items-baseline mb-4 px-1">
            <h3 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-[0.2em]">Your Progress</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <StatCard label="Consistency" value={`${progressStats.daysWithLogs}d`} subtext="Days logged" icon="📈" />
            <StatCard 
              label="Lab Records" 
              value={progressStats.labsCount} 
              subtext="Markers tracked" 
              icon="🧪" 
              onClick={handleLabsPress} 
              isLocked={!isSubscribed}
            />
          </div>
          <Card className="p-5 border-gray-100 shadow-sm bg-white">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-tighter">Current Program</p>
                <p className="text-sm font-bold text-[#1F2937] mt-0.5">
                  {activeProgram ? LEARN_ITEMS.find(i => i.id === activeProgram.programId)?.title : 'No active program'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-[#8FAF9D]">{activeProgram ? `${progressStats.programProgress}%` : '--'}</p>
              </div>
            </div>
            <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-[#8FAF9D] transition-all duration-700" style={{ width: `${progressStats.programProgress}%` }} />
            </div>
            <div className="flex justify-between gap-4 border-t border-gray-50 pt-4">
               <button onClick={onViewSaved} className="flex-1 text-center">
                 <p className="text-sm font-bold text-[#1F2937]">{progressStats.savedCount}</p>
                 <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Saved</p>
               </button>
               <div className="w-px h-8 bg-gray-100" />
               <button onClick={onViewLearningProgress} className="flex-1 text-center">
                 <p className="text-sm font-bold text-[#1F2937]">{progressStats.readCount}</p>
                 <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Lessons</p>
               </button>
            </div>
          </Card>
        </section>

        {/* SECTION 3: HEALTH DATA */}
        <section>
          <div className="mb-4 px-1">
            <h3 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-[0.2em]">Health Data</h3>
          </div>
          <div className="space-y-2">
            <ProfileRow 
              icon="🧪" 
              label="Lab Results Tracker" 
              onClick={handleLabsPress} 
              badgeText={!isSubscribed ? "Premium" : "Active"}
            />
          </div>
        </section>

        {/* SECTION 4: LEGAL & SUPPORT */}
        <section>
          <div className="mb-4 px-1">
            <h3 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-[0.2em]">Legal & Support</h3>
          </div>
          <div className="space-y-2">
            <ProfileRow icon="⚖️" label="Medical Disclaimer" onClick={() => onOpenLegal?.('disclaimer')} />
            <ProfileRow icon="🛡️" label="Privacy Policy" onClick={() => onOpenLegal?.('privacy')} />
            <ProfileRow icon="📜" label="Terms of Use" onClick={() => onOpenLegal?.('terms')} />
            <ProfileRow icon="💬" label="Support & FAQ" onClick={onOpenSupport} />
            <ProfileRow icon="🔄" label="Restore Purchases" onClick={restorePurchases} />
            <ProfileRow icon="🗑️" label="Manage Account Data" onClick={onOpenDelete} textColor="text-red-400" hideArrow />
          </div>
        </section>

        <div className="pt-6 text-center space-y-4">
          <button className="text-[11px] font-bold text-red-400 uppercase tracking-[0.2em] px-8 py-3 border border-red-50 rounded-2xl active:bg-red-50/50 transition-colors">
            Sign Out
          </button>
          
          <div className="space-y-1">
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em]">
              Cyra Version {APP_VERSION} ({BUILD_NUMBER})
            </p>
          </div>
        </div>
      </div>
    </Screen>
  );
};

const StatCard = ({ label, value, subtext, icon, onClick, isLocked }: any) => (
  <Card onClick={onClick} className="p-4 border-gray-50 flex items-center gap-3 active:scale-[0.98] transition-all bg-white relative">
    <div className="w-10 h-10 rounded-xl bg-[#F7F4F1] flex items-center justify-center text-lg">{icon}</div>
    <div className="flex-1">
      <div className="flex items-center gap-1">
        <p className="text-sm font-bold text-[#1F2937] leading-tight">{value}</p>
        {isLocked && <span className="text-[8px] opacity-40">🔒</span>}
      </div>
      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mt-0.5">{label}</p>
    </div>
  </Card>
);

const ProfileRow = ({ icon, label, onClick, textColor = 'text-[#1F2937]', hideArrow = false, badgeText }: any) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 px-5 bg-white rounded-2xl border border-gray-50 active:bg-gray-50 transition-all shadow-sm group"
  >
    <div className="flex items-center gap-4">
      <span className="text-lg opacity-70 group-active:scale-110 transition-transform">{icon}</span>
      <div className="flex items-center gap-2">
        <span className={`font-semibold text-sm ${textColor} tracking-tight`}>{label}</span>
        {badgeText && (
          <span className="px-2 py-0.5 rounded-full bg-[#8FAF9D]/10 text-[#8FAF9D] text-[8px] font-bold uppercase tracking-widest border border-[#8FAF9D]/10">
            {badgeText}
          </span>
        )}
      </div>
    </div>
    {!hideArrow && (
      <svg className="w-4 h-4 text-gray-200 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
      </svg>
    )}
  </button>
);

export default Profile;
