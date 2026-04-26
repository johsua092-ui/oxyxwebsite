import { NextResponse } from "next/server";

// POST API route registry
const routes: Record<string, { endpoints: Array<{ name: string; method: string; path: string; example?: string }> }> = {
  ai: {
    endpoints: [
      { name: "LuminAI", method: "POST", path: "/api/ai/luminai" },
      { name: "GPT-3", method: "POST", path: "/api/ai/gpt3" },
      { name: "Gemini", method: "POST", path: "/api/ai/gemini" },
    ],
  },
  tools: {
    endpoints: [
      { name: "Text to Image", method: "POST", path: "/api/tools/text2img" },
      { name: "OCR", method: "POST", path: "/api/tools/ocr" },
    ],
  },
};

export async function GET() {
  return NextResponse.json({ routes });
}
