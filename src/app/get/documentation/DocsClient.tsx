"use client";

import { useEffect, useState, useMemo } from "react";

interface Endpoint {
  name: string;
  method: string;
  path: string;
  example?: string;
  params?: { name: string; required: boolean; placeholder?: string }[];
}

interface RouteCategory {
  [key: string]: { endpoints: Endpoint[] };
}

interface ApiResponse {
  body: string;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  time: number;
  curl: string;
}

export default function DocsClient({ method }: { method: "get" | "post" }) {
  const [routes, setRoutes] = useState<RouteCategory>({});
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Per-endpoint state
  const [params, setParams] = useState<Record<string, string>>({});
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [executing, setExecuting] = useState(false);
  const [responseTab, setResponseTab] = useState<"preview" | "headers" | "curl">("preview");

  useEffect(() => {
    fetch(`/api/${method}`)
      .then((r) => r.ok ? r.json() : { routes: {} })
      .then((data) => setRoutes(data.routes || {}))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [method]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return Object.entries(routes).reduce<RouteCategory>((acc, [cat, data]) => {
      const matched = data.endpoints.filter(
        (ep) => ep.name.toLowerCase().includes(q) || ep.path.toLowerCase().includes(q)
      );
      if (matched.length > 0) acc[cat] = { endpoints: matched };
      return acc;
    }, {});
  }, [routes, query]);

  const total = Object.values(filtered).reduce((n, c) => n + c.endpoints.length, 0);

  function toggleEndpoint(id: string) {
    if (expanded === id) {
      setExpanded(null);
    } else {
      setExpanded(id);
      setResponse(null);
      setParams({});
      setResponseTab("preview");
    }
  }

  function updateParam(key: string, value: string) {
    setParams((prev) => ({ ...prev, [key]: value }));
  }

  async function executeRequest(ep: Endpoint) {
    setExecuting(true);
    setResponse(null);

    // Build URL with params
    const paramEntries = Object.entries(params).filter(([, v]) => v.trim());
    const queryString = paramEntries.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&");
    const fullUrl = queryString ? `${ep.path}?${queryString}` : ep.path;

    const curlCmd = `curl -X ${ep.method} "${window.location.origin}${fullUrl}"`;

    try {
      const start = Date.now();
      const res = await fetch(fullUrl);
      const elapsed = Date.now() - start;
      const body = await res.text();

      const headers: Record<string, string> = {};
      res.headers.forEach((val, key) => {
        headers[key] = val;
      });

      setResponse({
        body,
        status: res.status,
        statusText: res.statusText,
        headers,
        time: elapsed,
        curl: curlCmd,
      });
    } catch {
      setResponse({
        body: JSON.stringify({ error: "Request failed - server unreachable" }, null, 2),
        status: 0,
        statusText: "Network Error",
        headers: {},
        time: 0,
        curl: curlCmd,
      });
    }
    setExecuting(false);
  }

  function clearResponse() {
    setResponse(null);
    setParams({});
  }

  function getParamsForEndpoint(ep: Endpoint): { name: string; required: boolean; placeholder?: string }[] {
    if (ep.params) return ep.params;
    // Auto-detect from example
    if (ep.example) {
      return ep.example.split("&").map((p) => {
        const [name, val] = p.split("=");
        return { name, required: true, placeholder: val || "" };
      });
    }
    // Fallback: guess based on path
    if (ep.path.includes("/ai/")) return [{ name: "content", required: true, placeholder: "Your message here" }];
    if (ep.path.includes("/downloader/")) return [{ name: "url", required: true, placeholder: "https://..." }];
    if (ep.path.includes("/search/")) return [{ name: "query", required: true, placeholder: "Search term" }];
    if (ep.path.includes("/tools/shorturl")) return [{ name: "url", required: true, placeholder: "https://..." }];
    return [{ name: "q", required: false, placeholder: "Parameter value" }];
  }

  function formatJson(str: string): string {
    try {
      return JSON.stringify(JSON.parse(str), null, 2);
    } catch {
      return str;
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-14">
        <p className="section-label mb-3">Playground</p>
        <h1 className="text-3xl md:text-5xl font-black text-white mb-3 uppercase">
          {method.toUpperCase()} <span className="highlight-block">Endpoints</span>
        </h1>
        <p className="text-sm text-gray-600">{total} endpoints available</p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-14">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Filter endpoints..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 input-field rounded-sm text-sm uppercase tracking-wider"
          />
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-20"><div className="spinner" /></div>
      )}

      {!loading && Object.keys(routes).length === 0 && (
        <div className="text-center py-20">
          <p className="text-sm text-gray-600">No endpoints loaded. Start the server and configure API routes.</p>
        </div>
      )}

      {/* Endpoint List */}
      {Object.entries(filtered).map(([category, data]) => (
        <div key={category} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xs font-bold text-white uppercase tracking-widest">{category}</h2>
            <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.06] text-gray-500 font-mono">
              {data.endpoints.length}
            </span>
          </div>

          <div className="space-y-2">
            {data.endpoints.map((ep, i) => {
              const id = `${category}-${i}`;
              const isOpen = expanded === id;
              const epParams = getParamsForEndpoint(ep);

              return (
                <div key={id} className="surface-elevated rounded-sm overflow-hidden transition-all">
                  {/* Endpoint Row */}
                  <div
                    className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                    onClick={() => toggleEndpoint(id)}
                  >
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded ${
                      ep.method === "GET" ? "badge-get" : "badge-post"
                    }`}>
                      {ep.method}
                    </span>
                    <code className="text-sm text-gray-300 font-mono flex-1 truncate">{ep.path}</code>
                    <span className="text-[10px] text-gray-600 hidden md:block uppercase tracking-wider">{ep.name}</span>
                    <svg className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* Expanded Panel */}
                  {isOpen && (
                    <div className="border-t border-white/[0.04] px-5 py-6 bg-white/[0.01]" onClick={(e) => e.stopPropagation()}>
                      <p className="text-xs text-gray-500 mb-5">{ep.name} - Interact via query parameters.</p>

                      {/* Method Toggle */}
                      <div className="flex gap-2 mb-5">
                        <span className="text-[10px] font-bold px-3 py-1.5 bg-red-600 text-white rounded-sm">GET</span>
                        <span className="text-[10px] font-bold px-3 py-1.5 bg-white/[0.04] text-gray-600 rounded-sm cursor-not-allowed">POST</span>
                      </div>

                      {/* Parameters */}
                      <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-4">Request Parameters</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                        {epParams.map((p) => (
                          <div key={p.name}>
                            <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 block">
                              {p.name} {p.required && <span className="text-red-500">*</span>}
                            </label>
                            <input
                              type="text"
                              placeholder={p.placeholder || p.name}
                              value={params[p.name] || ""}
                              onChange={(e) => updateParam(p.name, e.target.value)}
                              className="w-full px-3 py-2.5 bg-black/30 border border-white/[0.08] text-sm text-white rounded-sm focus:border-red-500/50 focus:outline-none transition-colors"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Execute + Clear */}
                      <div className="flex gap-3 mb-6">
                        <button
                          onClick={() => executeRequest(ep)}
                          disabled={executing}
                          className="flex-1 btn-accent py-3 text-xs font-bold uppercase tracking-widest disabled:opacity-50"
                        >
                          {executing ? "Executing..." : "Execute Request"}
                        </button>
                        <button
                          onClick={clearResponse}
                          className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors rounded-sm"
                        >
                          Clear
                        </button>
                      </div>

                      {/* Response */}
                      {response && (
                        <div>
                          {/* Tabs + Status */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex gap-0">
                              {(["preview", "headers", "curl"] as const).map((tab) => (
                                <button
                                  key={tab}
                                  onClick={() => setResponseTab(tab)}
                                  className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 transition-colors ${
                                    responseTab === tab
                                      ? "text-white border-b-2 border-red-500"
                                      : "text-gray-600 hover:text-gray-400"
                                  }`}
                                >
                                  {tab}
                                </button>
                              ))}
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => navigator.clipboard.writeText(response.body)}
                                className="text-[10px] text-gray-600 hover:text-white transition-colors"
                                title="Copy"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </button>
                              <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                                response.status < 400 ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                              }`}>
                                {response.status} {response.statusText}
                              </span>
                              <span className="text-[10px] text-gray-600">{response.time}ms</span>
                            </div>
                          </div>

                          {/* Tab Content */}
                          <div className="bg-black/40 rounded-sm border border-white/[0.04] overflow-auto max-h-[400px]">
                            {responseTab === "preview" && (
                              <pre className="p-4 text-xs text-emerald-400 font-mono whitespace-pre-wrap">
                                {formatJson(response.body)}
                              </pre>
                            )}
                            {responseTab === "headers" && (
                              <div className="p-4 space-y-2">
                                {Object.entries(response.headers).map(([key, val]) => (
                                  <div key={key} className="flex gap-4 text-xs">
                                    <span className="text-red-400 font-bold uppercase">{key}</span>
                                    <span className="text-gray-400">{val}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            {responseTab === "curl" && (
                              <pre className="p-4 text-xs text-gray-400 font-mono whitespace-pre-wrap">
                                {response.curl}
                              </pre>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
