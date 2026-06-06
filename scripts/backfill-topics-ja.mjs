import fs from "fs";

function loadEnv() {
  const env = fs.readFileSync(".env.local", "utf8");

  for (const line of env.split("\n")) {
    const clean = line.trim();
    if (!clean || clean.startsWith("#")) continue;

    const index = clean.indexOf("=");
    if (index === -1) continue;

    const key = clean.slice(0, index).trim();
    const value = clean.slice(index + 1).trim().replace(/^["']|["']$/g, "");

    process.env[key] = value;
  }
}

loadEnv();

const { createClient } = await import("@supabase/supabase-js");
const OpenAI = (await import("openai")).default;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function hasJapanese(text = "") {
  return /[\u3040-\u30ff\u3400-\u9fff]/.test(text);
}

async function translate(text) {
  if (!text) return null;
  if (hasJapanese(text)) return text;

  const res = await openai.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5.5",
    input: `Translate this story topic text into natural Japanese. Return ONLY Japanese:\n\n${text}`,
  });

  return res.output_text?.trim();
}

async function run() {
  const { data, error } = await supabase
    .from("topics")
    .select("id, title, description, title_ja, description_ja");

  if (error) throw error;

  console.log("Topics:", data.length);

  for (const topic of data) {
    const titleJa = topic.title_ja || await translate(topic.title);
    const descriptionJa = topic.description_ja || await translate(topic.description);

    await supabase
      .from("topics")
      .update({
        title_ja: titleJa,
        description_ja: descriptionJa,
      })
      .eq("id", topic.id);

    console.log("Updated:", topic.id);
  }

  console.log("Done.");
}

run();
