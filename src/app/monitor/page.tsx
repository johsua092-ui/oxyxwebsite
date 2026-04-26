import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MonitorClient from "./MonitorClient";

export const metadata: Metadata = {
  title: "System Monitor - OXYX API",
  description: "Real-time system monitoring for OXYX API. Track uptime, CPU, memory, and request metrics.",
};

export default function MonitorPage() {
  return (
    <div className="surface-dark min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 pt-28 pb-20">
        <div className="text-center mb-12">
          <p className="section-label mb-4">
            System Monitor
          </p>
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase mb-2">
            Realtime Status
          </h1>
          <p className="text-sm text-gray-600">
            Live server metrics refreshed every 2 seconds
          </p>
        </div>
        <MonitorClient />
      </main>
      <Footer />
    </div>
  );
}
