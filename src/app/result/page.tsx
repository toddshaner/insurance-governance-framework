import Link from "next/link";

export default function ResultPage() {
  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Assessment results moved
        </h1>
        <p className="text-sm leading-6 text-zinc-700">
          Assessments are now previewed directly in the guided intake flow so
          use-case details do not need to travel through a shareable URL. Start
          a new assessment to build the summary, tier, rules, and controls in
          one place.
        </p>
      </section>
      <Link
        href="/"
        className="inline-flex rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
      >
        Start an assessment
      </Link>
    </div>
  );
}
