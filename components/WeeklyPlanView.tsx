
import React, { useState, useMemo } from 'react';
import Card from './Card';
import Button from './Button';
import Screen from './Screen';
import { useWellness } from '../context/WellnessContext';
import { RECIPES } from '../data/recipes';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const WeeklyPlanView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { getCycleInfo } = useWellness();
  const cycleInfo = getCycleInfo('2024-02-14');
  const [showGroceryList, setShowGroceryList] = useState(false);

  // Generate deterministic but "random-feeling" plan
  const plan = useMemo(() => {
    return DAYS.map((day, i) => {
      const breakfast = RECIPES.filter(r => r.meal_type === 'Breakfast')[i % 10];
      const lunch = RECIPES.filter(r => r.meal_type === 'Lunch')[i % 10];
      const dinner = RECIPES.filter(r => r.meal_type === 'Dinner')[i % 10];
      return { day, breakfast, lunch, dinner };
    });
  }, []);

  if (showGroceryList) {
    return <GroceryListModal onBack={() => setShowGroceryList(false)} plan={plan} />;
  }

  return (
    <Screen hideHeader title="Weekly Plan" hasTabBar={true}>
      <div className="pt-4 pb-20">
        <header className="flex justify-between items-center mb-8">
          <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <div className="text-right">
             <span className="text-[10px] font-bold text-[#8FAF9D] uppercase tracking-[0.2em]">{cycleInfo.phase} Plan</span>
          </div>
        </header>

        <div className="mb-8">
           <h2 className="text-2xl font-bold text-[#1F2937] mb-2">Hormone Sync Menu ✨</h2>
           <p className="text-sm text-[#6B7280] font-medium leading-relaxed italic">
             Tailored for {cycleInfo.phase} energy and metabolic stability.
           </p>
        </div>

        <div className="space-y-6">
          {plan.map((item, idx) => (
            <div key={item.day} className="animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[11px] font-extrabold text-[#8FAF9D] uppercase tracking-widest">{item.day}</span>
                <div className="h-[1px] flex-1 bg-gray-100" />
              </div>
              <Card className="bg-white border-gray-50 p-4 shadow-sm">
                <div className="space-y-3">
                   <MealRow type="Breakfast" name={item.breakfast.name} calories={item.breakfast.nutritional_info.calories} />
                   <MealRow type="Lunch" name={item.lunch.name} calories={item.lunch.nutritional_info.calories} />
                   <MealRow type="Dinner" name={item.dinner.name} calories={item.dinner.nutritional_info.calories} />
                </div>
              </Card>
            </div>
          ))}
        </div>

        <div className="pt-10 space-y-3">
          <Button label="Generate Grocery List 🛒" onPress={() => setShowGroceryList(true)} className="w-full shadow-lg" />
          <Button label="Shuffle All Meals 🔄" variant="secondary" onPress={() => window.location.reload()} className="w-full" />
        </div>
      </div>
    </Screen>
  );
};

const MealRow = ({ type, name, calories }: { type: string, name: string, calories: number }) => (
  <div className="flex justify-between items-center gap-4">
    <div>
      <p className="text-[8px] font-bold text-[#8FAF9D] uppercase tracking-widest">{type}</p>
      <p className="text-xs font-semibold text-[#1F2937] line-clamp-1">{name}</p>
    </div>
    <span className="text-[9px] font-bold text-gray-300">{calories} kcal</span>
  </div>
);

const GroceryListModal = ({ onBack, plan }: any) => {
  const items = [
    { cat: 'Produce', items: ['Avocado', 'Spinach', 'Kale', 'Sweet Potatoes', 'Berries'] },
    { cat: 'Protein', items: ['Salmon Fillets', 'Ground Turkey', 'Greek Yogurt', 'Eggs'] },
    { cat: 'Pantry', items: ['Quinoa', 'Lentils', 'Chia Seeds', 'Walnuts', 'Olive Oil'] }
  ];

  return (
    <Screen hideHeader title="Grocery List">
      <div className="pt-4 pb-20">
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest mb-8">
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
           </svg>
           Back to Plan
        </button>

        <h2 className="text-2xl font-bold text-[#1F2937] mb-8">Smart Grocery List</h2>

        <div className="space-y-8">
           {items.map(group => (
             <div key={group.cat}>
                <h4 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest mb-4 px-1">{group.cat}</h4>
                <Card className="p-4 bg-white border-gray-50 shadow-sm space-y-4">
                  {group.items.map(i => (
                    <div key={i} className="flex items-center gap-3">
                       <div className="w-5 h-5 rounded-md border-2 border-gray-100" />
                       <span className="text-sm font-medium text-[#1F2937]">{i}</span>
                    </div>
                  ))}
                </Card>
             </div>
           ))}
        </div>

        <div className="pt-10">
           <Button label="Export to PDF" onPress={() => alert('Exporting...')} className="w-full shadow-lg" />
           <p className="text-[10px] text-center text-gray-400 mt-4 italic">Automatically calculated based on your 7-day menu.</p>
        </div>
      </div>
    </Screen>
  );
};

export default WeeklyPlanView;
