# Shopify migration status

**Canonical status file:** update this file after each meaningful migration task. Claims below distinguish repository evidence from store/runtime verification.

## Current state

- **Overall phase:** Shopify theme implementation complete; store configuration and visual/data QA
- **Active focus:** assign the dedicated templates in Shopify Admin, populate real catalog/content, and test the development-store preview
- **Next exact task:** create the Shopify pages/blog/catalog/metafields, assign the new `page.*` templates, and run `shopify theme dev`
- **Production status:** not approved for production publishing

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
