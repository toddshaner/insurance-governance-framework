"use client";

import { useMemo, useState } from "react";
import { classify } from "@/lib/framework/engine";
import { controlLabels } from "@/lib/framework/rules";
import { remediationByRule } from "@/lib/framework/remediation";
import {
  jurisdictionGuidance,
  jurisdictionOptions,
  type JurisdictionKey,
} from "@/lib/framework/jurisdictions";
import {
  controlStatusClass,
  controlStatusLabel,
  dataSourceLabel,
  decisionAuthorityLabel,
  humanReviewLabel,
  tierBannerClass,
  tierChipClass,
} from "@/lib/framework/display";
import {
  tierLabel,
  type AiMode,
  type Audience,
  type ControlsForTier,
  type DataSource,
  type DecisionAuthority,
  type HumanReview,
  type RegulatedDomain,
  type Tier,
  type UseCaseInput,
} from "@/lib/framework/types";

type WorkflowArea =
  | "claims"
  | "underwriting_pricing"
  | "coverage"
  | "customer_service"
  | "agent_support"
  | "document_review"
  | "fraud"
  | "internal_productivity"
  | "other";

type OutputKind =
  | "draft_content"
  | "summary"
  | "classification_score"
  | "recommendation"
  | "decision"
  | "customer_message"
  | "other";

type YesNoUnknown = "yes" | "no" | "unknown";
type RegulatedMode = "" | "none" | "selected" | "unknown";

type AssessmentState = {
  workflowArea: WorkflowArea | "";
  outputKind: OutputKind | "";
  audience: Audience | "unknown" | "";
  clientFacing: YesNoUnknown | "";
  regulatedMode: RegulatedMode;
  regulatedDomains: RegulatedDomain[];
  aiMode: AiMode | "unknown" | "";
  decisionAuthority: DecisionAuthority | "unknown" | "";
  humanReview: HumanReview | "unknown" | "";
  dataSource: DataSource | "";
  logging: YesNoUnknown | "";
  jurisdictions: JurisdictionKey[];
  context: string;
};

const initialState: AssessmentState = {
  workflowArea: "",
  outputKind: "",
  audience: "",
  clientFacing: "",
  regulatedMode: "",
  regulatedDomains: [],
  aiMode: "",
  decisionAuthority: "",
  humanReview: "",
  dataSource: "",
  logging: "",
  jurisdictions: [],
  context: "",
};

const labelCls = "block text-sm font-medium text-zinc-900";
const helpCls = "mt-1 text-xs text-zinc-500";
const sectionCls = "border-t border-zinc-200 pt-6";
const inputCls =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500";

const workflowLabels: Record<WorkflowArea, string> = {
  claims: "Claims",
  underwriting_pricing: "Underwriting or pricing",
  coverage: "Coverage",
  customer_service: "Customer service",
  agent_support: "Agent or broker support",
  document_review: "Document review",
  fraud: "Fraud or investigation",
  internal_productivity: "Internal productivity",
  other: "Other",
};

const outputLabels: Record<OutputKind, string> = {
  draft_content: "Drafts text or documents",
  summary: "Summarizes information",
  classification_score: "Classifies, scores, or predicts",
  recommendation: "Recommends an action",
  decision: "Makes a decision",
  customer_message: "Creates a customer message",
  other: "Other output",
};

const audienceLabels: Record<Audience | "unknown", string> = {
  internal: "Internal staff",
  external: "External users",
  both: "Both internal and external",
  unknown: "Not sure",
};

const yesNoUnknownLabels: Record<YesNoUnknown, string> = {
  yes: "Yes",
  no: "No",
  unknown: "Not sure",
};

const aiModeLabels: Record<AiMode | "unknown", string> = {
  generative: "Generative",
  classifying: "Classifying, scoring, or predicting",
  unknown: "Not sure",
};

const jurisdictionLabels: Record<JurisdictionKey, string> = {
  naic_model: "NAIC model bulletin state",
  new_york: "New York",
  colorado: "Colorado",
  california: "California",
  eu: "European Union",
  unknown: "Not sure",
};

const domainLabels: Record<RegulatedDomain, string> = {
  pricing: "Pricing",
  coverage: "Coverage",
  claims: "Claims",
};

const workflowOptions = Object.keys(workflowLabels) as WorkflowArea[];
const outputOptions = Object.keys(outputLabels) as OutputKind[];
const audienceOptions: Array<Audience | "unknown"> = [
  "internal",
  "external",
  "both",
  "unknown",
];
const aiModeOptions: Array<AiMode | "unknown"> = [
  "generative",
  "classifying",
  "unknown",
];
const dataSourceOptions: DataSource[] = [
  "vendor_documented",
  "internal_curated",
  "public_unknown",
  "unknown",
];
const decisionAuthorityOptions: Array<DecisionAuthority | "unknown"> = [
  "recommend",
  "decide_with_review",
  "decide_without_review",
  "unknown",
];
const humanReviewOptions: Array<HumanReview | "unknown"> = [
  "yes",
  "no",
  "unknown",
];

export default function AssessForm() {
  const [state, setState] = useState<AssessmentState>(initialState);

  const missingItems = useMemo(() => getMissingItems(state), [state]);
  const generatedSummary = useMemo(() => buildSummary(state), [state]);
  const input = useMemo(
    () => (missingItems.length === 0 ? buildInput(state, generatedSummary) : null),
    [generatedSummary, missingItems.length, state],
  );
  const result = useMemo(() => (input ? classify(input) : null), [input]);
  const assumptions = useMemo(() => buildAssumptions(state), [state]);
  const selectedJurisdictions = useMemo(
    () => state.jurisdictions.map((key) => jurisdictionGuidance[key]),
    [state.jurisdictions],
  );

  const toggleDomain = (domain: RegulatedDomain) => {
    setState((current) => {
      const exists = current.regulatedDomains.includes(domain);
      const regulatedDomains = exists
        ? current.regulatedDomains.filter((d) => d !== domain)
        : [...current.regulatedDomains, domain];
      return {
        ...current,
        regulatedMode: regulatedDomains.length > 0 ? "selected" : "",
        regulatedDomains,
        decisionAuthority:
          regulatedDomains.length > 0 &&
          current.decisionAuthority === "not_applicable"
            ? ""
            : current.decisionAuthority,
      };
    });
  };

  const toggleJurisdiction = (jurisdiction: JurisdictionKey) => {
    setState((current) => {
      if (jurisdiction === "unknown") {
        return {
          ...current,
          jurisdictions: current.jurisdictions.includes("unknown")
            ? []
            : ["unknown"],
        };
      }

      const withoutUnknown = current.jurisdictions.filter(
        (item) => item !== "unknown",
      );
      const exists = withoutUnknown.includes(jurisdiction);
      return {
        ...current,
        jurisdictions: exists
          ? withoutUnknown.filter((item) => item !== jurisdiction)
          : [...withoutUnknown, jurisdiction],
      };
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,380px)] lg:items-start">
      <div className="space-y-8">
        <section className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Step 1
            </p>
            <h2 className="mt-1 text-lg font-semibold text-zinc-900">
              Shape the use case
            </h2>
            <p className={helpCls}>
              Build the use-case description from choices instead of starting
              with a blank text box.
            </p>
          </div>

          <ChoiceGrid
            label="Which insurance workflow is this for?"
            options={workflowOptions.map((value) => ({
              value,
              label: workflowLabels[value],
            }))}
            value={state.workflowArea}
            onChange={(workflowArea) =>
              setState((current) => ({ ...current, workflowArea }))
            }
          />

          <ChoiceGrid
            label="What does the AI produce?"
            options={outputOptions.map((value) => ({
              value,
              label: outputLabels[value],
            }))}
            value={state.outputKind}
            onChange={(outputKind) =>
              setState((current) => ({ ...current, outputKind }))
            }
          />

          <div>
            <label htmlFor="context" className={labelCls}>
              Optional context
            </label>
            <p className={helpCls}>
              Add specifics such as who reviews it, where it appears, or what
              system it supports.
            </p>
            <textarea
              id="context"
              rows={3}
              maxLength={1200}
              className={`${inputCls} mt-3`}
              value={state.context}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  context: event.target.value,
                }))
              }
              placeholder="Example: Adjusters review the draft before sending it to the claimant."
            />
          </div>
        </section>

        <section className={`${sectionCls} space-y-5`}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Step 2
            </p>
            <h2 className="mt-1 text-lg font-semibold text-zinc-900">
              Confirm exposure and authority
            </h2>
          </div>

          <ChoiceGrid
            label="Who operates or relies on this AI tool?"
            options={audienceOptions.map((value) => ({
              value,
              label: audienceLabels[value],
            }))}
            value={state.audience}
            onChange={(audience) =>
              setState((current) => ({ ...current, audience }))
            }
          />

          <ChoiceGrid
            label="Can any AI output reach a client or policyholder?"
            options={(["yes", "no", "unknown"] as YesNoUnknown[]).map(
              (value) => ({
                value,
                label: yesNoUnknownLabels[value],
              }),
            )}
            value={state.clientFacing}
            onChange={(clientFacing) =>
              setState((current) => ({
                ...current,
                clientFacing,
                humanReview:
                  clientFacing === "no"
                    ? "not_applicable"
                    : current.humanReview === "not_applicable"
                      ? ""
                      : current.humanReview,
              }))
            }
          />

          <div>
            <span className={labelCls}>
              Does it touch regulated insurance decisions?
            </span>
            <p className={helpCls}>
              Pricing, coverage, and claims answers are mutually exclusive with
              none or not sure.
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {(["pricing", "coverage", "claims"] as RegulatedDomain[]).map(
                (domain) => (
                  <label key={domain} className={choiceCls}>
                    <input
                      type="checkbox"
                      checked={
                        state.regulatedMode === "selected" &&
                        state.regulatedDomains.includes(domain)
                      }
                      onChange={() => toggleDomain(domain)}
                    />
                    <span>{domainLabels[domain]}</span>
                  </label>
                ),
              )}
              <label className={choiceCls}>
                <input
                  type="checkbox"
                  checked={state.regulatedMode === "none"}
                  onChange={() =>
                    setState((current) => ({
                      ...current,
                      regulatedMode:
                        current.regulatedMode === "none" ? "" : "none",
                      regulatedDomains: [],
                      decisionAuthority: "not_applicable",
                    }))
                  }
                />
                <span>None of these</span>
              </label>
              <label className={choiceCls}>
                <input
                  type="checkbox"
                  checked={state.regulatedMode === "unknown"}
                  onChange={() =>
                    setState((current) => ({
                      ...current,
                      regulatedMode:
                        current.regulatedMode === "unknown" ? "" : "unknown",
                      regulatedDomains: [],
                      decisionAuthority:
                        current.regulatedMode === "unknown"
                          ? ""
                          : current.decisionAuthority === "not_applicable"
                            ? ""
                            : current.decisionAuthority,
                    }))
                  }
                />
                <span>Not sure</span>
              </label>
            </div>
          </div>

          {state.regulatedMode !== "none" && state.regulatedMode !== "" && (
            <ChoiceGrid
              label="What authority does the AI have over that decision?"
              options={decisionAuthorityOptions.map((value) => ({
                value,
                label:
                  value === "unknown"
                    ? "Not sure"
                    : decisionAuthorityLabel[value],
              }))}
              value={state.decisionAuthority}
              onChange={(decisionAuthority) =>
                setState((current) => ({ ...current, decisionAuthority }))
              }
            />
          )}

          {state.clientFacing !== "no" && state.clientFacing !== "" && (
            <ChoiceGrid
              label="Does a human review output before it reaches the client?"
              options={humanReviewOptions.map((value) => ({
                value,
                label:
                  value === "unknown" ? "Not sure" : humanReviewLabel[value],
              }))}
              value={state.humanReview}
              onChange={(humanReview) =>
                setState((current) => ({ ...current, humanReview }))
              }
            />
          )}
        </section>

        <section className={`${sectionCls} space-y-5`}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Step 3
            </p>
            <h2 className="mt-1 text-lg font-semibold text-zinc-900">
              Flag jurisdiction overlays
            </h2>
            <p className={helpCls}>
              Pick any jurisdictions that may apply. This does not change the
              deterministic tier yet; it adds review prompts to the packet.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {jurisdictionOptions.map((jurisdiction) => (
              <label key={jurisdiction} className={choiceCls}>
                <input
                  type="checkbox"
                  checked={state.jurisdictions.includes(jurisdiction)}
                  onChange={() => toggleJurisdiction(jurisdiction)}
                />
                <span>{jurisdictionLabels[jurisdiction]}</span>
              </label>
            ))}
          </div>
        </section>

        <section className={`${sectionCls} space-y-5`}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Step 4
            </p>
            <h2 className="mt-1 text-lg font-semibold text-zinc-900">
              Confirm evidence and controls
            </h2>
          </div>

          <ChoiceGrid
            label="Is the AI generative or classifying?"
            options={aiModeOptions.map((value) => ({
              value,
              label: aiModeLabels[value],
            }))}
            value={state.aiMode}
            onChange={(aiMode) =>
              setState((current) => ({ ...current, aiMode }))
            }
          />

          <ChoiceGrid
            label="What is the source of training data or prompts?"
            options={dataSourceOptions.map((value) => ({
              value,
              label: dataSourceLabel[value],
            }))}
            value={state.dataSource}
            onChange={(dataSource) =>
              setState((current) => ({ ...current, dataSource }))
            }
          />

          <ChoiceGrid
            label="Is logging of inputs and outputs in place?"
            options={(["yes", "no", "unknown"] as YesNoUnknown[]).map(
              (value) => ({
                value,
                label: yesNoUnknownLabels[value],
              }),
            )}
            value={state.logging}
            onChange={(logging) =>
              setState((current) => ({ ...current, logging }))
            }
          />
        </section>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-6">
        <section className="rounded-md border border-zinc-200 bg-white p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-600">
            Generated use-case summary
          </h2>
          <p className="mt-3 text-sm leading-6 text-zinc-800">
            {generatedSummary}
          </p>
        </section>

        {result ? (
          <section
            className={`rounded-md border p-4 ${tierBannerClass[result.tier]}`}
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">
                Live preview
              </span>
              <TierPill tier={result.tier} />
              {result.tier === "prohibited" && (
                <span className="text-xs font-semibold uppercase tracking-wide text-red-800">
                  Do not deploy
                </span>
              )}
            </div>
            <p className="mt-3 text-sm text-zinc-700">
              The preview updates as answers change. Unknown answers are
              treated conservatively until confirmed.
            </p>
            <button
              type="button"
              onClick={() => window.print()}
              className="no-print mt-4 rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Export review packet
            </button>
          </section>
        ) : (
          <section className="rounded-md border border-zinc-200 bg-white p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-600">
              Live preview
            </h2>
            <p className="mt-3 text-sm text-zinc-700">
              Answer the required questions to see the tier, rules, and
              controls.
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-600">
              {missingItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {assumptions.length > 0 && (
          <section className="rounded-md border border-amber-200 bg-amber-50 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-800">
              Conservative assumptions
            </h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-amber-900">
              {assumptions.map((assumption) => (
                <li key={assumption}>{assumption}</li>
              ))}
            </ul>
          </section>
        )}

        {selectedJurisdictions.length > 0 && (
          <section className="rounded-md border border-zinc-200 bg-white p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-600">
              Jurisdiction prompts
            </h2>
            <ul className="mt-3 space-y-3">
              {selectedJurisdictions.map((jurisdiction) => (
                <li key={jurisdiction.key} className="border-t border-zinc-200 pt-3 first:border-t-0 first:pt-0">
                  <p className="text-sm font-medium text-zinc-900">
                    {jurisdiction.label}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-zinc-700">
                    {jurisdiction.whyItMatters}
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-600">
                    {jurisdiction.prompts.map((prompt) => (
                      <li key={prompt}>{prompt}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
        )}

        {result && (
          <>
            <section className="rounded-md border border-zinc-200 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-600">
                Why this tier
              </h2>
              {result.firedRules.length === 0 ? (
                <p className="mt-3 text-sm text-zinc-700">
                  No rules fired. Baseline tier is Low.
                </p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {result.firedRules.map((rule) => (
                    <li key={rule.id} className="border-t border-zinc-200 pt-3">
                      <div className="flex items-start gap-2">
                        <span className="font-mono text-xs text-zinc-500">
                          {rule.id}
                        </span>
                        <span className="min-w-0 flex-1 text-sm font-medium text-zinc-900">
                          {rule.title}
                        </span>
                        <TierPill tier={rule.severity} compact />
                      </div>
                      <p className="mt-1 text-sm text-zinc-700">
                        {rule.rationale}
                      </p>
                      {remediationByRule[rule.id] && (
                        <div className="mt-3 rounded-md border border-zinc-200 bg-zinc-50 p-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                            Remediation
                          </p>
                          <p className="mt-2 text-sm text-zinc-700">
                            {remediationByRule[rule.id].issue}
                          </p>
                          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
                            {remediationByRule[rule.id].actions.map((action) => (
                              <li key={action}>{action}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {result.tier !== "prohibited" && (
              <section className="rounded-md border border-zinc-200 bg-white p-4">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-600">
                  Required controls
                </h2>
                <ControlsList controls={result.controls} />
              </section>
            )}
          </>
        )}
      </aside>
    </div>
  );
}

const choiceCls =
  "flex min-h-11 items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 hover:border-zinc-300";

const ChoiceGrid = <T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Array<{ value: T; label: string }>;
  value: T | "";
  onChange: (value: T) => void;
}) => (
  <div>
    <span className={labelCls}>{label}</span>
    <div className="mt-3 grid gap-2 sm:grid-cols-2">
      {options.map((option) => (
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

const TierPill = ({
  tier,
  compact = false,
}: {
  tier: Tier;
  compact?: boolean;
}) => (
  <span
    className={`inline-flex items-center rounded px-1.5 py-0.5 font-medium ring-1 ring-inset ${compact ? "text-[11px]" : "text-xs"} ${tierChipClass[tier]}`}
  >
    {tierLabel[tier]}
  </span>
);

const ControlsList = ({ controls }: { controls: ControlsForTier }) => {
  const rows = (Object.keys(controlLabels) as Array<keyof ControlsForTier>).map(
    (key) => {
      if (key === "bias_drift_monitoring") {
        const control = controls.bias_drift_monitoring;
        return {
          key,
          status: controlStatusLabel[control.status],
          statusKey: control.status,
          detail: control.cadence,
        };
      }
      const status = controls[key];
      return {
        key,
        status: controlStatusLabel[status],
        statusKey: status,
        detail: undefined,
      };
    },
  );

  return (
    <dl className="mt-3 divide-y divide-zinc-200 text-sm">
      {rows.map((row) => (
        <div key={row.key} className="grid grid-cols-[1fr_auto] gap-3 py-2">
          <dt className="text-zinc-700">{controlLabels[row.key]}</dt>
          <dd className={controlStatusClass[row.statusKey]}>
            {row.status}
            {row.detail ? ` - ${row.detail}` : ""}
          </dd>
        </div>
      ))}
    </dl>
  );
};

const getMissingItems = (state: AssessmentState): string[] => {
  const missing: string[] = [];
  if (!state.workflowArea) missing.push("Choose the insurance workflow.");
  if (!state.outputKind) missing.push("Choose what the AI produces.");
  if (!state.audience) missing.push("Choose who operates or relies on it.");
  if (!state.clientFacing) missing.push("Confirm whether output can reach a client.");
  if (!state.regulatedMode) {
    missing.push("Confirm whether it touches regulated decisions.");
  }
  if (
    state.regulatedMode !== "" &&
    state.regulatedMode !== "none" &&
    (!state.decisionAuthority || state.decisionAuthority === "not_applicable")
  ) {
    missing.push("Choose the AI's authority over regulated decisions.");
  }
  if (
    state.clientFacing !== "" &&
    state.clientFacing !== "no" &&
    (!state.humanReview || state.humanReview === "not_applicable")
  ) {
    missing.push("Confirm human review before client output.");
  }
  if (!state.aiMode) missing.push("Choose whether the AI is generative or classifying.");
  if (!state.dataSource) missing.push("Choose the data or prompt source.");
  if (!state.logging) missing.push("Confirm whether logging is in place.");
  return missing;
};

const buildInput = (
  state: AssessmentState,
  description: string,
): UseCaseInput => {
  const clientFacing = state.clientFacing !== "no";
  const regulatedDomains =
    state.regulatedMode === "selected"
      ? state.regulatedDomains
      : state.regulatedMode === "unknown"
        ? (["pricing", "coverage", "claims"] as RegulatedDomain[])
        : [];

  return {
    description,
    audience: asAudience(state.audience),
    client_facing: clientFacing,
    regulated_domains: regulatedDomains,
    ai_mode: state.aiMode === "classifying" ? "classifying" : "generative",
    decision_authority:
      regulatedDomains.length === 0
        ? "not_applicable"
        : asDecisionAuthority(state.decisionAuthority),
    human_review_before_external_output: clientFacing
      ? asHumanReview(state.humanReview)
      : "not_applicable",
    data_source: state.dataSource || "unknown",
    logging: state.logging === "yes",
  };
};

const asAudience = (value: AssessmentState["audience"]): Audience =>
  value === "internal" || value === "external" || value === "both"
    ? value
    : "both";

const asDecisionAuthority = (
  value: AssessmentState["decisionAuthority"],
): DecisionAuthority =>
  value === "decide_with_review" ||
  value === "decide_without_review" ||
  value === "recommend"
    ? value
    : "recommend";

const asHumanReview = (value: AssessmentState["humanReview"]): HumanReview =>
  value === "yes" ? "yes" : "no";

const buildSummary = (state: AssessmentState): string => {
  const workflow = state.workflowArea
    ? workflowLabels[state.workflowArea].toLowerCase()
    : "an unspecified insurance workflow";
  const output = state.outputKind
    ? outputLabels[state.outputKind].toLowerCase()
    : "an unspecified AI output";
  const audience = state.audience
    ? audienceLabels[state.audience].toLowerCase()
    : "an unspecified audience";
  const client =
    state.clientFacing === "yes"
      ? "Output can reach clients or policyholders."
      : state.clientFacing === "no"
        ? "Output stays away from clients and policyholders."
        : state.clientFacing === "unknown"
          ? "Client exposure is not yet confirmed."
          : "Client exposure has not been answered.";
  const regulated = regulatedSummary(state);
  const jurisdictions = jurisdictionSummary(state);
  const aiMode = state.aiMode
    ? aiModeLabels[state.aiMode].toLowerCase()
    : "an unspecified AI mode";
  const data = state.dataSource
    ? dataSourceLabel[state.dataSource].toLowerCase()
    : "an unspecified data source";
  const logging =
    state.logging === "yes"
      ? "Logging is in place."
      : state.logging === "no"
        ? "Logging is not in place."
        : state.logging === "unknown"
          ? "Logging is not yet confirmed."
          : "Logging has not been answered.";
  const context = state.context.trim();

  return [
    `This use case supports ${workflow} and ${output}.`,
    `It is used by ${audience}.`,
    client,
    regulated,
    jurisdictions,
    `The AI mode is ${aiMode}, using ${data}.`,
    logging,
    context ? `Additional context: ${context}` : "",
  ]
    .filter(Boolean)
    .join(" ");
};

const jurisdictionSummary = (state: AssessmentState): string => {
  if (state.jurisdictions.length === 0) {
    return "Jurisdiction overlays have not been selected.";
  }
  if (state.jurisdictions.includes("unknown")) {
    return "Jurisdiction is not yet confirmed.";
  }
  const labels = state.jurisdictions.map(
    (key) => jurisdictionGuidance[key].shortLabel,
  );
  return `Jurisdiction overlays flagged: ${joinList(labels)}.`;
};

const regulatedSummary = (state: AssessmentState): string => {
  if (state.regulatedMode === "none") {
    return "It does not touch pricing, coverage, or claims decisions.";
  }
  if (state.regulatedMode === "unknown") {
    return "Regulated decision impact is not yet confirmed.";
  }
  if (state.regulatedMode === "selected") {
    const domains = state.regulatedDomains.map((d) => domainLabels[d].toLowerCase());
    return `It touches ${joinList(domains)}.`;
  }
  return "Regulated decision impact has not been answered.";
};

const joinList = (items: string[]) => {
  if (items.length === 0) return "no regulated domains";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
};

const buildAssumptions = (state: AssessmentState): string[] => {
  const assumptions: string[] = [];
  if (state.audience === "unknown") {
    assumptions.push("Operator is unclear, so the preview assumes both internal and external users.");
  }
  if (state.clientFacing === "unknown") {
    assumptions.push("Client exposure is unclear, so the preview assumes output can reach clients.");
  }
  if (state.regulatedMode === "unknown") {
    assumptions.push("Regulated impact is unclear, so the preview assumes pricing, coverage, and claims may be affected.");
  }
  if (state.aiMode === "unknown") {
    assumptions.push("AI mode is unclear, so the preview assumes generative AI.");
  }
  if (state.decisionAuthority === "unknown" && state.regulatedMode !== "none") {
    assumptions.push("Decision authority is unclear, so the preview assumes the AI recommends on a regulated matter.");
  }
  if (state.humanReview === "unknown" && state.clientFacing !== "no") {
    assumptions.push("Human review is unclear, so the preview assumes no pre-send review.");
  }
  if (state.dataSource === "unknown") {
    assumptions.push("Data provenance is unknown and must be documented before production use.");
  }
  if (state.logging === "unknown") {
    assumptions.push("Logging is unclear, so the preview assumes logging is not in place.");
  }
  return assumptions;
};
