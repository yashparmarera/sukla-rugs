# Migration workflow

## Before editing

1. Read `AGENTS.md`, `MIGRATION_STATUS.md`, and the relevant part of `SHOPIFY_MIGRATION.md`.
2. Identify whether the requested change belongs to `src/` or `shopify-theme/`.
3. Inspect the existing implementation, related templates/sections, and data contract before creating new logic.
4. Treat file presence as implementation evidence only; check runtime behavior separately.

## During editing

- Keep Shopify migration changes inside `shopify-theme/`.
- Preserve the independently runnable Next.js implementation.
- Prefer existing snippets, sections, settings, and Shopify-native APIs over duplication.
- Do not invent production catalog, customer, review, or payment data.
- Surface configuration and data problems with explicit empty states or repository-standard diagnostics.
- Make focused changes and preserve existing UX unless the task explicitly changes it.

## After editing

1. Run the smallest relevant validation.
2. For theme changes, run Shopify Theme Check when the CLI is available.
3. Test both populated and missing-data states where possible.
4. Update the canonical root `MIGRATION_STATUS.md` with exact files, validation results, warnings, blockers, and the next exact task.
5. Add an entry to `SHOPIFY_MIGRATION.md` only when an architectural or data-contract decision was made.
6. Report what was verified versus what still requires a Shopify development store.
