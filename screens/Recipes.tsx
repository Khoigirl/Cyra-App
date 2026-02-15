
import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, Pressable, Image } from 'react-native';
import { styled } from 'nativewind';
import Screen from '../components/Screen';
import Card from '../components/Card';
import RecipeDetail from '../components/RecipeDetail';
import { RECIPES } from '../data/recipes';
import { Recipe } from '../data/recipeTypes';
import { useSubscription } from '../context/SubscriptionContext';
import { useWellness } from '../context/WellnessContext';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledPressable = styled(Pressable);
const StyledImage = styled(Image);

const Recipes: React.FC<{ onOpenPaywall?: (source: string) => void }> = ({ onOpenPaywall }) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { isSubscribed } = useSubscription();
  const { getCycleInfo } = useWellness();
  
  const cycleInfo = getCycleInfo(new Date().toISOString().split('T')[0]);

  const filteredRecipes = useMemo(() => {
    return RECIPES.filter(recipe => 
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  if (selectedRecipe) {
    return <RecipeDetail recipe={selectedRecipe} onBack={() => setSelectedRecipe(null)} />;
  }

  return (
    <Screen hideHeader={true}>
      <StyledView className="pt-10 mb-8 px-1">
        <StyledText className="text-3xl font-bold text-[#1F2937]">Smart Nutrition</StyledText>
        <StyledText className="text-sm text-[#6B7280] mt-1 font-medium italic">Phase-aware, blood-sugar balanced meals.</StyledText>
      </StyledView>

      <StyledPressable 
        onPress={() => !isSubscribed && onOpenPaywall?.('recipe_weekly_plan')}
        className="w-full mb-8 p-6 rounded-[32px] bg-[#8FAF9D] shadow-lg flex-row items-center justify-between"
      >
        <StyledView className="flex-row items-center flex-1">
          <StyledText className="text-2xl mr-4">📅</StyledText>
          <StyledView>
            <StyledText className="text-white font-bold text-lg">Weekly Plan ✨</StyledText>
            <StyledText className="text-white/80 text-xs">Generate a 7-day adaptive menu</StyledText>
          </StyledView>
        </StyledView>
        <StyledText className="text-white text-lg font-bold">❯</StyledText>
      </StyledPressable>

      <StyledView className="flex-row gap-3 mb-8">
        <StyledView className="flex-1 bg-white rounded-2xl px-4 flex-row items-center border border-[#E5E7EB]">
          <StyledText className="mr-2">🔍</StyledText>
          <StyledTextInput 
            className="flex-1 py-4 text-sm text-[#1F2937]" 
            placeholder="Search meals..." 
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </StyledView>
      </StyledView>

      <StyledView className="space-y-6">
        {filteredRecipes.map(recipe => (
          <Card 
            key={recipe.id} 
            onPress={() => setSelectedRecipe(recipe)}
            className="p-0 overflow-hidden mb-6"
          >
            <StyledImage 
              source={{ uri: `https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800&q=${recipe.image_search_query}` }}
              className="h-48 w-full"
            />
            <StyledView className="p-5">
              <StyledText className="text-lg font-bold text-[#1F2937] mb-1">{recipe.name}</StyledText>
              <StyledView className="flex-row items-center gap-4">
                <StyledText className="text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest">{recipe.nutritional_info.calories} KCAL</StyledText>
                <StyledText className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">{recipe.total_time_minutes} MINS</StyledText>
              </StyledView>
            </StyledView>
          </Card>
        ))}
      </StyledView>
    </Screen>
  );
};

export default Recipes;
