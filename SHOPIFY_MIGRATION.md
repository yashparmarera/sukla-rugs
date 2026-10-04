# Shopify migration blueprint

## Purpose

This repository contains an existing Next.js storefront and a separate Shopify Online Store 2.0 theme. The goal is to move storefront ownership to Shopify without removing the Next.js implementation until the Shopify experience is verified and an explicit cutover decision is made.

## Non-negotiable boundaries

| Area | Next.js | Shopify |
| --- | --- | --- |
| Existing reference UI | `src/` | No runtime dependency |
| Migration target | No migration-only changes unless requested | `shopify-theme/` |
| Product and collection data | Storefront API integration/reference | Shopify catalog is authoritative |
| Cart and checkout | Reference/API integration | Shopify Ajax cart and Shopify Checkout |
| Editorial content | Reference pages | Shopify pages, blogs, and articles |
| Deployment | Next.js host | Shopify theme |

Do not merge the implementations, remove the Next.js fallback, or introduce mock production data without explicit approval.

## Shopify theme architecture

```text
shopify-theme/
├── assets/       JavaScript and CSS
├── config/       Theme settings schema and saved values
├── layout/       Global HTML/theme shell
├── locales/      Translation resources
├── sections/     Theme-editor sections and section groups
├── snippets/     Reusable Liquid fragments
└── templates/    Online Store 2.0 route templates
```

Prefer Shopify-native Liquid objects, section settings, JSON templates, Ajax APIs, and theme settings over hardcoded production content.

## Data contracts to complete

Document the final contract before depending on it in Liquid:

- Product attributes: handle, title, description, vendor, product type, tags, variants, price, compare-at price, inventory, images, and availability.
- Collection attributes: handle, title, description, image, products, sorting, and filters.
- `shukla.*` metafields for rug dimensions, materials, construction, origin, care, lead time, and custom-rug metadata where needed.
- Metaobjects for artisans, room/category navigation, process content, reviews, and consultation/trade content where structured editing is required.
- Form destinations and notification ownership for consultation, trade, contact, and custom-rug requests.
- Review provider and the source/shape of review data.

No data contract is considered complete until it is tested with real store data and an empty-state case.

## Feature parity and implementation order

1. Theme shell, typography, tokens, header, footer, and navigation.
2. Homepage and brand/editorial sections.
3. Collection and product templates, filters, variants, and product metadata.
4. Ajax cart, cart drawer/page, and Shopify Checkout handoff.
5. Predictive/search results and empty states.
6. Pages, blogs, articles, guides, services, and forms.
7. Customer accounts, reviews, analytics, SEO, accessibility, performance, and Markets.
8. Development-store QA, unpublished-theme review, production publishing, and rollback.

The repository already contains files for several of these surfaces. File existence is not proof of store/runtime parity; record validation in `MIGRATION_STATUS.md`.

## Checkout and payment

The theme must hand off to Shopify Checkout using Shopify's supported cart/checkout flow. Razorpay, if used, remains configured inside Shopify Checkout and must not be reimplemented as a client-side theme payment flow.

## Quality gates

Before production approval:

- `shopify theme check --path .\shopify-theme` passes or has documented, accepted warnings.
- Development-store preview works for populated and empty data states.
- Product variant selection, cart updates, cart drawer, checkout handoff, search, and forms are tested.
- Responsive behavior, keyboard navigation, focus states, semantic headings, contrast, and reduced motion are checked.
- SEO metadata, canonical URLs, structured data, sitemap behavior, analytics events, and consent requirements are checked.
- Markets, currency, tax, shipping, inventory, customer accounts, and payment configuration are checked with the store team.
- A rollback path to the existing Next.js implementation is documented before cutover.

## Decision log

Keep decisions here when they affect architecture or data contracts. Each entry should include the date, decision, alternatives considered, and consequence.

### 2026-10-03 - Canonical status file

Use one root `MIGRATION_STATUS.md` rather than maintaining a second Kiro-specific status copy. `.kiro/steering/` contains rules for reading and updating the canonical file.
