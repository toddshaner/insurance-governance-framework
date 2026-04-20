import AssessForm from "./AssessForm";

export default function AssessPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Assess an AI use case
        </h1>
        <p className="text-sm text-zinc-600">
          Describe a proposed AI use case. The tool returns a risk tier, the
          review it requires, and the controls that must be in place before it
          runs.
        </p>
      </section>
      <AssessForm />
    </div>
  );
}
