
import { GoogleGenAI, Type } from "@google/genai";
import { Recipe } from "../data/recipeTypes";
import fs from "fs";
import path from "path";

/**
 * Massive Recipe Generation Utility for PCOS Wellness.
 * Handles batching, persona-driven prompt engineering, and image keyword mapping.
 */
async function generateMassiveBatch(totalCount: number = 500, batchSize: number = 10) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  console.log(`🚀 Initiating PCOS Recipe Generation (${totalCount} total)...`);

  const recipes: Recipe[] = [];
  const mealTypes = ["breakfast", "lunch", "dinner", "snack"];
  const cuisines = [
    "Mediterranean", "Asian-Fusion", "Nordic Diet", "Clean Eating", 
    "Middle Eastern", "Latin-Inspired", "Plant-Forward"
  ];

  for (let i = 0; i < totalCount; i += batchSize) {
    const currentBatchSize = Math.min(batchSize, totalCount - i);
    const mealType = mealTypes[Math.floor(i / (totalCount / 4)) % 4];
    const cuisine = cuisines[Math.floor(i / (totalCount / cuisines.length)) % cuisines.length];

    console.log(`  - Processing batch ${i / batchSize + 1}: ${currentBatchSize} ${cuisine} ${mealType} recipes...`);

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a batch of ${currentBatchSize} unique, diverse ${mealType} recipes. 
      Theme: ${cuisine}. 
      Target: Women with PCOS (focus: Low Glycemic Index, High Protein, Anti-inflammatory).
      Avoid basic repetitions. Include global flavors.`,
      config: {
        systemInstruction: `You are a PCOS Nutrition Expert and Michelin-star Chef. 
        Your output must be a JSON array of Recipe objects. 
        "image_search_query" must be a specific search query for Unsplash that describes the visual perfectly.
        "dietary_tags" must include at least 3 relevant tags.
        "seasoning_and_spices" can be an optional array of strings.
        Ensure macros are medically plausible.`,
        responseMimeType: "application/json",
        // Fixed: Updated schema to match Recipe interface properties
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              meal_type: { type: Type.STRING },
              cook_time_minutes: { type: Type.NUMBER },
              prep_time_minutes: { type: Type.NUMBER },
              total_time_minutes: { type: Type.NUMBER },
              servings: { type: Type.NUMBER },
              difficulty: { type: Type.STRING },
              dietary_tags: { type: Type.ARRAY, items: { type: Type.STRING } },
              description: { type: Type.STRING },
              pcos_benefits: { type: Type.STRING },
              ingredients: { 
                type: Type.ARRAY, 
                items: {
                  type: Type.OBJECT,
                  properties: {
                    item: { type: Type.STRING },
                    amount: { type: Type.STRING },
                    unit: { type: Type.STRING },
                    notes: { type: Type.STRING }
                  },
                  required: ["item", "amount", "unit"]
                }
              },
              instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
              nutritional_info: {
                type: Type.OBJECT,
                properties: {
                  calories: { type: Type.NUMBER },
                  protein_g: { type: Type.NUMBER },
                  carbs_g: { type: Type.NUMBER },
                  fat_g: { type: Type.NUMBER },
                  fiber_g: { type: Type.NUMBER },
                  glycemic_index: { type: Type.STRING }
                },
                required: ["calories", "protein_g", "carbs_g", "fat_g", "fiber_g", "glycemic_index"]
              },
              tips: { type: Type.STRING },
              image_search_query: { type: Type.STRING, description: "Detailed Unsplash search query" },
              seasoning_and_spices: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["id", "name", "meal_type", "total_time_minutes", "servings", "dietary_tags", "ingredients", "instructions", "nutritional_info", "image_search_query"]
          }
        }
      }
    });

    try {
      const batch: Recipe[] = JSON.parse(response.text || '[]');
      
      const mappedBatch = batch.map(recipe => {
        // Fixed: Property 'imageKey' and 'title' do not exist on type 'Recipe'. Using 'image_search_query' and 'name'.
        const query = encodeURIComponent(recipe.image_search_query || recipe.name);
        // We use a high-quality food photography source with relevant keywords
        recipe.image_search_query = `https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800&q=${query}`;
        return recipe;
      });

      recipes.push(...mappedBatch);
    } catch (e) {
      console.error(`  ❌ Failed to parse batch at ${i}.`);
    }

    // Rate limiting delay
    if (totalCount > 50) await new Promise(r => setTimeout(r, 800));
  }

  const outPath = path.resolve("data", "recipes.generated.ts");
  fs.writeFileSync(outPath, `/* AUTO-GENERATED */\nimport { Recipe } from "./recipeTypes";\nexport const RECIPES: Recipe[] = ${JSON.stringify(recipes, null, 2)} as const;`, "utf8");
  console.log(`✅ Completed! ${recipes.length} recipes saved to ${outPath}`);
}
