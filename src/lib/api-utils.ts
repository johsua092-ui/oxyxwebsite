import { NextResponse } from "next/server";

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
 * Proxy a request to an external API and return the response
 * in the standard Oxyx format with metadata.
 */
export async function proxyRequest(
  externalUrl: string,
  endpointName: string,
  model?: string
): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    const res = await fetch(externalUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!res.ok) {
      return apiError(`Upstream returned ${res.status}`, 502);
    }

    const upstream = await res.json();
    const elapsed = Date.now() - startTime;

    // Extract the actual data from upstream response
    const result = upstream.data || upstream.result || upstream;

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
