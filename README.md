# Shukla Rugs

Shukla Rugs currently has two intentionally independent storefront implementations:

| Implementation | Location | Purpose |
| --- | --- | --- |
| Next.js storefront | [`src/`](./src) | Existing reference and rollback implementation |
| Shopify theme | [`shopify-theme/`](./shopify-theme) | Online Store 2.0 migration target |

Do not treat the Shopify theme as a wrapper around the Next.js app. They have separate runtimes, deployment paths, and data contracts.

## Start here

Before changing the project, read:

1. [`MIGRATION_STATUS.md`](./MIGRATION_STATUS.md) for the current verified state and next task.
2. [`SHOPIFY_MIGRATION.md`](./SHOPIFY_MIGRATION.md) for architecture, boundaries, and data contracts.
3. [`DEVELOPMENT.md`](./DEVELOPMENT.md) for local commands and environment setup.
4. [`AGENTS.md`](./AGENTS.md) for repository operating rules.

Kiro-specific steering files live in [`.kiro/steering/`](./.kiro/steering/).

## Next.js development

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`.

Other scripts:

```powershell
npm run lint
npm run build
npm run start
```

The Next.js storefront uses the environment variables documented in `.env.example`. Keep real credentials in `.env.local`; never commit them.

## Shopify theme development

```powershell
shopify theme dev --path .\shopify-theme --store vt0dch-hg.myshopify.com
shopify theme check --path .\shopify-theme
```

The Shopify theme must use Shopify-native products, collections, cart, checkout, search, pages, blogs, and articles. Do not add mock commerce data.

## Repository rules

- Keep the Next.js implementation independently runnable.
- Keep Shopify migration changes inside `shopify-theme/` unless a coordinated change is explicitly requested.
- Update `MIGRATION_STATUS.md` after meaningful migration work.
- Never commit secrets from `.env.local`.
