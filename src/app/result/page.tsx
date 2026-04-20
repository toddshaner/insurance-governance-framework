import Link from "next/link";
import { classify } from "@/lib/framework/engine";
import { parseInput, type SearchParams } from "@/lib/framework/parseInput";
import { controlLabels } from "@/lib/framework/rules";
import {
  controlStatusClass,
  controlStatusLabel,
  summarizeInputs,
  tierBannerClass,
  tierChipClass,
} from "@/lib/framework/display";
import { tierLabel, type ControlsForTier, type Tier } from "@/lib/framework/types";
import PrintButton from "./PrintButton";

type Props = { searchParams: SearchParams };

export default function ResultPage({ searchParams }: Props) {
  const input = parseInput(searchParams);
  const result = classify(input);

  const prohibited = result.tier === "prohibited";

  return (
    <div className="print-page space-y-8">
      <div className="no-print flex items-center justify-between">
        <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-900">
          ← Start over
        </Link>
        <PrintButton />
      </div>

      <section className={`rounded-lg border px-5 py-4 ${tierBannerClass[result.tier]}`}>
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-wide text-zinc-600">Tier</span>
          <span
            className={`inline-flex items-center rounded-md px-2.5 py-1 text-sm font-semibold ring-1 ring-inset ${tierChipClass[result.tier]}`}
          >
            {tierLabel[result.tier]}
          </span>
          {prohibited && (
            <span className="ml-2 text-sm font-semibold uppercase tracking-wide text-red-800">
              Do not deploy
            </span>
          )}
        </div>
        {input.description && (
          <p className="mt-3 text-sm text-zinc-700">{input.description}</p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-600">
          Inputs
        </h2>
        <dl className="divide-y divide-zinc-200 rounded-md border border-zinc-200 bg-white">
          {summarizeInputs(input).map(([k, v]) => (
            <div key={k} className="flex items-start justify-between px-4 py-2 text-sm">
              <dt className="text-zinc-600">{k}</dt>
              <dd className="text-zinc-900 text-right">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-600">
          {prohibited ? "Blocking rules" : "Why this tier"}
        </h2>
        {result.firedRules.length === 0 ? (
          <p className="text-sm text-zinc-700">
            No rules fired. Baseline tier is Low.
          </p>
        ) : (
          <ul className="space-y-3">
            {result.firedRules.map((r) => (
              <li
                key={r.id}
                className="rounded-md border border-zinc-200 bg-white p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-zinc-500">{r.id}</span>
                  <span className="text-sm font-medium text-zinc-900">
                    {r.title}
                  </span>
                  <span
                    className={`ml-auto inline-flex items-center rounded px-1.5 py-0.5 text-xs ring-1 ring-inset ${tierChipClass[r.severity]}`}
                  >
                    {tierLabel[r.severity]}
                  </span>
                </div>
                <p className="mt-2 text-sm text-zinc-700">{r.rationale}</p>
                {r.sources.length > 0 && (
                  <ul className="mt-2 list-disc pl-5 text-xs text-zinc-500">
                    {r.sources.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {!prohibited && (
        <>
          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-600">
              Required controls
            </h2>
            <ControlsTable controls={result.controls} />
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-600">
              Review expectations
            </h2>
            <dl className="divide-y divide-zinc-200 rounded-md border border-zinc-200 bg-white">
              <Row label="Who reviews" value={result.review.who} />
              <Row label="When" value={result.review.when} />
              <Row label="What they check" value={result.review.what} />
            </dl>
          </section>
        </>
      )}

      {prohibited && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-600">
            Next step
          </h2>
          <p className="rounded-md border border-zinc-200 bg-white p-4 text-sm text-zinc-800">
            {result.review.what}
          </p>
        </section>
      )}

      <footer className="border-t border-zinc-200 pt-4 text-xs text-zinc-500">
        Framework v{result.frameworkVersion}, updated {result.frameworkLastUpdated}.
        This tool supports, not replaces, qualified legal and compliance review.
        Not legal advice.
      </footer>
    </div>
  );
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start justify-between px-4 py-2 text-sm">
    <dt className="text-zinc-600 w-40 shrink-0">{label}</dt>
    <dd className="text-zinc-900 text-right">{value}</dd>
  </div>
);

const ControlsTable = ({ controls }: { controls: ControlsForTier }) => {
  const rows: Array<{ key: keyof ControlsForTier; status: string; statusKey: string; detail?: string }> = [];
  for (const key of Object.keys(controlLabels) as Array<keyof ControlsForTier>) {
    if (key === "bias_drift_monitoring") {
      const c = controls.bias_drift_monitoring;
      rows.push({
        key,
        status: controlStatusLabel[c.status],
        statusKey: c.status,
        detail: c.cadence,
      });
    } else {
      const status = controls[key];
      rows.push({
        key,
        status: controlStatusLabel[status],
        statusKey: status,
      });
    }
  }

  return (
    <div className="overflow-hidden rounded-md border border-zinc-200 bg-white">
      <table className="w-full text-sm">
        <tbody className="divide-y divide-zinc-200">
          {rows.map((r) => (
            <tr key={r.key}>
              <td className="px-4 py-2 text-zinc-700">{controlLabels[r.key]}</td>
              <td className={`px-4 py-2 text-right ${controlStatusClass[r.statusKey as keyof typeof controlStatusClass]}`}>
                {r.status}
                {r.detail ? ` · ${r.detail}` : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
