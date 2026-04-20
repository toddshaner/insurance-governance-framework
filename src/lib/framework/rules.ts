import type {
  ControlsForTier,
  ReviewForTier,
  Tier,
  UseCaseInput,
} from "./types";

export type RuleKind = "base" | "modifier";

export type RuleDefinition = {
  id: string;
  title: string;
  kind: RuleKind;
  severity: Tier;
  conditionText: string;
  rationale: string;
  sources: string[];
  test: (input: UseCaseInput, baseTier: Tier) => boolean;
};

const hasRegulated = (input: UseCaseInput) =>
  input.regulated_domains.length > 0;

export const rules: RuleDefinition[] = [
  {
    id: "R1",
    title: "Unknown training data with client or regulated exposure",
    kind: "base",
    severity: "prohibited",
    conditionText:
      "Training data source is Unknown AND (output reaches a client OR use case touches pricing, coverage, or claims).",
    rationale:
      "Training data provenance is unknown and the use case touches clients or regulated decisions. Cannot proceed without a documented data source.",
    sources: [
      "NAIC Model Bulletin on the Use of AI Systems by Insurers (2023) — Data governance",
      "EU AI Act Art. 10 — Data and data governance",
    ],
    test: (i) =>
      i.data_source === "unknown" &&
      (i.client_facing || hasRegulated(i)),
  },
  {
    id: "R3a",
    title: "AI decides a regulated matter without human review",
    kind: "base",
    severity: "prohibited",
    conditionText:
      "Use case touches pricing, coverage, or claims AND AI makes the decision without human review.",
    rationale:
      "Autonomous AI decisioning on a regulated matter fails meaningful human oversight requirements.",
    sources: [
      "EU AI Act Art. 14 — Human oversight",
      "NAIC Model Bulletin §4 — Governance and risk management",
      "NYDFS Circular Letter No. 7 (2024) — Use of AI in insurance underwriting and pricing",
    ],
    test: (i) =>
      hasRegulated(i) && i.decision_authority === "decide_without_review",
  },
  {
    id: "R3b",
    title: "AI decides a regulated matter with human review",
    kind: "base",
    severity: "high",
    conditionText:
      "Use case touches pricing, coverage, or claims AND AI makes the decision subject to human review.",
    rationale:
      "AI-driven regulated decisions require documented human review, audit trail, and bias monitoring.",
    sources: [
      "NAIC Model Bulletin §4 — Governance and risk management",
      "Colorado SB21-169 — Restrictions on insurers' use of external consumer data and algorithms",
      "NYDFS Circular Letter No. 7 (2024)",
    ],
    test: (i) =>
      hasRegulated(i) && i.decision_authority === "decide_with_review",
  },
  {
    id: "R3c",
    title: "AI recommends on a regulated matter",
    kind: "base",
    severity: "high",
    conditionText:
      "Use case touches pricing, coverage, or claims AND AI recommends while a human decides.",
    rationale:
      "Recommendations materially influence regulated outcomes and require governance equivalent to decisioning use cases.",
    sources: [
      "NAIC Model Bulletin §4 — Governance and risk management",
      "Colorado SB21-169",
    ],
    test: (i) => hasRegulated(i) && i.decision_authority === "recommend",
  },
  {
    id: "R4a",
    title: "Generative output reaches a client without human review",
    kind: "base",
    severity: "high",
    conditionText:
      "Output reaches a client AND AI is generative AND no human reviews output before it is sent.",
    rationale:
      "Unreviewed generative output to clients creates unbounded risk for hallucination, misstatement, and regulated disclosures.",
    sources: [
      "NAIC Model Bulletin §4 — Consumer protection",
      "NYDFS Circular Letter No. 7 (2024)",
    ],
    test: (i) =>
      i.client_facing &&
      i.ai_mode === "generative" &&
      i.human_review_before_external_output === "no",
  },
  {
    id: "R4b",
    title: "Generative output reaches a client with human review",
    kind: "base",
    severity: "moderate",
    conditionText:
      "Output reaches a client AND AI is generative AND a human reviews every output before it is sent.",
    rationale:
      "Reviewed generative output reduces external risk but still requires disclosure, logging, and drift monitoring.",
    sources: [
      "NAIC Model Bulletin §4 — Consumer protection",
    ],
    test: (i) =>
      i.client_facing &&
      i.ai_mode === "generative" &&
      i.human_review_before_external_output === "yes",
  },
  {
    id: "R5",
    title: "Classifier output reaches a client",
    kind: "base",
    severity: "moderate",
    conditionText:
      "Output reaches a client AND AI is classifying (not generative).",
    rationale:
      "Classifier output affecting clients requires sampled review, performance monitoring, and clear escalation.",
    sources: [
      "NAIC Model Bulletin §4 — Testing and validation",
      "NIST AI RMF — Measure function",
    ],
    test: (i) => i.client_facing && i.ai_mode === "classifying",
  },
  {
    id: "R6",
    title: "External user audience without client-facing output",
    kind: "base",
    severity: "moderate",
    conditionText:
      "External users operate the tool but AI output does not go directly to clients.",
    rationale:
      "External operation expands the attack surface and creates supervision gaps even when output stays internal to the business.",
    sources: [
      "NAIC Model Bulletin §4 — Third party and vendor oversight",
    ],
    test: (i) =>
      (i.audience === "external" || i.audience === "both") &&
      !i.client_facing,
  },
  {
    id: "R7",
    title: "Internal-only generative AI outside regulated domains",
    kind: "base",
    severity: "moderate",
    conditionText:
      "AI is generative AND audience is internal only AND use case does not touch regulated decisions.",
    rationale:
      "Internal generative AI still carries hallucination and drift risk; requires basic controls even without client or regulated exposure.",
    sources: [
      "NIST AI RMF — Govern and Manage functions",
    ],
    test: (i) =>
      i.ai_mode === "generative" &&
      i.audience === "internal" &&
      !hasRegulated(i) &&
      !i.client_facing,
  },
  {
    id: "R8",
    title: "Public training data with unknown curation",
    kind: "base",
    severity: "moderate",
    conditionText:
      "Training data or prompt source is public with unknown curation.",
    rationale:
      "Public uncurated data introduces bias, IP, and privacy risk that must be evaluated before production use.",
    sources: [
      "EU AI Act Art. 10 — Data and data governance",
      "NAIC Model Bulletin §4 — Data governance",
    ],
    test: (i) => i.data_source === "public_unknown",
  },
  {
    id: "R2",
    title: "High-risk use case without logging",
    kind: "modifier",
    severity: "prohibited",
    conditionText:
      "Base tier is High AND no logging of inputs and outputs is in place.",
    rationale:
      "A High-risk use case without logging cannot be audited, investigated, or evidenced to regulators.",
    sources: [
      "NYDFS Circular Letter No. 7 (2024) — Documentation and audit trails",
      "EU AI Act Art. 12 — Record keeping",
    ],
    test: (i, baseTier) => !i.logging && baseTier === "high",
  },
  {
    id: "R9",
    title: "Moderate-risk use case without logging",
    kind: "modifier",
    severity: "moderate",
    conditionText:
      "Base tier is Moderate AND no logging of inputs and outputs is in place.",
    rationale:
      "Moderate tier requires logging. Tier is held at Moderate and deployment is blocked until logging is added.",
    sources: [
      "NYDFS Circular Letter No. 7 (2024)",
    ],
    test: (i, baseTier) => !i.logging && baseTier === "moderate",
  },
];

export const controlsByTier: Record<Tier, ControlsForTier> = {
  low: {
    logging: "recommended",
    human_in_the_loop: "not_required",
    model_version_control: "recommended",
    escalation_path: "recommended",
    data_provenance: "required",
    bias_drift_monitoring: { status: "not_required" },
    legal_signoff: "not_required",
    client_disclosure: "not_required",
  },
  moderate: {
    logging: "required",
    human_in_the_loop: "required",
    model_version_control: "required",
    escalation_path: "required",
    data_provenance: "required",
    bias_drift_monitoring: { status: "required", cadence: "Quarterly" },
    legal_signoff: "recommended",
    client_disclosure: "not_required",
  },
  high: {
    logging: "required",
    human_in_the_loop: "required",
    model_version_control: "required",
    escalation_path: "required",
    data_provenance: "required",
    bias_drift_monitoring: { status: "required", cadence: "Monthly" },
    legal_signoff: "required",
    client_disclosure: "required",
  },
  prohibited: {
    logging: "not_applicable",
    human_in_the_loop: "not_applicable",
    model_version_control: "not_applicable",
    escalation_path: "not_applicable",
    data_provenance: "not_applicable",
    bias_drift_monitoring: { status: "not_applicable" },
    legal_signoff: "not_applicable",
    client_disclosure: "not_applicable",
  },
};

export const controlLabels: Record<keyof ControlsForTier, string> = {
  logging: "Logging of inputs and outputs",
  human_in_the_loop: "Human-in-the-loop review",
  model_version_control: "Model version control",
  escalation_path: "Escalation path (named role + SLA)",
  data_provenance: "Data provenance documented",
  bias_drift_monitoring: "Bias and drift monitoring",
  legal_signoff: "Regulatory counsel sign-off",
  client_disclosure: "Client disclosure of AI use",
};

export const reviewByTier: Record<Tier, ReviewForTier> = {
  low: {
    who: "Line manager",
    when: "Before launch, then annually.",
    what: "Confirm description is accurate and baseline controls are in place.",
  },
  moderate: {
    who: "Compliance lead and line manager.",
    when: "Before launch. Output sampling monthly.",
    what: "Verify logging, sample outputs for accuracy, confirm escalations are handled end-to-end.",
  },
  high: {
    who: "Compliance lead, legal, and an executive sponsor.",
    when: "Before launch. Weekly output review for the first 90 days, then monthly.",
    what: "Review every output pre-send during the first 90 days. Monitor bias and drift metrics. Confirm regulatory posture and client disclosure.",
  },
  prohibited: {
    who: "Do not deploy.",
    when: "—",
    what: "Address the blocking rule(s) below and re-run the assessment.",
  },
};
