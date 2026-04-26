# Insurance AI Governance Framework

Classify a proposed AI use case in insurance operations by risk tier, and see the review expectations and controls required at that tier.

The assessment flow guides the user through structured questions, generates the use-case summary, and previews the tier without putting assessment details in the URL.

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

## Where the framework lives

- `src/lib/framework/types.ts` - type definitions and framework version
- `src/lib/framework/rules.ts` - rules table, controls matrix, and review matrix
- `src/lib/framework/engine.ts` - the pure `classify(input)` function
- `src/lib/framework/engine.test.ts` - tests that assert rule outcomes
- `src/app/AssessForm.tsx` - guided assessment workspace and live preview
- `src/app/framework/page.tsx` - static render of the framework

To change the framework, edit `rules.ts` and update the tests.
