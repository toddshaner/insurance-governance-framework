export type CoveragePolicy =
  | "cgl"
  | "professional_eo"
  | "cyber"
  | "media_ip"
  | "epli"
  | "dno"
  | "tech_eo";

export type CoverageAnswer = "yes" | "no" | "unknown";

export type CoverageState = {
  policies: CoveragePolicy[];
  aiExcluded: CoverageAnswer | "";
  brokerDisclosed: CoverageAnswer | "";
  vendorIndemnity: CoverageAnswer | "";
  ipExposure: CoverageAnswer | "";
  decisionImpact: CoverageAnswer | "";
};

export type CoverageSeverity = "ready" | "review" | "urgent";

export type CoverageFinding = {
  severity: CoverageSeverity;
  title: string;
  detail: string;
  action: string;
};

export type CoverageResult = {
  severity: CoverageSeverity;
  label: string;
  summary: string;
  findings: CoverageFinding[];
};

const severityRank: Record<CoverageSeverity, number> = {
  ready: 0,
  review: 1,
  urgent: 2,
};

export const coveragePolicyLabels: Record<CoveragePolicy, string> = {
  cgl: "Commercial general liability",
  professional_eo: "Professional liability / E&O",
  cyber: "Cyber",
  media_ip: "Media / IP",
  epli: "Employment practices liability",
  dno: "Directors and officers",
  tech_eo: "Technology E&O",
};

export const initialCoverageState: CoverageState = {
  policies: [],
  aiExcluded: "",
  brokerDisclosed: "",
  vendorIndemnity: "",
  ipExposure: "",
  decisionImpact: "",
};

export const evaluateCoverage = (state: CoverageState): CoverageResult => {
  const findings: CoverageFinding[] = [];

  if (state.policies.length === 0) {
    findings.push({
      severity: "review",
      title: "No policy lines selected",
      detail:
        "AI exposure cannot be mapped to insurance response until relevant policy lines are identified.",
      action:
        "Collect current CGL, E&O, cyber, D&O, EPLI, media/IP, and technology E&O policies before relying on coverage assumptions.",
    });
  }

  if (state.aiExcluded === "yes") {
    findings.push({
      severity: "urgent",
      title: "Known AI exclusion",
      detail:
        "A known AI exclusion may remove or narrow coverage for AI-caused damages.",
      action:
        "Ask the broker or coverage counsel for the exact exclusion language, carvebacks, endorsements, and standalone AI coverage options.",
    });
  } else if (state.aiExcluded === "unknown" || state.aiExcluded === "") {
    findings.push({
      severity: "review",
      title: "AI exclusion status unknown",
      detail:
        "The market is moving toward AI-specific exclusions and endorsements, so silence is not enough.",
      action:
        "Request current forms, endorsements, exclusions, and renewal changes from the broker or carrier.",
    });
  }

  if (state.brokerDisclosed === "no") {
    findings.push({
      severity: "urgent",
      title: "AI use not disclosed to broker or carrier",
      detail:
        "Coverage and underwriting expectations may diverge if material AI use is not disclosed during placement or renewal.",
      action:
        "Prepare a plain-English AI-use inventory and discuss it with the broker before deployment or renewal.",
    });
  } else if (state.brokerDisclosed === "unknown" || state.brokerDisclosed === "") {
    findings.push({
      severity: "review",
      title: "Broker disclosure not confirmed",
      detail:
        "The organization may not know whether its AI use has been considered in placement or renewal.",
      action:
        "Confirm whether the broker has reviewed the AI use case, its controls, and possible exclusions.",
    });
  }

  if (state.vendorIndemnity === "no") {
    findings.push({
      severity: "review",
      title: "Vendor risk transfer gap",
      detail:
        "If a vendor model causes harm, weak indemnity or insurance terms can leave the user organization holding the risk.",
      action:
        "Review vendor indemnity, insurance requirements, audit rights, AI-use disclosures, IP warranties, and liability caps.",
    });
  } else if (state.vendorIndemnity === "unknown" || state.vendorIndemnity === "") {
    findings.push({
      severity: "review",
      title: "Vendor contract position unknown",
      detail:
        "Vendor AI terms often determine who pays when model output causes a claim, error, or third-party allegation.",
      action:
        "Request the vendor agreement, AI addendum, DPA, service description, and insurance certificate.",
    });
  }

  if (state.ipExposure === "yes") {
    findings.push({
      severity: "review",
      title: "IP or content liability exposure",
      detail:
        "Generative content, public data, and copied or derivative outputs can implicate media, IP, cyber, or E&O coverage.",
      action:
        "Check IP/copyright exclusions, media liability coverage, vendor warranties, and content review controls.",
    });
  } else if (state.ipExposure === "unknown" || state.ipExposure === "") {
    findings.push({
      severity: "review",
      title: "IP exposure not resolved",
      detail:
        "The coverage analysis should identify whether AI output can create copyright, trademark, publicity, or content harms.",
      action:
        "Confirm whether the system creates external content, code, marketing, advice, or documents from public or vendor-trained models.",
    });
  }

  if (state.decisionImpact === "yes") {
    findings.push({
      severity: "urgent",
      title: "Customer-impacting automated decision exposure",
      detail:
        "AI that affects underwriting, pricing, coverage, claims, employment, or customer access can create discrimination, professional liability, and regulatory exposure.",
      action:
        "Map the exposure to E&O, EPLI, D&O, cyber, and any algorithmic discrimination exclusions or endorsements.",
    });
  } else if (state.decisionImpact === "unknown" || state.decisionImpact === "") {
    findings.push({
      severity: "review",
      title: "Decision impact not confirmed",
      detail:
        "Coverage review is incomplete until the team knows whether the AI can materially affect people or policy outcomes.",
      action:
        "Confirm whether the AI affects underwriting, pricing, coverage, claims, employment, customer eligibility, or communications.",
    });
  }

  const severity = findings.reduce<CoverageSeverity>(
    (current, finding) =>
      severityRank[finding.severity] > severityRank[current]
        ? finding.severity
        : current,
    "ready",
  );

  return {
    severity,
    label:
      severity === "urgent"
        ? "Coverage action needed"
        : severity === "review"
          ? "Coverage review needed"
          : "Coverage posture looks documented",
    summary:
      severity === "ready"
        ? "No major coverage gaps were flagged from the selected answers. Keep policy evidence with the assessment packet."
        : "The answers identify coverage questions to resolve before deployment, renewal, or vendor approval.",
    findings,
  };
};
