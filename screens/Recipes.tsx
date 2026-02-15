
import React, { useState, useMemo } from 'react';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Chip from '../components/Chip';
import RecipeDetail from '../components/RecipeDetail';
import FilterBottomSheet from '../components/FilterBottomSheet';
import WeeklyPlanView from '../components/WeeklyPlanView';
import { RECIPES } from '../data/recipes';
import { Recipe, RecipeTag } from '../data/recipeTypes';
import { useSubscription } from '../context/SubscriptionContext';
import { useWellness } from '../context/WellnessContext';

const Recipes: React.FC<{ onOpenPaywall?: (source: string) => void }> = ({ onOpenPaywall }) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showWeeklyPlan, setShowWeeklyPlan] = useState(false);
  
  const { isSubscribed } = useSubscription();
  const { getCycleInfo } = useWellness();
  const todayKey = '2024-02-14';
  const cycleInfo = getCycleInfo(todayKey);

  const [filters, setFilters] = useState({
    mealType: 'All',
    phase: 'All',
    dietary: [] as string[]
  });

  const filteredRecipes = useMemo(() => {
    return RECIPES.filter(recipe => {
      const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMeal = filters.mealType === 'All' || recipe.meal_type === filters.mealType;
      
      // Phase matching logic (simulated by tags or metadata in a real app)
      const matchesPhase = filters.phase === 'All' || 
        recipe.dietary_tags.includes(filters.phase.toLowerCase() as any) ||
        (filters.phase === 'Luteal' && recipe.dietary_tags.includes('low-gi'));

      const matchesDietary = filters.dietary.length === 0 || 
        filters.dietary.every(tag => recipe.dietary_tags.includes(tag.toLowerCase() as any));

      return matchesSearch && matchesMeal && matchesPhase && matchesDietary;
    });
  }, [searchQuery, filters]);

  const handleGeneratePlan = () => {
    if (!isSubscribed) {
      onOpenPaywall?.('recipe_weekly_plan');
    } else {
      setShowWeeklyPlan(true);
    }
  };

  if (showWeeklyPlan) {
    return <WeeklyPlanView onBack={() => setShowWeeklyPlan(false)} />;
  }

  if (selectedRecipe) {
    return <RecipeDetail recipe={selectedRecipe} onBack={() => setSelectedRecipe(null)} />;
  }

  return (
    <Screen hasTabBar={true} hideHeader={true}>
      <div className="pt-12 pb-6">
        <header className="mb-8 px-1">
          <h2 className="text-3xl font-bold text-[#1F2937]">Smart Nutrition</h2>
          <p className="text-sm text-[#6B7280] mt-1 font-medium italic">Phase-aware, blood-sugar balanced meals.</p>
        </header>

        {/* Generate Weekly Plan CTA */}
        <button 
          onClick={handleGeneratePlan}
          className="w-full mb-8 p-6 rounded-[24px] bg-gradient-to-br from-[#8FAF9D] to-[#6E9482] text-white shadow-xl shadow-[#8FAF9D]/20 flex items-center justify-between group active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl">
              📅
            </div>
            <div className="text-left">
              <h4 className="font-bold text-lg leading-tight">Weekly Plan ✨</h4>
              <p className="text-white/80 text-xs mt-0.5">Generate a 7-day adaptive menu</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        <div className="flex gap-3 mb-6">
          <div className="flex-1 bg-white rounded-[20px] px-4 flex items-center gap-3 border border-[#E5E7EB] shadow-sm focus-within:border-[#8FAF9D]/50 transition-all">
            <svg className="w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              className="bg-transparent py-4 flex-1 text-sm outline-none placeholder-[#9CA3AF]" 
              placeholder="Search meals..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="w-14 h-14 rounded-[20px] bg-white border border-[#E5E7EB] shadow-sm flex items-center justify-center text-[#1F2937] active:bg-gray-50 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
        </div>

        <div className="flex justify-between items-center mb-6 px-1">
          <div className="flex items-center gap-2">
            <h4 className="text-[11px] font-bold text-[#1F2937] uppercase tracking-widest">
              {filteredRecipes.length} Healthy Options
            </h4>
            {filters.phase === cycleInfo.phase && (
              <span className="px-2 py-0.5 rounded-full bg-[#8FAF9D]/10 text-[#8FAF9D] text-[8px] font-extrabold uppercase">Phase Matched</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 pb-4">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map(recipe => {
              // Smart contextual label
              let contextualLabel = "Anti-Inflammatory";
              if (recipe.nutritional_info.protein_g > 25) contextualLabel = "High-Protein Option";
              if (recipe.nutritional_info.glycemic_index === "Low") contextualLabel = "Supports Insulin Stability";
              if (recipe.dietary_tags.includes('balanced')) contextualLabel = `Best for ${cycleInfo.phase} Phase`;

              const query = encodeURIComponent(recipe.image_search_query);
              const imageUrl = `https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800&q=${query}`;
              
              return (
                <Card 
                  key={recipe.id} 
                  className="p-0 overflow-hidden group border-none shadow-lg bg-white"
                  onClick={() => setSelectedRecipe(recipe)}
                >
                  <div className="h-52 bg-gray-100 relative">
                    <img src={imageUrl} className="w-full h-full object-cover" alt={recipe.name} loading="lazy" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-[9px] font-extrabold text-[#8FAF9D] uppercase tracking-widest shadow-sm border border-[#8FAF9D]/10">
                      {contextualLabel}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-[#1F2937] leading-tight mb-2">{recipe.name}</h3>
                    <div className="flex items-center gap-4 text-[#6B7280]">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-[#1F2937]">{recipe.nutritional_info.calories}</span>
                        <span className="text-[10px] uppercase font-bold tracking-tighter opacity-60">kcal</span>
                      </div>
                      <div className="w-1 h-1 rounded-full bg-gray-200" />
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-[#1F2937]">{recipe.nutritional_info.protein_g}g</span>
                        <span className="text-[10px] uppercase font-bold tracking-tighter opacity-60">protein</span>
                      </div>
                      <div className="w-1 h-1 rounded-full bg-gray-200" />
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-[#1F2937]">{recipe.total_time_minutes}</span>
                        <span className="text-[10px] uppercase font-bold tracking-tighter opacity-60">min</span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            <div className="text-center py-16 bg-white rounded-[32px] border border-dashed border-gray-200">
              <div className="text-4xl mb-4 opacity-30">🥗</div>
              <p className="text-[#6B7280] font-medium italic">No meals match those filters.</p>
              <button 
                onClick={() => setFilters({ mealType: 'All', phase: 'All', dietary: [] })}
                className="text-[#8FAF9D] font-bold text-xs uppercase tracking-widest mt-4 underline underline-offset-4"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      <FilterBottomSheet 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
      />
    </Screen>
  );
};

export default Recipes;
