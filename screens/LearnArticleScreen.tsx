import React from 'react';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Button from '../components/Button';
// Fix: Import LEARN_ITEMS instead of non-existent ARTICLES
import { LEARN_ITEMS } from '../learn/data';

interface LearnArticleScreenProps {
  articleId: string;
  onBack: () => void;
}

const LearnArticleScreen: React.FC<LearnArticleScreenProps> = ({ articleId, onBack }) => {
  // Fix: Use LEARN_ITEMS to find the relevant article
  const article = LEARN_ITEMS.find(a => a.id === articleId && a.type === 'article');

  if (!article) return null;

  return (
    <Screen hideHeader title="Article" hasTabBar={true}>
      <div className="pt-4 pb-20">
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {article.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 rounded bg-[#8FAF9D]/10 text-[#8FAF9D] text-[9px] font-extrabold uppercase tracking-widest">
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl font-bold text-[#1F2937] leading-tight">{article.title}</h1>
          
          <div className="flex items-center gap-3 border-y border-gray-100 py-4">
             <div className="w-10 h-10 rounded-full bg-gray-100" />
             <div>
                <p className="text-xs font-bold text-[#1F2937]">Cyra Health Team</p>
                {/* Fix: use 'readTimeMin' instead of 'minutes' */}
                <p className="text-[10px] text-[#6B7280]">{article.readTimeMin} min read • Evidence Based</p>
             </div>
          </div>

          {/* Fix: use 'description' instead of 'summary' */}
          <p className="text-base text-[#4B5563] leading-relaxed font-medium italic">
            {article.description}
          </p>

          <div className="space-y-6 py-4">
             <div className="space-y-3">
                <h3 className="text-lg font-bold text-[#1F2937]">Introduction</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  In this article, we dive deep into the specific mechanisms of {article.title.toLowerCase()} and how it impacts your unique PCOS journey. Understanding the data is the first step toward finding a sustainable rhythm that works for your body.
                </p>
             </div>

             <Card className="bg-[#F7F4F1]/50 border-dashed border-gray-200 p-8 text-center flex flex-col items-center">
                <span className="text-3xl mb-4">📖</span>
                <h4 className="text-sm font-bold text-[#1F2937] mb-1">Full content coming soon</h4>
                <p className="text-[11px] text-[#6B7280]">We are finalizing the evidence-based details for this specific guide.</p>
             </Card>

             <div className="space-y-3">
                <h3 className="text-lg font-bold text-[#1F2937]">Supportive Strategies</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed opacity-60">
                  The primary strategies for management often include gentle lifestyle shifts, consistent nutritional support, and understanding your cycle's natural peaks and valleys...
                </p>
             </div>
          </div>

          <div className="pt-8 space-y-4">
             <h4 className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest text-center">Was this helpful?</h4>
             <div className="flex justify-center gap-4">
                <button className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-xl shadow-sm active:scale-90 transition-all">👍</button>
                <button className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-xl shadow-sm active:scale-90 transition-all">👎</button>
             </div>
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default LearnArticleScreen;