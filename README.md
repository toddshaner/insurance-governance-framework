# Insurance AI Governance Framework

Classify a proposed AI use case in insurance operations by risk tier, and see the review expectations and controls required at that tier.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Vitest for unit tests
- No database, no auth, no server-side logging

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

- `src/lib/framework/types.ts` — type definitions and framework version
- `src/lib/framework/rules.ts` — the rules table, controls matrix, and review matrix (single source of truth)
- `src/lib/framework/engine.ts` — the pure `classify(input)` function
- `src/lib/framework/engine.test.ts` — tests that assert each rule fires on the expected inputs
- `src/app/framework/page.tsx` — static render of the framework, same data the engine evaluates

To change the framework, edit `rules.ts` and update the tests.
