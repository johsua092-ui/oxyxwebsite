import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Donate",
  description: "Support the development of OXYX API through donations.",
};

const TIERS = [
  {
    name: "Supporter",
    price: "Rp 10K",
    popular: false,
    features: ["Support ongoing development", "Listed as contributor", "Community access"],
    accent: "border-white/[0.06]",
    button: "btn-ghost",
  },
  {
    name: "Pro",
    price: "Rp 50K",
    popular: true,
    features: ["All Supporter benefits", "Priority support channel", "Custom API key", "Higher rate limits"],
    accent: "border-blue-500/30",
    button: "btn-accent",
  },
  {
    name: "Enterprise",
    price: "Rp 100K+",
    popular: false,
    features: ["All Pro benefits", "Dedicated support", "Custom endpoints", "SLA guarantee", "White-label option"],
    accent: "border-white/[0.06]",
    button: "btn-ghost",
  },
] as const;

export default function DonasiPage() {
  return (
    <div className="surface-dark min-h-screen">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 pt-28 pb-20">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-[0.2em] mb-4">
            Support the Project
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-display mb-4">Fund Open Source</h1>
          <p className="text-gray-500 max-w-md mx-auto">
            Your contribution keeps the API free and helps us build new features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`surface-elevated rounded-2xl p-7 border ${tier.accent} ${
                tier.popular ? "ring-1 ring-blue-500/20 shadow-depth-lg relative" : ""
              } transition-all hover:translate-y-[-4px]`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/20">
                    Popular
                  </span>
                </div>
              )}
              <h3 className="text-lg font-semibold text-white mb-1">{tier.name}</h3>
              <p className="text-2xl font-bold text-gradient mb-6">{tier.price}</p>
              <ul className="space-y-3 mb-8">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-400">
                    <svg className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-xl text-sm font-semibold ${tier.button}`}>
                Contribute
              </button>
            </div>
          ))}
        </div>

        <div className="surface-elevated rounded-2xl p-8 text-center">
          <h3 className="text-lg font-semibold text-white mb-3">Other Ways to Support</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
            Star the repository, share the project, or submit pull requests. Open source thrives on community.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="#" className="btn-accent text-xs px-6 py-3">Star on GitHub</a>
            <button className="btn-ghost text-xs px-6 py-3">Share Project</button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
