import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { FRAMEWORK_VERSION } from "@/lib/framework/types";

export const metadata: Metadata = {
  title: "Insurance AI Governance Framework",
  description:
    "Classify a proposed AI use case by risk tier and see the review expectations and controls required at that tier.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">
        <header className="no-print border-b border-zinc-200 bg-white">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-sm font-semibold text-zinc-900">
              Insurance AI Governance Framework
            </Link>
            <nav className="flex gap-5 text-sm text-zinc-600">
              <Link href="/" className="hover:text-zinc-900">
                Assess
              </Link>
              <Link href="/framework" className="hover:text-zinc-900">
                Framework
              </Link>
              <Link href="/about" className="hover:text-zinc-900">
                About
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-6 py-10">{children}</main>
        <footer className="no-print mx-auto max-w-3xl px-6 py-10 text-xs text-zinc-500">
          Framework v{FRAMEWORK_VERSION}. Not legal advice.
        </footer>
      </body>
    </html>
  );
}
