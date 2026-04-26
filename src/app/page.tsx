"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TiltCard from "@/components/TiltCard";
import Marquee from "@/components/Marquee";

const MARQUEE_CATEGORIES = [
  "AI", "DOWNLOADER", "SEARCH", "TOOLS", "RANDOM", "INFO", "ANIME", "GAMES",
];

const FEATURES = [
  {
    title: "No Registration",
    description: "Access all endpoints without creating an account. No API keys, no signup forms, no barriers.",
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  },
  {
    title: "Lightning Fast",
    description: "Sub-100ms response times powered by edge computing. Built for speed at every layer of the stack.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    title: "Always Online",
    description: "99.9% uptime with real-time monitoring. We keep the infrastructure running so you can focus on building.",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
] as const;

const CATALOG_ITEMS = [
  {
    title: "Media Downloader",
    desc: "TikTok, IG, YouTube, Twitter.",
    icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4",
    badges: ["DL"],
    href: "/get/documentation",
  },
  {
    title: "AI Chat",
    desc: "LuminAI, GPT, Gemini, Meta AI.",
    icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    badges: ["AI"],
    href: "/get/documentation",
  },
  {
    title: "Search Engine",
    desc: "Google, YouTube, Pinterest, Images.",
    icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    badges: ["SCH"],
    href: "/get/documentation",
  },
  {
    title: "Developer Tools",
    desc: "URL Shortener, QR Code, Translate.",
    icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
    badges: ["TLS"],
    href: "/get/documentation",
  },
  {
    title: "Random Content",
    desc: "Quotes, Jokes, Memes, Anime.",
    icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
    badges: ["RND"],
    href: "/get/documentation",
  },
  {
    title: "Info Lookup",
    desc: "IP Info, Weather, NPM Package.",
    icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    badges: ["INF"],
    href: "/get/documentation",
  },
] as const;

const FAQ_ITEMS = [
  {
    question: "Is this API service completely free?",
    answer: "Yes. No hidden costs, no rate limits for basic usage, and no registration required. We sustain the project through optional donations.",
  },
  {
    question: "Do I need an API key to get started?",
    answer: "No. All public endpoints are accessible without authentication. Just call the endpoint and get your data.",
  },
  {
    question: "How can I support the project?",
    answer: "Visit the donation page to contribute directly, or submit code contributions. Every form of support helps us keep the service running.",
  },
  {
    question: "What uptime can I expect?",
    answer: "We target 99.9% uptime with real-time monitoring. Check the status page for current system health and historical performance data.",
  },
] as const;

const STATS = [
  { label: "API Endpoints", value: "150+" },
  { label: "Avg Response", value: "<80ms" },
  { label: "Uptime", value: "99.9%" },
  { label: "Daily Requests", value: "10K+" },
] as const;

// Scroll reveal hook
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function RevealSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="surface-dark min-h-screen">
      <Navbar />

      {/* ---- Hero ---- */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="grid-bg absolute inset-0" />
        <div className="orb w-[600px] h-[600px] bg-red-600/20 -top-60 -right-60 absolute" />
        <div className="orb w-[400px] h-[400px] bg-red-900/15 -bottom-40 -left-40 absolute" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-white/[0.03] border border-white/[0.06] text-xs text-gray-500 uppercase tracking-widest mb-10 fade-in-up">
            <span className="dot-online pulse-ring" />
            <span>System Operational. V.2.0.0</span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-[5.5rem] font-black tracking-tight leading-[1.1] mb-8 uppercase fade-in-up">
            <span className="text-white">No Login.</span>
            <br />
            <span className="text-white">No Key.</span>
            <br />
            <span className="text-white">Just </span>
            <span className="text-white relative inline-block">
              Pure
              <span className="absolute bottom-2 left-0 w-full h-[3px] bg-red-600 -rotate-2" />
            </span>
            <span className="text-white"> API.</span>
          </h1>

          <p className="text-sm md:text-base text-gray-500 max-w-xl mx-auto leading-relaxed mb-12 fade-in-up" style={{ animationDelay: "0.2s" }}>
            Platform REST API open-public pertama yang menghapus batasan.
            <br />
            <span className="text-white font-bold">Gratis selamanya</span>, tanpa registrasi, fokus pada kecepatan eksekusi kode Anda.
          </p>

          <div className="flex justify-center fade-in-up" style={{ animationDelay: "0.3s" }}>
            <a href="/get/documentation" className="btn-accent px-10 py-4 text-sm">
              Go to Playground
            </a>
          </div>
        </div>
      </section>

      {/* ---- Stats Bar ---- */}
      <RevealSection>
        <section className="relative z-10 -mt-16 mb-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="surface-elevated rounded-sm grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.04] shimmer glow-pulse">
              {STATS.map((stat) => (
                <div key={stat.label} className="px-6 py-8 text-center">
                  <p className="text-2xl md:text-3xl font-black text-white mb-1 uppercase">{stat.value}</p>
                  <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ---- Why Choose Section ---- */}
      <RevealSection>
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="section-label mb-4">Why Choose</p>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4 uppercase">
                Why <span className="highlight-block">OXYX</span>
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto text-sm">
                Built with reliability and speed as the foundation. No compromises.
              </p>
            </div>

            <div className="scene">
              <div className="grid md:grid-cols-3 gap-6 stagger">
                {FEATURES.map((feature, i) => (
                  <TiltCard key={i} className="card-3d rounded-xl p-8 fade-in-up" intensity={6}>
                    <div className="w-12 h-12 rounded-lg bg-red-600/10 border border-red-600/20 flex items-center justify-center mb-6">
                      <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.icon} />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3 uppercase tracking-wide">{feature.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                  </TiltCard>
                ))}
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ---- Endpoint Catalog (like siputzx) ---- */}
      <RevealSection>
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase">
                Endpoint <span className="highlight-block">Catalog</span>
              </h2>
            </div>

            {/* Scrolling cards */}
            <div className="marquee-container py-2">
              <div className="marquee-track" style={{ animationDuration: "35s" }}>
                {[...CATALOG_ITEMS, ...CATALOG_ITEMS].map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    className="inline-block w-[280px] flex-shrink-0 mx-3 surface-elevated rounded-lg p-6 group hover:border-white/15 transition-all duration-300 whitespace-normal"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center group-hover:border-red-500/30 transition-colors">
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                        </svg>
                      </div>
                      <div className="flex gap-1.5">
                        {item.badges.map((b) => (
                          <span key={b} className="text-[9px] font-bold px-2 py-1 rounded bg-white/[0.06] text-gray-500 uppercase tracking-wider border border-white/[0.08]">
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-1.5 group-hover:text-red-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-600">{item.desc}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ---- Marquee Divider ---- */}
      <section className="py-4">
        <Marquee items={MARQUEE_CATEGORIES} variant="ticker" direction="left" speed="fast" />
      </section>

      {/* ---- Code Preview ---- */}
      <RevealSection>
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="section-label mb-4">Developer Experience</p>
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase">
                Three Lines. That&apos;s It.
              </h2>
            </div>

            <div className="surface-elevated rounded-sm overflow-hidden shimmer">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.04]">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="ml-3 text-xs text-gray-600 font-mono uppercase tracking-wider">request.ts</span>
              </div>
              <pre className="p-6 text-sm font-mono leading-8 overflow-x-auto">
                <code>
                  <span className="text-red-400">const</span>{" "}
                  <span className="text-gray-300">response</span>{" "}
                  <span className="text-gray-600">=</span>{" "}
                  <span className="text-red-400">await</span>{" "}
                  <span className="text-yellow-300">fetch</span>
                  <span className="text-gray-500">(</span>
                  <span className="text-green-400">&apos;https://api.oxyx.my.id/api/ai/luminai?content=hello&apos;</span>
                  <span className="text-gray-500">)</span>
                  <br />
                  <span className="text-red-400">const</span>{" "}
                  <span className="text-gray-300">data</span>{" "}
                  <span className="text-gray-600">=</span>{" "}
                  <span className="text-red-400">await</span>{" "}
                  <span className="text-gray-300">response</span>
                  <span className="text-gray-500">.</span>
                  <span className="text-yellow-300">json</span>
                  <span className="text-gray-500">()</span>
                  <br />
                  <span className="text-gray-300">console</span>
                  <span className="text-gray-500">.</span>
                  <span className="text-yellow-300">log</span>
                  <span className="text-gray-500">(</span>
                  <span className="text-gray-300">data</span>
                  <span className="text-gray-500">.</span>
                  <span className="text-gray-300">result</span>
                  <span className="text-gray-500">)</span>
                </code>
              </pre>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ---- FAQ ---- */}
      <RevealSection>
        <section className="py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <p className="section-label mb-4">FAQ</p>
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase">
                Common Questions
              </h2>
            </div>

            <div className="space-y-0">
              {FAQ_ITEMS.map((faq, i) => (
                <div
                  key={i}
                  className={`accordion-item py-6 cursor-pointer ${openFaq === i ? "open" : ""}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className="flex justify-between items-center gap-4">
                    <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">{faq.question}</h3>
                    <svg className="accordion-icon w-5 h-5 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div className="accordion-body">
                    <p className="pt-4 text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ---- CTA ---- */}
      <RevealSection>
        <section className="py-24 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase">
              Ready to Build?
            </h2>
            <p className="text-gray-600 mb-10 max-w-lg mx-auto text-sm">
              Start integrating in minutes. No sign-up required.
            </p>
            <a href="/get/documentation" className="btn-accent inline-block px-10 py-4 text-sm">
              Read the Docs
            </a>
          </div>
        </section>
      </RevealSection>

      <Footer />
    </div>
  );
}
