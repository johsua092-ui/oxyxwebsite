import { NextRequest, NextResponse } from "next/server";
import { logApiRequest, incrementEndpointHits } from "@/lib/supabase";

const UPSTREAM = "https://api.siputzx.my.id";

// All supported proxy paths
const ALLOWED = new Set([
  "ai/duckai", "ai/gita", "ai/metaai", "ai/gemini",
  "d/tiktok", "d/igdl", "d/twitter", "d/facebook", "d/spotify", "d/pinterest", "d/snackvideo",
  "s/pinterest", "s/youtube",
  "tools/ssweb", "tools/translate",
  "stalk/github", "stalk/tiktok",
]);

async function handleProxy(request: NextRequest, subpath: string) {
  const startTime = Date.now();

  if (!ALLOWED.has(subpath)) {
    return NextResponse.json(
      { status: false, message: `Endpoint /api/${subpath} not found`, timestamp: new Date().toISOString() },
      { status: 404 }
    );
  }

  const searchParams = request.nextUrl.searchParams.toString();
  const upstreamUrl = `${UPSTREAM}/api/${subpath}${searchParams ? `?${searchParams}` : ""}`;

  try {
    const fetchOpts: RequestInit = {
      method: request.method,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Content-Type": "application/json",
      },
    };

    if (request.method === "POST") {
      try {
        const body = await request.text();
        if (body) fetchOpts.body = body;
      } catch { /* no body */ }
    }

    const res = await fetch(upstreamUrl, fetchOpts);
    const elapsed = Date.now() - startTime;
    const data = await res.json();

    // Log to Supabase (fire-and-forget)
    logApiRequest({
      endpoint: `/api/${subpath}`,
      method: request.method,
      status_code: data.status ? 200 : (data.code || res.status),
      response_time_ms: elapsed,
      user_agent: request.headers.get("user-agent") || "unknown",
      ip_address: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
    }).catch(() => {});

    incrementEndpointHits(`/api/${subpath}`).catch(() => {});

    // Return as-is from siputzx (already in correct format)
    if (data.timestamp) {
      return NextResponse.json(data, { status: data.status ? 200 : (data.code || 500) });
    }

    // Wrap in OXYX format
    return NextResponse.json({
      status: data.status ?? true,
      data: data.data || data.result || data,
      metadata: {
        id: `req_${crypto.randomUUID().replace(/-/g, "").substring(0, 24)}`,
        action: data.status ? "success" : "error",
        created: Date.now(),
        responseTime: `${elapsed}ms`,
      },
      timestamp: new Date().toISOString(),
    }, { status: data.status ? 200 : (data.code || 500) });
  } catch {
    const elapsed = Date.now() - startTime;
    logApiRequest({
      endpoint: `/api/${subpath}`,
      method: request.method,
      status_code: 502,
      response_time_ms: elapsed,
      user_agent: request.headers.get("user-agent") || "unknown",
      ip_address: request.headers.get("x-forwarded-for") || "unknown",
    }).catch(() => {});

    return NextResponse.json(
      { status: false, message: "Upstream server unreachable", timestamp: new Date().toISOString() },
      { status: 502 }
    );
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return handleProxy(request, path.join("/"));
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return handleProxy(request, path.join("/"));
}
