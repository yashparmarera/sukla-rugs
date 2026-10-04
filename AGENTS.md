<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project operating rules

## Source of truth

- Read `MIGRATION_STATUS.md` before starting migration work.
- Treat `SHOPIFY_MIGRATION.md` as the long-term architecture and data-contract reference.
- Update `MIGRATION_STATUS.md` after completing a meaningful migration task.
- Record architectural decisions in `SHOPIFY_MIGRATION.md` when they affect future work.

## Two independent implementations

- `src/` is the existing Next.js storefront and must remain independently runnable.
- `shopify-theme/` is the independent Shopify Online Store 2.0 theme migration.
- Shopify migration work belongs in `shopify-theme/` unless the user explicitly requests a coordinated Next.js change.
- Do not delete, merge, or create runtime dependencies between the two implementations without explicit approval.
- Do not replace real Shopify data with mock production data. Render an explicit empty state when required Shopify data is missing.

## Workflow

1. Inspect the relevant existing implementation before recreating behavior.
2. Read the applicable section of `SHOPIFY_MIGRATION.md`.
3. Make the smallest complete change in the permitted implementation.
4. Validate with the relevant Next.js checks or Shopify Theme Check.
5. Update `MIGRATION_STATUS.md` with files changed, validation, blockers, and the next exact task.
