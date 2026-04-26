import AssessForm from "./AssessForm";

export default function AssessPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Assess an AI use case
        </h1>
        <p className="text-sm text-zinc-600">
          Answer guided questions and the tool builds the use-case summary,
          previews the risk tier, and shows the review and controls required
          before launch.
        </p>
      </section>
      <AssessForm />
    </div>
  );
}
