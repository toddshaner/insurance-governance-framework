import { controlsByTier, reviewByTier, rules } from "./rules";
import {
  ClassifyResult,
  FRAMEWORK_LAST_UPDATED,
  FRAMEWORK_VERSION,
  FiredRule,
  Tier,
  UseCaseInput,
  tierRank,
} from "./types";

const maxTier = (tiers: Tier[]): Tier => {
  let current: Tier = "low";
  for (const t of tiers) {
    if (tierRank[t] > tierRank[current]) current = t;
  }
  return current;
};

export const classify = (input: UseCaseInput): ClassifyResult => {
  const fired: FiredRule[] = [];

  const baseRules = rules.filter((r) => r.kind === "base");
  const modifierRules = rules.filter((r) => r.kind === "modifier");

  for (const r of baseRules) {
    if (r.test(input, "low")) {
      fired.push({
        id: r.id,
        title: r.title,
        severity: r.severity,
        rationale: r.rationale,
        sources: r.sources,
      });
    }
  }

  const baseTier: Tier =
    fired.length === 0 ? "low" : maxTier(fired.map((f) => f.severity));

  for (const r of modifierRules) {
    if (r.test(input, baseTier)) {
      fired.push({
        id: r.id,
        title: r.title,
        severity: r.severity,
        rationale: r.rationale,
        sources: r.sources,
      });
    }
  }

  const tier: Tier = maxTier(fired.map((f) => f.severity));
  const finalTier: Tier = fired.length === 0 ? "low" : tier;

  return {
    tier: finalTier,
    firedRules: fired,
    controls: controlsByTier[finalTier],
    review: reviewByTier[finalTier],
    frameworkVersion: FRAMEWORK_VERSION,
    frameworkLastUpdated: FRAMEWORK_LAST_UPDATED,
  };
};
