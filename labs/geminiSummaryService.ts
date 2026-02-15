
import { GoogleGenAI, Type } from "@google/genai";
import { LabResult } from "./types";

export interface LabSummary {
  summary: string;
  highlights: string[];
  questionsForClinician: string[];
  gentleNextSteps: string[];
  disclaimer: string;
}

/**
 * Uses Gemini to generate a wellness summary for confirmed lab results.
 * Gemini ONLY sees structured JSON, not the original report image.
 */
export const generateLabsSummary = async (confirmedResults: Partial<LabResult>[]): Promise<LabSummary> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const resultsJson = JSON.stringify(confirmedResults, null, 2);
  
  const prompt = `
    You are a compassionate PCOS health educator. 
    Analyze the following confirmed laboratory results for a user tracking their wellness journey.
    Provide a supportive, informational summary focused on education and clinic communication.
    
    STRICT RULES:
    - DO NOT provide a medical diagnosis or treatment plan.
    - USE CAUTIOUS PHRASING: "may indicate", "may correlate with", "often associated with", "might reflect".
    - DO NOT give urgent warnings unless values are physically impossible (suggest lab error).
    - USE a calm, wellness-focused tone.
    - ALWAYS emphasize that results must be discussed with a doctor for interpretation.
    
    RESULTS JSON:
    ${resultsJson}
    
    RESPONSE SCHEMA:
    Return a JSON object with properties:
    - summary: A 2-3 sentence overview of what these markers track (e.g. "These markers focus on identifying patterns in your metabolic and hormonal balance").
    - highlights: An array of 2-3 educational observations using cautious language (e.g. "Your Fasting Glucose value may correlate with steady energy patterns").
    - questionsForClinician: 3-4 specific, professional questions the user can take to their next appointment.
    - gentleNextSteps: 2-3 lifestyle-based supportive habits (e.g. "Continuing with fiber-rich protein pairings").
    - disclaimer: A mandatory standard medical disclaimer.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
            questionsForClinician: { type: Type.ARRAY, items: { type: Type.STRING } },
            gentleNextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
            disclaimer: { type: Type.STRING },
          },
          required: ["summary", "highlights", "questionsForClinician", "gentleNextSteps", "disclaimer"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini summary failed:", error);
    return {
      summary: "We've recorded your results. These markers may help you identify patterns in your unique hormonal rhythm over time.",
      highlights: ["Results successfully logged to your history."],
      questionsForClinician: ["How do these results compare to my previous tests?", "Are there specific markers you'd like me to re-test next cycle?"],
      gentleNextSteps: ["Continue consistent logging to see trends."],
      disclaimer: "Cyra is for educational purposes only. Always consult with a qualified clinician."
    };
  }
};
