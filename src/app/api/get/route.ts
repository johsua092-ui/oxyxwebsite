import { NextResponse } from "next/server";

interface EndpointDef {
  name: string;
  method: string;
  path: string;
  example?: string;
  params?: { name: string; required: boolean; placeholder?: string }[];
}

const routes: Record<string, { endpoints: EndpointDef[] }> = {
  ai: {
    endpoints: [
      // LuminAI (own backend with fallback)
      {
        name: "LuminAI Chat", method: "GET", path: "/api/ai/luminai", example: "content=Hello+AI",
        params: [{ name: "content", required: true, placeholder: "Your message here" }],
      },
      {
        name: "LuminAI Chat", method: "POST", path: "/api/ai/luminai",
        params: [{ name: "content", required: true, placeholder: "Your message here" }],
      },
      // DuckAI (GPT-4o-mini via siputzx)
      {
        name: "DuckAI Chat", method: "GET", path: "/api/proxy/ai/duckai", example: "message=Hello",
        params: [{ name: "message", required: true, placeholder: "Your message" }],
      },
      {
        name: "DuckAI Chat", method: "POST", path: "/api/proxy/ai/duckai",
        params: [{ name: "message", required: true, placeholder: "Your message" }],
      },
      // Gemini
      {
        name: "Gemini (Beta)", method: "GET", path: "/api/proxy/ai/gemini",
        example: "text=Explain+quantum+physics&cookie=test&promptSystem=Act+as+a+professional",
        params: [
          { name: "text", required: true, placeholder: "Your question" },
          { name: "cookie", required: true, placeholder: "Session cookie" },
          { name: "promptSystem", required: false, placeholder: "System prompt" },
          { name: "imageUrl", required: false, placeholder: "Image URL (optional)" },
        ],
      },
      {
        name: "Gemini (Beta)", method: "POST", path: "/api/proxy/ai/gemini",
        params: [
          { name: "content", required: true, placeholder: "Your question" },
          { name: "cookie", required: true, placeholder: "Session cookie" },
          { name: "promptSystem", required: false, placeholder: "System prompt" },
          { name: "imageUrl", required: false, placeholder: "Image URL" },
          { name: "conversationId", required: false, placeholder: "Conversation ID" },
          { name: "responseId", required: false, placeholder: "Response ID" },
          { name: "choiceId", required: false, placeholder: "Choice ID" },
        ],
      },
      // Gita AI
      {
        name: "Gita AI", method: "GET", path: "/api/proxy/ai/gita", example: "query=What+is+dharma",
        params: [{ name: "query", required: true, placeholder: "Your question" }],
      },
      {
        name: "Gita AI", method: "POST", path: "/api/proxy/ai/gita",
        params: [{ name: "query", required: true, placeholder: "Your question" }],
      },
      // Meta AI
      {
        name: "Meta AI", method: "GET", path: "/api/proxy/ai/metaai", example: "query=Hello",
        params: [{ name: "query", required: true, placeholder: "Your question" }],
      },
      {
        name: "Meta AI", method: "POST", path: "/api/proxy/ai/metaai",
        params: [{ name: "query", required: true, placeholder: "Your question" }],
      },
    ],
  },
  downloader: {
    endpoints: [
      {
        name: "TikTok Downloader", method: "GET", path: "/api/proxy/d/tiktok",
        example: "url=https://www.tiktok.com/@user/video/123",
        params: [{ name: "url", required: true, placeholder: "TikTok video URL" }],
      },
      {
        name: "TikTok Downloader", method: "POST", path: "/api/proxy/d/tiktok",
        params: [{ name: "url", required: true, placeholder: "TikTok video URL" }],
      },
      {
        name: "Instagram Downloader", method: "GET", path: "/api/proxy/d/igdl",
        example: "url=https://www.instagram.com/reel/abc",
        params: [{ name: "url", required: true, placeholder: "Instagram post/reel URL" }],
      },
      {
        name: "Instagram Downloader", method: "POST", path: "/api/proxy/d/igdl",
        params: [{ name: "url", required: true, placeholder: "Instagram post/reel URL" }],
      },
      {
        name: "Twitter/X Video", method: "GET", path: "/api/proxy/d/twitter",
        example: "url=https://x.com/user/status/123",
        params: [{ name: "url", required: true, placeholder: "Twitter/X post URL" }],
      },
      {
        name: "Twitter/X Video", method: "POST", path: "/api/proxy/d/twitter",
        params: [{ name: "url", required: true, placeholder: "Twitter/X post URL" }],
      },
      {
        name: "Facebook Video", method: "GET", path: "/api/proxy/d/facebook",
        example: "url=https://facebook.com/watch?v=123",
        params: [{ name: "url", required: true, placeholder: "Facebook video URL" }],
      },
      {
        name: "Facebook Video", method: "POST", path: "/api/proxy/d/facebook",
        params: [{ name: "url", required: true, placeholder: "Facebook video URL" }],
      },
      {
        name: "Spotify Track", method: "GET", path: "/api/proxy/d/spotify",
        example: "url=https://open.spotify.com/track/abc",
        params: [{ name: "url", required: true, placeholder: "Spotify track URL" }],
      },
      {
        name: "Spotify Track", method: "POST", path: "/api/proxy/d/spotify",
        params: [{ name: "url", required: true, placeholder: "Spotify track URL" }],
      },
      {
        name: "Pinterest Download", method: "GET", path: "/api/proxy/d/pinterest",
        example: "url=https://pinterest.com/pin/123",
        params: [{ name: "url", required: true, placeholder: "Pinterest pin URL" }],
      },
      {
        name: "SnackVideo", method: "GET", path: "/api/proxy/d/snackvideo",
        example: "url=https://snackvideo.com/...",
        params: [{ name: "url", required: true, placeholder: "SnackVideo URL" }],
      },
    ],
  },
  search: {
    endpoints: [
      {
        name: "Pinterest Search", method: "GET", path: "/api/proxy/s/pinterest",
        example: "query=aesthetic+wallpaper",
        params: [{ name: "query", required: true, placeholder: "Search term" }],
      },
      {
        name: "Pinterest Search", method: "POST", path: "/api/proxy/s/pinterest",
        params: [{ name: "query", required: true, placeholder: "Search term" }],
      },
      {
        name: "YouTube Search", method: "GET", path: "/api/proxy/s/youtube",
        example: "query=coding+tutorial",
        params: [{ name: "query", required: true, placeholder: "Search term" }],
      },
      {
        name: "YouTube Search", method: "POST", path: "/api/proxy/s/youtube",
        params: [{ name: "query", required: true, placeholder: "Search term" }],
      },
    ],
  },
  tools: {
    endpoints: [
      {
        name: "Screenshot Website", method: "GET", path: "/api/proxy/tools/ssweb",
        example: "url=https://google.com",
        params: [{ name: "url", required: true, placeholder: "Website URL" }],
      },
      {
        name: "Translate Text", method: "GET", path: "/api/proxy/tools/translate",
        example: "text=Hello+World&to=id",
        params: [
          { name: "text", required: true, placeholder: "Text to translate" },
          { name: "to", required: true, placeholder: "Target language (id, en, ja, ko, etc)" },
        ],
      },
      {
        name: "Translate Text", method: "POST", path: "/api/proxy/tools/translate",
        params: [
          { name: "text", required: true, placeholder: "Text to translate" },
          { name: "to", required: true, placeholder: "Target language code" },
        ],
      },
      {
        name: "URL Shortener", method: "GET", path: "/api/tools/shorturl",
        example: "url=https://google.com",
        params: [{ name: "url", required: true, placeholder: "URL to shorten" }],
      },
    ],
  },
  stalker: {
    endpoints: [
      {
        name: "GitHub Stalker", method: "GET", path: "/api/proxy/stalk/github",
        example: "user=vercel",
        params: [{ name: "user", required: true, placeholder: "GitHub username" }],
      },
      {
        name: "GitHub Stalker", method: "POST", path: "/api/proxy/stalk/github",
        params: [{ name: "user", required: true, placeholder: "GitHub username" }],
      },
      {
        name: "TikTok Stalker", method: "GET", path: "/api/proxy/stalk/tiktok",
        example: "username=tiktok",
        params: [{ name: "username", required: true, placeholder: "TikTok username" }],
      },
    ],
  },
};

export async function GET() {
  const totalEndpoints = Object.values(routes).reduce((n, c) => n + c.endpoints.length, 0);
  return NextResponse.json({ routes, total: totalEndpoints });
}
