
import { GoogleGenAI } from "@google/genai";

/**
 * Real AI OCR Service using Gemini 3 Flash.
 * Extracts structured text from lab report images.
 */
export const extractTextFromImage = async (base64Image: string): Promise<string> => {
  // Use a new instance to ensure the latest API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Clean the base64 string if it contains the data:image/jpeg;base64, prefix
  const imageData = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;

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
              text: `Extract all medical lab test names, results, and units from this image. 
                     Format it clearly as a text report. If you see reference ranges, include them. 
                     Be extremely precise with numbers and decimals.`,
            },
          ],
        },
      ],
    });

    return response.text || "No text could be extracted. Please try a clearer photo.";
  } catch (error) {
    console.error("Gemini OCR failed:", error);
    throw new Error("AI extraction failed. Please ensure the image is clear and try again.");
  }
};
