
import React, { useState, useRef } from 'react';
import Button from './Button';
import SegmentedControl from './onboarding/SegmentedControl';
import { FoodItem } from '../context/WellnessContext';
import { GoogleGenAI, Type } from "@google/genai";

interface LogMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (meal: { type: string; items: FoodItem[] }) => void;
}

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

const LogMealModal: React.FC<LogMealModalProps> = ({ isOpen, onClose, onSave }) => {
  const [mealType, setMealType] = useState('Breakfast');
  const [foodName, setFoodName] = useState('');
  const [foodCals, setFoodCals] = useState('');
  const [items, setItems] = useState<FoodItem[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const analyzeFoodImage = async (base64Image: string) => {
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: base64Image.split(',')[1],
                },
              },
              {
                text: "Analyze this food image. Identify the meal and estimate its nutritional content. Return a JSON object with properties: name (string), calories (number), protein_g (number), carbs_g (number), fat_g (number), fiber_g (number). Focus on PCOS-friendly accuracy.",
              },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              calories: { type: Type.NUMBER },
              protein_g: { type: Type.NUMBER },
              carbs_g: { type: Type.NUMBER },
              fat_g: { type: Type.NUMBER },
              fiber_g: { type: Type.NUMBER },
            },
            required: ["name", "calories", "protein_g", "carbs_g", "fat_g", "fiber_g"],
          },
        },
      });

      const result = JSON.parse(response.text || '{}');
      if (result.name) {
        const newItem: FoodItem = {
          id: Math.random().toString(36).substr(2, 9),
          name: result.name,
          calories: result.calories,
          protein_g: result.protein_g,
          carbs_g: result.carbs_g,
          fat_g: result.fat_g,
          fiber_g: result.fiber_g,
        };
        setItems(prev => [...prev, newItem]);
        setCapturedImage(null);
      }
    } catch (error) {
      console.error("AI Analysis failed:", error);
      alert("Could not analyze image. Please enter details manually.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setCapturedImage(base64);
        analyzeFoodImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = async () => {
    if (!foodName) return;
    
    // If calories are missing, ask AI to estimate based on name
    if (!foodCals) {
      setIsAnalyzing(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Estimate nutritional value for: ${foodName}. Focus on PCOS health.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                calories: { type: Type.NUMBER },
                protein_g: { type: Type.NUMBER },
                carbs_g: { type: Type.NUMBER },
                fat_g: { type: Type.NUMBER },
                fiber_g: { type: Type.NUMBER },
              },
              required: ["calories", "protein_g", "carbs_g", "fat_g", "fiber_g"],
            }
          }
        });
        const result = JSON.parse(response.text || '{}');
        const newItem: FoodItem = {
          id: Math.random().toString(36).substr(2, 9),
          name: foodName,
          calories: result.calories,
          protein_g: result.protein_g,
          carbs_g: result.carbs_g,
          fat_g: result.fat_g,
          fiber_g: result.fiber_g,
        };
        setItems([...items, newItem]);
      } catch (e) {
        alert("Enter calories manually.");
      } finally {
        setIsAnalyzing(false);
      }
    } else {
      const newItem: FoodItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: foodName,
        calories: parseInt(foodCals)
      };
      setItems([...items, newItem]);
    }
    setFoodName('');
    setFoodCals('');
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const totalCalories = items.reduce((sum, item) => sum + item.calories, 0);

  const handleSave = () => {
    if (items.length === 0) return;
    onSave({ type: mealType, items });
    setItems([]);
    setMealType('Breakfast');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 animate-in fade-in duration-300">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="w-full max-w-md bg-white rounded-t-[28px] p-8 pb-12 shadow-2xl animate-in slide-in-from-bottom-full duration-300 relative z-50 overflow-y-auto max-h-[90vh] hide-scrollbar">
        <div className="w-12 h-1.5 bg-[#E5E7EB] rounded-full mx-auto mb-8" />
        
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-[#1F2937]">Log Meal</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#F7F4F1] flex items-center justify-center text-[#6B7280]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <SegmentedControl 
            options={MEAL_TYPES} 
            selectedOption={mealType} 
            onSelect={setMealType} 
            label="Meal Type"
          />

          <div className="grid grid-cols-2 gap-3">
             <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-4 bg-[#8FAF9D]/5 border border-dashed border-[#8FAF9D]/30 rounded-[18px] transition-all active:scale-95"
             >
                <div className="text-2xl mb-2">📸</div>
                <span className="text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest">Take Image</span>
             </button>
             <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-4 bg-[#DDEEF4]/20 border border-dashed border-[#DDEEF4]/50 rounded-[18px] transition-all active:scale-95"
             >
                <div className="text-2xl mb-2">🖼️</div>
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Upload Image</span>
             </button>
             <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
             />
          </div>

          <div className="bg-[#F7F4F1] p-4 rounded-[18px] border border-[#E5E7EB]">
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-3 px-1">Manual Entry</p>
            <div className="flex gap-2 items-center">
              <input 
                type="text" 
                placeholder="Item name (e.g. Avocado Toast)"
                className="flex-[2] min-w-0 h-10 bg-white border border-[#E5E7EB] rounded-[12px] px-3 text-sm outline-none focus:border-[#8FAF9D] transition-colors"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
              />
              <input 
                type="number" 
                placeholder="kcal"
                className="flex-1 min-w-0 h-10 bg-white border border-[#E5E7EB] rounded-[12px] px-2 text-sm outline-none focus:border-[#8FAF9D] transition-colors"
                value={foodCals}
                onChange={(e) => setFoodCals(e.target.value)}
              />
              <button 
                onClick={handleAddItem}
                disabled={isAnalyzing}
                className={`w-10 h-10 flex-shrink-0 rounded-[12px] bg-[#8FAF9D] text-white flex items-center justify-center shadow-sm active:scale-90 transition-transform ${isAnalyzing ? 'opacity-50' : ''}`}
                aria-label="Add food item"
              >
                {isAnalyzing ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {isAnalyzing && (
            <div className="flex items-center justify-center gap-3 p-4 bg-[#8FAF9D]/5 rounded-xl border border-[#8FAF9D]/10">
               <div className="w-5 h-5 border-2 border-[#8FAF9D]/30 border-t-[#8FAF9D] rounded-full animate-spin" />
               <p className="text-xs font-bold text-[#8FAF9D] uppercase tracking-widest">AI analyzing nutrition...</p>
            </div>
          )}

          {items.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Added Items</p>
                <p className="text-[10px] font-bold text-[#8FAF9D] uppercase tracking-widest">{totalCalories} Total kcal</p>
              </div>
              <div className="bg-white border border-[#E5E7EB] rounded-[18px] overflow-hidden">
                {items.map((item, idx) => (
                  <div key={item.id} className={`flex justify-between items-center p-3 px-4 ${idx !== items.length - 1 ? 'border-b border-[#F7F4F1]' : ''}`}>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[#1F2937] truncate">{item.name}</p>
                      <div className="flex gap-2 mt-0.5">
                        <p className="text-[10px] font-bold text-[#8FAF9D]">{item.calories} kcal</p>
                        {item.protein_g !== undefined && (
                          <p className="text-[9px] text-[#6B7280]">P: {item.protein_g}g • C: {item.carbs_g}g • F: {item.fat_g}g</p>
                        )}
                      </div>
                    </div>
                    <button onClick={() => handleRemoveItem(item.id)} className="text-[#E26D6D] p-1 ml-2 flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button 
            label="Save Meal" 
            onPress={handleSave} 
            className={`w-full mt-2 ${items.length === 0 || isAnalyzing ? 'opacity-50 pointer-events-none' : ''}`}
          />
        </div>
      </div>
    </div>
  );
};

export default LogMealModal;
