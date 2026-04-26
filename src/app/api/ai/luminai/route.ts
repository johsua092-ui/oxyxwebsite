import { apiSuccess, apiError, requireParam } from "@/lib/api-utils";

async function scrape(content: string) {
  const response = await fetch("https://luminai.my.id/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
    body: JSON.stringify({ content }),
  });
  const data = await response.json();
  return data.result;
}

export async function GET(request: Request) {
  const param = requireParam(request, "content");
  if ("error" in param) return param.error;

  try {
    const result = await scrape(param.value);
    if (!result) return apiError("No result returned from AI", 500);

    return apiSuccess({
      message: result,
      model: "luminai-v1",
      metadata: {
        id: `msg_${crypto.randomUUID().replace(/-/g, "")}`,
        action: "success",
        created: Date.now(),
        model: "luminai-v1",
        role: "assistant",
      },
    });
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

    const result = await scrape(content.trim());
    if (!result) return apiError("No result returned from AI", 500);

    return apiSuccess({
      message: result,
      model: "luminai-v1",
      metadata: {
        id: `msg_${crypto.randomUUID().replace(/-/g, "")}`,
        action: "success",
        created: Date.now(),
        model: "luminai-v1",
        role: "assistant",
      },
    });
  } catch {
    return apiError("Failed to process request", 500);
  }
}
