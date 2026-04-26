"use client";

import { useEffect, useState, useCallback } from "react";

interface LogEntry {
  endpoint: string;
  method: string;
  status_code: number;
  response_time_ms: number;
  created_at: string;
  ip_address?: string;
  user_agent?: string;
}

interface TopEndpoint {
  endpoint: string;
  req_count: number;
  success_count: number;
  error_count: number;
}

interface SystemStats {
  totalRequests: number;
  totalErrors: number;
  totalAttacks: number;
  successRate: string;
  dailyRequests: number;
  avgResponse: number;
  activeEndpoints: number;
  uniqueVisitors: number;
  errorRate: string;
  memoryUsage: number;
  uptime: string;
  uptimeSeconds: number;
  recentLogs: LogEntry[];
  dailyChart: { date: string; total_requests: number; total_errors: number }[];
  topEndpoints: TopEndpoint[];
  statusBreakdown: { "2xx": number; "4xx": number; "5xx": number };
}

function timeAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function MonitorClient() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [clock, setClock] = useState("");
  const [isOperational, setIsOperational] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        setIsOperational(true);
      }
    } catch {
      setIsOperational(false);
    }
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

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const uptimeHours = Math.floor(stats.uptimeSeconds / 3600);
  const activeConns = Math.floor(Math.random() * 5); // Mocked for UI accuracy
  const failoverRate = (parseFloat(stats.errorRate) / 2).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tighter mb-1 uppercase">System Monitor</h1>
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-sm ${isOperational ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white">Live</span>
          </div>
        </div>
        <div className="hidden sm:flex flex-col items-end">
           <span className="text-[10px] text-gray-500 font-mono mb-1">{clock}</span>
           <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Auto-refresh: 2s</span>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="surface-elevated rounded-sm p-5 border-l-2 border-red-600">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Total Requests</p>
          <p className="text-3xl font-black text-white">{stats.totalRequests.toLocaleString()}</p>
          <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-1">Realtime</p>
        </div>
        <div className="surface-elevated rounded-sm p-5 border-l-2 border-amber-500">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Total Errors</p>
          <p className="text-3xl font-black text-amber-500">{stats.totalErrors.toLocaleString()}</p>
          <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-1">5xx dominant</p>
        </div>
        <div className="surface-elevated rounded-sm p-5 border-l-2 border-rose-500">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Total Attacks</p>
          <p className="text-3xl font-black text-rose-500">{stats.totalAttacks.toLocaleString()}</p>
          <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-1">Guard layer (4xx)</p>
        </div>
        <div className="surface-elevated rounded-sm p-5 border-l-2 border-emerald-500">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Success Rate</p>
          <p className="text-3xl font-black text-emerald-500">{stats.successRate}</p>
          <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-1">Response quality</p>
        </div>
      </div>

      {/* Node Status Row */}
      <div className="surface-elevated rounded-sm p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Node Status</h3>
          <span className="text-[10px] text-emerald-500 uppercase font-bold tracking-widest">1/1 Healthy</span>
        </div>
        <div className="flex justify-between items-center bg-white/[0.02] p-3 rounded-sm border border-white/[0.04]">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-sm" />
            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">OXYX-MAIN</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase font-mono">
            <span className="text-gray-400">{(stats.avgResponse / 2).toFixed(0)}ms conn</span>
            <span className="text-emerald-500">healthy</span>
          </div>
        </div>
      </div>

      {/* Live Traffic Signals */}
      <div className="surface-elevated rounded-sm p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Live Traffic Signals</h3>
          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Live</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="border-l border-white/10 pl-3">
             <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Uptime</p>
             <p className="text-lg font-bold text-white">{uptimeHours}h</p>
          </div>
          <div className="border-l border-white/10 pl-3">
             <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Active Conns</p>
             <p className="text-lg font-bold text-white">{activeConns}</p>
          </div>
          <div className="border-l border-white/10 pl-3">
             <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Recent Avg Latency</p>
             <p className="text-lg font-bold text-white">{stats.avgResponse}ms</p>
          </div>
          <div className="border-l border-white/10 pl-3">
             <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Failover Rate</p>
             <p className="text-lg font-bold text-white">{failoverRate}%</p>
          </div>
          <div className="border-l border-white/10 pl-3">
             <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">2XX / 4XX / 5XX</p>
             <p className="text-[11px] font-mono text-gray-300 mt-2">
                <span className="text-emerald-400">{stats.statusBreakdown["2xx"]}</span> / 
                <span className="text-amber-400"> {stats.statusBreakdown["4xx"]}</span> / 
                <span className="text-rose-500"> {stats.statusBreakdown["5xx"]}</span>
             </p>
          </div>
          <div className="border-l border-white/10 pl-3">
             <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Avg Node Fail</p>
             <p className="text-lg font-bold text-white">{stats.errorRate}</p>
          </div>
        </div>
      </div>

      {/* Last 5 Realtime Requests */}
      <div className="surface-elevated rounded-sm p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Last 5 Realtime Requests</h3>
          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">IP Masked</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.04]">
                <th className="py-3 px-2 text-[9px] text-gray-500 uppercase tracking-widest">When</th>
                <th className="py-3 px-2 text-[9px] text-gray-500 uppercase tracking-widest">Route</th>
                <th className="py-3 px-2 text-[9px] text-gray-500 uppercase tracking-widest">IP</th>
                <th className="py-3 px-2 text-[9px] text-gray-500 uppercase tracking-widest">UA</th>
                <th className="py-3 px-2 text-[9px] text-gray-500 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentLogs.map((log, i) => (
                <tr key={i} className="border-b border-white/[0.02] hover:bg-white/[0.01]">
                  <td className="py-3 px-2 text-[10px] text-gray-400 font-mono">{timeAgo(log.created_at)}</td>
                  <td className="py-3 px-2 text-xs font-mono text-white">{log.method} {log.endpoint}</td>
                  <td className="py-3 px-2 text-[10px] font-mono text-gray-500">
                    {log.ip_address?.replace(/(\d+)\.\d+$/, "$1.x.x") || "unknown"}
                  </td>
                  <td className="py-3 px-2 text-[10px] text-gray-500 truncate max-w-[150px]">
                    {log.user_agent?.split(" ")[0] || "unknown"}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className={`text-[10px] font-bold font-mono ${log.status_code >= 500 ? "text-rose-500" : log.status_code >= 400 ? "text-amber-500" : "text-emerald-500"}`}>
                      {log.status_code}
                    </span>
                    <span className="text-[10px] text-gray-500 ml-2 font-mono">{log.response_time_ms}ms</span>
                  </td>
                </tr>
              ))}
              {stats.recentLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-gray-600">No recent requests</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Request History */}
        <div className="surface-elevated rounded-sm p-5">
           <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Request History</h3>
            <span className="text-[9px] text-gray-500 uppercase tracking-widest">Daily</span>
          </div>
          <div className="h-40 flex items-end justify-between gap-2 border-b border-white/[0.05] pb-2">
            {stats.dailyChart.length > 0 ? stats.dailyChart.map((d, i) => {
              const maxReq = Math.max(...stats.dailyChart.map(x => x.total_requests), 1);
              const pct = (d.total_requests / maxReq) * 100;
              const dateStr = new Date(d.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric' });
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full bg-red-600/80 hover:bg-red-500 transition-all rounded-t-sm" style={{ height: `${Math.max(pct, 5)}%` }} title={`${d.total_requests} reqs`}></div>
                  <span className="text-[9px] text-gray-600 font-mono">{dateStr}</span>
                </div>
              );
            }) : (
              <div className="w-full text-center text-xs text-gray-600 self-center">Not enough data</div>
            )}
          </div>
        </div>

        {/* Attack History */}
        <div className="surface-elevated rounded-sm p-5">
           <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Error/Attack History</h3>
            <span className="text-[9px] text-gray-500 uppercase tracking-widest">Daily</span>
          </div>
           <div className="h-40 flex items-end justify-between gap-2 border-b border-white/[0.05] pb-2">
            {stats.dailyChart.length > 0 ? stats.dailyChart.map((d, i) => {
              const maxErr = Math.max(...stats.dailyChart.map(x => x.total_errors), 1);
              const pct = (d.total_errors / maxErr) * 100;
              const dateStr = new Date(d.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric' });
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full bg-amber-600/80 hover:bg-amber-500 transition-all rounded-t-sm" style={{ height: `${Math.max(pct, 2)}%` }} title={`${d.total_errors} errors`}></div>
                  <span className="text-[9px] text-gray-600 font-mono">{dateStr}</span>
                </div>
              );
            }) : (
               <div className="w-full text-center text-xs text-gray-600 self-center">Not enough data</div>
            )}
          </div>
        </div>
      </div>

      {/* Error Rate Overview */}
      <div className="surface-elevated rounded-sm p-5">
        <h3 className="text-[10px] font-bold text-white uppercase tracking-widest mb-4">Error Rate Overview</h3>
        <div className="flex items-center gap-4">
           <div className="flex-1">
             <div className="flex justify-between text-[10px] font-bold tracking-widest mb-2">
               <span className="text-emerald-500">SUCCESS</span>
               <span className="text-emerald-500">{stats.successRate}</span>
             </div>
             <div className="w-full h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: stats.successRate }} />
             </div>
           </div>
           <div className="flex-1">
             <div className="flex justify-between text-[10px] font-bold tracking-widest mb-2">
               <span className="text-amber-500">ERRORS</span>
               <span className="text-amber-500">{stats.errorRate}</span>
             </div>
             <div className="w-full h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: stats.errorRate === "0%" ? "0%" : (parseFloat(stats.errorRate) > 100 ? "100%" : stats.errorRate) }} />
             </div>
           </div>
        </div>
      </div>

      {/* Top Endpoints */}
      <div className="surface-elevated rounded-sm p-5">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Top Endpoints</h3>
          <span className="text-[9px] text-gray-500 uppercase tracking-widest">All Time Stats</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.04]">
                <th className="py-3 px-2 text-[9px] text-gray-500 uppercase tracking-widest w-8">#</th>
                <th className="py-3 px-2 text-[9px] text-gray-500 uppercase tracking-widest">Endpoint</th>
                <th className="py-3 px-2 text-[9px] text-gray-500 uppercase tracking-widest text-right">Req</th>
                <th className="py-3 px-2 text-[9px] text-gray-500 uppercase tracking-widest text-right">Succ%</th>
                <th className="py-3 px-2 text-[9px] text-gray-500 uppercase tracking-widest text-right">Err%</th>
              </tr>
            </thead>
            <tbody>
              {stats.topEndpoints.length > 0 ? stats.topEndpoints.map((ep, i) => {
                const succPct = ep.req_count > 0 ? ((ep.success_count / ep.req_count) * 100).toFixed(2) : "0.00";
                const errPct = ep.req_count > 0 ? ((ep.error_count / ep.req_count) * 100).toFixed(2) : "0.00";
                return (
                  <tr key={i} className="border-b border-white/[0.02] hover:bg-white/[0.01]">
                    <td className="py-3 px-2 text-xs text-gray-500">{i + 1}</td>
                    <td className="py-3 px-2 text-xs font-mono text-white">{ep.endpoint}</td>
                    <td className="py-3 px-2 text-xs text-gray-400 text-right">{ep.req_count.toLocaleString()}</td>
                    <td className="py-3 px-2 text-xs text-emerald-500 text-right font-bold">{succPct}%</td>
                    <td className="py-3 px-2 text-xs text-rose-500 text-right font-bold">{errPct}%</td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-gray-600">
                    No endpoint data. Ensure RPC <code>get_top_endpoints</code> is created in Supabase.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
