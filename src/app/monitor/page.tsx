import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MonitorClient from "./MonitorClient";

export const metadata: Metadata = {
  title: "API Status & Monitoring",
  description: "Real-time monitoring dashboard for OXYX API. View uptime, response times, and system health.",
};

export default function MonitorPage() {
  return (
    <div className="surface-dark min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-[0.2em] mb-2">
              System Health
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-display">API Monitoring</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="dot-online pulse-ring" />
            Live Dashboard
          </div>
        </div>

        <MonitorClient />
      </main>

      <Footer />
    </div>
  );
}
