
import React, { useState } from 'react';
import Screen from './Screen';
import Button from './Button';
import Card from './Card';
import { Recipe } from '../data/recipeTypes';
import { useWellness } from '../context/WellnessContext';

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, onBack }) => {
  const { addMeal } = useWellness();
  const [isSaved, setIsSaved] = useState(false);
  const todayKey = '2024-02-14'; 

  const handleAddToToday = () => {
    addMeal(todayKey, {
      type: recipe.meal_type,
      items: [{
        id: Math.random().toString(36).substr(2, 9),
        name: recipe.name,
        calories: recipe.nutritional_info.calories,
        protein_g: recipe.nutritional_info.protein_g,
        carbs_g: recipe.nutritional_info.carbs_g,
        fat_g: recipe.nutritional_info.fat_g,
        fiber_g: recipe.nutritional_info.fiber_g,
      }]
    });
    alert(`${recipe.name} added to your logs for today!`);
  };

  const query = encodeURIComponent(recipe.image_search_query);
  const imageUrl = `https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800&q=${query}`;

  return (
    <Screen hasTabBar={true} hideHeader={true}>
      <div className="relative h-72 -mx-6 mb-8">
        <img src={imageUrl} className="w-full h-full object-cover" alt={recipe.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F7F4F1] via-transparent to-black/20" />
        
        <button 
          onClick={onBack}
          className="absolute top-12 left-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-all border border-white/20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button 
          onClick={() => setIsSaved(!isSaved)}
          className="absolute top-12 right-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-all border border-white/20"
        >
          <svg className={`w-5 h-5 ${isSaved ? 'fill-[#E26D6D] text-[#E26D6D]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.364-1.364a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex gap-2 mb-2">
            {recipe.dietary_tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[9px] font-bold text-[#1F2937] uppercase tracking-widest bg-white/80 backdrop-blur px-2 py-1 rounded-md border border-white/40">
                {tag}
              </span>
            ))}
          </div>
          <h2 className="text-3xl font-bold text-[#1F2937] leading-tight drop-shadow-sm">{recipe.name}</h2>
        </div>
      </div>

      <div className="space-y-8 pb-16">
        {/* PCOS Benefit Highlight - REFINED */}
        <Card className="bg-[#8FAF9D]/5 border-none p-6 relative overflow-hidden ring-1 ring-[#8FAF9D]/10">
           <div className="flex items-center gap-3 mb-3 relative z-10">
             <div className="w-10 h-10 rounded-full bg-[#8FAF9D] flex items-center justify-center text-xl shadow-lg shadow-[#8FAF9D]/20">🌿</div>
             <h4 className="text-[11px] font-bold text-[#4A5D4E] uppercase tracking-[0.2em]">Hormone Intelligence Benefit</h4>
           </div>
           <p className="text-sm text-[#4A5D4E] leading-relaxed font-semibold italic relative z-10">
             "{recipe.pcos_benefits}"
           </p>
           <div className="absolute top-[-20px] right-[-20px] w-32 h-32 rounded-full bg-[#8FAF9D]/5 -z-0" />
        </Card>

        {/* Macros */}
        <div className="flex justify-between items-center bg-white p-6 rounded-[28px] shadow-sm border border-[#E5E7EB]/50">
          {[
            { label: 'Cals', value: recipe.nutritional_info.calories, unit: '', color: 'bg-orange-50 text-orange-600' },
            { label: 'Protein', value: recipe.nutritional_info.protein_g, unit: 'g', color: 'bg-green-50 text-green-600' },
            { label: 'Carbs', value: recipe.nutritional_info.carbs_g, unit: 'g', color: 'bg-blue-50 text-blue-600' },
            { label: 'Fiber', value: recipe.nutritional_info.fiber_g, unit: 'g', color: 'bg-purple-50 text-purple-600' },
          ].map(macro => (
            <div key={macro.label} className="text-center px-1">
              <p className="text-lg font-bold text-[#1F2937]">{macro.value}<span className="text-[10px] font-medium text-gray-400">{macro.unit}</span></p>
              <p className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest mt-0.5">{macro.label}</p>
            </div>
          ))}
        </div>

        {/* Action: Add to Log */}
        <Button 
          label="Add to Today's Log 🥗" 
          onPress={handleAddToToday} 
          className="w-full shadow-xl shadow-[#8FAF9D]/10 h-[56px] text-sm tracking-widest"
        />

        {/* Ingredients */}
        <div>
          <div className="flex justify-between items-baseline mb-5 px-1">
            <h3 className="text-sm font-bold text-[#1F2937] uppercase tracking-[0.15em]">Ingredients</h3>
            <span className="text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest">{recipe.ingredients.length} Items</span>
          </div>
          <div className="space-y-3">
            {recipe.ingredients.map((ing, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white border border-[#E5E7EB]/40 rounded-2xl shadow-sm group hover:border-[#8FAF9D]/30 transition-colors">
                <div className="w-2 h-2 rounded-full bg-[#8FAF9D]/40 group-hover:bg-[#8FAF9D]" />
                <div className="flex-1">
                  <span className="text-sm text-[#1F2937] font-semibold">{ing.amount} {ing.unit} {ing.item}</span>
                  {ing.notes && <span className="text-[11px] text-[#6B7280] block mt-0.5 italic opacity-60">{ing.notes}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preparation */}
        <div>
          <h3 className="text-sm font-bold text-[#1F2937] uppercase tracking-[0.15em] mb-6 px-1">Preparation</h3>
          <div className="space-y-8 relative pl-6 border-l-2 border-[#8FAF9D]/10 ml-2">
            {recipe.instructions.map((step, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-white shadow-md border-2 border-[#8FAF9D] flex items-center justify-center text-[10px] font-bold text-[#8FAF9D]">
                  {i + 1}
                </div>
                <p className="text-sm text-[#4B5563] leading-relaxed font-medium">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Chef's Tip */}
        <div className="bg-[#DDEEF4]/20 p-6 rounded-[28px] border border-[#DDEEF4]/40 flex gap-4">
          <span className="text-2xl">💡</span>
          <div>
            <h5 className="text-[10px] font-bold text-[#2D3436] uppercase tracking-[0.2em] mb-2">Chef's Secret Tip</h5>
            <p className="text-xs text-[#6B7280] leading-relaxed italic">{recipe.tips}</p>
          </div>
        </div>

        <Button 
          label={isSaved ? "Saved to Collection" : "Save for Later"} 
          variant="tertiary" 
          onPress={() => setIsSaved(!isSaved)}
          className="w-full text-[#8FAF9D] font-bold uppercase tracking-widest text-[10px]"
        />
      </div>
    </Screen>
  );
};

export default RecipeDetail;
