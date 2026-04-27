import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { FRAMEWORK_VERSION } from "@/lib/framework/types";

export const metadata: Metadata = {
  title: "Insurance AI Governance Framework",
  description:
    "Assess insurance AI governance, jurisdiction prompts, remediation steps, and coverage-readiness gaps.",
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
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-sm font-semibold text-zinc-900">
              Insurance AI Governance Framework
            </Link>
            <nav className="flex gap-5 text-sm text-zinc-600">
              <Link href="/" className="hover:text-zinc-900">
                Workbench
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
        <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
        <footer className="no-print mx-auto max-w-6xl px-6 py-10 text-xs text-zinc-500">
          Framework v{FRAMEWORK_VERSION}. Not legal advice.
        </footer>
      </body>
    </html>
  );
}
