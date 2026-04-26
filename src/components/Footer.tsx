import Link from "next/link";
import Marquee from "./Marquee";

const FOOTER_SECTIONS = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "Playground", href: "/get/documentation" },
      { label: "Monitor", href: "/monitor" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "Contributors", href: "/contributor" },
      { label: "Donate", href: "/donasi" },
      { label: "Support", href: "/support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/tos" },
      { label: "Privacy", href: "#" },
    ],
  },
] as const;

const TICKER_ITEMS = [
  "OXYX API",
  "FAST",
  "SECURE",
  "RELIABLE",
  "FREE",
  "OPEN SOURCE",
  "NO KEY REQUIRED",
  "150+ ENDPOINTS",
];

export default function Footer() {
  return (
    <footer className="footer-surface pt-20 pb-0">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">

          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5 group">
              <div className="w-2 h-6 bg-red-600" />
              <span className="text-lg font-black text-white uppercase tracking-tight">OXYX</span>
            </Link>
            <div className="flex items-center gap-2 mb-4">
              <span className="dot-online pulse-ring" />
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-widest">Online</span>
            </div>
            <p className="text-gray-600 text-xs leading-relaxed max-w-xs">
              Membangun ekosistem developer yang lebih cepat, terbuka, dan inklusif.
            </p>
          </div>

          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-5">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-gray-600 hover:text-white uppercase tracking-wider transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee Ticker */}
      <div className="border-t border-white/[0.04] py-4">
        <Marquee items={TICKER_ITEMS} variant="ticker" direction="left" speed="fast" />
      </div>

      <div className="border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-gray-700 uppercase tracking-widest">
            {new Date().getFullYear()} OXYX API.
          </p>
          <div className="flex items-center gap-2">
            <span className="dot-online" />
            <p className="text-[10px] text-gray-700 uppercase tracking-widest">
              All Systems Operational
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
