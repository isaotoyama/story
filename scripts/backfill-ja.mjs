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

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL in .env.local");
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY in .env.local");
}

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY in .env.local");
}

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
  const res = await openai.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5.5",
    input: `Translate this into natural Japanese. Return ONLY Japanese:\n\n${text}`,
  });

  return res.output_text?.trim();
}

async function run() {
  const { data, error } = await supabase
    .from("story_contributions")
    .select("id, content, content_ja")
    .or("content_ja.is.null,content_ja.eq.");

  if (error) throw error;

  console.log("Rows:", data.length);

  for (const row of data) {
    if (!row.content) continue;

    if (hasJapanese(row.content)) {
      await supabase
        .from("story_contributions")
        .update({
          content_ja: row.content,
          source_language: "ja",
        })
        .eq("id", row.id);

      console.log("Already Japanese:", row.id);
      continue;
    }

    const ja = await translate(row.content);

    await supabase
      .from("story_contributions")
      .update({
        content_ja: ja,
        source_language: "en",
      })
      .eq("id", row.id);

    console.log("Translated:", row.id);
  }

  console.log("Done.");
}

run();
