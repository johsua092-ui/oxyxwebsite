import { NextRequest, NextResponse } from "next/server";

async function scrape(content: string) {
  try {
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to get response from API: ${message}`);
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const content = searchParams.get("content");

  if (!content || content.trim().length === 0) {
    return NextResponse.json(
      { status: false, error: "Content parameter is required", code: 400 },
      { status: 400 }
    );
  }

  try {
    const result = await scrape(content.trim());

    if (!result) {
      return NextResponse.json(
        { status: false, error: "No result returned from the API", code: 500 },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: true,
      creator: "OXYX",
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { status: false, error: message, code: 500 },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const content = body.content;

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json(
        { status: false, error: "Content parameter is required", code: 400 },
        { status: 400 }
      );
    }

    const result = await scrape(content.trim());

    if (!result) {
      return NextResponse.json(
        { status: false, error: "No result returned from the API", code: 500 },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: true,
      creator: "OXYX",
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { status: false, error: message, code: 500 },
      { status: 500 }
    );
  }
}
