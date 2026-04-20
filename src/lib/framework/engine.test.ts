import { describe, expect, it } from "vitest";
import { classify } from "./engine";
import type { UseCaseInput } from "./types";

const base: UseCaseInput = {
  description: "",
  audience: "internal",
  client_facing: false,
  regulated_domains: [],
  ai_mode: "classifying",
  decision_authority: "not_applicable",
  human_review_before_external_output: "not_applicable",
  data_source: "vendor_documented",
  logging: true,
};

const withInput = (override: Partial<UseCaseInput>): UseCaseInput => ({
  ...base,
  ...override,
});

describe("classify — tier outcomes", () => {
  it("returns Low for internal classifier with documented data and logging", () => {
    const result = classify(base);
    expect(result.tier).toBe("low");
    expect(result.firedRules).toHaveLength(0);
  });

  it("returns Moderate for internal generative outside regulated domains (R7)", () => {
    const result = classify(withInput({ ai_mode: "generative" }));
    expect(result.tier).toBe("moderate");
    expect(result.firedRules.map((r) => r.id)).toContain("R7");
  });

  it("returns Moderate for client-facing classifier (R5)", () => {
    const result = classify(
      withInput({ client_facing: true, ai_mode: "classifying", human_review_before_external_output: "no" }),
    );
    expect(result.tier).toBe("moderate");
    expect(result.firedRules.map((r) => r.id)).toContain("R5");
  });

  it("returns Moderate for client-facing generative with human review (R4b)", () => {
    const result = classify(
      withInput({
        client_facing: true,
        ai_mode: "generative",
        human_review_before_external_output: "yes",
      }),
    );
    expect(result.tier).toBe("moderate");
    expect(result.firedRules.map((r) => r.id)).toContain("R4b");
  });

  it("returns High for client-facing generative without human review (R4a)", () => {
    const result = classify(
      withInput({
        client_facing: true,
        ai_mode: "generative",
        human_review_before_external_output: "no",
      }),
    );
    expect(result.tier).toBe("high");
    expect(result.firedRules.map((r) => r.id)).toContain("R4a");
  });

  it("returns High for regulated recommend (R3c)", () => {
    const result = classify(
      withInput({
        regulated_domains: ["pricing"],
        decision_authority: "recommend",
      }),
    );
    expect(result.tier).toBe("high");
    expect(result.firedRules.map((r) => r.id)).toContain("R3c");
  });

  it("returns High for regulated decide-with-review (R3b)", () => {
    const result = classify(
      withInput({
        regulated_domains: ["coverage"],
        decision_authority: "decide_with_review",
      }),
    );
    expect(result.tier).toBe("high");
    expect(result.firedRules.map((r) => r.id)).toContain("R3b");
  });

  it("returns Prohibited for regulated decide-without-review (R3a)", () => {
    const result = classify(
      withInput({
        regulated_domains: ["claims"],
        decision_authority: "decide_without_review",
      }),
    );
    expect(result.tier).toBe("prohibited");
    expect(result.firedRules.map((r) => r.id)).toContain("R3a");
  });

  it("returns Prohibited for unknown training data reaching clients (R1)", () => {
    const result = classify(
      withInput({
        client_facing: true,
        ai_mode: "classifying",
        data_source: "unknown",
        human_review_before_external_output: "yes",
      }),
    );
    expect(result.tier).toBe("prohibited");
    expect(result.firedRules.map((r) => r.id)).toContain("R1");
  });

  it("returns Prohibited for unknown training data in regulated domain (R1)", () => {
    const result = classify(
      withInput({
        regulated_domains: ["pricing"],
        decision_authority: "recommend",
        data_source: "unknown",
      }),
    );
    expect(result.tier).toBe("prohibited");
    expect(result.firedRules.map((r) => r.id)).toContain("R1");
  });

  it("escalates High to Prohibited when logging is missing (R2)", () => {
    const result = classify(
      withInput({
        regulated_domains: ["claims"],
        decision_authority: "recommend",
        logging: false,
      }),
    );
    expect(result.tier).toBe("prohibited");
    expect(result.firedRules.map((r) => r.id)).toContain("R2");
    expect(result.firedRules.map((r) => r.id)).toContain("R3c");
  });

  it("keeps Moderate tier when logging is missing but flags R9", () => {
    const result = classify(
      withInput({
        ai_mode: "generative",
        logging: false,
      }),
    );
    expect(result.tier).toBe("moderate");
    expect(result.firedRules.map((r) => r.id)).toContain("R9");
  });

  it("fires R8 for public-unknown training data", () => {
    const result = classify(withInput({ data_source: "public_unknown" }));
    expect(result.tier).toBe("moderate");
    expect(result.firedRules.map((r) => r.id)).toContain("R8");
  });

  it("fires R6 when external users operate the tool without client-facing output", () => {
    const result = classify(
      withInput({
        audience: "external",
        client_facing: false,
      }),
    );
    expect(result.tier).toBe("moderate");
    expect(result.firedRules.map((r) => r.id)).toContain("R6");
  });

  it("worked example: adjuster-reviewed generative claim letter is High", () => {
    // Generative AI drafts claim denial letters; adjuster reviews before sending.
    const result = classify({
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
    });
    expect(result.tier).toBe("high");
    const ids = result.firedRules.map((r) => r.id);
    expect(ids).toContain("R3c");
    expect(ids).toContain("R4b");
  });
});

describe("classify — controls and review mapping", () => {
  it("Low tier: logging and version control recommended, disclosure not required", () => {
    const result = classify(base);
    expect(result.controls.logging).toBe("recommended");
    expect(result.controls.model_version_control).toBe("recommended");
    expect(result.controls.client_disclosure).toBe("not_required");
    expect(result.review.who.toLowerCase()).toContain("line manager");
  });

  it("High tier: every control required and monthly bias monitoring", () => {
    const result = classify(
      withInput({
        regulated_domains: ["pricing"],
        decision_authority: "recommend",
      }),
    );
    expect(result.controls.logging).toBe("required");
    expect(result.controls.human_in_the_loop).toBe("required");
    expect(result.controls.legal_signoff).toBe("required");
    expect(result.controls.client_disclosure).toBe("required");
    expect(result.controls.bias_drift_monitoring.status).toBe("required");
    expect(result.controls.bias_drift_monitoring.cadence).toBe("Monthly");
  });

  it("Prohibited tier: all controls not_applicable, do-not-deploy review", () => {
    const result = classify(
      withInput({
        regulated_domains: ["claims"],
        decision_authority: "decide_without_review",
      }),
    );
    expect(result.controls.logging).toBe("not_applicable");
    expect(result.controls.human_in_the_loop).toBe("not_applicable");
    expect(result.review.who.toLowerCase()).toContain("do not deploy");
  });
});

describe("classify — metadata", () => {
  it("includes framework version and last-updated", () => {
    const result = classify(base);
    expect(result.frameworkVersion).toBe("1.0");
    expect(result.frameworkLastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
