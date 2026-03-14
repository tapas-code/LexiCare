import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { medicalData, targetLanguage } = await req.json();

    if (!medicalData || !targetLanguage) {
      return NextResponse.json({ error: "Missing data or target language" }, { status: 400 });
    }

    // If the target is English, skip the API call to save latency
    if (targetLanguage === 'en') {
      return NextResponse.json({ success: true, translatedData: medicalData });
    }

    // Prepare the payload for Lingo.dev
    // We only translate the user-facing text, keeping the risk_level machine-readable
    const textToTranslate = {
      explanation: medicalData.simplified_explanation,
      warnings: medicalData.allergy_warnings.join(" | "), // Join arrays for easier translation
    };

    // The Lingo.dev API Call
    // Note: Adjust the endpoint/format slightly based on their exact hackathon SDK documentation
    const lingoResponse = await fetch("https://api.lingo.dev/v1/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.LINGO_API_KEY}`,
      },
      body: JSON.stringify({
        source_language: "en",
        target_language: targetLanguage,
        content: textToTranslate,
        // THIS IS HOW YOU WIN: Passing context ensures medical terms aren't mistranslated
        context: "This is a highly sensitive medical warning for a patient. Maintain an empathetic but urgent tone. Ensure drug names and medical conditions are accurately localized.",
      }),
    });

    if (!lingoResponse.ok) {
      throw new Error(`Lingo API Error: ${lingoResponse.statusText}`);
    }

    const lingoData = await lingoResponse.json();

    // Reconstruct the JSON object with the localized strings
    const translatedResult = {
      ...medicalData,
      simplified_explanation: lingoData.translated_content.explanation,
      allergy_warnings: lingoData.translated_content.warnings.split(" | "),
    };

    return NextResponse.json({ success: true, translatedData: translatedResult });

  } catch (error) {
    console.error("Lingo.dev Translation Error:", error);
    return NextResponse.json({ error: "Failed to localize medical data" }, { status: 500 });
  }
}