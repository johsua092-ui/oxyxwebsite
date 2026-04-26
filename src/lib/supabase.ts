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
  created_at?: string;
}

export interface ApiEndpoint {
  id?: string;
  name: string;
  path: string;
  method: string;
  category: string;
  is_active: boolean;
  is_premium: boolean;
  description: string;
  created_at?: string;
}

export interface DailyStat {
  id?: string;
  date: string;
  total_requests: number;
  total_errors: number;
  avg_response_ms: number;
}

// ---- Query Helpers ----

export async function logApiRequest(log: Omit<ApiLog, "id" | "created_at">) {
  if (!supabaseUrl) return null;
  const { data, error } = await supabase.from("api_logs").insert(log);
  if (error) console.error("[supabase] log error:", error.message);
  return data;
}

export async function getRecentLogs(limit = 10) {
  if (!supabaseUrl) return [];
  const { data } = await supabase
    .from("api_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data || [];
}

export async function getDailyStats(days = 7) {
  if (!supabaseUrl) return [];
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
  if (!supabaseUrl) return 0;
  const today = new Date().toISOString().split("T")[0];
  const { count } = await supabase
    .from("api_logs")
    .select("*", { count: "exact", head: true })
    .gte("created_at", `${today}T00:00:00`);
  return count || 0;
}
