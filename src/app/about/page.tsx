import {
  FRAMEWORK_LAST_UPDATED,
  FRAMEWORK_VERSION,
} from "@/lib/framework/types";

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-zinc-900">About</h1>
      <section className="space-y-3 text-sm text-zinc-800">
        <p>
          This tool classifies a proposed AI use case in insurance operations
          into one of four tiers — Low, Moderate, High, or Prohibited — and
          reports the review expectations and controls required at that tier.
        </p>
        <p>
          The framework is deterministic. The same inputs always produce the
          same tier and the same rationale. Every rule that fires is shown on
          the result page so the decision can be traced end-to-end.
        </p>
        <p>
          Framework v{FRAMEWORK_VERSION}, last updated{" "}
          {FRAMEWORK_LAST_UPDATED}. See the{" "}
          <a href="/framework" className="underline">
            Framework
          </a>{" "}
          page for the full rules, controls matrix, and review matrix.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-600">
          Sources
        </h2>
        <ul className="list-disc pl-5 text-sm text-zinc-700 space-y-1">
          <li>NAIC Model Bulletin on the Use of Artificial Intelligence Systems by Insurers (2023)</li>
          <li>NYDFS Insurance Circular Letter No. 7 (2024)</li>
          <li>Colorado SB21-169 — Restrictions on insurers' use of external consumer data and algorithms</li>
          <li>EU AI Act (Regulation (EU) 2024/1689)</li>
          <li>NIST AI Risk Management Framework 1.0</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-600">
          Limitations
        </h2>
        <ul className="list-disc pl-5 text-sm text-zinc-700 space-y-1">
          <li>This tool supports, not replaces, qualified legal and compliance review. Not legal advice.</li>
          <li>The framework is hardcoded. Edits require a code change.</li>
          <li>The tool does not save submissions. Nothing is logged server-side.</li>
          <li>No authentication. Designed for a single user drafting assessments.</li>
        </ul>
      </section>
    </div>
  );
}
