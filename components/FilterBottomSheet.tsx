
import React from 'react';
import Card from './Card';
import Button from './Button';
import Chip from './Chip';

interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    mealType: string;
    phase: string;
    dietary: string[];
  };
  setFilters: (filters: any) => void;
}

const MEAL_TYPES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];
const PHASES = ['All', 'Menstrual', 'Follicular', 'Ovulatory', 'Luteal'];
const DIETARY_TAGS = ['High Protein', 'Quick', 'Mediterranean', 'Low-GI', 'Anti-Inflammatory', 'Gluten-Free', 'Vegan'];

const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({ isOpen, onClose, filters, setFilters }) => {
  if (!isOpen) return null;

  const toggleDietary = (tag: string) => {
    const current = filters.dietary;
    if (current.includes(tag)) {
      setFilters({ ...filters, dietary: current.filter(t => t !== tag) });
    } else {
      setFilters({ ...filters, dietary: [...current, tag] });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-300">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="w-full max-w-md bg-[#F7F4F1] rounded-t-[32px] p-8 pb-12 shadow-2xl animate-in slide-in-from-bottom-full duration-400 relative z-10">
        <div className="w-12 h-1.5 bg-[#E5E7EB] rounded-full mx-auto mb-8" />
        
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold text-[#1F2937]">Filter Recipes</h3>
          <button onClick={() => setFilters({ mealType: 'All', phase: 'All', dietary: [] })} className="text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest">Reset</button>
        </div>

        <div className="space-y-8 max-h-[60vh] overflow-y-auto hide-scrollbar pb-6">
          <section>
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-4">Meal Type</p>
            <div className="flex flex-wrap gap-2">
              {MEAL_TYPES.map(m => (
                <Chip key={m} label={m} selected={filters.mealType === m} onPress={() => setFilters({ ...filters, mealType: m })} />
              ))}
            </div>
          </section>

          <section>
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-4">Phase Focus</p>
            <div className="flex flex-wrap gap-2">
              {PHASES.map(p => (
                <Chip key={p} label={p} selected={filters.phase === p} onPress={() => setFilters({ ...filters, phase: p })} />
              ))}
            </div>
          </section>

          <section>
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-4">Dietary Tags</p>
            <div className="flex flex-wrap gap-2">
              {DIETARY_TAGS.map(t => (
                <Chip key={t} label={t} selected={filters.dietary.includes(t)} onPress={() => toggleDietary(t)} />
              ))}
            </div>
          </section>
        </div>

        <div className="pt-6">
          <Button label="Apply Filters" onPress={onClose} className="w-full shadow-lg" />
        </div>
      </div>
    </div>
  );
};

export default FilterBottomSheet;
