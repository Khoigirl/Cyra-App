
import React from 'react';
import Screen from '../components/Screen';
import Card from '../components/Card';
import { ARTICLES } from '../data/mock';

const Learn: React.FC = () => {
  return (
    <Screen title="Learn">
      <div className="bg-white rounded-[14px] p-1 px-4 mb-8 flex items-center gap-3 border border-[#E5E7EB]">
        <svg className="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input className="bg-transparent py-3 flex-1 text-sm outline-none" placeholder="Search hormone health..." />
      </div>

      <div className="space-y-4">
        {ARTICLES.map(art => (
          <Card key={art.id} className="flex gap-4 p-4 items-center group cursor-pointer">
            <div className="w-16 h-16 rounded-[14px] bg-[#DDEEF4] flex items-center justify-center text-3xl">
              {art.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-[#1F2937] group-hover:text-[#8FAF9D] transition-colors">{art.title}</h4>
              <p className="text-[10px] text-[#6B7280] font-bold uppercase tracking-widest mt-1">{art.readTime} read</p>
            </div>
            <svg className="w-5 h-5 text-[#E5E7EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-bold text-[#1F2937] mb-4">Masterclasses</h3>
        <Card className="bg-[#FADADD] border-none p-6">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-bold text-[#1F2937] text-xl">The Cortisol Fix</h4>
              <p className="text-sm text-[#1F2937]/70 mt-2">Reduce stress-driven PCOS symptoms.</p>
            </div>
            <div className="bg-white p-2 rounded-full">
              <svg className="w-6 h-6 text-[#1F2937]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
            </div>
          </div>
        </Card>
      </div>
    </Screen>
  );
};

export default Learn;
