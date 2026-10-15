# Implementation Plan — Shukla Rugs Horizon Storefront

Scope: edit ONLY files under `c:\Users\yashs\Downloads\shuklarugsv1\shopify-live-horizon`. `src/` (Next.js) and `shopify-theme/` are READ ONLY. Never run `shopify theme push`/`publish`. Live theme #188131279037 must not be touched.

## Grounding findings (verified by reading source)

- `templates/index.json` already has a customized `hero` block (`<p>Rugs for Every Space</p>`, "Explore Collections" -> `shopify://collections/all`, full-width, large, overlay) and a `product-list` "Featured Loom Releases" (collection `all`, carousel, 8 products, "View all"). PRESERVE both; only append new sections after them.
- `config/settings_data.json` confirmed: `color_palette` background `#FAF7F2`, foreground `#211D1B`, color1 `#A8917E`, color2 `#E6DDD4` in BOTH `current` and `presets.Horizon`; heading/subheading/accent = Jost, body = Inter; `page_width: wide`. REUSE `{{ settings.color_palette.* }}` and `var(--font-heading--family)` / `var(--font-body--family)`. Terracotta `#BC8A5A` is a literal accent only.
- Horizon is a stock Online Store 2.0 theme. Sections are composed in JSON templates from block trees; the authoring pattern is to copy a section preset's block structure (see `presets` in `sections/collection-list.liquid`, `sections/media-with-content.liquid`) into `templates/index.json` with Shukla settings. Prefer adding sections via JSON over writing new `.liquid` sections.
- Reusable sections confirmed present: `collection-list.liquid` (grid/carousel/bento/editorial via `_collection-card`), `collection-links.liquid`, `media-with-content.liquid` (`_media-without-appearance` + `_content-without-appearance` with text/group/button blocks), `section.liquid` (generic centered content container accepting text/button/image/divider blocks), `featured-blog-posts.liquid` (bound to a `blog` setting; renders empty placeholders when blog is blank), `marquee.liquid`, `product-recommendations.liquid`, `divider.liquid`, `slideshow.liquid`.
- `templates/collection.json` already renders: an editorial `section` header (h1 title + rte description bound to `closest.collection.*`) and `main-collection` with a static `filters` block (`enable_filtering`, `enable_sorting`, `enable_grid_density`, horizontal filter style) and `_product-card` (image_ratio `adapt`, title, price). `sections/main-collection.liquid` uses `<results-list>` with `infinite-scroll` or `products_per_page` pagination and native `collection.filters`. Most collection work is editorial/typography/card tuning, NOT building filtering from scratch.
- `templates/product.json` already renders `product-information` with `_product-media-gallery` (carousel, thumbnails, zoom, `aspect_ratio: adapt`, `media_fit: contain`), product title (h1), price, `variant-picker` (buttons), `buy-buttons` (quantity + add-to-cart + accelerated-checkout, sticky add-to-cart enabled), product description, a `disclosures` block, and a `product-recommendations` section (related, 4 products). Variant/price/cart/checkout are native and already wired.
- Shopify CLI 4.8.4 present; `shopify theme check` available. Git branch `main`.

## Data dependencies (REAL data required; fabrication forbidden)

The Next.js reference uses hardcoded Unsplash imagery and `MOCK_REVIEWS` / `MOCK_JOURNAL_ARTICLES`. These MUST NOT be copied as production data. For each homepage section, bind to real Shopify objects; when the object does not exist in the store, expose a merchant-editable picker/empty state with NO fabricated default claim.

| Section | Real data source | Fallback when absent |
|---|---|---|
| Shop by Room | merchant-selected collections OR image+link blocks (merchant uploads) | `collection-list` with empty `collection_list` renders Horizon placeholder cards; label the setting so merchant picks collections. No invented room copy baked as claims. |
| Shop by Category/Construction | real collections (Hand-Knotted / Hand-Tufted / Hand-Woven / Hand-Woven Jute) via `collection_list` picker | empty picker -> placeholder cards; do NOT hardcode handles that may not exist. **needs verification during implementation**: whether these collections exist in the connected store. |
| Bhadohi Story | `media-with-content` with merchant image + rich text | editorial brand voice allowed; numeric claims ("1,200,000 knots / 16 weeks") OMITTED unless merchant enters them. |
| Brand Statement | `section` rich-text (static editorial copy, no stats) | n/a (pure editorial copy, no claims) |
| Design Consultation | CTA button -> real contact/consultation page. `templates/page.contact.json` exists (`page.contact`). | **needs verification during implementation**: real page handle. Default link `shopify://pages/contact`; expose as merchant-editable link setting. No fabricated service promises. |
| Reviews / Social Proof | ONLY a real review app metafield/metaobject source | **No such source confirmed.** OMIT by default OR add a merchant-editable, empty-by-default testimonial `section` with zero fabricated reviews/ratings. Record as data dependency. |
| Journal | `featured-blog-posts` bound to a real `blog` | blog unset -> section renders placeholders; keep blog picker empty so merchant binds the real blog. **needs verification during implementation**: whether a blog exists. |
| Final CTA | `section` with button -> `shopify://collections/all` | n/a |
| Product metafields (material/construction/dimensions/care/origin/story) | `product.metafields.*` | **No namespace confirmed.** Render each detail row only `{% if product.metafields... != blank %}`; omit entirely when absent. No invented values. |
| Compare-at price | native `variant.compare_at_price` | shown only when genuinely set (native price block already handles this). |
| Shipping/returns | real store `shop.policies` / policy pages | link only if policy exists; otherwise omit. |

## Ordered implementation sequence

Each item leaves the theme JSON-valid and Theme-Check-clean for introduced errors.

- [ ] 1. Homepage — Shop by Room + Shop by Category/Construction.
      Append two `collection-list` sections to `templates/index.json` after `product_list_fa6P9H`. Replicate the `collections_grid`/`collections_editorial` preset block tree from `sections/collection-list.liquid`; set heading text block to Jost (`var(--font-heading--family)`), small uppercase eyebrow via a `text` block, `background_color` using `{{ settings.color_palette.* }}`, generous `padding-block-*` (~64-80). Leave `collection_list` as an empty merchant picker (room section) and real construction collections if present. Copy: "Shop by Space & Scale", "Shop by Collection"/construction types.
      Files: `templates/index.json`
      Verify: `shopify theme check` reports no new errors; `python -c "import json,re"` JSON parse of index.json (strip leading comment block) succeeds. Confirm `order` array lists the new section ids.

- [ ] 2. Homepage — Bhadohi Story + Design Consultation.
      Append two `media-with-content` sections (replicate the `editorial` preset block tree) to `templates/index.json`. Bhadohi uses dark `background_color` `{{ settings.color_palette.foreground }}` with light text, merchant image, Jost heading, rte body (no numeric claims). Design Consultation uses a CTA `button` block linking to `shopify://pages/contact` (merchant-editable), terracotta `#BC8A5A` accent eyebrow.
      Files: `templates/index.json`
      Verify: `shopify theme check` no new errors; JSON parses; both section ids present in `order`.

- [ ] 3. Homepage — Brand Statement + Final CTA + Journal.
      Append a centered `section` (Brand Statement: eyebrow text + large Jost display quote + rte paragraph, no stats), a `featured-blog-posts` section (Journal; `blog` left as merchant picker, heading "Stories on Craft & Materiality"), and a final centered `section` CTA (large heading + button -> `shopify://collections/all`). Match Next.js order: Brand Statement and Journal are separated by Design Consultation per `src/app/page.tsx`; final CTA last.
      Files: `templates/index.json`
      Verify: `shopify theme check` no new errors; JSON parses; `order` matches intended visual order: hero, product-list, shop-by-room, shop-by-category, bhadohi, brand-statement, design-consultation, reviews(if added), journal, final-cta.

- [ ] 4. Homepage — Reviews/Social Proof data-safe section.
      Add a merchant-editable, empty-by-default testimonial `section` (or OMIT). Use `blocks/review.liquid` if it binds to a real source; otherwise provide `text` blocks the merchant fills manually with NO default review/rating/testimonial text. Document in findings that no verified review source exists.
      Files: `templates/index.json` (and reference `blocks/review.liquid` read-only to decide)
      Verify: `shopify theme check` no new errors; JSON parses; no fabricated review strings present (grep index.json for star/rating literals returns none).

- [ ] 5. Collection page — editorial header + typography + card ratio tuning.
      In `templates/collection.json`: keep native `filters` (sorting, filtering, grid density) and `_product-card`. Tune the header `section` text blocks to Jost display h1 + small uppercase eyebrow + rte description; set `_product-card-gallery` `image_ratio` to a rug-appropriate value (keep `adapt` to preserve aspect; do NOT force-crop). Ensure product card title uses Jost, price uses Inter tabular. Confirm active-filter/clear-filter and product count come from native `filters` block (they do — `blocks/filters.liquid`). Preserve collection URLs.
      Files: `templates/collection.json`
      Verify: `shopify theme check` no new errors; JSON parses; `filters` block still has `enable_filtering`/`enable_sorting` true.

- [ ] 6. Product page — gallery ratio, detail disclosures from real metafields, related products.
      In `templates/product.json`: keep native gallery (`media_fit: contain`, `aspect_ratio: adapt` — preserves rug proportions, do not change to crop). Keep variant-picker, buy-buttons (qty + add-to-cart + accelerated checkout), description. Replace/extend the `disclosures` block with accordion rows for Material/Construction/Dimensions/Care/Origin/Story, each guarded so it renders ONLY when the corresponding `product.metafields.*` exists (custom-liquid or product-custom-property block). Add shipping/returns disclosure linking real policy only if present. Keep `product-recommendations` (related). Tune title (h1 Jost) and price typography.
      Files: `templates/product.json` (optionally a small `snippets/shukla-product-details.liquid` if metafield guards need Liquid logic beyond JSON block settings)
      Verify: `shopify theme check` no new errors; JSON parses; no hardcoded metafield values; variant-picker + buy-buttons blocks intact.

- [ ] 7. Final validation pass.
      Run `shopify theme check` once over the whole theme; fix ONLY errors introduced by edits 1-6 (ignore pre-existing warnings). Validate all modified JSON templates parse. Optionally confirm `shopify theme dev` can boot (needs store auth — mark "needs verification during implementation" if auth unavailable; do NOT push).
      Files: none (validation only)
      Verify: `shopify theme check` introduced-error count is zero; record pre-existing warning baseline.

## Notes / assumptions
- Brand name is exactly "Shukla Rugs" everywhere (Next.js metadata says "SUKLA RUGS" — do NOT copy that typo).
- All new sections are merchant-editable via theme editor (settings exposed through reused section schemas; no new schema needed if only JSON composition is used).
- If any reused section cannot express a required layout purely via JSON, create a minimal new section under `sections/` rather than hardcoding data — recorded per-item above.
- Collection/product native commerce (filters, sorting, variants, cart, checkout, recommendations) is PRESERVED, not rebuilt.
