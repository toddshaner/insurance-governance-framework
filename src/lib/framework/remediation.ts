export type Remediation = {
  issue: string;
  inputTrigger: string;
  actions: string[];
  evidence: string[];
  owner: string;
};

export const remediationByRule: Record<string, Remediation> = {
  R1: {
    issue: "Data provenance is not documented for a client-facing or regulated use case.",
    inputTrigger: "Training data source is Unknown while the use case reaches clients or touches pricing, coverage, or claims.",
    actions: [
      "Get a vendor data sheet, model card, or internal data inventory before production use.",
      "Confirm whether protected-class, proxy, PHI, claim, policy, or external consumer data is used.",
      "Restrict the use case to sandbox testing until provenance is documented.",
    ],
    evidence: [
      "Vendor data sheet or model card",
      "Data provenance memo",
      "Approved data-use inventory entry",
    ],
    owner: "Model owner with Compliance and Legal review",
  },
  R3a: {
    issue: "The AI makes a regulated insurance decision without meaningful human review.",
    inputTrigger: "Pricing, coverage, or claims is selected and the AI decides without review.",
    actions: [
      "Add pre-effect human review before the decision affects a policyholder, applicant, or claimant.",
      "Create override, escalation, and exception handling logs.",
      "Re-run the assessment after the workflow is changed from autonomous decisioning to reviewed decision support.",
    ],
    evidence: [
      "Workflow control diagram",
      "Reviewer role and SLA",
      "Override and exception log sample",
    ],
    owner: "Business process owner with Compliance approval",
  },
  R3b: {
    issue: "The AI decides a regulated matter, even with review.",
    inputTrigger: "Pricing, coverage, or claims is selected and the AI decides subject to review.",
    actions: [
      "Document what the reviewer must check before accepting the AI output.",
      "Sample accepted, overridden, and escalated outputs for bias, drift, and accuracy.",
      "Define who can override the model and when escalation is required.",
    ],
    evidence: [
      "Reviewer checklist",
      "Sampling results",
      "Model monitoring report",
    ],
    owner: "Compliance lead and business sponsor",
  },
  R3c: {
    issue: "The AI materially influences a regulated matter.",
    inputTrigger: "Pricing, coverage, or claims is selected and the AI recommends while a human decides.",
    actions: [
      "Treat the recommendation as decision support, not informal productivity tooling.",
      "Require reviewer attestation that the human made the final decision.",
      "Monitor acceptance rate, overrides, and downstream outcomes.",
    ],
    evidence: [
      "Human decision attestation",
      "Acceptance and override metrics",
      "Bias and drift monitoring report",
    ],
    owner: "Compliance lead and workflow owner",
  },
  R4a: {
    issue: "Generative output can reach a client without human review.",
    inputTrigger: "Client-facing output, generative AI, and no pre-send human review.",
    actions: [
      "Insert mandatory pre-send review for every external output.",
      "Add approved templates, prohibited-content checks, and escalation paths.",
      "Block direct send until review and logging are active.",
    ],
    evidence: [
      "Pre-send review workflow",
      "Prompt and template controls",
      "Output log sample",
    ],
    owner: "Customer communications owner with Compliance review",
  },
  R4b: {
    issue: "Reviewed generative output still creates external communication risk.",
    inputTrigger: "Client-facing generative AI with human review.",
    actions: [
      "Keep approved templates and review criteria close to the workflow.",
      "Sample outputs for misstatements, hallucinations, and disclosure issues.",
      "Confirm whether AI-use disclosure is required by policy or jurisdiction.",
    ],
    evidence: [
      "Review checklist",
      "Output sampling log",
      "Disclosure decision record",
    ],
    owner: "Business owner with Compliance review",
  },
  R5: {
    issue: "Classifier output reaches a client or policyholder.",
    inputTrigger: "Client-facing output and classifying, scoring, or predictive AI.",
    actions: [
      "Validate model performance before launch and after material changes.",
      "Provide a path for human escalation and correction.",
      "Monitor error rates and client-impacting exceptions.",
    ],
    evidence: [
      "Validation report",
      "Escalation procedure",
      "Exception and correction log",
    ],
    owner: "Model owner and operations lead",
  },
  R6: {
    issue: "External users operate the AI tool.",
    inputTrigger: "Audience is external or mixed, while output is not directly client-facing.",
    actions: [
      "Confirm external-user access controls, training, and acceptable-use limits.",
      "Log usage and review exceptions.",
      "Define who supervises external use and how misuse is remediated.",
    ],
    evidence: [
      "Access-control record",
      "External-user training or terms",
      "Usage monitoring report",
    ],
    owner: "Third-party risk or channel owner",
  },
  R7: {
    issue: "Internal generative AI can still create operational reliance risk.",
    inputTrigger: "Internal-only generative AI outside regulated decisions.",
    actions: [
      "Define acceptable uses and prohibited uses.",
      "Require source checking before relying on generated content.",
      "Log material uses where the output affects business records or decisions.",
    ],
    evidence: [
      "Internal AI-use standard",
      "User guidance",
      "Sample log or review record",
    ],
    owner: "Business owner",
  },
  R8: {
    issue: "Public or unknown-curation data introduces bias, privacy, and IP risk.",
    inputTrigger: "Training data or prompt source is public with unknown curation.",
    actions: [
      "Determine whether the data contains sensitive, copyrighted, or non-representative material.",
      "Run bias, privacy, and IP review before production use.",
      "Prefer documented vendor or internally curated data sources when possible.",
    ],
    evidence: [
      "Data review memo",
      "Bias and privacy assessment",
      "Approved data-source record",
    ],
    owner: "Model owner with Legal or Compliance review",
  },
  R8a: {
    issue: "Data provenance is unknown even without client or regulated exposure.",
    inputTrigger: "Training data source is Unknown for an otherwise lower-exposure use case.",
    actions: [
      "Document the source before relying on the system in production.",
      "Limit use to non-material internal testing until the source is known.",
      "Re-run the assessment once provenance is confirmed.",
    ],
    evidence: [
      "Data provenance memo",
      "Approved data-source record",
      "Testing-only use restriction",
    ],
    owner: "Model owner",
  },
  R2: {
    issue: "A high-risk use case cannot be audited because logging is missing.",
    inputTrigger: "Base tier is High and logging is not in place.",
    actions: [
      "Add input, output, model version, reviewer, and override logging.",
      "Confirm retention period and access controls.",
      "Block launch until logs can support investigation and regulatory review.",
    ],
    evidence: [
      "Logging design",
      "Sample audit log",
      "Retention and access-control decision",
    ],
    owner: "Technology owner with Compliance approval",
  },
  R9: {
    issue: "A moderate-risk use case is missing required logging.",
    inputTrigger: "Base tier is Moderate and logging is not in place.",
    actions: [
      "Add basic input, output, user, timestamp, and model-version logging.",
      "Define who reviews exceptions.",
      "Re-run the assessment after logging is enabled.",
    ],
    evidence: [
      "Sample audit log",
      "Exception review procedure",
      "Model-version record",
    ],
    owner: "Technology owner",
  },
};
