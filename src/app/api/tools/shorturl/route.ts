import { NextResponse } from "next/server";
import { logApiRequest } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  await logApiRequest({
    endpoint: "/api/tools/shortlink",
    method: "GET",
    status_code: url ? 200 : 400,
    response_time_ms: 0,
    user_agent: request.headers.get("user-agent") || "unknown",
    ip_address: request.headers.get("x-forwarded-for") || "unknown",
  });

  if (!url) {
    return NextResponse.json(
      { status: false, message: "Parameter 'url' is required" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`https://api.siputzx.my.id/api/tools/shortlink?url=${encodeURIComponent(url)}`);
    const data = await res.json();

    return NextResponse.json({
      status: true,
      creator: "Oxyx API",
      data: data.data || data
    });
  } catch (error) {
    return NextResponse.json(
      { status: false, message: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
