import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
const modelId = "gemini-2.5-flash";

export const GeminiService = {
  /**
   * Enhances a rough user description into a professional job post.
   */
  enhanceDescription: async (rawText: string, serviceType: string): Promise<{ title: string; description: string; estimatedPrice: string }> => {
    if (!process.env.API_KEY) {
      // Fallback if no API key is present
      return {
        title: `${serviceType} Request`,
        description: rawText,
        estimatedPrice: "$50 - $100 (Estimate unavailable)"
      };
    }

    try {
      const response = await ai.models.generateContent({
        model: modelId,
        contents: `
          You are a professional household service manager. 
          A client has provided the following rough details for a ${serviceType} job: "${rawText}".
          
          Please output a JSON object with:
          1. A catchy, professional short title (max 5 words).
          2. A polite, clear, and detailed description of the task suitable for a worker to read.
          3. A realistic estimated price range based on typical US rates (e.g., "$80 - $120").
        `,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              estimatedPrice: { type: Type.STRING }
            },
            required: ["title", "description", "estimatedPrice"]
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("No response from AI");
      
      return JSON.parse(text);
    } catch (error) {
      console.error("Gemini Error:", error);
      return {
        title: `${serviceType} Job`,
        description: rawText,
        estimatedPrice: "Price TBD"
      };
    }
  },

  /**
   * Analyzes an image (simulated upload) to suggest repairs/cleaning.
   * Note: In a real app, we would pass base64 image data.
   */
  analyzeJobImage: async (base64Image: string): Promise<string> => {
     if (!process.env.API_KEY) return "AI analysis unavailable (Missing Key)";

     try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: {
                parts: [
                    { inlineData: { mimeType: "image/jpeg", data: base64Image.split(',')[1] } },
                    { text: "Analyze this image and describe what household service is likely needed (e.g., plumbing repair, cleaning, gardening). Keep it brief." }
                ]
            }
        });
        return response.text || "Could not analyze image.";
     } catch (e) {
         console.error(e);
         return "Error analyzing image.";
     }
  }
};