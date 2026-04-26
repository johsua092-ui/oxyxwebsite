import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ---- Database Types ----

export interface ApiLog {
  id?: string;
  endpoint: string;
  method: string;
  status_code: number;
  response_time_ms: number;
  user_agent: string;
  ip_address: string;
  query_params?: Record<string, string>;
  error_message?: string;
  created_at?: string;
}

export interface DailyStat {
  id?: string;
  date: string;
  total_requests: number;
  total_errors: number;
  avg_response_ms: number;
  unique_ips: number;
  top_endpoint: string;
}

export interface Endpoint {
  id?: string;
  name: string;
  path: string;
  method: string;
  category: string;
  description: string;
  is_active: boolean;
  is_premium: boolean;
  total_hits: number;
  created_at?: string;
}

export interface Visitor {
  id?: string;
  ip_address: string;
  user_agent: string;
  country: string;
  first_visit: string;
  last_visit: string;
  total_visits: number;
}

export interface SupportTicket {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at?: string;
}

// ---- Check if Supabase is configured ----

export function isConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

// ---- API Logs ----

export async function logApiRequest(log: Omit<ApiLog, "id" | "created_at">) {
  if (!isConfigured()) return null;
  // Strip undefined fields to avoid column mismatch
  const clean: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(log)) {
    if (v !== undefined) clean[k] = v;
  }
  const { data, error } = await supabase.from("api_logs").insert(clean);
  if (error) console.error("[supabase] log error:", error.message);
  return data;
}

export async function getRecentLogs(limit = 15) {
  if (!isConfigured()) return [];
  const { data } = await supabase
    .from("api_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data || [];
}

// ---- Daily Stats ----

export async function getDailyStats(days = 7) {
  if (!isConfigured()) return [];
  const since = new Date();
  since.setDate(since.getDate() - days);
  const { data } = await supabase
    .from("daily_stats")
    .select("*")
    .gte("date", since.toISOString().split("T")[0])
    .order("date", { ascending: true });
  return data || [];
}

export async function getTodayRequestCount() {
  if (!isConfigured()) return 0;
  const today = new Date().toISOString().split("T")[0];
  const { count } = await supabase
    .from("api_logs")
    .select("*", { count: "exact", head: true })
    .gte("created_at", `${today}T00:00:00`);
  return count || 0;
}

// ---- Endpoints ----

export async function getEndpoints(activeOnly = true) {
  if (!isConfigured()) return [];
  let query = supabase.from("endpoints").select("*");
  if (activeOnly) query = query.eq("is_active", true);
  const { data } = await query.order("category");
  return data || [];
}

export async function incrementEndpointHits(path: string) {
  if (!isConfigured()) return;
  const { data } = await supabase
    .from("endpoints")
    .select("total_hits")
    .eq("path", path)
    .single();
  if (data) {
    await supabase
      .from("endpoints")
      .update({ total_hits: data.total_hits + 1 })
      .eq("path", path);
  }
}

// ---- Visitors ----

export async function trackVisitor(ip: string, userAgent: string) {
  if (!isConfigured()) return;
  const { data: existing } = await supabase
    .from("visitors")
    .select("id, total_visits")
    .eq("ip_address", ip)
    .single();

  if (existing) {
    await supabase
      .from("visitors")
      .update({
        last_visit: new Date().toISOString(),
        total_visits: existing.total_visits + 1,
        user_agent: userAgent,
      })
      .eq("id", existing.id);
  } else {
    await supabase.from("visitors").insert({
      ip_address: ip,
      user_agent: userAgent,
    });
  }
}

export async function getVisitorCount() {
  if (!isConfigured()) return 0;
  const { count } = await supabase
    .from("visitors")
    .select("*", { count: "exact", head: true });
  return count || 0;
}

// ---- Support Tickets ----

export async function createTicket(ticket: Omit<SupportTicket, "id" | "status" | "created_at">) {
  if (!isConfigured()) return null;
  const { data, error } = await supabase.from("support_tickets").insert(ticket);
  if (error) console.error("[supabase] ticket error:", error.message);
  return data;
}

export async function getTickets(status?: string) {
  if (!isConfigured()) return [];
  let query = supabase.from("support_tickets").select("*");
  if (status) query = query.eq("status", status);
  const { data } = await query.order("created_at", { ascending: false });
  return data || [];
}

// ---- Aggregate Stats (for monitor page) ----

export async function getSystemStats() {
  if (!isConfigured()) return null;

  const today = new Date().toISOString().split("T")[0];

  const [totalRes, todayRes, endpointRes, visitorRes] = await Promise.all([
    supabase.from("api_logs").select("*", { count: "exact", head: true }),
    supabase.from("api_logs").select("*", { count: "exact", head: true }).gte("created_at", `${today}T00:00:00`),
    supabase.from("endpoints").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("visitors").select("*", { count: "exact", head: true }),
  ]);

  return {
    totalRequests: totalRes.count || 0,
    dailyRequests: todayRes.count || 0,
    totalEndpoints: endpointRes.count || 0,
    uniqueVisitors: visitorRes.count || 0,
  };
}
