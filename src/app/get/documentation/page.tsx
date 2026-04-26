import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DocsClient from "./DocsClient";

export const metadata: Metadata = {
  title: "GET API Documentation",
  description: "Complete documentation for OXYX API GET endpoints. Free, fast, and reliable REST API.",
};

export default function GetDocsPage() {
  return (
    <div className="surface-dark min-h-screen">
      <Navbar />
      <main className="pt-20">
        <DocsClient method="get" />
      </main>
      <Footer />
    </div>
  );
}
