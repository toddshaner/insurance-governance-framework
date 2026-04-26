import type {
  AiMode,
  Audience,
  DataSource,
  DecisionAuthority,
  HumanReview,
  RegulatedDomain,
  UseCaseInput,
} from "./types";

export type SearchParams = Record<string, string | string[] | undefined>;

const one = (v: string | string[] | undefined): string =>
  Array.isArray(v) ? (v[0] ?? "") : (v ?? "");

const many = (v: string | string[] | undefined): string[] =>
  Array.isArray(v) ? v : v ? [v] : [];

const asAudience = (v: string): Audience =>
  v === "internal" || v === "external" || v === "both" ? v : "both";

const asAiMode = (v: string): AiMode =>
  v === "classifying" ? "classifying" : "generative";

const asDataSource = (v: string): DataSource => {
  const allowed: DataSource[] = [
    "vendor_documented",
    "internal_curated",
    "public_unknown",
    "unknown",
  ];
  return (allowed as string[]).includes(v)
    ? (v as DataSource)
    : "unknown";
};

const asDomains = (v: string[]): RegulatedDomain[] => {
  const allowed: RegulatedDomain[] = ["pricing", "coverage", "claims"];
  return v.filter((x): x is RegulatedDomain =>
    (allowed as string[]).includes(x),
  );
};

const asDecisionAuthority = (
  v: string,
  hasDomains: boolean,
): DecisionAuthority => {
  if (!hasDomains) return "not_applicable";
  if (
    v === "recommend" ||
    v === "decide_with_review" ||
    v === "decide_without_review"
  ) {
    return v;
  }
  return "recommend";
};

const asHumanReview = (v: string, clientFacing: boolean): HumanReview => {
  if (!clientFacing) return "not_applicable";
  return v === "yes" ? "yes" : "no";
};

export const parseInput = (params: SearchParams): UseCaseInput => {
  const description = one(params.description).slice(0, 2000);
  const audience = asAudience(one(params.audience));
  const client_facing = one(params.client_facing) !== "no";
  const regulated_domains = asDomains(many(params.regulated_domains));
  const ai_mode = asAiMode(one(params.ai_mode));
  const decision_authority = asDecisionAuthority(
    one(params.decision_authority),
    regulated_domains.length > 0,
  );
  const human_review_before_external_output = asHumanReview(
    one(params.human_review_before_external_output),
    client_facing,
  );
  const data_source = asDataSource(one(params.data_source));
  const logging = one(params.logging) === "yes";

  return {
    description,
    audience,
    client_facing,
    regulated_domains,
    ai_mode,
    decision_authority,
    human_review_before_external_output,
    data_source,
    logging,
  };
};
