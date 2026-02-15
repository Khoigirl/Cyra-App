
import React, { useState } from 'react';
import Screen from '../components/Screen';
import Card from '../components/Card';
import PhaseChip from '../components/PhaseChip';
import { generateIntelligence } from '../intelligence/engine';
// Added IntelligenceProfile to imports to fix type mismatch issues
import { IntelligenceData, IntelligenceProfile } from '../intelligence/types';
import { PHASE_THEMES, CyclePhase } from '../theme/phaseTokens';

const IntelligenceDebugScreen: React.FC = () => {
  const [scenario, setScenario] = useState('Default');

  const getMockData = (type: string): IntelligenceData => {
    // Explicitly typed as IntelligenceProfile and added missing 'hasConsented' and 'isHealthSynced' properties
    const baseProfile: IntelligenceProfile = {
      goals: ["Regular cycles"],
      symptoms: ["Cravings"],
      restrictions: [],
      allergies: '',
      hasConsented: true,
      isHealthSynced: false,
      reminders: { period: true, symptoms: true, water: false, meal: false },
      reminderTimes: { period: '09:00', symptoms: '20:00', water: '10:00', meal: '12:00' },
      dietStyle: 'Low GI',
      cookingTime: '15-30'
    };

    // Fix: Added missing supplements property to satisfy DailyLog type requirements
    const baseLog = {
      steps: 5000,
      workouts: [],
      water: 2.0,
      meals: [],
      symptomLogs: [],
      supplements: []
    };

    switch(type) {
      case 'Late Period':
        return {
          profile: baseProfile,
          todayLog: baseLog,
          recentLogs: [baseLog],
          cycleInfo: { day: 35, phase: 'Luteal', status: 'Late', isPeriod: false, daysUntilNext: -8 },
          cycleConfig: { lastPeriodStart: '2024-01-01', cycleLength: 28, regularity: 'Regular' }
        };
      case 'Luteal Cravings':
        return {
          profile: baseProfile,
          todayLog: { ...baseLog, symptomLogs: [{ id: '1', symptoms: ['Cravings'], intensity: 4, notes: '' }] },
          recentLogs: [baseLog],
          cycleInfo: { day: 22, phase: 'Luteal', status: 'PMS', isPeriod: false, daysUntilNext: 6 },
          cycleConfig: { lastPeriodStart: '2024-01-20', cycleLength: 28, regularity: 'Regular' }
        };
      case 'Acne + Dairy':
        return {
          profile: baseProfile,
          todayLog: { 
            ...baseLog, 
            symptomLogs: [{ id: '1', symptoms: ['Acne'], intensity: 3, notes: '' }],
            meals: [{ id: 'm1', type: 'Lunch', items: [{ id: 'f1', name: 'Cheese Pizza', calories: 600 }] }]
          },
          recentLogs: [baseLog],
          cycleInfo: { day: 10, phase: 'Follicular', status: 'Healthy', isPeriod: false, daysUntilNext: 18 },
          cycleConfig: { lastPeriodStart: '2024-02-04', cycleLength: 28, regularity: 'Regular' }
        };
      case 'Menstrual':
        return {
          profile: baseProfile,
          todayLog: baseLog,
          recentLogs: [baseLog],
          cycleInfo: { day: 2, phase: 'Menstrual', status: 'Bleeding', isPeriod: true, daysUntilNext: 26 },
          cycleConfig: { lastPeriodStart: '2024-02-12', cycleLength: 28, regularity: 'Regular' }
        };
      case 'Ovulatory':
        return {
          profile: baseProfile,
          todayLog: baseLog,
          recentLogs: [baseLog],
          cycleInfo: { day: 14, phase: 'Ovulatory', status: 'Fertile', isPeriod: false, daysUntilNext: 14 },
          cycleConfig: { lastPeriodStart: '2024-02-01', cycleLength: 28, regularity: 'Regular' }
        };
      default:
        return {
          profile: baseProfile,
          todayLog: baseLog,
          recentLogs: [baseLog],
          cycleInfo: { day: 12, phase: 'Follicular', status: 'Healthy', isPeriod: false, daysUntilNext: 16 },
          cycleConfig: { lastPeriodStart: '2024-02-02', cycleLength: 28, regularity: 'Regular' }
        };
    }
  };

  const output = generateIntelligence(getMockData(scenario));

  return (
    <Screen title="Intelligence Debug">
      <div className="space-y-6 pt-6 pb-20">
        
        {/* Phase Token Preview */}
        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#6B7280] mb-3 px-1">Phase UI Tokens</h3>
          <div className="grid grid-cols-2 gap-3">
            {(Object.keys(PHASE_THEMES) as CyclePhase[]).map(p => (
              <div key={p} className="bg-white p-3 rounded-xl border border-gray-100 flex flex-col gap-2">
                <PhaseChip phase={p} className="self-start" />
                <div className="flex gap-2">
                   <div className="w-4 h-4 rounded-full" style={{ backgroundColor: PHASE_THEMES[p].accent }} />
                   <div className="w-4 h-4 rounded-full border border-gray-100" style={{ backgroundColor: PHASE_THEMES[p].tintBg }} />
                   <div className="w-4 h-4 rounded-full border border-gray-100" style={{ backgroundColor: PHASE_THEMES[p].chipBg }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#6B7280] mb-3 px-1">Scenario Selection</h3>
          <div className="flex flex-wrap gap-2">
            {['Default', 'Late Period', 'Luteal Cravings', 'Acne + Dairy', 'Menstrual', 'Ovulatory'].map(s => (
              <button 
                key={s} 
                onClick={() => setScenario(s)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${scenario === s ? 'bg-[#8FAF9D] text-white shadow-md scale-105' : 'bg-white text-[#6B7280] border border-[#E5E7EB]'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#6B7280] mb-3 px-1">Briefing Preview</h3>
          <Card 
            className="border-none p-6 relative overflow-hidden shadow-lg transition-colors duration-500"
            style={{ 
              backgroundColor: PHASE_THEMES[(output.briefing.phase || 'follicular').toLowerCase() as CyclePhase]?.tintBg || '#FFF',
              borderLeft: `4px solid ${PHASE_THEMES[(output.briefing.phase || 'follicular').toLowerCase() as CyclePhase]?.accent || '#8FAF9D'}`
            }}
          >
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">{output.briefing.title}</h4>
                <PhaseChip phase={output.briefing.phase || 'Follicular'} />
              </div>
              <div className="space-y-2">
                {output.briefing.bullets.map((b, i) => (
                  <p key={i} className="text-sm text-[#4B5563] font-medium leading-relaxed">• {b}</p>
                ))}
              </div>
            </div>
          </Card>
        </section>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#6B7280] mb-3 px-1">Recommendation Breakdown</h3>
          <div className="space-y-3">
            {output.recommendations.map(r => (
              <Card key={r.id} className="p-4 border-l-4 border-l-[#8FAF9D]">
                <div className="flex justify-between">
                  <p className="text-sm font-bold text-[#1F2937]">{r.title}</p>
                  <span className="text-[10px] font-bold text-[#8FAF9D] uppercase">{r.category}</span>
                </div>
                {/* Fixed: Property 'reason' changed to 'explanation' to match Recommendation interface */}
                <p className="text-[10px] text-[#6B7280] mt-1 font-medium italic">{r.explanation}</p>
                <div className="mt-3 bg-[#F7F4F1] p-3 rounded-lg border border-[#E5E7EB]">
                   <p className="text-[10px] font-bold text-[#1F2937] uppercase mb-1">Proposed Action</p>
                   <p className="text-xs text-[#1F2937]">{r.action}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default IntelligenceDebugScreen;
