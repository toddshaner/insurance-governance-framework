import AssessForm from "./AssessForm";
import CoverageReadiness from "./CoverageReadiness";
import ScenarioLab from "./ScenarioLab";

export default function AssessPage() {
  return (
    <div className="space-y-10">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold text-zinc-900">
          AI insurance governance workbench
        </h1>
        <p className="text-sm text-zinc-600">
          Assess the governance tier, flag jurisdiction-specific review
          questions, check coverage readiness, and compare the rules against
          messy insurance scenarios.
        </p>
      </section>
      <AssessForm />
      <CoverageReadiness />
      <ScenarioLab />
    </div>
  );
}
