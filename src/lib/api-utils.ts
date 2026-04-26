import { NextResponse } from "next/server";
import { logApiRequest, incrementEndpointHits } from "./supabase";

/**
 * Standard API response format matching siputzx style:
 * { status: true, data: { ... }, timestamp: "..." }
 */
export function apiSuccess<T>(data: T, statusCode = 200) {
  return NextResponse.json(
    {
      status: true,
      data,
      timestamp: new Date().toISOString(),
    },
    { status: statusCode }
  );
}

export function apiError(message: string, statusCode = 500) {
  return NextResponse.json(
    {
      status: false,
      message,
      timestamp: new Date().toISOString(),
    },
    { status: statusCode }
  );
}

/**
 * Log a request to Supabase (fire-and-forget, won't block response)
 */
function logToSupabase(
  request: Request,
  endpoint: string,
  statusCode: number,
  responseTimeMs: number,
  errorMessage?: string
) {
  const userAgent = request.headers.get("user-agent") || "unknown";
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

  // Fire and forget - don't await
  logApiRequest({
    endpoint,
    method: request.method,
    status_code: statusCode,
    response_time_ms: responseTimeMs,
    user_agent: userAgent,
    ip_address: ip,
    error_message: errorMessage,
  }).catch(() => {});

  incrementEndpointHits(endpoint).catch(() => {});
}

/**
 * Proxy a request to an external API and return the response
 * in the standard Oxyx format with metadata.
 */
export async function proxyRequest(
  request: Request,
  externalUrl: string,
  endpointName: string,
  model?: string
): Promise<NextResponse> {
  const startTime = Date.now();
  const endpointPath = new URL(request.url).pathname;

  try {
    const res = await fetch(externalUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    const elapsed = Date.now() - startTime;

    if (!res.ok) {
      logToSupabase(request, endpointPath, 502, elapsed, `Upstream ${res.status}`);
      return apiError(`Upstream returned ${res.status}`, 502);
    }

    const upstream = await res.json();

    // Extract the actual data from upstream response
    const result = upstream.data || upstream.result || upstream;

    logToSupabase(request, endpointPath, 200, elapsed);

    return apiSuccess({
      ...( typeof result === "string" ? { message: result } : result ),
      model: model || endpointName,
      metadata: {
        id: `msg_${crypto.randomUUID().replace(/-/g, "")}`,
        action: "success",
        created: Date.now(),
        model: model || endpointName,
        role: "assistant",
        responseTime: `${elapsed}ms`,
      },
    });
  } catch {
    const elapsed = Date.now() - startTime;
    logToSupabase(request, endpointPath, 502, elapsed, "Upstream unreachable");
    return apiError("Failed to fetch data from upstream", 502);
  }
}

/**
 * Extract a query param or return an error response.
 */
export function requireParam(
  request: Request,
  paramName: string
): { value: string } | { error: NextResponse } {
  const { searchParams } = new URL(request.url);
  const value = searchParams.get(paramName);

  if (!value || value.trim().length === 0) {
    return {
      error: apiError(`Parameter '${paramName}' is required`, 400),
    };
  }

  return { value: value.trim() };
}
