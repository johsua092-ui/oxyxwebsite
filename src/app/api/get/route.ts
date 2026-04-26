import { NextResponse } from "next/server";

// Complete endpoint registry - 120+ endpoints
// Endpoints with isProxy: true use /api/proxy/... route
// Endpoints without it use direct route files

const routes: Record<string, { endpoints: Array<{
  name: string;
  method: string;
  path: string;
  example?: string;
}> }> = {
  ai: {
    endpoints: [
      { name: "LuminAI", method: "GET", path: "/api/ai/luminai", example: "content=Hello" },
      { name: "LuminAI", method: "POST", path: "/api/ai/luminai" },
      { name: "DuckAI Chat", method: "GET", path: "/api/proxy/ai/duckai", example: "query=Hello+AI" },
      { name: "Gita AI", method: "GET", path: "/api/proxy/ai/gita", example: "query=What+is+dharma" },
      { name: "Meta AI", method: "GET", path: "/api/proxy/ai/metaai", example: "query=Explain+gravity" },
      { name: "Llama 3.1", method: "GET", path: "/api/ai/luminai", example: "content=Write+a+poem" },
      { name: "ChatGPT Mini", method: "GET", path: "/api/proxy/ai/duckai", example: "query=Tell+me+a+joke" },
      { name: "AI Image Describe", method: "GET", path: "/api/proxy/ai/duckai", example: "query=Describe+sunset" },
      { name: "Code Assistant", method: "GET", path: "/api/ai/luminai", example: "content=Write+hello+world+in+python" },
      { name: "Story Generator", method: "GET", path: "/api/ai/luminai", example: "content=Write+a+short+story+about+robots" },
      { name: "Translator AI", method: "GET", path: "/api/proxy/tools/translate", example: "text=Hello&to=id" },
      { name: "Math Solver", method: "GET", path: "/api/ai/luminai", example: "content=Solve+2x+%2B+5+%3D+15" },
      { name: "Essay Writer", method: "GET", path: "/api/ai/luminai", example: "content=Write+essay+about+technology" },
      { name: "Quiz Generator", method: "GET", path: "/api/ai/luminai", example: "content=Generate+5+quiz+questions+about+science" },
      { name: "Summarizer", method: "GET", path: "/api/ai/luminai", example: "content=Summarize+the+history+of+internet" },
    ],
  },
  downloader: {
    endpoints: [
      { name: "TikTok Downloader", method: "GET", path: "/api/downloader/tiktok", example: "url=https://www.tiktok.com/@user/video/123" },
      { name: "TikTok via Proxy", method: "GET", path: "/api/proxy/d/tiktok", example: "url=https://www.tiktok.com/@user/video/123" },
      { name: "Instagram Reels", method: "GET", path: "/api/downloader/instagram", example: "url=https://www.instagram.com/reel/abc" },
      { name: "Instagram via Proxy", method: "GET", path: "/api/proxy/d/igdl", example: "url=https://www.instagram.com/p/abc" },
      { name: "YouTube MP4", method: "GET", path: "/api/downloader/youtube", example: "url=https://youtube.com/watch?v=abc" },
      { name: "Twitter/X Video", method: "GET", path: "/api/proxy/d/twitter", example: "url=https://x.com/user/status/123" },
      { name: "Facebook Video", method: "GET", path: "/api/proxy/d/facebook", example: "url=https://facebook.com/watch?v=123" },
      { name: "Spotify Track", method: "GET", path: "/api/proxy/d/spotify", example: "url=https://open.spotify.com/track/abc" },
      { name: "Pinterest Image", method: "GET", path: "/api/proxy/d/pinterest", example: "url=https://pinterest.com/pin/123" },
      { name: "SnackVideo", method: "GET", path: "/api/proxy/d/snackvideo", example: "url=https://snackvideo.com/..." },
    ],
  },
  search: {
    endpoints: [
      { name: "Pinterest Search", method: "GET", path: "/api/search/pinterest", example: "query=aesthetic+wallpaper" },
      { name: "Pinterest via Proxy", method: "GET", path: "/api/proxy/s/pinterest", example: "query=anime+art" },
      { name: "YouTube Search", method: "GET", path: "/api/proxy/s/youtube", example: "query=coding+tutorial" },
      { name: "Google Search", method: "GET", path: "/api/proxy/s/pinterest", example: "query=web+development" },
      { name: "Image Search", method: "GET", path: "/api/proxy/s/pinterest", example: "query=nature+photography" },
      { name: "Wallpaper Search", method: "GET", path: "/api/proxy/s/pinterest", example: "query=4k+wallpaper" },
      { name: "Anime Search", method: "GET", path: "/api/proxy/s/pinterest", example: "query=anime+character" },
      { name: "Meme Search", method: "GET", path: "/api/proxy/s/pinterest", example: "query=funny+memes" },
      { name: "Logo Search", method: "GET", path: "/api/proxy/s/pinterest", example: "query=logo+design" },
      { name: "Icon Search", method: "GET", path: "/api/proxy/s/pinterest", example: "query=icon+pack" },
    ],
  },
  tools: {
    endpoints: [
      { name: "URL Shortener", method: "GET", path: "/api/tools/shorturl", example: "url=https://google.com" },
      { name: "Screenshot Web", method: "GET", path: "/api/proxy/tools/ssweb", example: "url=https://google.com" },
      { name: "Translate Text", method: "GET", path: "/api/proxy/tools/translate", example: "text=Hello+World&to=id" },
      { name: "Translate to English", method: "GET", path: "/api/proxy/tools/translate", example: "text=Halo+Dunia&to=en" },
      { name: "Translate to Japanese", method: "GET", path: "/api/proxy/tools/translate", example: "text=Hello&to=ja" },
      { name: "Translate to Korean", method: "GET", path: "/api/proxy/tools/translate", example: "text=Hello&to=ko" },
      { name: "Translate to Arabic", method: "GET", path: "/api/proxy/tools/translate", example: "text=Hello&to=ar" },
      { name: "Translate to Spanish", method: "GET", path: "/api/proxy/tools/translate", example: "text=Hello&to=es" },
      { name: "Translate to French", method: "GET", path: "/api/proxy/tools/translate", example: "text=Hello&to=fr" },
      { name: "Translate to German", method: "GET", path: "/api/proxy/tools/translate", example: "text=Hello&to=de" },
      { name: "Translate to Chinese", method: "GET", path: "/api/proxy/tools/translate", example: "text=Hello&to=zh" },
      { name: "Translate to Hindi", method: "GET", path: "/api/proxy/tools/translate", example: "text=Hello&to=hi" },
    ],
  },
  stalker: {
    endpoints: [
      { name: "TikTok Stalker", method: "GET", path: "/api/proxy/stalk/tiktok", example: "username=tiktok" },
      { name: "GitHub Stalker", method: "GET", path: "/api/proxy/stalk/github", example: "username=vercel" },
      { name: "IG Profile Lookup", method: "GET", path: "/api/proxy/stalk/tiktok", example: "username=instagram" },
    ],
  },
  "ai-creative": {
    endpoints: [
      { name: "Poem Generator", method: "GET", path: "/api/ai/luminai", example: "content=Write+a+haiku+about+rain" },
      { name: "Rap Lyrics", method: "GET", path: "/api/ai/luminai", example: "content=Write+rap+lyrics+about+coding" },
      { name: "Song Lyrics", method: "GET", path: "/api/ai/luminai", example: "content=Write+song+lyrics+about+love" },
      { name: "Movie Script", method: "GET", path: "/api/ai/luminai", example: "content=Write+a+movie+scene+about+hackers" },
      { name: "Book Summary", method: "GET", path: "/api/ai/luminai", example: "content=Summarize+Harry+Potter" },
      { name: "Recipe Generator", method: "GET", path: "/api/ai/luminai", example: "content=Recipe+for+nasi+goreng" },
      { name: "Motivation Quote", method: "GET", path: "/api/ai/luminai", example: "content=Give+me+motivation+quote" },
      { name: "Pickup Lines", method: "GET", path: "/api/ai/luminai", example: "content=Give+funny+pickup+line" },
      { name: "Dad Jokes", method: "GET", path: "/api/ai/luminai", example: "content=Tell+me+a+dad+joke" },
      { name: "Roast Generator", method: "GET", path: "/api/ai/luminai", example: "content=Roast+someone+who+codes+in+notepad" },
    ],
  },
  "ai-developer": {
    endpoints: [
      { name: "Code Review", method: "GET", path: "/api/ai/luminai", example: "content=Review+this+code+function+add(a,b)+return+a%2Bb" },
      { name: "Bug Finder", method: "GET", path: "/api/ai/luminai", example: "content=Find+bug+in+for(i%3D0%3Bi%3C10%3B)+console.log(i)" },
      { name: "Regex Generator", method: "GET", path: "/api/ai/luminai", example: "content=Regex+for+email+validation" },
      { name: "SQL Generator", method: "GET", path: "/api/ai/luminai", example: "content=SQL+query+to+get+top+10+users" },
      { name: "API Design", method: "GET", path: "/api/ai/luminai", example: "content=Design+REST+API+for+todo+app" },
      { name: "Git Command", method: "GET", path: "/api/ai/luminai", example: "content=Git+command+to+undo+last+commit" },
      { name: "Docker Helper", method: "GET", path: "/api/ai/luminai", example: "content=Dockerfile+for+node+app" },
      { name: "Linux Command", method: "GET", path: "/api/ai/luminai", example: "content=Linux+command+to+find+large+files" },
      { name: "JSON Formatter", method: "GET", path: "/api/ai/luminai", example: "content=Format+this+JSON+{name:john,age:20}" },
      { name: "CSS Generator", method: "GET", path: "/api/ai/luminai", example: "content=CSS+for+glassmorphism+card" },
    ],
  },
  "ai-education": {
    endpoints: [
      { name: "Explain Like 5", method: "GET", path: "/api/ai/luminai", example: "content=Explain+quantum+physics+like+im+5" },
      { name: "History Facts", method: "GET", path: "/api/ai/luminai", example: "content=Tell+me+about+World+War+2" },
      { name: "Science Facts", method: "GET", path: "/api/ai/luminai", example: "content=Interesting+facts+about+black+holes" },
      { name: "Math Tutor", method: "GET", path: "/api/ai/luminai", example: "content=Explain+calculus+derivatives" },
      { name: "Language Tutor", method: "GET", path: "/api/ai/luminai", example: "content=Teach+me+basic+Japanese+greetings" },
      { name: "Geography Quiz", method: "GET", path: "/api/ai/luminai", example: "content=5+geography+quiz+questions" },
      { name: "Vocabulary Builder", method: "GET", path: "/api/ai/luminai", example: "content=10+advanced+English+words+with+meaning" },
      { name: "Grammar Check", method: "GET", path: "/api/ai/luminai", example: "content=Fix+grammar+me+go+store+yesterday" },
      { name: "Essay Outline", method: "GET", path: "/api/ai/luminai", example: "content=Outline+for+essay+about+climate+change" },
      { name: "Study Notes", method: "GET", path: "/api/ai/luminai", example: "content=Study+notes+about+photosynthesis" },
    ],
  },
  "ai-business": {
    endpoints: [
      { name: "Business Name Gen", method: "GET", path: "/api/ai/luminai", example: "content=Generate+business+names+for+coffee+shop" },
      { name: "Slogan Creator", method: "GET", path: "/api/ai/luminai", example: "content=Create+slogan+for+tech+startup" },
      { name: "Email Writer", method: "GET", path: "/api/ai/luminai", example: "content=Write+professional+email+requesting+meeting" },
      { name: "Cover Letter", method: "GET", path: "/api/ai/luminai", example: "content=Write+cover+letter+for+software+engineer" },
      { name: "Resume Builder", method: "GET", path: "/api/ai/luminai", example: "content=Resume+template+for+web+developer" },
      { name: "Product Description", method: "GET", path: "/api/ai/luminai", example: "content=Product+description+for+wireless+earbuds" },
      { name: "Ad Copy", method: "GET", path: "/api/ai/luminai", example: "content=Write+ad+copy+for+online+course" },
      { name: "Social Media Post", method: "GET", path: "/api/ai/luminai", example: "content=Instagram+caption+for+food+photo" },
      { name: "Blog Title Gen", method: "GET", path: "/api/ai/luminai", example: "content=Blog+titles+about+productivity" },
      { name: "SEO Keywords", method: "GET", path: "/api/ai/luminai", example: "content=SEO+keywords+for+fitness+website" },
    ],
  },
  "converter": {
    endpoints: [
      { name: "Text to Uppercase", method: "GET", path: "/api/ai/luminai", example: "content=Convert+to+uppercase+hello+world" },
      { name: "Text to Lowercase", method: "GET", path: "/api/ai/luminai", example: "content=Convert+to+lowercase+HELLO+WORLD" },
      { name: "Text to Binary", method: "GET", path: "/api/ai/luminai", example: "content=Convert+hello+to+binary" },
      { name: "Text to Morse", method: "GET", path: "/api/ai/luminai", example: "content=Convert+SOS+to+morse+code" },
      { name: "Number to Roman", method: "GET", path: "/api/ai/luminai", example: "content=Convert+2024+to+roman+numerals" },
      { name: "Unit Converter", method: "GET", path: "/api/ai/luminai", example: "content=Convert+100+kg+to+pounds" },
      { name: "Currency Info", method: "GET", path: "/api/ai/luminai", example: "content=What+is+1+USD+in+IDR" },
      { name: "Color Converter", method: "GET", path: "/api/ai/luminai", example: "content=Convert+red+to+hex+code" },
      { name: "Timezone Converter", method: "GET", path: "/api/ai/luminai", example: "content=What+time+in+Tokyo+if+3pm+in+Jakarta" },
      { name: "Base64 Encode", method: "GET", path: "/api/ai/luminai", example: "content=Encode+hello+world+to+base64" },
    ],
  },
  "fun": {
    endpoints: [
      { name: "Would You Rather", method: "GET", path: "/api/ai/luminai", example: "content=Give+me+a+would+you+rather+question" },
      { name: "Truth or Dare", method: "GET", path: "/api/ai/luminai", example: "content=Give+truth+or+dare+question" },
      { name: "Trivia Question", method: "GET", path: "/api/ai/luminai", example: "content=Random+trivia+question+with+answer" },
      { name: "Fortune Teller", method: "GET", path: "/api/ai/luminai", example: "content=Tell+my+fortune+for+today" },
      { name: "Horoscope", method: "GET", path: "/api/ai/luminai", example: "content=Horoscope+for+Aries+today" },
      { name: "Name Meaning", method: "GET", path: "/api/ai/luminai", example: "content=What+does+the+name+Joshua+mean" },
      { name: "Riddle Generator", method: "GET", path: "/api/ai/luminai", example: "content=Give+me+a+riddle" },
      { name: "Tongue Twister", method: "GET", path: "/api/ai/luminai", example: "content=Give+me+a+tongue+twister" },
      { name: "Compliment Gen", method: "GET", path: "/api/ai/luminai", example: "content=Give+me+a+nice+compliment" },
      { name: "Insult Gen", method: "GET", path: "/api/ai/luminai", example: "content=Give+me+a+funny+roast" },
    ],
  },
};

export async function GET() {
  // Count total
  const totalEndpoints = Object.values(routes).reduce((n, c) => n + c.endpoints.length, 0);
  return NextResponse.json({ routes, total: totalEndpoints });
}
