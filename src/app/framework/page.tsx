import { controlsByTier, controlLabels, reviewByTier, rules } from "@/lib/framework/rules";
import { remediationByRule } from "@/lib/framework/remediation";
import { jurisdictionGuidance, jurisdictionOptions } from "@/lib/framework/jurisdictions";
import {
  controlStatusClass,
  controlStatusLabel,
  tierChipClass,
} from "@/lib/framework/display";
import {
  FRAMEWORK_LAST_UPDATED,
  FRAMEWORK_VERSION,
  tierLabel,
  type ControlsForTier,
  type Tier,
} from "@/lib/framework/types";

const tiers: Tier[] = ["low", "moderate", "high", "prohibited"];

export default function FrameworkPage() {
  return (
    <div className="space-y-10">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold text-zinc-900">Framework</h1>
        <p className="text-sm text-zinc-600">
          The rules, remediation guidance, controls, jurisdiction prompts, and
          review expectations this tool uses. The engine evaluates the rules
          below in order. The final tier is the most severe tier among all fired
          rules. Framework v{FRAMEWORK_VERSION}, updated{" "}
          {FRAMEWORK_LAST_UPDATED}.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-600">
          Tiers
        </h2>
        <ul className="space-y-2 text-sm text-zinc-800">
          <li>
            <TierPill tier="low" /> Internal productivity use with documented
            data, not client-facing, not regulated.
          </li>
          <li>
            <TierPill tier="moderate" /> AI assists on work that may touch
            clients or regulated topics with human review and logging.
          </li>
          <li>
            <TierPill tier="high" /> Output reaches clients directly, or
            materially influences a regulated decision, or is generative with
            external exposure.
          </li>
          <li>
            <TierPill tier="prohibited" /> Do not deploy. AI decides a regulated
            matter without human review, training data is unknown with client
            or regulated exposure, or a High-risk use case has no logging.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-600">
          Rules
        </h2>
        <ul className="space-y-3">
          {rules.map((r) => (
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
              <p className="mt-2 text-sm text-zinc-700">
                <span className="font-semibold text-zinc-800">Condition:</span>{" "}
                {r.conditionText}
              </p>
              <p className="mt-1 text-sm text-zinc-700">
                <span className="font-semibold text-zinc-800">Rationale:</span>{" "}
                {r.rationale}
              </p>
              {remediationByRule[r.id] && (
                <div className="mt-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm">
                  <p className="font-semibold text-zinc-800">
                    Remediation:
                  </p>
                  <p className="mt-1 text-zinc-700">
                    {remediationByRule[r.id].issue}
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-700">
                    {remediationByRule[r.id].actions.map((action) => (
                      <li key={action}>{action}</li>
                    ))}
                  </ul>
                </div>
              )}
              {r.sources.length > 0 && (
                <ul className="mt-2 list-disc pl-5 text-xs text-zinc-500">
                  {r.sources.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              )}
              <p className="mt-2 text-xs text-zinc-500">
                Kind: {r.kind === "base" ? "Base rule" : "Modifier (evaluated after base tier is set)"}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-600">
          Jurisdiction overlays
        </h2>
        <p className="text-sm text-zinc-600">
          Jurisdiction prompts do not change the deterministic tier yet. They
          identify review questions that should be included in the assessment
          packet.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {jurisdictionOptions.map((key) => {
            const jurisdiction = jurisdictionGuidance[key];
            return (
              <article
                key={jurisdiction.key}
                className="rounded-md border border-zinc-200 bg-white p-4"
              >
                <h3 className="text-sm font-semibold text-zinc-900">
                  {jurisdiction.label}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-700">
                  {jurisdiction.whyItMatters}
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-600">
                  {jurisdiction.prompts.map((prompt) => (
                    <li key={prompt}>{prompt}</li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-zinc-500">
                  Source: {jurisdiction.source}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-600">
          Controls matrix
        </h2>
        <div className="overflow-x-auto rounded-md border border-zinc-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-left">
              <tr>
                <th className="px-3 py-2 text-zinc-600 font-medium">Control</th>
                {tiers.map((t) => (
                  <th key={t} className="px-3 py-2 text-zinc-600 font-medium">
                    {tierLabel[t]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {(Object.keys(controlLabels) as Array<keyof ControlsForTier>).map(
                (key) => (
                  <tr key={key}>
                    <td className="px-3 py-2 text-zinc-700">
                      {controlLabels[key]}
                    </td>
                    {tiers.map((t) => {
                      if (key === "bias_drift_monitoring") {
                        const b = controlsByTier[t].bias_drift_monitoring;
                        return (
                          <td
                            key={t}
                            className={`px-3 py-2 ${controlStatusClass[b.status]}`}
                          >
                            {controlStatusLabel[b.status]}
                            {b.cadence ? ` - ${b.cadence}` : ""}
                          </td>
                        );
                      }
                      const s = controlsByTier[t][key];
                      return (
                        <td
                          key={t}
                          className={`px-3 py-2 ${controlStatusClass[s]}`}
                        >
                          {controlStatusLabel[s]}
                        </td>
                      );
                    })}
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-600">
          Review expectations
        </h2>
        <div className="overflow-x-auto rounded-md border border-zinc-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-left">
              <tr>
                <th className="px-3 py-2 text-zinc-600 font-medium">Tier</th>
                <th className="px-3 py-2 text-zinc-600 font-medium">Who</th>
                <th className="px-3 py-2 text-zinc-600 font-medium">When</th>
                <th className="px-3 py-2 text-zinc-600 font-medium">What</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {tiers.map((t) => (
                <tr key={t}>
                  <td className="px-3 py-2">
                    <TierPill tier={t} />
                  </td>
                  <td className="px-3 py-2 text-zinc-700">
                    {reviewByTier[t].who}
                  </td>
                  <td className="px-3 py-2 text-zinc-700">
                    {reviewByTier[t].when}
                  </td>
                  <td className="px-3 py-2 text-zinc-700">
                    {reviewByTier[t].what}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

const TierPill = ({ tier }: { tier: Tier }) => (
  <span
    className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset ${tierChipClass[tier]}`}
  >
    {tierLabel[tier]}
  </span>
);
