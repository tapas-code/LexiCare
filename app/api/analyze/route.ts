import { NextResponse } from 'next/server';
import { GoogleGenAI, Type, Schema } from '@google/genai';

// Initialize the Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { imageBase64, userProfile } = body;

    if (!imageBase64) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Strip the "data:image/jpeg;base64," prefix if it exists from the frontend
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const profileForAI = {
      allergies: userProfile?.allergies || [],
      medications: userProfile?.medications || []
    };

    const systemInstruction = `
      You are an expert medical AI. The user has uploaded an image of a medical prescription or over-the-counter medicine box.
      You must:
      1. Extract the active ingredients and dosage.
      2. Simplify the medical jargon into plain, easy-to-understand terms.
      3. Cross-reference the ingredients with the user's health profile: ${JSON.stringify(profileForAI)}.
      4. Flag any high-risk allergy interactions or drug conflicts.

      CRITICAL INSTRUCTION: You MUST generate your entire response in strictly ENGLISH. Do NOT translate the output into any other language.
    `;

    // Gemini allows us to strictly define the JSON schema it MUST return
    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
        simplified_explanation: { type: Type.STRING },
        allergy_warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
        risk_level: { type: Type.STRING, enum: ["safe", "warning", "danger"] },
      },
      required: ["ingredients", "simplified_explanation", "allergy_warnings", "risk_level"],
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Fast, multimodal, and FREE tier available
      contents: [
        {
          role: 'user',
          parts: [
            { text: "Analyze this medical label based on the system instructions." },
            { inlineData: { mimeType: "image/jpeg", data: base64Data } }
          ],
        }
      ],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    // Parse the guaranteed JSON response
    const aiResult = JSON.parse(response.text || "{}");

    return NextResponse.json({ success: true, data: aiResult });

  } catch (error) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 });
  }
}