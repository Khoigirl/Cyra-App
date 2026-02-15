
export type RecipeTag =
  | "anti-inflammatory"
  | "low-gi"
  | "plant-based"
  | "vegan"
  | "vegetarian"
  | "gluten-free"
  | "high-protein"
  | "quick"
  | "grain-free"
  | "dairy-free"
  | "balanced"
  | "mediterranean";

export type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";

export interface IngredientItem {
  item: string;
  amount: string;
  unit: string;
  notes?: string;
}

export interface NutritionalInfo {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fiber_g: number;
  fat_g: number;
  saturated_fat_g?: number;
  sugar_g?: number;
  sodium_mg?: number;
  glycemic_index: "Low" | "Medium" | "High";
}

export interface Recipe {
  id: string;
  name: string;
  meal_type: MealType;
  cook_time_minutes: number;
  prep_time_minutes: number;
  total_time_minutes: number;
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
  dietary_tags: RecipeTag[];
  description: string;
  pcos_benefits: string;
  ingredients: IngredientItem[];
  instructions: string[];
  nutritional_info: NutritionalInfo;
  tips: string;
  image_search_query: string;
  // seasoning_and_spices is used in generated recipes and needs to be typed
  seasoning_and_spices?: string[];
}
