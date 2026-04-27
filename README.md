# Insurance AI Governance Framework

Assess a proposed AI use case in insurance operations by governance tier, jurisdiction review questions, coverage-readiness gaps, and stress-tested scenario fit.

The workbench guides the user through structured questions, generates the use-case summary, previews the tier, and keeps assessment details out of the URL.

## What it does

- Builds a use-case summary from structured answers.
- Applies a deterministic insurance AI governance ruleset.
- Shows the risk tier, fired rules, assumptions, remediation guidance, controls, and review expectations.
- Flags jurisdiction-specific review prompts for NAIC model bulletin states, New York, Colorado, California, and the EU AI Act.
- Checks coverage readiness across policy lines, AI exclusions, broker disclosure, vendor contracts, IP exposure, and customer-impacting decisions.
- Includes a stress-test scenario lab so rule outcomes can be compared against practitioner judgment.
- Treats unknowns conservatively instead of defaulting to low-risk answers.
- Keeps assessment payloads out of shareable URLs.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Vitest for unit tests
- No database, no auth, no server-side logging
- No URL-based assessment payloads; the live assessment runs in the browser

## Run locally

```
npm install
npm run dev
```

Open http://localhost:3000.

## Verify

```
npm run typecheck
npm test
npm run build
```

## Deploy

Push to a GitHub repo, import into Vercel, no configuration needed. Free tier is sufficient.

## Privacy and limitations

- The app does not save assessments.
- No database, authentication, or server-side assessment logging is included.
- Export uses the browser print flow.
- This tool supports, but does not replace, qualified legal and compliance review.
- Jurisdiction and coverage prompts are readiness questions, not legal or policy-language interpretations.
- Scenario outcomes are a validation scaffold and should be reviewed by compliance, coverage, or regulatory practitioners before being treated as validated.
- Not legal advice.

## Where the framework lives

- `src/lib/framework/types.ts` - type definitions and framework version
- `src/lib/framework/rules.ts` - rules table, controls matrix, and review matrix
- `src/lib/framework/remediation.ts` - remediation guidance and evidence requests by rule
- `src/lib/framework/jurisdictions.ts` - jurisdiction overlay prompts
- `src/lib/framework/coverage.ts` - coverage-readiness checklist logic
- `src/lib/framework/scenarios.ts` - stress-test scenario library
- `src/lib/framework/engine.ts` - the pure `classify(input)` function
- `src/lib/framework/engine.test.ts` - tests that assert rule outcomes
- `src/app/AssessForm.tsx` - guided assessment workspace and live preview
- `src/app/CoverageReadiness.tsx` - coverage readiness workspace
- `src/app/ScenarioLab.tsx` - scenario stress-test workspace
- `src/app/framework/page.tsx` - static render of the framework

To change the framework, edit `rules.ts` and update the tests.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## License

MIT. See [LICENSE](LICENSE).
