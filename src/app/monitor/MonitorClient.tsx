"use client";

import { useEffect, useState, useCallback } from "react";

interface SystemStats {
  totalRequests: number;
  dailyRequests: number;
  requestsPerSecond: number;
  totalEndpoints: number;
  apiTotalRequests: number;
  cpuUsage: string;
  memoryUsage: string;
  networkDown: string;
  networkUp: string;
  uptime: string;
  timestamp: string;
  status: string;
}

const METRIC_CONFIG = [
  { key: "totalRequests", label: "Total Requests", color: "text-red-400", bar: "bg-red-500" },
  { key: "dailyRequests", label: "Today", color: "text-amber-400", bar: "bg-amber-500" },
  { key: "requestsPerSecond", label: "Req/sec", color: "text-emerald-400", bar: "bg-emerald-500" },
  { key: "totalEndpoints", label: "Endpoints", color: "text-sky-400", bar: "bg-sky-500" },
  { key: "cpuUsage", label: "CPU Usage", color: "text-orange-400", bar: "bg-orange-500" },
  { key: "memoryUsage", label: "Memory", color: "text-violet-400", bar: "bg-violet-500" },
  { key: "networkDown", label: "Download", color: "text-cyan-400", bar: "bg-cyan-500" },
  { key: "networkUp", label: "Upload", color: "text-pink-400", bar: "bg-pink-500" },
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
    memoryUsage: "0 MB", networkDown: "0 MB/s", networkUp: "0 KB/s",
    uptime: "0h 0m", timestamp: "", status: "loading",
  });
  const [clock, setClock] = useState("");
  const [lastUpdate, setLastUpdate] = useState("");
  const [history, setHistory] = useState<Array<{ time: string; rps: number }>>([]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        setLastUpdate(new Date().toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta" }));
        setHistory((prev) => {
          const next = [...prev, {
            time: new Date().toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", second: "2-digit" }),
            rps: data.requestsPerSecond,
          }];
          return next.slice(-20);
        });
      }
    } catch { /* server offline */ }
  }, []);

  useEffect(() => {
    const tick = () => setClock(
      new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta", dateStyle: "full", timeStyle: "medium" })
    );
    tick();
    const clockTimer = setInterval(tick, 1000);

    fetchStats();
    const statsTimer = setInterval(fetchStats, 2000);

    return () => { clearInterval(clockTimer); clearInterval(statsTimer); };
  }, [fetchStats]);

  const maxRps = Math.max(...history.map((h) => h.rps), 1);

  return (
    <>
      {/* Status Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${stats.status === "operational" ? "bg-emerald-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]" : "bg-red-500"}`} />
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              {stats.status === "operational" ? "All Systems Operational" : "Checking..."}
            </h2>
            {stats.uptime && (
              <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-0.5">
                Uptime: {stats.uptime}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdate && (
            <span className="text-[10px] text-gray-600 uppercase tracking-widest">
              Updated: {lastUpdate}
            </span>
          )}
          <span className="text-[10px] text-gray-700 surface-elevated px-3 py-1.5">{clock}</span>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {METRIC_CONFIG.map((m) => (
          <div key={m.key} className="surface-elevated rounded-sm p-5 group hover:border-white/10 transition-all">
            <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-2">{m.label}</p>
            <p className={`text-xl font-black text-white mb-3`}>{formatValue(m.key, stats)}</p>
            <div className="w-full h-1 bg-white/[0.03] rounded-full overflow-hidden">
              <div className={`h-full ${m.bar} rounded-full transition-all duration-1000 opacity-40`} style={{ width: `${30 + Math.random() * 70}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Realtime RPS Chart */}
      <div className="surface-elevated rounded-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Requests Per Second</h3>
            <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-1">Live chart - updates every 2s</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] text-red-400 uppercase tracking-widest font-bold">Live</span>
          </div>
        </div>
        <div className="flex items-end gap-1 h-32">
          {history.length === 0 && (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-xs text-gray-700 uppercase tracking-widest">Collecting data...</p>
            </div>
          )}
          {history.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-gradient-to-t from-red-600/60 to-red-400/30 rounded-t-sm transition-all duration-500"
                style={{ height: `${Math.max((h.rps / maxRps) * 100, 4)}%` }}
              />
            </div>
          ))}
        </div>
        {history.length > 0 && (
          <div className="flex justify-between mt-2">
            <span className="text-[9px] text-gray-700 font-mono">{history[0]?.time}</span>
            <span className="text-[9px] text-gray-700 font-mono">{history[history.length - 1]?.time}</span>
          </div>
        )}
      </div>

      {/* System Info */}
      <div className="grid lg:grid-cols-2 gap-3">
        <div className="surface-elevated rounded-sm p-6">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Network Traffic</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                <span>Download</span>
                <span className="text-cyan-400">{stats.networkDown}</span>
              </div>
              <div className="w-full h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500/50 rounded-full transition-all duration-1000" style={{ width: "65%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                <span>Upload</span>
                <span className="text-pink-400">{stats.networkUp}</span>
              </div>
              <div className="w-full h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
                <div className="h-full bg-pink-500/50 rounded-full transition-all duration-1000" style={{ width: "35%" }} />
              </div>
            </div>
          </div>
        </div>
        <div className="surface-elevated rounded-sm p-6">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Server Resources</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                <span>CPU</span>
                <span className="text-orange-400">{stats.cpuUsage}</span>
              </div>
              <div className="w-full h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
                <div className="h-full bg-orange-500/50 rounded-full transition-all duration-1000" style={{ width: stats.cpuUsage }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                <span>Memory</span>
                <span className="text-violet-400">{stats.memoryUsage}</span>
              </div>
              <div className="w-full h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
                <div className="h-full bg-violet-500/50 rounded-full transition-all duration-1000" style={{ width: "45%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
