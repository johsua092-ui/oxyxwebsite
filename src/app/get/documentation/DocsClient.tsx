"use client";

import { useEffect, useState, useMemo } from "react";

interface Endpoint {
  name: string;
  method: string;
  path: string;
  example?: string;
}

interface RouteCategory {
  [key: string]: { endpoints: Endpoint[] };
}

export default function DocsClient({ method }: { method: "get" | "post" }) {
  const [routes, setRoutes] = useState<RouteCategory>({});
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

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
    setExpanded(expanded === id ? null : id);
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-14">
        <p className="text-xs font-semibold text-blue-400 uppercase tracking-[0.2em] mb-3">
          API Reference
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-display mb-2">
          {method.toUpperCase()} Endpoints
        </h1>
        <p className="text-sm text-gray-500">{total} endpoints available</p>
      </div>

      <div className="max-w-xl mx-auto mb-14">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search endpoints..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 input-field rounded-xl text-sm"
          />
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-20"><div className="spinner" /></div>
      )}

      {!loading && Object.keys(routes).length === 0 && (
        <div className="text-center py-20">
          <p className="text-sm text-gray-600">
            No endpoints loaded. Start the server and configure API routes.
          </p>
        </div>
      )}

      {Object.entries(filtered).map(([category, data]) => (
        <div key={category} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">{category}</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-gray-500 font-mono">
              {data.endpoints.length}
            </span>
          </div>

          <div className="space-y-2">
            {data.endpoints.map((ep, i) => {
              const id = `${category}-${i}`;
              const isOpen = expanded === id;

              return (
                <div
                  key={id}
                  className="surface-elevated rounded-xl overflow-hidden cursor-pointer transition-all hover:border-white/10"
                  onClick={() => toggleEndpoint(id)}
                >
                  <div className="flex items-center gap-4 px-5 py-4">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${
                      ep.method === "GET" ? "badge-get" : "badge-post"
                    }`}>
                      {ep.method}
                    </span>
                    <code className="text-sm text-gray-300 font-mono flex-1 truncate">{ep.path}</code>
                    <span className="text-xs text-gray-600 hidden md:block">{ep.name}</span>
                    <svg className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {isOpen && (
                    <div className="border-t border-white/[0.04] px-5 py-4 bg-white/[0.01]">
                      <p className="text-xs text-gray-500 mb-3">{ep.name}</p>
                      {ep.example && (
                        <code className="block bg-black/30 rounded-lg px-4 py-3 text-xs text-emerald-400 font-mono mb-3 overflow-x-auto">
                          {ep.path}?{ep.example}
                        </code>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const url = ep.example ? `${ep.path}?${ep.example}` : ep.path;
                          window.open(url, "_blank");
                        }}
                        className="btn-accent text-xs px-4 py-2"
                      >
                        Try Request
                      </button>
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
