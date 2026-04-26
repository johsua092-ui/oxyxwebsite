import { NextResponse } from "next/server";

// In-memory stats (replace with database later)
const stats = {
  totalRequests: 12847,
  dailyRequests: 1523,
  requestsPerSecond: 3.2,
  totalEndpoints: 150,
  apiTotalRequests: 9821,
  cpuUsage: "12%",
  networkDown: "2.3 MB/s",
  networkUp: "456 KB/s",
  uptime: "72h 15m",
};

export async function GET() {
  return NextResponse.json(stats);
}
