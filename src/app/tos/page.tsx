import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "OXYX API terms of service and usage policies.",
};

const SECTIONS = [
  { title: "1. Acceptance of Terms", body: "By accessing and using the OXYX API service, you accept and agree to be bound by the terms and provisions of this agreement." },
  { title: "2. Use of Service", body: "You may use the OXYX API for personal and commercial purposes. The API is provided free of charge and does not require registration for basic access." },
  { title: "3. Acceptable Use", body: "You agree not to: (a) use the API for illegal purposes, (b) attempt to overload or disrupt the service, (c) reverse engineer the system, or (d) use the API to harm others." },
  { title: "4. Rate Limiting", body: "We implement rate limiting to ensure fair usage. Excessive requests may result in temporary blocking. Premium API keys provide higher limits." },
  { title: "5. Availability", body: "We strive for high uptime but do not guarantee uninterrupted service. Scheduled maintenance will be announced when possible." },
  { title: "6. Privacy", body: "We collect minimal data for service operation. Request logs are used for monitoring only. We do not sell or share data with third parties." },
  { title: "7. Disclaimer", body: "The API is provided as-is without warranty. We are not responsible for damages arising from use of this service." },
  { title: "8. Changes", body: "We may modify these terms at any time. Continued use after changes constitutes acceptance of the updated terms." },
] as const;

export default function TosPage() {
  return (
    <div className="surface-dark min-h-screen">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-[0.2em] mb-4">
            Legal
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-display mb-3">Terms of Service</h1>
          <p className="text-xs text-gray-600">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>

        <div className="surface-elevated rounded-2xl p-8 md:p-10 space-y-8">
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <h2 className="text-base font-semibold text-white mb-2">{s.title}</h2>
              <p className="text-sm text-gray-500 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
