import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TiltCard from "@/components/TiltCard";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with OXYX API. Contact our support team for technical assistance.",
};

const SUPPORT_OPTIONS = [
  {
    title: "Live Chat",
    description: "Connect with our team instantly for real-time technical assistance and troubleshooting.",
    href: "#",
    label: "Start Chat",
    icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    title: "Email",
    description: "Send detailed bug reports, feature requests, or technical questions to our engineering team.",
    href: "mailto:support@oxyx.my.id",
    label: "Send Email",
    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    gradient: "from-violet-500 to-purple-400",
  },
  {
    title: "Community",
    description: "Join our developer community to share ideas, get peer support, and stay updated on changes.",
    href: "#",
    label: "Join Now",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    gradient: "from-emerald-500 to-teal-400",
  },
  {
    title: "Documentation",
    description: "Comprehensive guides covering every endpoint, parameter, and response format available.",
    href: "/get/documentation",
    label: "View Docs",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    gradient: "from-amber-500 to-orange-400",
  },
] as const;

export default function SupportPage() {
  return (
    <div className="surface-dark min-h-screen">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 pt-28 pb-20">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-[0.2em] mb-4">
            Support Center
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-display mb-4">How Can We Help?</h1>
          <p className="text-gray-500 max-w-md mx-auto">
            Choose the best way to reach us. We typically respond within 24 hours.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {SUPPORT_OPTIONS.map((opt) => (
            <TiltCard key={opt.title} className="card-3d rounded-2xl p-8" intensity={5}>
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${opt.gradient} flex items-center justify-center mb-5`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={opt.icon} />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{opt.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">{opt.description}</p>
              <a href={opt.href} className="btn-accent inline-block text-xs px-5 py-2.5">
                {opt.label}
              </a>
            </TiltCard>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
