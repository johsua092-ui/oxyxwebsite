import { apiSuccess, apiError, requireParam } from "@/lib/api-utils";
import { logApiRequest } from "@/lib/supabase";

// Multiple AI sources with fallback
const AI_SOURCES = [
  {
    name: "luminai",
    fetch: async (content: string) => {
      const res = await fetch("https://luminai.my.id/", {
        method: "POST",
        headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      return data.result;
    },
  },
  {
    name: "llama-3.1",
    fetch: async (content: string) => {
      const res = await fetch(`https://api.gurusensei.workers.dev/llama?prompt=${encodeURIComponent(content)}`);
      const data = await res.json();
      return data.response?.response || data.response;
    },
  },
];

async function getAIResponse(content: string): Promise<{ result: string; model: string }> {
  for (const source of AI_SOURCES) {
    try {
      const result = await source.fetch(content);
      if (result && typeof result === "string" && result.length > 0) {
        return { result, model: source.name };
      }
    } catch {
      continue; // try next source
    }
  }
  throw new Error("All AI sources failed");
}

function buildResponse(result: string, model: string) {
  return apiSuccess({
    message: result,
    model,
    metadata: {
      id: `msg_${crypto.randomUUID().replace(/-/g, "")}`,
      action: "success",
      created: Date.now(),
      model,
      role: "assistant",
    },
  });
}

export async function GET(request: Request) {
  const param = requireParam(request, "content");
  if ("error" in param) return param.error;

  const startTime = Date.now();

  try {
    const { result, model } = await getAIResponse(param.value);
    const elapsed = Date.now() - startTime;

    // Log to Supabase
    logApiRequest({
      endpoint: "/api/ai/luminai",
      method: "GET",
      status_code: 200,
      response_time_ms: elapsed,
      user_agent: request.headers.get("user-agent") || "unknown",
      ip_address: request.headers.get("x-forwarded-for") || "unknown",
    }).catch(() => {});

    return buildResponse(result, model);
  } catch {
    return apiError("Failed to get response from AI", 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const content = body.content;

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return apiError("Parameter 'content' is required", 400);
    }

    const startTime = Date.now();
    const { result, model } = await getAIResponse(content.trim());
    const elapsed = Date.now() - startTime;

    logApiRequest({
      endpoint: "/api/ai/luminai",
      method: "POST",
      status_code: 200,
      response_time_ms: elapsed,
      user_agent: request.headers.get("user-agent") || "unknown",
      ip_address: request.headers.get("x-forwarded-for") || "unknown",
    }).catch(() => {});

    return buildResponse(result, model);
  } catch {
    return apiError("Failed to process request", 500);
  }
}
