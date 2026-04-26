import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contributors",
  description: "The people building OXYX API.",
};

export default function ContributorPage() {
  const contributors = [
    { name: "OXYX Team", role: "Core Developer", initials: "OX" },
  ];

  return (
    <div className="surface-dark min-h-screen">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-28 pb-20">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-violet-400 uppercase tracking-[0.2em] mb-4">
            Team
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-display mb-4">Contributors</h1>
          <p className="text-gray-500 max-w-md mx-auto">
            The people behind OXYX API. Open to new contributors.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 mb-16">
          {contributors.map((c) => (
            <div key={c.name} className="card-3d rounded-2xl p-8 text-center group">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 text-lg font-bold text-white transition-transform duration-300 group-hover:scale-110">
                {c.initials}
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{c.name}</h3>
              <p className="text-xs text-gray-500">{c.role}</p>
            </div>
          ))}
        </div>

        <div className="surface-elevated rounded-2xl p-8 text-center">
          <h2 className="text-xl font-semibold text-white mb-3">Want to Contribute?</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
            We welcome new contributors. Reach out to us to get involved with development.
          </p>
          <a href="/support" className="btn-accent inline-block text-xs px-6 py-3">
            Contact Us
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
