import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DocsClient from "@/app/get/documentation/DocsClient";

export const metadata: Metadata = {
  title: "POST API Documentation",
  description: "Complete documentation for OXYX API POST endpoints.",
};

export default function PostDocsPage() {
  return (
    <div className="surface-dark min-h-screen">
      <Navbar />
      <main className="pt-20">
        <DocsClient method="post" />
      </main>
      <Footer />
    </div>
  );
}
