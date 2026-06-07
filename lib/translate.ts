import OpenAI from "openai";

function hasJapanese(text: string) {
  return /[\u3040-\u30ff\u3400-\u9fff]/.test(text);
}

export async function translateToJapaneseIfEnglish(text: string) {
  if (!text) {
    return { sourceLanguage: "unknown", japanese: null, translated: false };
  }

  if (hasJapanese(text)) {
    return { sourceLanguage: "ja", japanese: text, translated: true };
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error("Missing OPENAI_API_KEY");
    return { sourceLanguage: "en", japanese: null, translated: false };
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY.trim(),
    });

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input: `Translate this story contribution into natural Japanese.
Preserve paragraph breaks.
Return only Japanese.

${text}`,
    });

    const japanese = response.output_text?.trim() || null;

    console.log("Translation result:", {
      inputLength: text.length,
      outputLength: japanese?.length || 0,
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    });

    return {
      sourceLanguage: "en",
      japanese,
      translated: Boolean(japanese),
    };
  } catch (error: any) {
    console.error("Translation failed:", error?.message || error);
    return { sourceLanguage: "en", japanese: null, translated: false };
  }
}
