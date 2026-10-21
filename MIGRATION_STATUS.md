# Shopify migration status

**Canonical status file:** update this file after each meaningful migration task. Claims below distinguish repository evidence from store/runtime verification.

## Current state

- **Overall phase:** Shopify theme implementation complete; store configuration and visual/data QA
- **Active focus:** assign the dedicated templates in Shopify Admin, populate real catalog/content, and test the development-store preview
- **Next exact task:** configure the store in Shopify Admin (see "Store configuration findings"): local-currency Markets, shipping coverage for the 11 unavailable countries, shipping/refund policies, product metafields in the `sukla` namespace, collection assignment; then run end-to-end QA on the development store
- **Production status:** not approved for production publishing. Code-complete does not mean production-ready.

## Store configuration findings

Verified against `vt0dch-hg.myshopify.com` through the Storefront API on 2026-10-16. These are store-side facts that code cannot fix.

- **Currency:** all 36 available countries price in USD. No local-currency Markets are enabled, so the Next.js storefront shows other currencies as labelled approximations only; checkout is in USD.
- **Availability:** Shopify reports every product as unavailable in 11 countries: BH, CY, HU, LT, LU, LV, MT, RO, SA, SI, SK (almost certainly missing shipping/market coverage).
- **Policies:** no shipping or refund policy is configured, so the product page shows no shipping and returns section.
- **Catalog data:** 3 products, each with a single `Default Title` variant; no product type, tags or SKU; vendor is the placeholder `My Store`; two of three products belong to no collection.
- **Metafields:** the specification metafields the storefront reads (namespace `sukla`: technique, material, color_family, origin_region, care_instructions, pile_height, weight, knots_per_sq_inch, craft_duration, product_story) are not populated.
- **Descriptions:** marketplace-style bullet lists. Two descriptions contain "Karori Rugs"; this is kept as is for now by the owner's decision.
- **API scope:** the Storefront token cannot read `quantityAvailable` (needs `unauthenticated_read_product_inventory`).

## Horizon theme folder

- `shopify-live-horizon/` is a local copy of the live theme "Updated copy of Horizon" (#188131279037). A customisation attempt was made and then reverted: the folder was re-pulled from the store and the Kiro-created files were removed. The folder now mirrors the live theme.
- Nothing was pushed to, published on, or modified in the Shopify store from this repository. Unpublished development/preview themes created by `shopify theme dev` may exist on the store and have not been deleted.
- `shopify-theme/` (the earlier custom Liquid theme) is untouched.

## Next.js reference storefront (src/)

Updated as the rollback/reference implementation; these are not Shopify theme changes.

- Brand text, CSS variables and storage keys renamed from `shukla` to `sukla` (external addresses `shuklarugsv1.vercel.app` and `concierge@shuklarugs.com` deliberately unchanged and need the owner's confirmation).
- Typography system (Jost display, Ibarra Real Nova editorial, Inter UI and numbers).
- Product page: real-data-only content, pinned gallery, feature list from the product description, related products ranking.
- Country selector and display currency. Prices outside USD are approximations from daily ExchangeRate-API rates; checkout always uses Shopify.
- Shop mega menu (uncommitted): `src/lib/shop-menu.ts` (single source of truth, 5 columns), `src/components/navigation/ShopMegaMenu.tsx` (desktop), `ShopMobileMenu.tsx` (drawer accordion), wired in `Header.tsx`. `/shop` now accepts `style`, matches `style|room|construction|material` with the documented helper `src/lib/shop-filters.ts` (real product title/description/options/tags/productType/`sukla` metafields only; style never matches free text), shows active-filter chips (`ActiveFilterChips.tsx`) and an explicit "No rugs match X yet" empty state with a View All Rugs link. `getProducts` gained an opt-in `strictCollection`; the product fragment also reads optional `sukla.style|room|shape` metafields. Area Rugs handles (`bestseller`, `runners`, `premium-rugs`, `round-rugs`, `shaped-rugs`) are assumptions: the owner must confirm or create these collections in Shopify Admin (until then keyword fallback applies). Evidence: `.agents/tasks/shop-mega-menu/verification.md`.
- Known limitation: the search modal and Find Your Rug quiz load products in the browser, where the Shopify call is unavailable, so they fall back to mock products.

## Architecture

- The existing Next.js storefront lives in `src/` and remains the reference/rollback implementation.
- The Shopify migration is isolated in `shopify-theme/`.
- The two implementations have no required runtime dependency on each other.
- Shopify should own product data, collections, search, cart, checkout, pages, blogs, articles, and customer/store capabilities.

## Confirmed in the repository

### Next.js implementation

- App Router pages exist for the home page, shop, collections, products, journal, guides, brand/service pages, account, and other content routes.
- Shopify Storefront API client, queries, mutations, fragments, local cart support, and analytics modules exist under `src/lib/`.
- An API checkout route exists under `src/app/api/checkout/`.

### Shopify theme implementation

- Theme shell, settings, header/footer groups, assets, locales, snippets, sections, and JSON templates exist.
- Templates exist for index, collection, product, cart, search, page, blog, article, and 404 routes.
- Sections exist for homepage/editorial content, products, collections, cart, search, blog/article content, consultation, and brand content.
- Dedicated JSON page templates now exist for find-your-rug, custom-rugs, design-consultation, trade, artisans, process, story, sustainability, rug-care, and rug-size.
- `service-experience.liquid` provides accessible Shopify contact/search forms, success/error states, and configurable service steps.
- Testimonials can be configured through theme-editor blocks.
- Shopify-hosted image pickers are available for hero, room, category, and Bhadohi story imagery; external placeholder defaults were removed from those surfaces.
- Product view, product selection, and add-to-cart data-layer hooks are present.
- Theme-level Open Graph, Twitter card, and product/article structured-data hooks are present.
- Shopify hero now matches the Next.js hero composition: 85vh desktop presentation, transparent image layer, text-shadow backdrops, explicit two-line heading, rounded cream CTA, and matching mobile behavior.
- Hero autoplay now initializes reliably after deferred page load and Shopify Theme Editor section reloads, restarts after manual navigation, and preserves the reduced-motion opt-out.
- Theme README explicitly requires empty states rather than mock commerce data.

## Not yet verified

- Development-store preview and real content rendering.
- Successful connection to the development store and preview rendering.
- Real product, collection, image, inventory, cart, checkout, search, blog, article, and page data.
- Checkout/payment configuration, including Razorpay behavior inside Shopify Checkout.
- Form destinations, review provider, customer accounts, Markets/international behavior, analytics, SEO, accessibility, and performance.
- Production publishing and rollback procedure.

## Worktree note

At the time this file was created, the worktree already contained unrelated changes in `src/components/cart/CartDrawer.tsx` and `src/app/api/`, plus an untracked `shopify-theme/` directory. Do not revert or reinterpret those changes without inspecting their ownership and history.

## Validation log

| Date | Scope | Result |
| --- | --- | --- |
| 2026-10-03 | Repository structure and documentation review | Confirmed both implementations and theme file inventory; store/runtime checks not run |
| 2026-10-03 | Shopify theme implementation and Theme Check | Added dedicated service/content templates, testimonials, image-picker paths, analytics hooks, accessibility feedback, and metadata; Theme Check passed with no offenses |
| 2026-10-03 | Hero parity pass | Matched Shopify hero copy structure, text treatment, CTA shape, veil behavior, image scale, and responsive presentation to the Next.js hero; Theme Check passed |
| 2026-10-03 | Hero autoplay fix | Made hero initialization resilient to deferred loading and Shopify section reloads; manual controls restart the timer; Theme Check passed |
| 2026-10-16 | Next.js storefront (src/) | `npm run build` passes (all routes compile, TypeScript clean); ESLint is clean on the components and helpers edited in this work, except `src/lib/shopify/client.ts`, which has about 23 pre-existing `any` errors. Pre-existing lint errors elsewhere remain (for example `setState` in effects in Header, CartDrawer, SearchModal, and `any` types in the Shopify client). Verified against the live store through the dev server: product pages, per-country currency display, availability messaging. Not visually verified in a browser. |
| 2026-10-16 | shopify-live-horizon | Folder re-pulled from live theme #188131279037 and verified by file hashes. Theme Check was last run before the restore, with 2 pre-existing `UnknownFilter: applicable_disclosures` errors in stock Horizon files; it was not re-run after the restore. |
| 2026-10-16 | Product short description (src/) | Short description under the product title: `sukla.short_description` metafield first, then the first feature body from `descriptionHtml`, then the plain description. Capped near 170 characters, ends on a sentence, never repeats the title. Metafield definitions need Storefront access (public read) to be returned. Storefront API schema for 2026-07 and 2026-10 is identical for the types checked; the app stays on 2026-07. |
| 2026-10-21 | Shop mega menu (src/) | Full-width Shop mega menu (desktop) and drawer accordion (mobile); `/shop` accepts `style` and matches style/room/construction/material from real product fields, with filter chips and an explicit empty state. New: `src/lib/shop-menu.ts`, `src/lib/shop-filters.ts`, `src/components/navigation/ShopMegaMenu.tsx`, `src/components/navigation/ShopMobileMenu.tsx`, `src/components/filters/ActiveFilterChips.tsx`. Modified: `src/components/navigation/Header.tsx`, `src/app/shop/page.tsx`, `src/components/filters/FilterBar.tsx`, `src/lib/shopify/client.ts` (opt-in `strictCollection`, style/room/shape metafields), `src/lib/shopify/fragments/product.ts`. `npm run build` passes; `tsc --noEmit` clean; ESLint on the new files, `shop/page.tsx`, `FilterBar.tsx` and `fragments/product.ts` has 0 errors and 1 pre-existing unused `FilterState` warning. `Header.tsx` (pre-existing `setState` in effect errors) and `client.ts` (about 23 pre-existing `any` errors) report 27 problems (24 errors, 3 warnings) both before and after this change, none introduced here. Playwright (Chromium) run against the dev server: hover/focus/click/touch/Escape/outside-click, reduced motion, mobile accordion and all 21 menu filters checked with the 3 real products. Next task: owner confirms Area Rugs collection handles and populates `sukla.style|room|shape` or tags so style/shape filters can match. |
| 2026-10-22 | Shop filter metafield matching (src/) | `/shop` menu matching extended; namespace stays `sukla`. Modified: `src/lib/shop-filters.ts` (new exported `parseMetafieldValues` for JSON list metafields, GIDs ignored; style also matches `sukla.palette`; `premium-rugs` matches `sukla.premium` = true; `runners` matches `sukla.rug_format` = Runner; `round-rugs` matches `sukla.shape` = Round; `shaped-rugs` now matches only shape values that are not rectangular/rectangle/square/round, or the existing shaped tag/title rule; construction reads `sukla.construction`, `sukla.technique` only as fallback), `src/lib/shopify/fragments/product.ts` (new reads: `construction`, `palette`, `premium`, `rug_format`), `src/lib/shopify/client.ts` (mapper for those keys; the color filter also matches `palette` values), `src/types/index.ts` (`palette`, `premium`, `rug_format` on `ProductMetafields`). Nothing is invented: products without these metafields still do not match. `tsc --noEmit` clean; `npm run build` passes. ESLint on the 4 changed files: 26 problems (23 errors, 3 warnings) before and after, all pre-existing (`any` in `client.ts`), none introduced. 46 synthetic-product checks (temp script, deleted) pass for palette/style lists, premium true/false/absent, runner, round, shaped, GID lists and plain strings. Runtime against the live store on the already running dev server: `/shop` lists 3 products; `/shop?style=neutral`, `?collection=premium-rugs`, `?collection=runners`, `?collection=shaped-rugs` list 0 products and show the empty state. Not verified: matching against real metafield data (live products have none). Next task: owner creates the `sukla.*` metafield definitions in Shopify Admin with Storefront access enabled (`style` list, `room` list, `material` list, `palette` list, `construction` text, `shape` text, `rug_format` text, `premium` boolean) and populates products. |
| 2026-10-23 | Shopify data entry guides and image alt fallback (src/, docs/) | Added `docs/SHOPIFY_DATA_ENTRY_GUIDE.md` (what to fill or leave blank for products, metafields, variants, collections) and `docs/SHOPIFY_DATA_ENTRY_REASONS.md` (the reason for each item, tagged Code, Shopify or Judgment). `src/lib/shopify/client.ts` `reshapeImage` no longer replaces missing Shopify alt text with a generic phrase; it returns an empty string so each component falls back to its own product, collection or article title (all existing consumers already use `altText \|\| title`). `tsc --noEmit` clean; ESLint on `client.ts` reports 26 problems (23 errors, 3 warnings), all pre-existing `any` errors, none added. Not verified in a browser. Findings recorded in the guides: the site does not read Shopify SEO fields or vendor. Next task: owner creates the `sukla.*` metafield definitions with Storefront access and fills products; decide whether to remove the `MOCK_PRODUCTS` fallback and the unverified announcement-bar claims. |

## Blockers and prerequisites

- A Shopify development-store session and authenticated Shopify CLI are required for preview validation and real-data QA.
- Real catalog/content population is required before judging production behavior.
- The destinations and providers for consultation, trade, contact, reviews, analytics, and customer accounts must be decided before final QA.

## Next update checklist

When completing a task, update:

- current phase and active focus
- exact files changed
- validation commands and results
- confirmed behavior versus store-dependent behavior
- warnings or blockers
- next exact task
