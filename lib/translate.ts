import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function hasJapanese(text: string) {
  return /[\u3040-\u30ff\u3400-\u9fff]/.test(text);
}

export async function translateToJapaneseIfEnglish(text: string) {
  if (!text || hasJapanese(text)) {
    return {
      sourceLanguage: "ja",
      japanese: text,
    };
  }

  if (!process.env.OPENAI_API_KEY) {
    return {
      sourceLanguage: "en",
      japanese: null,
    };
  }

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5.5",
    input: `Translate this story contribution into natural Japanese. Preserve tone, imagery, names, and paragraph breaks. Return only the Japanese translation:\n\n${text}`,
  });

  return {
    sourceLanguage: "en",
    japanese: response.output_text?.trim() || null,
  };
}
