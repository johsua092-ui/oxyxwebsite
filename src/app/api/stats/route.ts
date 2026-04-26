import { NextResponse } from "next/server";
import { supabase, isConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  // If Supabase not configured, return simulated data
  if (!isConfigured()) {
    return NextResponse.json({
      uptime: "99.9%",
      totalRequests: 0,
      totalErrors: 0,
      totalAttacks: 0,
      successRate: "0.0%",
      dailyRequests: 0,
      avgResponse: 0,
      activeEndpoints: 7,
      uniqueVisitors: 0,
      errorRate: "0%",
      memoryUsage: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      uptimeSeconds: process.uptime(),
      recentLogs: [],
      dailyChart: [],
      topEndpoints: [],
      statusBreakdown: { "2xx": 0, "4xx": 0, "5xx": 0 }
    });
  }

  const today = new Date().toISOString().split("T")[0];
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  try {
    const [
      totalRes,
      todayRes,
      endpointRes,
      visitorRes,
      recentRes,
      dailyRes,
      avgRes,
      totalErrorsRes,
      totalAttacksRes,
      topEndpointsRes
    ] = await Promise.all([
      // Total all-time requests
      supabase.from("api_logs").select("*", { count: "exact", head: true }),
      // Today requests
      supabase.from("api_logs").select("*", { count: "exact", head: true }).gte("created_at", `${today}T00:00:00`),
      // Active endpoints
      supabase.from("endpoints").select("*", { count: "exact", head: true }).eq("is_active", true),
      // Unique visitors
      supabase.from("visitors").select("*", { count: "exact", head: true }),
      // Recent 5 logs
      supabase.from("api_logs").select("endpoint, method, status_code, response_time_ms, created_at, ip_address, user_agent").order("created_at", { ascending: false }).limit(5),
      // Daily stats chart (7 days)
      supabase.from("daily_stats").select("*").gte("date", weekAgo.toISOString().split("T")[0]).order("date", { ascending: true }),
      // Average response time today
      supabase.from("api_logs").select("response_time_ms").gte("created_at", `${today}T00:00:00`).limit(100),
      // Total errors (5xx)
      supabase.from("api_logs").select("*", { count: "exact", head: true }).gte("status_code", 500),
      // Total attacks (4xx)
      supabase.from("api_logs").select("*", { count: "exact", head: true }).gte("status_code", 400).lt("status_code", 500),
      // Top endpoints via RPC (returns {data, error})
      supabase.rpc("get_top_endpoints")
    ]);

    const totalRequests = totalRes.count || 0;
    const dailyRequests = todayRes.count || 0;
    
    const totalErrors = totalErrorsRes.count || 0;
    const totalAttacks = totalAttacksRes.count || 0;
    
    const totalFailed = totalErrors + totalAttacks;
    const totalSuccess = totalRequests - totalFailed;
    const successRate = totalRequests > 0 ? ((totalSuccess / totalRequests) * 100).toFixed(1) : "0.0";
    
    const errorRate = dailyRequests > 0 ? (((totalErrorsRes.count || 0) / dailyRequests) * 100).toFixed(1) : "0";

    // Calculate avg response
    const responseTimes = (avgRes.data || []).map((r: { response_time_ms: number }) => r.response_time_ms);
    const avgResponse = responseTimes.length > 0
      ? Math.round(responseTimes.reduce((a: number, b: number) => a + b, 0) / responseTimes.length)
      : 0;

    return NextResponse.json({
      uptime: "99.9%",
      totalRequests,
      totalErrors,
      totalAttacks,
      successRate: `${successRate}%`,
      dailyRequests,
      avgResponse,
      activeEndpoints: endpointRes.count || 7,
      uniqueVisitors: visitorRes.count || 0,
      errorRate: `${errorRate}%`,
      memoryUsage: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      uptimeSeconds: process.uptime(),
      recentLogs: recentRes.data || [],
      dailyChart: dailyRes.data || [],
      topEndpoints: topEndpointsRes.data || [],
      statusBreakdown: { 
        "2xx": totalSuccess, 
        "4xx": totalAttacks, 
        "5xx": totalErrors 
      }
    });
  } catch (err) {
    console.error("[stats]", err);
    return NextResponse.json({
      uptime: "99.9%",
      totalRequests: 0,
      totalErrors: 0,
      totalAttacks: 0,
      successRate: "0.0%",
      dailyRequests: 0,
      avgResponse: 0,
      activeEndpoints: 7,
      uniqueVisitors: 0,
      errorRate: "0%",
      memoryUsage: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      uptimeSeconds: process.uptime(),
      recentLogs: [],
      dailyChart: [],
      topEndpoints: [],
      statusBreakdown: { "2xx": 0, "4xx": 0, "5xx": 0 }
    });
  }
}
