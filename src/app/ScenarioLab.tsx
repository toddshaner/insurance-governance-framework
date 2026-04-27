import { classify } from "@/lib/framework/engine";
import { stressScenarios } from "@/lib/framework/scenarios";
import { tierChipClass } from "@/lib/framework/display";
import { tierLabel, type Tier } from "@/lib/framework/types";

export default function ScenarioLab() {
  const rows = stressScenarios.map((scenario) => {
    const result = classify(scenario.input);
    return {
      scenario,
      result,
      aligned: result.tier === scenario.expectedTier,
    };
  });

  const alignedCount = rows.filter((row) => row.aligned).length;

  return (
    <section className="space-y-6 border-t border-zinc-200 pt-10">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Scenario lab
        </p>
        <h2 className="text-xl font-semibold text-zinc-900">
          Stress-test the rules against messy insurance examples
        </h2>
        <p className="max-w-3xl text-sm leading-6 text-zinc-600">
          These scenarios make the framework testable. They are not a
          substitute for practitioner validation; each one needs compliance,
          coverage, or regulatory review before it can be marked validated.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Metric label="Scenarios" value={String(rows.length)} />
        <Metric label="Engine aligned" value={`${alignedCount}/${rows.length}`} />
        <Metric label="Validation status" value="Needs review" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {rows.map(({ scenario, result, aligned }) => (
          <article
            key={scenario.id}
            className="rounded-md border border-zinc-200 bg-white p-4"
          >
            <div className="flex flex-wrap items-start gap-2">
              <span className="font-mono text-xs text-zinc-500">
                {scenario.id}
              </span>
              <h3 className="min-w-0 flex-1 text-sm font-semibold text-zinc-900">
                {scenario.title}
              </h3>
              <TierPill tier={result.tier} />
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-700">
              {scenario.description}
            </p>

            <dl className="mt-4 grid gap-3 text-sm">
              <div className="grid grid-cols-[130px_1fr] gap-3">
                <dt className="text-zinc-500">Expected tier</dt>
                <dd>
                  <TierPill tier={scenario.expectedTier} />
                </dd>
              </div>
              <div className="grid grid-cols-[130px_1fr] gap-3">
                <dt className="text-zinc-500">Engine result</dt>
                <dd className="flex flex-wrap items-center gap-2">
                  <TierPill tier={result.tier} />
                  <span
                    className={`rounded px-1.5 py-0.5 text-xs ring-1 ring-inset ${
                      aligned
                        ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
                        : "bg-red-50 text-red-800 ring-red-200"
                    }`}
                  >
                    {aligned ? "Aligned" : "Mismatch"}
                  </span>
                </dd>
              </div>
              <div className="grid grid-cols-[130px_1fr] gap-3">
                <dt className="text-zinc-500">Rules fired</dt>
                <dd className="text-zinc-700">
                  {result.firedRules.length === 0
                    ? "None"
                    : result.firedRules.map((rule) => rule.id).join(", ")}
                </dd>
              </div>
            </dl>

            <div className="mt-4 space-y-2 border-t border-zinc-200 pt-3 text-sm leading-6">
              <p className="text-zinc-700">
                <span className="font-medium text-zinc-900">Reviewer note:</span>{" "}
                {scenario.reviewerNote}
              </p>
              <p className="text-zinc-700">
                <span className="font-medium text-zinc-900">Coverage question:</span>{" "}
                {scenario.coverageQuestion}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

const Metric = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-md border border-zinc-200 bg-white p-4">
    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
      {label}
    </p>
    <p className="mt-2 text-lg font-semibold text-zinc-900">{value}</p>
  </div>
);

const TierPill = ({ tier }: { tier: Tier }) => (
  <span
    className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset ${tierChipClass[tier]}`}
  >
    {tierLabel[tier]}
  </span>
);
