# Development guide

## Repository layout

- `src/` contains the Next.js storefront.
- `shopify-theme/` contains the independent Shopify Online Store 2.0 theme.
- `.kiro/steering/` contains Kiro operating guidance; it is not a second status system.
- `MIGRATION_STATUS.md` is the single canonical migration status file.

## Prerequisites

The repository currently uses:

- Node.js and npm
- Next.js `16.3.6`
- React `19.2.8`
- TypeScript `^5`
- Shopify CLI for theme development and Theme Check

Use the versions selected by the repository and lockfile unless a task explicitly changes them.

## Next.js workflow

From the repository root:

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`.

Validation and production-like execution:

```powershell
npm run lint
npm run build
npm run start
```

The Next.js storefront uses the environment variables documented in `.env.example`. Keep real credentials in `.env.local`; never commit them.

## Shopify workflow

Authenticate the Shopify CLI with an account that has access to the development store, then run:

```powershell
shopify theme dev --path .\shopify-theme --store vt0dch-hg.myshopify.com
shopify theme check --path .\shopify-theme
shopify theme push --path .\shopify-theme --unpublished
```

Use `theme push` only when explicitly ready to publish an unpublished theme for review. Do not push to a live theme as part of routine local validation.

The theme's local structure is:

- `layout/` - global theme shell
- `config/` - theme settings schema and saved values
- `sections/` - editable Online Store 2.0 sections
- `snippets/` - reusable Liquid fragments
- `templates/` - JSON and Liquid page templates
- `assets/` - JavaScript and CSS
- `locales/` - translations

## Safe handoff workflow

1. Read `MIGRATION_STATUS.md`.
2. Confirm whether the task belongs to `src/` or `shopify-theme/`.
3. Inspect existing files and the relevant data contract.
4. Implement and validate incrementally.
5. Update `MIGRATION_STATUS.md` with the exact files, validation, warnings, blockers, and next exact task.
