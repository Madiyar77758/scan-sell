import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ScanResult {
  exactProductName: string;
  brand: string;
  model: string;
  confidence: 'High' | 'Medium' | 'Low';
  description: string;
  estimatedValueRange: string;
  priceMin: number;
  priceMax: number;
  suggestedPriceNum: number;
  marketplaces: {
    name: string;
    estimatedPrice: string;
    searchQuery: string;
  }[];
  listing: {
    title: string;
    description: string;
    suggestedPrice: string;
    tags: string[];
  };
}

export async function analyzeImage(base64Image: string): Promise<ScanResult> {
  const mimeType = base64Image.split(';')[0].split(':')[1];
  const data = base64Image.split(',')[1];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType,
            data,
          },
        },
        {
          text: "Analyze this image and identify the EXACT specific product shown. Do not give a generic category. Identify the specific brand, model name, and model number if possible. Estimate its used resale value range in Kazakhstani Tenge (KZT). Provide estimated prices on Kaspi, Wildberries, and OLX. Return the result as JSON. ALL TEXT VALUES IN THE JSON MUST BE IN RUSSIAN (except for brand names and exact model names which should be in their original language). Please provide the absolute minimum price (priceMin) and maximum reasonable price (priceMax) as raw numbers in KZT, as well as a suggested price number (suggestedPriceNum) for a quick sale.",
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          exactProductName: { type: Type.STRING, description: "The exact, specific name of the product (e.g., 'Apple iPhone 13 Pro Max 256GB')." },
          brand: { type: Type.STRING, description: "The brand or manufacturer of the product." },
          model: { type: Type.STRING, description: "The specific model or version." },
          confidence: { type: Type.STRING, enum: ['High', 'Medium', 'Low'], description: "How confident you are that this is the exact product." },
          description: { type: Type.STRING, description: "A short description of the product." },
          estimatedValueRange: { type: Type.STRING, description: "The estimated resale value range in KZT (e.g., '15 000 ₸ - 25 000 ₸')." },
          priceMin: { type: Type.INTEGER, description: "Absolute minimum estimated value in KZT (number only)." },
          priceMax: { type: Type.INTEGER, description: "Absolute maximum estimated value in KZT (number only)." },
          suggestedPriceNum: { type: Type.INTEGER, description: "Suggested selling price in KZT as for a quick sale (number only)." },
          marketplaces: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Name of the marketplace (e.g., Kaspi, Wildberries, OLX)." },
                estimatedPrice: { type: Type.STRING, description: "Estimated price on this marketplace." },
                searchQuery: { type: Type.STRING, description: "A highly specific search query to find this EXACT item on the marketplace." },
              },
              required: ["name", "estimatedPrice", "searchQuery"],
            },
          },
          listing: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "A catchy, SEO-optimized title for a sales listing." },
              description: { type: Type.STRING, description: "A detailed, persuasive description for the sales listing." },
              suggestedPrice: { type: Type.STRING, description: "A suggested selling price in KZT." },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Tags for the listing.",
              },
            },
            required: ["title", "description", "suggestedPrice", "tags"],
          },
        },
        required: ["exactProductName", "brand", "model", "confidence", "description", "estimatedValueRange", "priceMin", "priceMax", "suggestedPriceNum", "marketplaces", "listing"],
      },
    },
  });

  const jsonStr = response.text?.trim() || "{}";
  try {
    return JSON.parse(jsonStr) as ScanResult;
  } catch (e) {
    console.error("Failed to parse Gemini response:", e);
    throw new Error("Failed to analyze image.");
  }
}
