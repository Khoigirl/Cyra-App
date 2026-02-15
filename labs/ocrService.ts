
import { GoogleGenAI } from "@google/genai";

/**
 * Real AI OCR Service using Gemini 3 Flash.
 * Extracts structured text from lab report images.
 */
export const extractTextFromImage = async (base64Image: string): Promise<string> => {
  // Use a new instance to ensure the latest API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // CRITICAL: Remove the data URL prefix (e.g., data:image/jpeg;base64,) 
  // as the API expects raw base64 encoded bytes.
  let imageData = base64Image;
  if (base64Image.includes(',')) {
    imageData = base64Image.split(',')[1];
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: imageData,
              },
            },
            {
              text: `You are a medical data extraction expert. 
                     Please extract all lab test names, results, and units found in this image.
                     Format the output as a clean, line-by-line list:
                     [Test Name] [Value] [Unit]
                     Example: Fasting Glucose 92 mg/dL
                     Be extremely accurate with decimals and unit names.`,
            },
          ],
        },
      ],
    });

    if (!response.text) {
      throw new Error("The AI returned an empty response. Please try a clearer photo.");
    }

    return response.text;
  } catch (error: any) {
    console.error("Gemini OCR failed:", error);
    if (error.message?.includes('API_KEY')) {
      throw new Error("Scanner configuration error. Please contact support.");
    }
    throw new Error("AI extraction failed. Please ensure the image is clear and contains text.");
  }
};
