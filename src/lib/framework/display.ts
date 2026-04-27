import type {
  ControlStatus,
  DataSource,
  DecisionAuthority,
  HumanReview,
  Tier,
  UseCaseInput,
} from "./types";

export const tierChipClass: Record<Tier, string> = {
  low: "bg-emerald-100 text-emerald-900 ring-emerald-200",
  moderate: "bg-amber-100 text-amber-900 ring-amber-200",
  high: "bg-orange-100 text-orange-900 ring-orange-300",
  prohibited: "bg-red-100 text-red-900 ring-red-300",
};

export const tierBannerClass: Record<Tier, string> = {
  low: "border-emerald-300 bg-emerald-50",
  moderate: "border-amber-300 bg-amber-50",
  high: "border-orange-300 bg-orange-50",
  prohibited: "border-red-400 bg-red-50",
};

export const controlStatusLabel: Record<ControlStatus, string> = {
  required: "Required",
  recommended: "Recommended",
  not_required: "Not required",
  not_applicable: "Not applicable",
};

export const controlStatusClass: Record<ControlStatus, string> = {
  required: "text-zinc-900 font-medium",
  recommended: "text-zinc-700",
  not_required: "text-zinc-500",
  not_applicable: "text-zinc-400",
};

export const dataSourceLabel: Record<DataSource, string> = {
  vendor_documented: "Vendor-documented",
  internal_curated: "Internally curated",
  public_unknown: "Public, unknown curation",
  unknown: "Unknown",
};

export const decisionAuthorityLabel: Record<DecisionAuthority, string> = {
  recommend: "Recommends - human decides",
  decide_with_review: "Decides - with human review",
  decide_without_review: "Decides - without human review",
  not_applicable: "Not applicable",
};

export const humanReviewLabel: Record<HumanReview, string> = {
  yes: "Yes",
  no: "No",
  not_applicable: "Not applicable",
};

export const summarizeInputs = (input: UseCaseInput): Array<[string, string]> => [
  [
    "Operator",
    input.audience === "internal"
      ? "Internal staff"
      : input.audience === "external"
        ? "External users"
        : "Both",
  ],
  ["Output reaches a client", input.client_facing ? "Yes" : "No"],
  [
    "Regulated domains",
    input.regulated_domains.length === 0
      ? "None"
      : input.regulated_domains
          .map((d) => d.charAt(0).toUpperCase() + d.slice(1))
          .join(", "),
  ],
  [
    "AI mode",
    input.ai_mode === "generative" ? "Generative" : "Classifying",
  ],
  ["Decision authority", decisionAuthorityLabel[input.decision_authority]],
  [
    "Human review before external output",
    humanReviewLabel[input.human_review_before_external_output],
  ],
  ["Training data source", dataSourceLabel[input.data_source]],
  ["Logging in place", input.logging ? "Yes" : "No"],
];
