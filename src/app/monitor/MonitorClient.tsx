"use client";

import { useEffect, useState } from "react";

interface SystemStats {
  totalRequests: number;
  dailyRequests: number;
  requestsPerSecond: number;
  totalEndpoints: number;
  apiTotalRequests: number;
  cpuUsage: string;
  networkDown: string;
  networkUp: string;
}

const METRIC_CONFIG = [
  { key: "totalRequests", label: "Total Requests", color: "text-sky-400", bg: "bg-sky-500/10", icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" },
  { key: "dailyRequests", label: "Daily Requests", color: "text-violet-400", bg: "bg-violet-500/10", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
  { key: "requestsPerSecond", label: "Req/Second", color: "text-emerald-400", bg: "bg-emerald-500/10", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { key: "totalEndpoints", label: "Endpoints", color: "text-amber-400", bg: "bg-amber-500/10", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
  { key: "apiTotalRequests", label: "API Total", color: "text-indigo-400", bg: "bg-indigo-500/10", icon: "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" },
  { key: "cpuUsage", label: "CPU", color: "text-red-400", bg: "bg-red-500/10", icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" },
  { key: "networkDown", label: "Download", color: "text-cyan-400", bg: "bg-cyan-500/10", icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" },
  { key: "networkUp", label: "Upload", color: "text-orange-400", bg: "bg-orange-500/10", icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" },
] as const;

function formatValue(key: string, stats: SystemStats): string {
  const raw = stats[key as keyof SystemStats];
  if (typeof raw === "number") return raw.toLocaleString();
  return String(raw);
}

export default function MonitorClient() {
  const [stats, setStats] = useState<SystemStats>({
    totalRequests: 0, dailyRequests: 0, requestsPerSecond: 0,
    totalEndpoints: 0, apiTotalRequests: 0, cpuUsage: "0%",
    networkDown: "0 MB/s", networkUp: "0 KB/s",
  });
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => setClock(
      new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta", dateStyle: "full", timeStyle: "medium" })
    );
    tick();
    const clockTimer = setInterval(tick, 1000);

    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) setStats(await res.json());
      } catch { /* server may be offline */ }
    };
    fetchStats();
    const statsTimer = setInterval(fetchStats, 5000);

    return () => { clearInterval(clockTimer); clearInterval(statsTimer); };
  }, []);

  return (
    <>
      {clock && (
        <div className="flex justify-end mb-6">
          <span className="text-xs text-gray-600 surface-elevated px-4 py-2 rounded-lg">{clock}</span>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {METRIC_CONFIG.map((m) => (
          <div key={m.key} className="metric-card surface-elevated rounded-xl p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500 mb-2">{m.label}</p>
                <p className="text-xl font-bold text-white">{formatValue(m.key, stats)}</p>
              </div>
              <div className={`${m.color} ${m.bg} p-2.5 rounded-lg`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={m.icon} />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-10">
        {["Request History", "Network Usage"].map((title) => (
          <div key={title} className="surface-elevated rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-6">{title}</h3>
            <div className="h-48 flex items-center justify-center">
              <p className="text-xs text-gray-600 text-center">
                Chart data available when connected to Supabase
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="surface-elevated rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-300">Recent Requests</h3>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="dot-online" />
            <span>Real-time</span>
          </div>
        </div>
        <p className="text-xs text-gray-600 text-center py-12">
          Waiting for incoming API requests...
        </p>
      </div>
    </>
  );
}
