import { NextResponse } from 'next/server';
import { LingoDotDevEngine } from "lingo.dev/sdk";

export async function POST(req: Request) {
  try {
    const { medicalData, targetLanguage } = await req.json();

    if (!medicalData || !targetLanguage) {
      return NextResponse.json({ error: "Missing data or target language" }, { status: 400 });
    }

    // Skip translation if the target is English
    if (targetLanguage === 'en') {
      return NextResponse.json({ success: true, translatedData: medicalData });
    }

    // Failsafe: Check if the API key is actually loading from .env.local
    const apiKey = process.env.LINGO_API_KEY || process.env.LINGODOTDEV_API_KEY;
    if (!apiKey) {
      console.error("❌ MISSING LINGO API KEY IN .env.local");
      throw new Error("API Key missing");
    }

    // Initialize SDK
    const lingoDotDev = new LingoDotDevEngine({ apiKey });

    const contentToTranslate = {
      summary: medicalData.overall_summary,
      symptoms: medicalData.symptoms_treated?.join(" | ") || "None", 
      risk: medicalData.risk_explanation,
    };

    console.log("⏳ Sending ENGLISH text to Lingo.dev SDK...");

    const translatedContent = await lingoDotDev.localizeObject(contentToTranslate, {
      sourceLocale: "en",
      targetLocale: targetLanguage,
    });

    console.log("✅ Lingo SDK Success!");

    // Rebuild the final JSON payload with translated strings
    const translatedResult = {
      ...medicalData,
      overall_summary: translatedContent.summary || medicalData.overall_summary,
      symptoms_treated: translatedContent.symptoms ? translatedContent.symptoms.split(" | ") : medicalData.symptoms_treated,
      risk_explanation: translatedContent.risk || medicalData.risk_explanation,
    };

    return NextResponse.json({ success: true, translatedData: translatedResult });

  } catch (error: any) {
    // This will print the EXACT reason it failed in your VS Code terminal
    console.error("🔥 Lingo SDK Error Details:", error?.message || error);
    return NextResponse.json({ error: "Failed to localize medical data", details: error?.message }, { status: 500 });
  }
}