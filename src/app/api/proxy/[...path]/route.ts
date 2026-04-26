import { NextRequest, NextResponse } from "next/server";
import { logApiRequest, incrementEndpointHits } from "@/lib/supabase";

const UPSTREAM = "https://api.siputzx.my.id";

/**
 * Mapping from OXYX paths to siputzx upstream paths.
 * OXYX uses /api/... while siputzx uses /api/... with different structure.
 */
const PATH_MAP: Record<string, string> = {
  // AI
  "ai/duckai": "ai/duckai",
  "ai/gita": "ai/gita",
  "ai/metaai": "ai/metaai",
  // Downloader
  "d/tiktok": "d/tiktok",
  "d/igdl": "d/igdl",
  "d/twitter": "d/twitter",
  "d/facebook": "d/facebook",
  "d/spotify": "d/spotify",
  "d/pinterest": "d/pinterest",
  "d/snackvideo": "d/snackvideo",
  // Search
  "s/pinterest": "s/pinterest",
  "s/youtube": "s/youtube",
  // Tools
  "tools/ssweb": "tools/ssweb",
  "tools/translate": "tools/translate",
  // Stalker
  "stalk/tiktok": "stalk/tiktok",
  "stalk/github": "stalk/github",
};

async function handleProxy(request: NextRequest, subpath: string) {
  const startTime = Date.now();
  const searchParams = request.nextUrl.searchParams.toString();
  const upstreamPath = PATH_MAP[subpath];

  if (!upstreamPath) {
    return NextResponse.json(
      { status: false, message: `Endpoint /api/${subpath} not found`, timestamp: new Date().toISOString() },
      { status: 404 }
    );
  }

  const upstreamUrl = `${UPSTREAM}/api/${upstreamPath}${searchParams ? `?${searchParams}` : ""}`;

  try {
    const res = await fetch(upstreamUrl, {
      method: request.method,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Content-Type": "application/json",
      },
      ...(request.method === "POST" ? { body: await request.text() } : {}),
    });

    const elapsed = Date.now() - startTime;
    const data = await res.json();

    // Log to Supabase (fire-and-forget)
    logApiRequest({
      endpoint: `/api/${subpath}`,
      method: request.method,
      status_code: res.status,
      response_time_ms: elapsed,
      user_agent: request.headers.get("user-agent") || "unknown",
      ip_address: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
    }).catch(() => {});

    incrementEndpointHits(`/api/${subpath}`).catch(() => {});

    // Re-wrap in OXYX format
    return NextResponse.json({
      status: data.status ?? true,
      data: data.data || data.result || data,
      metadata: {
        id: `req_${crypto.randomUUID().replace(/-/g, "").substring(0, 24)}`,
        action: res.ok ? "success" : "error",
        created: Date.now(),
        model: subpath.split("/")[0],
        responseTime: `${elapsed}ms`,
        upstream: upstreamPath,
      },
      timestamp: new Date().toISOString(),
    }, { status: res.status });
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
  const subpath = path.join("/");
  return handleProxy(request, subpath);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const subpath = path.join("/");
  return handleProxy(request, subpath);
}
