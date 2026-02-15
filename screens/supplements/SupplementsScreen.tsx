
import React from 'react';
import Screen from '../../components/Screen';
import Card from '../../components/Card';
import Button from '../../components/Button';
import SupplementItem from '../../components/SupplementItem';
import { useSupplements } from '../../context/SupplementContext';

interface SupplementsScreenProps {
  onBack: () => void;
  onManage: () => void;
  onReminders: () => void;
}

const SupplementsScreen: React.FC<SupplementsScreenProps> = ({ onBack, onManage, onReminders }) => {
  const { supplements, logs, setTaken, getStats, getCompletionForDate } = useSupplements();
  const today = new Date().toISOString().split('T')[0];
  const activeSupps = supplements.filter(s => s.isActive);
  const completion = getCompletionForDate(today);

  return (
    <Screen hideHeader title="Supplements">
      <div className="pt-4 pb-12">
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#1F2937]">Your Ritual</h2>
            <p className="text-sm text-[#6B7280]">Small daily wins for hormonal harmony.</p>
          </div>
          <div className="text-right">
            <p className="text-[20px] font-bold text-[#8FAF9D]">{completion.taken}/{completion.total}</p>
            <p className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest">Today</p>
          </div>
        </div>

        <Card className="bg-[#8FAF9D]/10 border-none p-5 mb-8">
          <div className="flex items-center gap-4">
            <div className="text-3xl">🌿</div>
            <div>
              <h4 className="text-sm font-bold text-[#1F2937]">Keep the momentum!</h4>
              <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed italic">
                Consistent intake helps your body build steady nutrient levels.
              </p>
            </div>
          </div>
        </Card>

        <div className="mb-8">
          <h3 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest mb-4 px-1">Today's Checklist</h3>
          {activeSupps.length > 0 ? (
            activeSupps.map(sup => {
              const stats = getStats(sup.id);
              return (
                <SupplementItem 
                  key={sup.id}
                  supplement={sup}
                  checked={logs[today]?.taken[sup.id]?.checked || false}
                  onToggle={() => setTaken(today, sup.id, !logs[today]?.taken[sup.id]?.checked)}
                  streak={stats.currentStreak}
                  weeklyCount={stats.weeklyConsistency}
                />
              );
            })
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm text-[#6B7280] italic">No active supplements yet.</p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Button label="Manage Supplements" onPress={onManage} className="w-full" />
          <Button label="Reminders" variant="secondary" onPress={onReminders} className="w-full" />
        </div>

        {/* Debug Section */}
        <div className="mt-12 opacity-30">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase mb-2 px-1">Debug Info</h3>
          <pre className="text-[8px] bg-gray-100 p-2 rounded-lg">
            {JSON.stringify(logs[today]?.taken || {}, null, 2)}
          </pre>
        </div>
      </div>
    </Screen>
  );
};

export default SupplementsScreen;
