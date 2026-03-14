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

    // Prepare the exact strings we want Lingo to translate
    const contentToTranslate = {
      explanation: medicalData.simplified_explanation,
      warnings: medicalData.allergy_warnings?.join(" | ") || "No warnings", 
    };

    console.log("⏳ Sending ENGLISH text to Lingo.dev SDK...");

    // The actual translation call
    const translatedContent = await lingoDotDev.localizeObject(contentToTranslate, {
      sourceLocale: "en",
      targetLocale: targetLanguage,
    });

    console.log("✅ Lingo SDK Success!");

    // Rebuild the final JSON payload for the frontend UI
    const translatedResult = {
      ...medicalData,
      simplified_explanation: translatedContent.explanation || medicalData.simplified_explanation,
      allergy_warnings: translatedContent.warnings ? translatedContent.warnings.split(" | ") : medicalData.allergy_warnings,
    };

    return NextResponse.json({ success: true, translatedData: translatedResult });

  } catch (error: any) {
    // This will print the EXACT reason it failed in your VS Code terminal
    console.error("🔥 Lingo SDK Error Details:", error?.message || error);
    return NextResponse.json({ error: "Failed to localize medical data", details: error?.message }, { status: 500 });
  }
}