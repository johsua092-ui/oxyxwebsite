import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "OXYX API - Free Public REST API Without API Key",
    template: "%s | OXYX API",
  },
  description: "Free public REST API platform without API key requirements. Access AI, image processing, downloaders, and more. No registration, no limits, no auth needed.",
  keywords: ["free api", "public api", "rest api", "no api key", "oxyx api", "developer tools", "ai api", "image api"],
  authors: [{ name: "OXYX" }],
  robots: "index, follow",
  openGraph: {
    title: "OXYX API - Free Public REST API",
    description: "No login, no key, just pure API. Free forever.",
    type: "website",
    siteName: "OXYX API",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "OXYX API - Free Public REST API",
    description: "No login, no key, just pure API. Free forever.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.variable} font-sans bg-slate-900 text-gray-200 antialiased`}>
        {children}
      </body>
    </html>
  );
}
