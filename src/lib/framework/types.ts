export const FRAMEWORK_VERSION = "1.2";
export const FRAMEWORK_LAST_UPDATED = "2026-04-26";

export type Tier = "low" | "moderate" | "high" | "prohibited";

export const tierRank: Record<Tier, number> = {
  low: 0,
  moderate: 1,
  high: 2,
  prohibited: 3,
};

export const tierLabel: Record<Tier, string> = {
  low: "Low",
  moderate: "Moderate",
  high: "High",
  prohibited: "Prohibited",
};

export type Audience = "internal" | "external" | "both";
export type AiMode = "generative" | "classifying";
export type DataSource =
  | "vendor_documented"
  | "internal_curated"
  | "public_unknown"
  | "unknown";
export type RegulatedDomain = "pricing" | "coverage" | "claims";
export type DecisionAuthority =
  | "recommend"
  | "decide_with_review"
  | "decide_without_review"
  | "not_applicable";
export type HumanReview = "yes" | "no" | "not_applicable";

export type UseCaseInput = {
  description: string;
  audience: Audience;
  client_facing: boolean;
  regulated_domains: RegulatedDomain[];
  ai_mode: AiMode;
  decision_authority: DecisionAuthority;
  human_review_before_external_output: HumanReview;
  data_source: DataSource;
  logging: boolean;
};

export type FiredRule = {
  id: string;
  title: string;
  severity: Tier;
  rationale: string;
  sources: string[];
};

export type ControlStatus = "required" | "recommended" | "not_required" | "not_applicable";

export type ControlsForTier = {
  logging: ControlStatus;
  human_in_the_loop: ControlStatus;
  model_version_control: ControlStatus;
  escalation_path: ControlStatus;
  data_provenance: ControlStatus;
  bias_drift_monitoring: { status: ControlStatus; cadence?: string };
  legal_signoff: ControlStatus;
  client_disclosure: ControlStatus;
};

export type ReviewForTier = {
  who: string;
  when: string;
  what: string;
};

export type ClassifyResult = {
  tier: Tier;
  firedRules: FiredRule[];
  controls: ControlsForTier;
  review: ReviewForTier;
  frameworkVersion: string;
  frameworkLastUpdated: string;
};
