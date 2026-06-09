"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AuthModal from "@/components/AuthModal";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/get/documentation", label: "Playground" },
  { href: "/monitor", label: "Monitor" },
  { href: "/donasi", label: "Donate" },
] as const;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Ambil session saat ini
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Dengarkan perubahan state auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.reload();
  };

  const getDisplayName = () => {
    if (!user) return "";
    return user.user_metadata?.nickname || user.email?.split("@")[0];
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "nav-surface shadow-depth" : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-2 h-6 bg-red-600 animate-pulse" />
              <span className="text-lg font-black text-white uppercase tracking-tight hover:text-red-500 transition-colors">
                OXYX
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-white uppercase tracking-widest transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}

              {user ? (
                <div className="flex items-center gap-3 ml-2 border-l border-white/10 pl-4">
                  <span className="text-xs font-bold text-red-500 uppercase tracking-widest">
                    Hi, {getDisplayName()}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 text-[10px] font-bold bg-white/5 hover:bg-red-600/20 text-gray-400 hover:text-red-500 border border-white/10 hover:border-red-500/20 rounded uppercase tracking-wider transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="ml-2 border-l border-white/10 pl-4 text-xs font-semibold text-gray-400 hover:text-white uppercase tracking-widest transition-colors"
                >
                  Sign In
                </button>
              )}

              <div className="flex items-center gap-2 ml-3 px-3 py-2">
                <span className="dot-online pulse-ring" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Status</span>
              </div>
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Toggle navigation"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden nav-surface border-t border-white/5">
            <div className="px-6 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3 text-xs font-semibold text-gray-500 hover:text-white uppercase tracking-widest transition-all"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {user ? (
                <div className="pt-4 border-t border-white/5 px-4 space-y-3">
                  <div className="text-xs font-bold text-red-500 uppercase tracking-widest">
                    Hi, {getDisplayName()}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left py-2 text-xs font-semibold text-red-500 hover:text-red-400 uppercase tracking-widest transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t border-white/5 px-4">
                  <button
                    onClick={() => {
                      setIsAuthOpen(true);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left py-2 text-xs font-semibold text-gray-400 hover:text-white uppercase tracking-widest transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}

