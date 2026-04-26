import { NextResponse } from "next/server";

// API route registry - add your routes here
const routes: Record<string, { endpoints: Array<{ name: string; method: string; path: string; example?: string }> }> = {
  ai: {
    endpoints: [
      { name: "LuminAI", method: "GET", path: "/api/ai/luminai", example: "content=Hello%20AI" },
      { name: "GPT-3", method: "GET", path: "/api/ai/gpt3", example: "content=Tell%20me%20a%20story" },
      { name: "Gemini", method: "GET", path: "/api/ai/gemini", example: "content=What%20is%20quantum%20physics" },
      { name: "BlackboxAI", method: "GET", path: "/api/ai/blackboxai", example: "content=Explain%20recursion" },
      { name: "Meta AI", method: "GET", path: "/api/ai/metaai", example: "content=Hello%20Meta" },
    ],
  },
  downloader: {
    endpoints: [
      { name: "TikTok Downloader", method: "GET", path: "/api/downloader/tiktok", example: "url=https://tiktok.com/..." },
      { name: "YouTube Downloader", method: "GET", path: "/api/downloader/youtube", example: "url=https://youtube.com/..." },
      { name: "Instagram Downloader", method: "GET", path: "/api/downloader/instagram", example: "url=https://instagram.com/..." },
      { name: "Twitter/X Downloader", method: "GET", path: "/api/downloader/twitter", example: "url=https://x.com/..." },
      { name: "Facebook Downloader", method: "GET", path: "/api/downloader/facebook", example: "url=https://facebook.com/..." },
    ],
  },
  tools: {
    endpoints: [
      { name: "Screenshot", method: "GET", path: "/api/tools/screenshot", example: "url=https://google.com" },
      { name: "QR Generator", method: "GET", path: "/api/tools/qrcode", example: "text=Hello%20World" },
      { name: "URL Shortener", method: "GET", path: "/api/tools/shorturl", example: "url=https://example.com" },
      { name: "Translate", method: "GET", path: "/api/tools/translate", example: "text=Hello&to=id" },
    ],
  },
  search: {
    endpoints: [
      { name: "Google Search", method: "GET", path: "/api/search/google", example: "query=nextjs%20tutorial" },
      { name: "YouTube Search", method: "GET", path: "/api/search/youtube", example: "query=coding%20music" },
      { name: "Image Search", method: "GET", path: "/api/search/images", example: "query=nature%20wallpaper" },
      { name: "Pinterest Search", method: "GET", path: "/api/search/pinterest", example: "query=aesthetic%20wallpaper" },
    ],
  },
  random: {
    endpoints: [
      { name: "Random Quote", method: "GET", path: "/api/random/quote" },
      { name: "Random Joke", method: "GET", path: "/api/random/joke" },
      { name: "Random Anime", method: "GET", path: "/api/random/anime" },
      { name: "Random Meme", method: "GET", path: "/api/random/meme" },
    ],
  },
  info: {
    endpoints: [
      { name: "IP Info", method: "GET", path: "/api/info/ip", example: "ip=8.8.8.8" },
      { name: "Weather", method: "GET", path: "/api/info/weather", example: "city=Jakarta" },
      { name: "NPM Package", method: "GET", path: "/api/info/npm", example: "package=next" },
    ],
  },
};

export async function GET() {
  return NextResponse.json({ routes });
}
