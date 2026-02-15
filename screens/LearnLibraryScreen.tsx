
import React, { useState, useMemo } from 'react';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Chip from '../components/Chip';
import { LEARN_ITEMS, PILLARS } from '../learn/data';
import { LearnPillarId } from '../learn/types';

interface LearnLibraryScreenProps {
  onBack: () => void;
  onSelectItem: (id: string) => void;
  initialPillarId?: string;
}

const TAG_FILTERS = ["Low GI", "Anti-inflammatory", "Stress", "Sleep", "Supplements", "Fertility", "Acne", "Cravings"];

const LearnLibraryScreen: React.FC<LearnLibraryScreenProps> = ({ onBack, onSelectItem, initialPillarId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activePillar, setActivePillar] = useState<LearnPillarId | 'all'>((initialPillarId as any) || 'all');
  const [activeTag, setActiveTag] = useState<string | 'all'>('all');
  const [sortMode, setSortMode] = useState<'Recommended' | 'New' | 'Saved'>('Recommended');

  const filteredItems = useMemo(() => {
    return LEARN_ITEMS.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesPillar = activePillar === 'all' || item.pillarId === activePillar;
      const matchesTag = activeTag === 'all' || item.tags.some(t => t.toLowerCase() === activeTag.toLowerCase());
      return matchesSearch && matchesPillar && matchesTag;
    });
  }, [searchQuery, activePillar, activeTag]);

  return (
    <Screen hideHeader title="Library" hasTabBar={true}>
      <div className="pt-4 pb-12">
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <h2 className="text-2xl font-bold text-[#1F2937] mb-6 px-1">Full Library</h2>

        {/* Search */}
        <div className="bg-white rounded-2xl px-4 mb-6 flex items-center gap-3 border border-[#E5E7EB] shadow-sm">
          <svg className="w-5 h-5 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            className="bg-transparent py-3.5 flex-1 text-sm outline-none" 
            placeholder="Search topics, tags, or focus areas..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Pillar Filters */}
        <div className="mb-6">
          <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-3 px-1">Focus Area</p>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-6 px-6">
            <Chip label="All" selected={activePillar === 'all'} onPress={() => setActivePillar('all')} />
            {PILLARS.map(p => (
              <Chip key={p.id} label={p.title} selected={activePillar === p.id} onPress={() => setActivePillar(p.id)} />
            ))}
          </div>
        </div>

        {/* Tag Filters */}
        <div className="mb-8">
          <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-3 px-1">Specific Needs</p>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-6 px-6">
            <Chip label="All Tags" selected={activeTag === 'all'} onPress={() => setActiveTag('all')} />
            {TAG_FILTERS.map(t => (
              <Chip key={t} label={t} selected={activeTag === t} onPress={() => setActiveTag(t)} />
            ))}
          </div>
        </div>

        {/* Sort Bar */}
        <div className="flex justify-between items-center mb-4 px-1 border-b border-gray-100 pb-4">
          <div className="flex gap-4">
            {['Recommended', 'New', 'Saved'].map((mode) => (
              <button 
                key={mode}
                onClick={() => setSortMode(mode as any)}
                className={`text-[10px] font-bold uppercase tracking-wider ${sortMode === mode ? 'text-[#8FAF9D]' : 'text-gray-400'}`}
              >
                {mode}
              </button>
            ))}
          </div>
          <span className="text-[9px] text-gray-400 font-bold uppercase">{filteredItems.length} results</span>
        </div>

        <div className="space-y-3">
          {filteredItems.map(item => (
            <Card 
              key={item.id} 
              className="p-4 flex gap-4 items-center group active:bg-gray-50 border-gray-100 shadow-sm"
              onClick={() => onSelectItem(item.id)}
            >
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-xl">
                {item.type === 'article' ? '📖' : '🎓'}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-[#1F2937] group-hover:text-[#8FAF9D] transition-colors">{item.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                   <span className="text-[9px] text-[#6B7280] font-medium uppercase tracking-widest">
                     {item.type === 'article' ? `${item.readTimeMin} min` : `${item.days} days`}
                   </span>
                   {item.isPremium && <span className="text-xs">🔒</span>}
                </div>
              </div>
              <svg className="w-4 h-4 text-gray-200 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </Card>
          ))}
          {filteredItems.length === 0 && (
             <div className="py-20 text-center">
                <p className="text-sm text-[#6B7280] italic">No guides match your current filters.</p>
             </div>
          )}
        </div>
      </div>
    </Screen>
  );
};

export default LearnLibraryScreen;
