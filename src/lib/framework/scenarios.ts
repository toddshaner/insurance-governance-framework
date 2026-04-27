import type { Tier, UseCaseInput } from "./types";

export type ScenarioValidationStatus = "needs_practitioner_review" | "aligned" | "disputed";

export type StressScenario = {
  id: string;
  title: string;
  description: string;
  expectedTier: Tier;
  validationStatus: ScenarioValidationStatus;
  reviewerNote: string;
  coverageQuestion: string;
  input: UseCaseInput;
};

export const stressScenarios: StressScenario[] = [
  {
    id: "S1",
    title: "Adjuster-reviewed claim denial letter",
    description:
      "Generative AI drafts claim denial letters for adjusters to review before sending to claimants.",
    expectedTier: "high",
    validationStatus: "needs_practitioner_review",
    reviewerNote:
      "Should remain High because the output influences claims and reaches claimants, even with human review.",
    coverageQuestion:
      "Would E&O, CGL, or any claims-handling endorsement respond if the letter is inaccurate or discriminatory?",
    input: {
      description:
        "Generative AI drafts claim denial letters for adjusters to review before sending to claimants.",
      audience: "internal",
      client_facing: true,
      regulated_domains: ["claims"],
      ai_mode: "generative",
      decision_authority: "recommend",
      human_review_before_external_output: "yes",
      data_source: "vendor_documented",
      logging: true,
    },
  },
  {
    id: "S2",
    title: "Automatic low-dollar claim denial",
    description:
      "A model automatically denies claims below a dollar threshold when it predicts low coverage likelihood.",
    expectedTier: "prohibited",
    validationStatus: "needs_practitioner_review",
    reviewerNote:
      "Autonomous AI decisioning on claims should be blocked until meaningful pre-effect review exists.",
    coverageQuestion:
      "Would claim-handling errors, bad faith allegations, or regulatory claims be excluded if AI made the decision?",
    input: {
      description:
        "A model automatically denies claims below a dollar threshold when it predicts low coverage likelihood.",
      audience: "internal",
      client_facing: true,
      regulated_domains: ["claims"],
      ai_mode: "classifying",
      decision_authority: "decide_without_review",
      human_review_before_external_output: "no",
      data_source: "internal_curated",
      logging: true,
    },
  },
  {
    id: "S3",
    title: "Internal policy summarizer",
    description:
      "Employees use generative AI to summarize long policy documents for internal research.",
    expectedTier: "moderate",
    validationStatus: "needs_practitioner_review",
    reviewerNote:
      "Internal generative use is not Low because business users may rely on generated summaries.",
    coverageQuestion:
      "If an employee relies on an incorrect summary, is the resulting professional error covered or excluded?",
    input: {
      description:
        "Employees use generative AI to summarize long policy documents for internal research.",
      audience: "internal",
      client_facing: false,
      regulated_domains: [],
      ai_mode: "generative",
      decision_authority: "not_applicable",
      human_review_before_external_output: "not_applicable",
      data_source: "vendor_documented",
      logging: true,
    },
  },
  {
    id: "S4",
    title: "Fraud referral score",
    description:
      "A classifier scores claims for fraud referral and investigators decide whether to open a case.",
    expectedTier: "high",
    validationStatus: "needs_practitioner_review",
    reviewerNote:
      "The model materially influences claims handling and should be governed like regulated decision support.",
    coverageQuestion:
      "Could a wrongful fraud referral trigger E&O, defamation, privacy, or regulatory coverage issues?",
    input: {
      description:
        "A classifier scores claims for fraud referral and investigators decide whether to open a case.",
      audience: "internal",
      client_facing: false,
      regulated_domains: ["claims"],
      ai_mode: "classifying",
      decision_authority: "recommend",
      human_review_before_external_output: "not_applicable",
      data_source: "internal_curated",
      logging: true,
    },
  },
  {
    id: "S5",
    title: "Coverage chatbot without review",
    description:
      "A customer chatbot answers policyholder questions about whether a loss appears covered.",
    expectedTier: "high",
    validationStatus: "needs_practitioner_review",
    reviewerNote:
      "Direct coverage explanations to policyholders create high external communication risk.",
    coverageQuestion:
      "Would misstatements by a chatbot be treated as professional services, customer communication, or excluded AI output?",
    input: {
      description:
        "A customer chatbot answers policyholder questions about whether a loss appears covered.",
      audience: "external",
      client_facing: true,
      regulated_domains: ["coverage"],
      ai_mode: "generative",
      decision_authority: "recommend",
      human_review_before_external_output: "no",
      data_source: "vendor_documented",
      logging: true,
    },
  },
  {
    id: "S6",
    title: "Underwriting price recommendation",
    description:
      "A predictive model recommends price changes for underwriters, who approve before quote issuance.",
    expectedTier: "high",
    validationStatus: "needs_practitioner_review",
    reviewerNote:
      "Pricing recommendations are high impact even when an underwriter approves the final quote.",
    coverageQuestion:
      "Does the organization have coverage for algorithmic discrimination or rating-practice allegations?",
    input: {
      description:
        "A predictive model recommends price changes for underwriters, who approve before quote issuance.",
      audience: "internal",
      client_facing: false,
      regulated_domains: ["pricing"],
      ai_mode: "classifying",
      decision_authority: "recommend",
      human_review_before_external_output: "not_applicable",
      data_source: "internal_curated",
      logging: true,
    },
  },
  {
    id: "S7",
    title: "Public-data marketing copy",
    description:
      "Generative AI creates insurance marketing copy from public web data and a producer reviews it before use.",
    expectedTier: "moderate",
    validationStatus: "needs_practitioner_review",
    reviewerNote:
      "Public data and reviewed external content should trigger at least Moderate controls.",
    coverageQuestion:
      "Are copyright, advertising injury, and media liability exposures covered or excluded for AI-generated copy?",
    input: {
      description:
        "Generative AI creates insurance marketing copy from public web data and a producer reviews it before use.",
      audience: "internal",
      client_facing: true,
      regulated_domains: [],
      ai_mode: "generative",
      decision_authority: "not_applicable",
      human_review_before_external_output: "yes",
      data_source: "public_unknown",
      logging: true,
    },
  },
  {
    id: "S8",
    title: "Unknown-data internal classifier",
    description:
      "An internal classifier prioritizes back-office work, but the team cannot confirm its training data.",
    expectedTier: "moderate",
    validationStatus: "needs_practitioner_review",
    reviewerNote:
      "Unknown data provenance should not fall below public unknown data.",
    coverageQuestion:
      "If the classifier causes operational loss, does any policy respond when data provenance is undocumented?",
    input: {
      description:
        "An internal classifier prioritizes back-office work, but the team cannot confirm its training data.",
      audience: "internal",
      client_facing: false,
      regulated_domains: [],
      ai_mode: "classifying",
      decision_authority: "not_applicable",
      human_review_before_external_output: "not_applicable",
      data_source: "unknown",
      logging: true,
    },
  },
  {
    id: "S9",
    title: "Client-facing service triage",
    description:
      "A classifier routes policyholder service requests to queues and shows the queue choice to the customer.",
    expectedTier: "moderate",
    validationStatus: "needs_practitioner_review",
    reviewerNote:
      "Client-facing classifier output needs monitoring and escalation, even if it is not a regulated decision.",
    coverageQuestion:
      "Would misrouting, delay, or customer harm be covered under E&O, cyber, or customer communication coverage?",
    input: {
      description:
        "A classifier routes policyholder service requests to queues and shows the queue choice to the customer.",
      audience: "both",
      client_facing: true,
      regulated_domains: [],
      ai_mode: "classifying",
      decision_authority: "not_applicable",
      human_review_before_external_output: "no",
      data_source: "vendor_documented",
      logging: true,
    },
  },
  {
    id: "S10",
    title: "High-risk pricing model without logging",
    description:
      "A pricing model recommends rate actions, but the workflow does not log prompts, outputs, reviewer decisions, or model versions.",
    expectedTier: "prohibited",
    validationStatus: "needs_practitioner_review",
    reviewerNote:
      "A high-risk model without logging cannot support audit, inquiry, or remediation.",
    coverageQuestion:
      "Would the lack of audit evidence weaken defense, indemnity, or regulatory response coverage?",
    input: {
      description:
        "A pricing model recommends rate actions, but the workflow does not log prompts, outputs, reviewer decisions, or model versions.",
      audience: "internal",
      client_facing: false,
      regulated_domains: ["pricing"],
      ai_mode: "classifying",
      decision_authority: "recommend",
      human_review_before_external_output: "not_applicable",
      data_source: "internal_curated",
      logging: false,
    },
  },
];
