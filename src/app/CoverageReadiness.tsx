"use client";

import { useMemo, useState } from "react";
import {
  coveragePolicyLabels,
  evaluateCoverage,
  initialCoverageState,
  type CoverageAnswer,
  type CoveragePolicy,
  type CoverageSeverity,
  type CoverageState,
} from "@/lib/framework/coverage";

const policyOptions = Object.keys(coveragePolicyLabels) as CoveragePolicy[];
const answerOptions: Array<{ value: CoverageAnswer; label: string }> = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "unknown", label: "Not sure" },
];

const choiceCls =
  "flex min-h-11 items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 hover:border-zinc-300";
const labelCls = "block text-sm font-medium text-zinc-900";
const helpCls = "mt-1 text-xs text-zinc-500";

const severityClass: Record<CoverageSeverity, string> = {
  ready: "border-emerald-300 bg-emerald-50 text-emerald-950",
  review: "border-amber-300 bg-amber-50 text-amber-950",
  urgent: "border-red-300 bg-red-50 text-red-950",
};

export default function CoverageReadiness() {
  const [state, setState] = useState<CoverageState>(initialCoverageState);
  const result = useMemo(() => evaluateCoverage(state), [state]);

  const togglePolicy = (policy: CoveragePolicy) => {
    setState((current) => ({
      ...current,
      policies: current.policies.includes(policy)
        ? current.policies.filter((item) => item !== policy)
        : [...current.policies, policy],
    }));
  };

  const setAnswer = (key: keyof Omit<CoverageState, "policies">, value: CoverageAnswer) => {
    setState((current) => ({ ...current, [key]: value }));
  };

  return (
    <section className="space-y-6 border-t border-zinc-200 pt-10">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Coverage readiness
        </p>
        <h2 className="text-xl font-semibold text-zinc-900">
          Check whether the AI risk is insurable or drifting into an exclusion gap
        </h2>
        <p className="max-w-3xl text-sm leading-6 text-zinc-600">
          This does not interpret policy language. It surfaces the broker,
          carrier, vendor, and coverage-counsel questions that should be
          resolved before launch or renewal.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,380px)]">
        <div className="space-y-6">
          <div>
            <span className={labelCls}>Which policies may need to respond?</span>
            <p className={helpCls}>
              Select what exists today or what should be reviewed for this use case.
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {policyOptions.map((policy) => (
                <label key={policy} className={choiceCls}>
                  <input
                    type="checkbox"
                    checked={state.policies.includes(policy)}
                    onChange={() => togglePolicy(policy)}
                  />
                  <span>{coveragePolicyLabels[policy]}</span>
                </label>
              ))}
            </div>
          </div>

          <AnswerGrid
            label="Do current or renewal policies include an AI exclusion or narrowing endorsement?"
            value={state.aiExcluded}
            onChange={(value) => setAnswer("aiExcluded", value)}
          />
          <AnswerGrid
            label="Has this AI use been disclosed to the broker or carrier?"
            value={state.brokerDisclosed}
            onChange={(value) => setAnswer("brokerDisclosed", value)}
          />
          <AnswerGrid
            label="Do vendor contracts cover AI indemnity, insurance, audit rights, and IP warranties?"
            value={state.vendorIndemnity}
            onChange={(value) => setAnswer("vendorIndemnity", value)}
          />
          <AnswerGrid
            label="Can the AI create content, code, marketing, advice, or other IP-sensitive output?"
            value={state.ipExposure}
            onChange={(value) => setAnswer("ipExposure", value)}
          />
          <AnswerGrid
            label="Can the AI materially affect a customer, claimant, applicant, employee, or insured business?"
            value={state.decisionImpact}
            onChange={(value) => setAnswer("decisionImpact", value)}
          />
        </div>

        <aside className={`rounded-md border p-4 ${severityClass[result.severity]}`}>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide">
              {result.label}
            </h3>
            <span className="rounded px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset ring-current">
              {result.severity === "urgent"
                ? "Urgent"
                : result.severity === "review"
                  ? "Review"
                  : "Ready"}
            </span>
          </div>
          <p className="mt-3 text-sm leading-6">{result.summary}</p>

          {result.findings.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {result.findings.map((finding) => (
                <li key={finding.title} className="border-t border-current/20 pt-3">
                  <p className="text-sm font-medium">{finding.title}</p>
                  <p className="mt-1 text-sm leading-6">{finding.detail}</p>
                  <p className="mt-2 text-sm">
                    <span className="font-medium">Action:</span> {finding.action}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm">
              Keep the policy forms, endorsements, broker confirmation, and
              vendor contract evidence with the review packet.
            </p>
          )}
        </aside>
      </div>
    </section>
  );
}

const AnswerGrid = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: CoverageAnswer | "";
  onChange: (value: CoverageAnswer) => void;
}) => (
  <div>
    <span className={labelCls}>{label}</span>
    <div className="mt-3 grid gap-2 sm:grid-cols-3">
      {answerOptions.map((option) => (
        <label key={option.value} className={choiceCls}>
          <input
            type="radio"
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  </div>
);
