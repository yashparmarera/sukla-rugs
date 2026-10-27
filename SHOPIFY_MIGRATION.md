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
- `sukla.*` metafields for rug dimensions, materials, construction, origin, care, lead time, and custom-rug metadata where needed.
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

### 2026-10-24 - Contact details single source of truth (Next.js)

`src/lib/contact.ts` is the single source of truth for the business phone number and WhatsApp details in the Next.js app: `PHONE_E164`, `PHONE_DISPLAY`, `PHONE_TEL`, `WHATSAPP_NUMBER`, `WHATSAPP_MESSAGE`, and the `whatsappUrl(message?)` helper. Any future contact surface (footer, header, contact/consultation/trade pages, `tel:`/`mailto:` CTAs, JSON-LD/schema.org `telephone` fields, metadata) must import these constants instead of hardcoding the number, so the number changes in exactly one place. Alternatives considered: inlining the literal per component (rejected — drift risk) and an env variable (rejected — the number is a public, stable brand value, not a secret or per-environment config). Consequence: the floating WhatsApp widget (`src/components/common/WhatsAppFloat.tsx`) and the footer both consume this module. Scope note: this contract is for the Next.js app only; the Shopify theme has its own data sources and is untouched.

### 2026-10-28 - PDP infographic data contract (Next.js)

The product page "At a glance" tiles and Care icons (`src/lib/product-infographics.ts`) read only these `sukla` metafields, the selected variant and the product title. A missing or unparseable value hides its tile; no tiles hides the block. Nothing is invented.

| Tile | Source | Format observed in the live store (2026-10-28) |
| --- | --- | --- |
| Construction (icon + technique summary) | `sukla.construction`, else `sukla.technique` | single line: `Hand Knotted`, `Hand Tufted`, `Hand Woven`, `Flatweave`. A summary needs "hand" in the value (or flatweave/kilim/dhurrie/soumak); machine or power-loom values get none |
| Material(s) | `sukla.material` | single line: `Wool`, `Jute` (lists and comma text are also split) |
| Pile height gauge | `sukla.pile_height` | `0.5 inches (~12 mm)`, `0.5–0.6 inches (~12–15 mm)`, `0.8 inches (~20 mm)`, `Medium pile, approximately 0.5 inches / 12–15 mm`. mm, cm, inch, fractions and ranges parse; a plain band word (Low/Medium/High) overrides the computed band |
| Knot density | `sukla.knots_per_sq_inch`, only when construction is hand-knotted | not populated. Expected: a plain number or range per sq in (`120`, `100-120 KPSI`); pair notation (`9/9`) shows no tile |
| Shape & size | `sukla.shape` (runner fallback from `sukla.rug_format`); size from the selected variant option, else the size in the title | shape: `Rectangular`, `Round`, `Scalloped`, `Irregular`; `rug_format`: `Area Rug`; sizes such as `4x6 ft`, `5x8 ft`, `2.6x10 ft` |
| Suitable rooms | `sukla.room` | `list.single_line_text_field`: `["Living Room","Bedroom","Dining Room"]` |
| Origin & craft | `sukla.origin_region`, `sukla.craft_duration` | not populated. Expected: short text |
| Care icons | `sukla.care_instructions` | multi-line text, one instruction per line, mostly `Label: instruction` (`Vacuum Gently: Use low suction without a beater bar weekly.`); an optional `Care Instructions:` header line is dropped. Every line is printed; icons come from keywords, and affirmative icons are dropped when negated |

Alternatives considered: deriving tiles from the description HTML (rejected: free text, risk of wrong claims) and a new metaobject per product (rejected for now: the existing `sukla` fields already cover the tiles). Consequence: adding a tile means adding a `sukla` field to the Storefront fragment and a parser with an empty-state rule. Known limit: care negation uses a closed vocabulary, so phrasings such as "can damage" or "is unsuitable" may still show an icon; owners should keep care text in the positive `Label: instruction` form. Scope: Next.js app only; `shopify-theme/` does not implement these tiles.

### 2026-10-29 - Custom-size pricing in code, quoted on WhatsApp (Next.js)

The PDP "Customise" calculator prices custom sizes from website code, not from Shopify. The owner's size-wise table (48 standard sizes), the per-sq-ft rates (Hand Knotted $12, Hand Tufted $8, Jute / Flat Weave $6, Hand Loom $10) and the lead times all live in `src/lib/custom-rug-pricing.ts`. All 48 chart prices are used exactly as the owner gave them (no corrections, including HL 5×8 $439, HL 8×10 $879, HK runner 2.5×8 $230, which differ from area × rate). A standard size uses its chart price; for Rectangle, Runner and Square both the Area and the Runner chart are checked, so identical dimensions always quote the same price. Any other size is area × rate. The category comes from `sukla.construction` (fallback `sukla.technique`; jute material only when both are empty). Unmapped or machine-made values hide the calculator. Custom sizes are not Shopify variants and are never added to the cart. The shopper gets a USD estimate and a "Get a Quote" WhatsApp link (`whatsappUrl()` from `src/lib/contact.ts`) with a prewritten message, and the team confirms the final price and lead time there. Alternatives considered: Shopify variants per custom size (rejected: unbounded sizes) and a Shopify metaobject for the rate table (not requested; the owner chose website code). Consequence: price changes require a code deploy, and the Shopify theme has no equivalent calculator. A theme port would need the same table, either copied or moved to a metaobject.
