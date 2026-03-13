import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyCyOyN28w36E15lVK5IdRBQR2hR7G_O1yM" });

async function test() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: "Hello",
    });
    console.log("SUCCESS:", response.text);
  } catch (e: any) {
    console.error("ERROR:", JSON.stringify(e, null, 2));
  }
}

test();
