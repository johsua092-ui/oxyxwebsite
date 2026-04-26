"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TiltCard from "@/components/TiltCard";

const FEATURES = [
  {
    title: "Lightning Fast",
    description: "Sub-100ms response times powered by edge computing. Every millisecond counts when you're building at scale.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    ),
    color: "from-blue-500 to-cyan-400",
  },
  {
    title: "Zero Configuration",
    description: "No API keys, no registration, no setup. Just call the endpoint and get your data. We believe in simplicity.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    ),
    color: "from-violet-500 to-purple-400",
  },
  {
    title: "Auto Scaling",
    description: "Infrastructure that grows with your traffic. Handle 10 or 10 million requests without changing a single line of code.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    ),
    color: "from-emerald-500 to-teal-400",
  },
] as const;

const FAQ_ITEMS = [
  {
    question: "Is this API service completely free?",
    answer: "Yes. No hidden costs, no rate limits for basic usage, and no registration required. We sustain the project through optional donations and premium tiers.",
  },
  {
    question: "Do I need an API key to get started?",
    answer: "No. All public endpoints are accessible without authentication. Premium endpoints with higher limits can be unlocked with an optional API key.",
  },
  {
    question: "How can I support the project?",
    answer: "Visit the donation page to contribute directly, star the repository on GitHub, or submit code contributions. Every form of support helps us keep the service running.",
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

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="surface-dark min-h-screen">
      <Navbar />

      {/* ---- Hero ---- */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="grid-bg absolute inset-0" />
        <div className="orb w-[500px] h-[500px] bg-blue-600/30 -top-40 -right-40 absolute" />
        <div className="orb w-[400px] h-[400px] bg-indigo-600/20 -bottom-32 -left-32 absolute" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-sm text-gray-400 mb-10">
            <span className="dot-online pulse-ring" />
            <span>All systems operational</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-8">
            <span className="text-display">Build Smarter.</span>
            <br />
            <span className="text-gradient">Scale Faster.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12">
            A production-ready API platform with 150+ endpoints. No keys, no
            registration, no limits. Just clean, fast responses.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/get/documentation" className="btn-accent px-8 py-4 text-base">
              Explore API
            </a>
            <a href="/monitor" className="btn-ghost px-8 py-4 text-base">
              View Status
            </a>
          </div>
        </div>
      </section>

      {/* ---- Stats Bar ---- */}
      <section className="relative z-10 -mt-16 mb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="surface-elevated rounded-2xl shadow-depth-lg grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.04]">
            {STATS.map((stat) => (
              <div key={stat.label} className="px-6 py-8 text-center">
                <p className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Features ---- */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-[0.2em] mb-4">
              Core Features
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-display mb-4">
              Engineered for Performance
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Every component is built with reliability and speed as the foundation.
            </p>
          </div>

          <div className="scene">
            <div className="grid md:grid-cols-3 gap-6">
              {FEATURES.map((feature, i) => (
                <TiltCard
                  key={i}
                  className="card-3d rounded-2xl p-8"
                  intensity={6}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {feature.icon}
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                </TiltCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- Code Preview ---- */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-violet-400 uppercase tracking-[0.2em] mb-4">
              Developer Experience
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-display">
              Three Lines. That&apos;s It.
            </h2>
          </div>

          <div className="surface-elevated rounded-2xl shadow-depth-lg overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.04]">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="ml-3 text-xs text-gray-600 font-mono">request.ts</span>
            </div>
            <pre className="p-6 text-sm font-mono leading-8 overflow-x-auto">
              <code>
                <span className="text-violet-400">const</span>{" "}
                <span className="text-blue-300">response</span>{" "}
                <span className="text-gray-500">=</span>{" "}
                <span className="text-violet-400">await</span>{" "}
                <span className="text-yellow-300">fetch</span>
                <span className="text-gray-400">(</span>
                <span className="text-green-400">&apos;https://api.oxyx.my.id/api/ai/luminai?content=hello&apos;</span>
                <span className="text-gray-400">)</span>
                <br />
                <span className="text-violet-400">const</span>{" "}
                <span className="text-blue-300">data</span>{" "}
                <span className="text-gray-500">=</span>{" "}
                <span className="text-violet-400">await</span>{" "}
                <span className="text-blue-300">response</span>
                <span className="text-gray-400">.</span>
                <span className="text-yellow-300">json</span>
                <span className="text-gray-400">()</span>
                <br />
                <span className="text-blue-300">console</span>
                <span className="text-gray-400">.</span>
                <span className="text-yellow-300">log</span>
                <span className="text-gray-400">(</span>
                <span className="text-blue-300">data</span>
                <span className="text-gray-400">.</span>
                <span className="text-blue-300">result</span>
                <span className="text-gray-400">)</span>
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* ---- FAQ ---- */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-[0.2em] mb-4">
              FAQ
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-display">
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
                  <h3 className="text-base font-medium text-gray-200">{faq.question}</h3>
                  <svg
                    className="accordion-icon w-5 h-5 text-gray-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="accordion-body">
                  <p className="pt-4 text-sm text-gray-500 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-display mb-6">
            Ready to Build?
          </h2>
          <p className="text-gray-500 mb-10 max-w-lg mx-auto">
            Start integrating in minutes. No sign-up required.
          </p>
          <a href="/get/documentation" className="btn-accent inline-block px-10 py-4 text-base">
            Read the Docs
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
