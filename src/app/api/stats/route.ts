import { NextResponse } from "next/server";

// Simulated live stats with slight randomness for realtime feel
export async function GET() {
  const now = Date.now();
  const uptimeMs = now - 1745600000000;
  const hours = Math.floor(uptimeMs / 3600000);
  const minutes = Math.floor((uptimeMs % 3600000) / 60000);

  const baseRequests = 12847 + Math.floor((now - 1745600000000) / 10000);
  const dailyBase = 1523 + Math.floor(Math.random() * 50);
  const rps = (2 + Math.random() * 4).toFixed(1);
  const cpu = (8 + Math.random() * 15).toFixed(1);
  const memUsed = (180 + Math.random() * 60).toFixed(0);
  const netDown = (1.5 + Math.random() * 3).toFixed(1);
  const netUp = (200 + Math.random() * 500).toFixed(0);

  return NextResponse.json({
    totalRequests: baseRequests,
    dailyRequests: dailyBase,
    requestsPerSecond: parseFloat(rps),
    totalEndpoints: 150,
    apiTotalRequests: baseRequests - 3000,
    cpuUsage: `${cpu}%`,
    memoryUsage: `${memUsed} MB`,
    networkDown: `${netDown} MB/s`,
    networkUp: `${netUp} KB/s`,
    uptime: `${hours}h ${minutes}m`,
    timestamp: new Date().toISOString(),
    status: "operational",
  });
}
