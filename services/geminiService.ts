import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage } from "../types";

let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (aiInstance) return aiInstance;

  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === 'undefined') {
    console.warn("Gemini API Key is missing. AI features will be disabled. Check your .env file and GEMINI_API_KEY variable.");
    // Return a dummy instance to avoid further crashes, but it won't work for real requests
    aiInstance = new GoogleGenAI({ apiKey: "AIza_MISSING_KEY" });
  } else {
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

export const sendMessageToGemini = async (prompt: string, history: ChatMessage[] = [], inventoryContext?: any[]): Promise<string> => {
  try {
    let systemInstruction = "You are a helpful, concise, and intelligent AI assistant embedded in a futuristic, organic-tech dashboard. Keep responses brief, insightful, and professional.";

    if (inventoryContext) {
      systemInstruction += `\n\nYou have access to the user's current inventory data: ${JSON.stringify(inventoryContext)}. Use this data to answer questions about their items, sales, and inventory status.`;
    }

    // Convert history to Gemini format
    const contents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Add the new prompt
    contents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction,
      }
    });

    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error (v4). Check model availability.";
  }
};

export const analyzeImage = async (base64Image: string, mimeType: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          {
            text: `Analyze this product image for an inventory system.
            
            MANDATORY FIELDS:
            1. Title: A clear, catchy name.
            2. Description: A persuasive description of the item.
            3. Condition: The physical state of the item (e.g., "New", "Like New", "Good", "Fair", "Vintage").
            4. Category: The general classification.
            5. Price: Estimated value in USD.

            DYNAMIC ATTRIBUTES:
            Based on the category, generate 3 to 6 specific technical attributes (key-value pairs) EXCLUDING condition.
            - If Clothing: Material, Size, Color, Brand.
            - If Electronics: Model, Specs, Battery, Ports.
            - If Furniture: Dimensions, Material, Style.
            `
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            condition: { type: Type.STRING, description: "Physical state of the item (New, Used, etc.)" },
            price: { type: Type.NUMBER },
            category: { type: Type.STRING },
            attributes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  key: { type: Type.STRING },
                  value: { type: Type.STRING }
                }
              }
            }
          },
          required: ["title", "description", "condition", "price", "category", "attributes"],
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No response text generated");
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    throw error;
  }
};