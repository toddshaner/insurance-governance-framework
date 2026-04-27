export type JurisdictionKey =
  | "naic_model"
  | "new_york"
  | "colorado"
  | "california"
  | "eu"
  | "unknown";

export type JurisdictionGuidance = {
  key: JurisdictionKey;
  label: string;
  shortLabel: string;
  whyItMatters: string;
  prompts: string[];
  source: string;
};

export const jurisdictionGuidance: Record<JurisdictionKey, JurisdictionGuidance> = {
  naic_model: {
    key: "naic_model",
    label: "NAIC model bulletin state",
    shortLabel: "NAIC model",
    whyItMatters:
      "Many state insurance departments now use the NAIC AI model bulletin as their governance baseline.",
    prompts: [
      "Keep an AI inventory, risk classification, controls, and audit evidence.",
      "Be ready to explain vendor oversight, model monitoring, and consumer-impact controls.",
      "Document who owns the AI system and who can approve launch or material changes.",
    ],
    source: "NAIC Model Bulletin on the Use of AI Systems by Insurers",
  },
  new_york: {
    key: "new_york",
    label: "New York",
    shortLabel: "NYDFS",
    whyItMatters:
      "NYDFS guidance focuses on external consumer data, AI systems, underwriting, pricing, unfair discrimination, and proxy risk.",
    prompts: [
      "Confirm whether external consumer data or proxy variables are used.",
      "Document why the data is not a protected-class proxy and does not create unfair discrimination.",
      "Keep governance, testing, and documentation strong enough for regulatory inquiry.",
    ],
    source: "NYDFS Insurance Circular Letter No. 7 (2024)",
  },
  colorado: {
    key: "colorado",
    label: "Colorado",
    shortLabel: "Colorado",
    whyItMatters:
      "Colorado has one of the more prescriptive insurance AI regimes for unfair discrimination controls.",
    prompts: [
      "Identify external consumer data, algorithms, and predictive models in scope.",
      "Prepare governance, testing, documentation, and accountability evidence.",
      "Track whether the use case affects a line of insurance subject to current Colorado requirements.",
    ],
    source: "Colorado SB21-169 and Division of Insurance rules",
  },
  california: {
    key: "california",
    label: "California",
    shortLabel: "California",
    whyItMatters:
      "California has warned insurers that AI, big data, and algorithmic methods must still comply with anti-discrimination rules.",
    prompts: [
      "Review marketing, rating, underwriting, claims, and fraud practices for unfair discrimination.",
      "Document how model inputs and outputs are tested for disparate or unfair outcomes.",
      "Confirm consumer-facing communications are accurate and reviewable.",
    ],
    source: "California Department of Insurance Bulletin 2022-5",
  },
  eu: {
    key: "eu",
    label: "European Union",
    shortLabel: "EU AI Act",
    whyItMatters:
      "The EU AI Act treats certain life and health insurance risk assessment and pricing systems as high-risk.",
    prompts: [
      "Confirm whether natural persons are affected in life or health insurance.",
      "Prepare high-risk AI evidence: risk management, data governance, logging, human oversight, and documentation.",
      "Do not assume a US-only tier maps cleanly to EU compliance status.",
    ],
    source: "EU AI Act Annex III",
  },
  unknown: {
    key: "unknown",
    label: "Not sure",
    shortLabel: "Not sure",
    whyItMatters:
      "Jurisdiction is unresolved, so the assessment should preserve the state and international questions for review.",
    prompts: [
      "Identify where applicants, policyholders, claimants, and users are located.",
      "Confirm which state insurance departments or international regimes may apply.",
      "Do not treat a generic US review as complete until jurisdiction is confirmed.",
    ],
    source: "Jurisdiction intake gap",
  },
};

export const jurisdictionOptions: JurisdictionKey[] = [
  "naic_model",
  "new_york",
  "colorado",
  "california",
  "eu",
  "unknown",
];
