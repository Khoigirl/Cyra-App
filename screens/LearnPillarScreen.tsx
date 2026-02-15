import React, { useState, useMemo } from 'react';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Chip from '../components/Chip';
// Fix: Import LEARN_ITEMS instead of non-existent ARTICLES
import { LEARN_ITEMS } from '../learn/data';
import { LearnPillar } from '../learn/types';

interface LearnPillarScreenProps {
  pillar: LearnPillar;
  onBack: () => void;
  onSelectArticle: (articleId: string) => void;
}

const LearnPillarScreen: React.FC<LearnPillarScreenProps> = ({ pillar, onBack, onSelectArticle }) => {
  const [selectedTag, setSelectedTag] = useState('All');

  const pillarArticles = useMemo(() => {
    // Fix: Use LEARN_ITEMS filtered by type 'article' and matching pillarId
    return LEARN_ITEMS.filter(a => a.type === 'article' && a.pillarId === pillar.id);
  }, [pillar.id]);

  const tags = useMemo(() => {
    const t = new Set<string>(['All']);
    pillarArticles.forEach(a => a.tags.forEach(tag => t.add(tag)));
    return Array.from(t);
  }, [pillarArticles]);

  const filteredArticles = useMemo(() => {
    if (selectedTag === 'All') return pillarArticles;
    return pillarArticles.filter(a => a.tags.includes(selectedTag));
  }, [pillarArticles, selectedTag]);

  return (
    <Screen hideHeader title={pillar.title} hasTabBar={true}>
      <div className="pt-4 pb-12">
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Learn
        </button>

        <div className="flex items-center gap-4 mb-8">
           <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-4xl shadow-sm ${
             pillar.accentKey === 'sage' ? 'bg-[#8FAF9D]/10' : 
             pillar.accentKey === 'rose' ? 'bg-[#FADADD]/30' : 
             pillar.accentKey === 'lavender' ? 'bg-[#E1D5E7]/40' : 'bg-[#DDEEF4]/40'
           }`}>
             {pillar.icon}
           </div>
           <div>
             <h2 className="text-2xl font-bold text-[#1F2937]">{pillar.title}</h2>
             <p className="text-sm text-[#6B7280] font-medium">{pillar.subtitle}</p>
           </div>
        </div>

        <div className="mb-8">
          <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-4 px-1">Filter by focus</p>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-6 px-6">
             {tags.map(t => (
               <Chip key={t} label={t} selected={selectedTag === t} onPress={() => setSelectedTag(t)} />
             ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredArticles.map(art => (
            <Card 
              key={art.id} 
              className="p-5 flex justify-between items-center group active:bg-gray-50 border-gray-100 shadow-sm"
              onClick={() => onSelectArticle(art.id)}
            >
              <div className="flex-1 pr-4">
                <h4 className="text-base font-bold text-[#1F2937] group-hover:text-[#8FAF9D] transition-colors">{art.title}</h4>
                {/* Fix: use 'description' instead of 'summary', 'readTimeMin' instead of 'minutes', and 'isPremium' instead of 'premium' */}
                <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed line-clamp-2">{art.description}</p>
                <div className="flex items-center gap-3 mt-4">
                   <span className="text-[9px] font-extrabold text-[#8FAF9D] uppercase tracking-widest">{art.readTimeMin} min read</span>
                   {art.isPremium && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 text-[8px] font-bold uppercase">Premium</span>
                   )}
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-200 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </Card>
          ))}
          {filteredArticles.length === 0 && (
             <div className="py-20 text-center">
                <p className="text-sm text-[#6B7280] italic">No articles found in this focus area.</p>
             </div>
          )}
        </div>
      </div>
    </Screen>
  );
};

export default LearnPillarScreen;