
import React from 'react';
import Screen from '../components/Screen';
import CollapsibleSection from '../components/CollapsibleSection';
import Card from '../components/Card';

const CollapsibleSectionDemoScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <Screen hasTabBar={true} hideHeader={false} title="Components Demo">
      <div className="pt-4 pb-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest mb-6 px-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Profile
        </button>

        <h2 className="text-xl font-bold text-[#1F2937] mb-2 px-1">Collapsible Sections</h2>
        <p className="text-sm text-[#6B7280] mb-8 px-1 leading-relaxed">
          Showcasing the flexible accordion-style components designed for deep hormonal insights.
        </p>

        {/* 1. Cycle Patterns - Default Expanded */}
        <CollapsibleSection 
          title="Cycle Patterns" 
          subtitle="Long-term hormonal trends"
          leftIcon="🌙"
          badgeText="New"
          rightMeta="3 insights"
          defaultExpanded={true}
        >
          <div className="space-y-3">
            <Card className="p-3 border-none bg-[#F7F4F1]/50 shadow-none">
              <p className="text-xs font-semibold text-[#1F2937]">Luteal Phase Length</p>
              <p className="text-[10px] text-[#6B7280] mt-1 italic">Average: 12 days (Healthy range)</p>
            </Card>
            <Card className="p-3 border-none bg-[#F7F4F1]/50 shadow-none">
              <p className="text-xs font-semibold text-[#1F2937]">Ovulation Window</p>
              <p className="text-[10px] text-[#6B7280] mt-1 italic">Varies by +/- 3 days based on logs.</p>
            </Card>
          </div>
        </CollapsibleSection>

        {/* 2. Nutrition Strategy - With Badge */}
        <CollapsibleSection 
          title="Nutrition Strategy" 
          subtitle="Tailored for insulin stability"
          leftIcon="🥗"
          badgeText="Phase"
          rightMeta="Recommended"
        >
          <div className="space-y-4">
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Based on your current follicular phase, focus on fresh, fiber-rich vegetables and lean proteins to support rising estrogen levels.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[#8FAF9D]/10 text-[#8FAF9D] text-[9px] font-bold uppercase rounded-full">Cruciferous</span>
              <span className="px-3 py-1 bg-[#8FAF9D]/10 text-[#8FAF9D] text-[9px] font-bold uppercase rounded-full">Sprouted Grains</span>
              <span className="px-3 py-1 bg-[#8FAF9D]/10 text-[#8FAF9D] text-[9px] font-bold uppercase rounded-full">Berries</span>
            </div>
          </div>
        </CollapsibleSection>

        {/* 3. Calendar Settings - Flat Variant */}
        <div className="mt-8 mb-4">
           <h3 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest px-1">Settings Style</h3>
        </div>
        
        <CollapsibleSection 
          title="Privacy & Data" 
          variant="flat"
          leftIcon="🔒"
        >
          <div className="py-2 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#1F2937] font-medium">Local Storage Only</span>
              <span className="text-[10px] font-bold text-[#8FAF9D]">Enabled</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#1F2937] font-medium">Biometric Unlock</span>
              <span className="text-[10px] font-bold text-[#6B7280]">Disabled</span>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection 
          title="Health Connect" 
          variant="flat"
          leftIcon="⌚"
          rightMeta="Syncing"
        >
          <p className="text-xs text-[#6B7280] py-2 leading-relaxed italic">
            Steps and active minutes are currently being imported from your system health app.
          </p>
        </CollapsibleSection>

        <div className="mt-12 p-6 bg-white rounded-[22px] border border-dashed border-[#8FAF9D]/30 text-center">
           <span className="text-2xl block mb-2">✨</span>
           <p className="text-xs font-bold text-[#1F2937] uppercase tracking-wider mb-1">UI Consistency</p>
           <p className="text-[10px] text-[#6B7280] leading-normal italic">
             These sections use Animated CSS Grid for zero-height auto-expansion, ensuring layout stability.
           </p>
        </div>
      </div>
    </Screen>
  );
};

export default CollapsibleSectionDemoScreen;
