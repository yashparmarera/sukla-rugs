# Project architecture

## System overview

Shukla Rugs has two independent storefront implementations:

1. **Next.js implementation** in `src/`
   - Existing storefront and reference implementation.
   - Must remain independently runnable and deployable.
   - May be used to compare behavior and design during migration.

2. **Shopify implementation** in `shopify-theme/`
   - Independent Online Store 2.0 theme.
   - Uses Liquid, JSON templates, sections, snippets, assets, Shopify data, and Shopify Ajax APIs.
   - Is the only permitted location for Shopify migration work unless the user explicitly requests a coordinated change.

There is no required runtime dependency between these implementations.

## Ownership boundaries

- Shopify owns production catalog, collections, inventory, cart, checkout, search, pages, blogs, articles, customer capabilities, and payment configuration.
- The Next.js app remains the rollback/reference implementation until an explicit cutover decision.
- Do not delete or silently rewrite the Next.js implementation during migration.
- Do not add mock production commerce data to the Shopify theme.
- Missing Shopify data should produce an explicit empty state or an actionable configuration warning.

## Source-of-truth files

- `MIGRATION_STATUS.md` - current verified progress, validation, blockers, and next task.
- `SHOPIFY_MIGRATION.md` - durable architecture, implementation order, data contracts, and quality gates.
- `DEVELOPMENT.md` - commands, prerequisites, and local workflows.
- `AGENTS.md` - repository-wide operating rules.

Read `MIGRATION_STATUS.md` before continuing work. Update it after meaningful changes.
