# Shopify data entry guide for SUKLA RUGS

This guide covers what to fill in, what to leave blank, and what to avoid when you add a product, a collection or anything else in Shopify Admin. It reflects how the Next.js site in `src/` reads your store today. It is not a general Shopify guide. The reason behind each item is in `SHOPIFY_DATA_ENTRY_REASONS.md`.

**Key legend**
- **MUST**: the product or page looks broken or incomplete without it.
- **SHOULD**: the site uses it, or a menu filter depends on it.
- **OPTIONAL**: shown only when filled.
- **BLANK**: leave empty unless you really have the data.

## The schema contract (read this first)

> Namespace, keys, types, collection handles and matching values in this guide must match the storefront code exactly. Changing any of them needs a coordinated code and data update. Do not rename a metafield, change its type, or rename a menu collection handle in Shopify on its own.

The source of truth is the Next.js code in `src/`, not any suggestion made elsewhere. For example, the namespace is `sukla` (not `custom`), and the Bestseller handle is `bestseller` (singular).

## Golden rules

1. **Blank beats guessed.** The site hides any empty field. It never invents values, so a wrong value is worse than an empty one.
2. **No claims you cannot prove.** That covers certificates, free shipping, dispatch times, ratings and reviews. Do not put these in descriptions or metafields unless they are true and you can stand behind them.
3. **Use the exact spelling from the lists below.** Menu filters match text. "Hand-Knotted" and "Hand Knotted" are different values.
4. **One product per design and colour.** Put sizes inside the product as variants.
5. **Prices are in USD.** Shopify prices every country in USD (observed 2026-10-16). The site shows approximate local prices, but checkout charges USD.
6. **Pick one source of truth per fact.** Where two fields hold related information, section 1 says which one is authoritative.

## 1. Product template

### Product page fields

| Shopify field | Level | What to enter | What the site does with it |
|---|---|---|---|
| **Title** | MUST | A short, readable name, under about 60 characters. For a rug sold in **one size only**, end with the size, for example `Hand Tufted Wool Area Rug (2.6x10 ft)`. For a rug sold in **several sizes**, do **not** put a size in the title; use the Size option values instead. | Shown as the page title. The site reads a size like `(2.6x10 ft)` from the title and shows it as "Listed size", exactly as written and without converting units. It only recognises `length x width` with `ft`, `feet`, `foot` or `'`. A round rug such as `Round 6 ft` shows no "Listed size" row, so write its diameter in the title or option value and accept that. |
| **Description** | MUST | Use a bullet list. Write each bullet as `Lead-in - detail`, for example `Soft underfoot - dense wool pile`. Only claim things that are true of this rug. | The bullets become the "About" feature list. If you leave the short description empty, the first bullet's text becomes the line under the title. Plain paragraphs also work, but they show as one block. |
| **Media** | MUST | At least 3 images. The first image is the main one. Add alt text describing that view. | The gallery. If a variant has its own image, choosing that variant switches the gallery. A blank alt text falls back to the product title. |
| **Status** | MUST | Active | Draft products do not appear on the site. |
| **Price** | MUST | Price in USD | Shown on the page and cards. |
| **Compare-at price** | OPTIONAL | Only when there is a real previous price | Leave blank otherwise. |
| **SKU** | SHOULD | Your internal code | Shown in the details table. |
| **Product category** | SHOULD | Rugs | Already set on all current products. |
| **Product type** | SHOULD | `Area Rug` or `Runner` | Shown in the details table. Used for related-product ranking. Keep it consistent with `sukla.rug_format` (see the metafield table). |
| **Vendor** | SHOULD | `SUKLA RUGS` | Currently "My Store" on every product (observed 2026-10-16). The site does not read it; it only affects Shopify Admin and reports. |
| **Tags** | OPTIONAL | Lowercase. Useful ones: `bestseller`, `premium`, `shaped`, `runner`. | Used for the Bestseller menu link, related-product ranking and filter matching. Do not tag decoratively. |
| **Collections** | SHOULD | Add to the right collections (section 3) | The first collection's **title** is shown on the product card and in the details table. Name collections the way a shopper should read them. |
| **Weight (shipping weight)** | SHOULD | Real weight | Used by Shopify for shipping rates. The site does not read it. It is separate from the display metafield `sukla.weight`. |
| **Inventory** | MUST | Enable inventory tracking for stocked variants, enter the actual available quantity at the right location, and turn **Continue selling when out of stock** off. | Out-of-stock rugs show as unavailable. Made-to-order rugs are a separate, deliberate selling policy (see section 2). |
| **Options and variants** | See section 2 | | |
| **SEO title and description** | OPTIONAL | Short and specific to this rug | The Next.js site does not read these fields. Its page title is the product title plus "\| SUKLA RUGS", and its meta description is the start of the product description. Fill them only for Shopify-hosted pages. |
| **URL handle** | MUST | Short, lowercase and hyphenated, for example `hand-tufted-wool-rug` | It becomes `/products/<handle>`. Do not change it after publishing (see the redirect note in section 6). |

### Sales channels and markets

- Publish each product to the sales channel that holds your storefront token. Existing products already appear on the site. Check this on every new product.
- Under Markets, make the product available in every country you ship to. As observed on 2026-10-16, 11 countries (BH, CY, HU, LT, LU, LV, MT, RO, SA, SI, SK) cannot buy any product. The site shows "Not available in X" for them.

### Product metafields (namespace `sukla`)

Create each definition once in Settings, then Custom data, then Products. Turn on **Storefront access** for every one. Then fill them per product.

| Metafield | Type | Level | Allowed values | Notes |
|---|---|---|---|---|
| `sukla.style` | List of single line text | SHOULD | Traditional, Modern, Contemporary, Abstract, Minimalist, Neutral | A rug can have several. Drives the Style menu. |
| `sukla.palette` | List of single line text | SHOULD | Neutral, Ivory, Beige, and your other colour names | **Preferred home for Neutral**, because Neutral is a colour, not a design style. The Style menu matches both `style` and `palette`, so a Neutral rug works either way. Putting Neutral in `sukla.style` is a compatibility option only. |
| `sukla.room` | List of single line text | SHOULD | Living Room, Bedroom, Dining Room | Drives the Room menu. |
| `sukla.construction` | Single line text | MUST | Hand Knotted, Hand Tufted, Hand Woven, Handloom | **The source of truth for construction.** Drives the Construction menu, the product cards and the "Construction" specification row. |
| `sukla.technique` | Single line text | BLANK | Same as construction | Old compatibility field. The site uses it only when `construction` is empty. You do not need to fill both. |
| `sukla.material` | Single line text | MUST | Wool, Silk, Jute. For a blend, write `Wool, Silk`. | Keep it single text. A blend is one text value, not two separate materials; the filter finds "wool" inside it by matching text. Do not change this to a list until the storefront code that reads and filters it has been updated. |
| `sukla.shape` | Single line text | SHOULD | Rectangular, Round, Irregular (Oval or Scalloped also count as shaped) | See the collection rules in section 3. |
| `sukla.rug_format` | Single line text | SHOULD | Area Rug, Runner | **The source of truth for runner or area rug.** Drives the Runners link. Keep product type consistent with it, but the filter uses this field. |
| `sukla.premium` | True or false | OPTIONAL | true | Set to true only for premium pieces. Leave blank otherwise. |
| `sukla.short_description` | Single line text | OPTIONAL | One sentence, under about 170 characters | Overrides the automatic line under the title. Do not repeat the title. |
| `sukla.color_family` | Single line text | OPTIONAL | For example `Ivory` | Shown in specifications and used by the colour filter. |
| `sukla.origin_region` | Single line text | OPTIONAL | For example `Bhadohi, India` | Specifications. |
| `sukla.pile_height` | Single line text | OPTIONAL | Write it as shoppers should read it, for example `12 mm` | Specifications. |
| `sukla.weight` | Single line text | OPTIONAL | For example `3.2 kg` | Display value in specifications. Not the shipping weight. |
| `sukla.knots_per_sq_inch` | Single line text | BLANK unless real | Real figure only | Specifications. |
| `sukla.craft_duration` | Single line text | BLANK unless real | For example `6 weeks` | Specifications. |
| `sukla.care_instructions` | Multi-line text | OPTIONAL | Real care steps for this rug | Shown in the Care section above the link to the rug care guide. |
| `sukla.product_story` | Multi-line text | OPTIONAL | A real story about this piece | Shown in the About section. |

I did not check how the page formats number-type metafields, so use single line text for the numeric ones.

## 2. Variant scenarios

| Scenario | What to do |
|---|---|
| **One rug, one size** | No options. Leave the default variant, and put the size in the title as `(LxW ft)`. |
| **Same design, several sizes** | One product with one option called `Size`. Use values like `2.6x8 ft` or `Round 6 ft`. Give each size its own price, SKU and stock. Do not put one size in the title. |
| **Same design, several colours** | Make separate products. The page uses only the first option's name as its label, and products with two options have not been tested. |
| **Runner** | Product type `Runner` and `sukla.rug_format` = Runner. |
| **Round rug** | `sukla.shape` = Round. Write the diameter in the title or option value. |
| **Irregular, oval or scalloped rug** | `sukla.shape` = Irregular, Oval or Scalloped. Do not use Rectangular. |
| **Premium piece** | `sukla.premium` = true. |
| **Bestseller** | Tag `bestseller`, or add it to a collection whose handle is `bestseller`. This is a curated selection, not an automatically calculated sales ranking. |
| **On sale** | Set the compare-at price to the real previous price. |
| **Out of stock** | Keep it Active with stock 0 so the page stays live. |
| **Made to order or custom** | Treat this as its own selling policy, not the stocked-product rule. Decide deliberately how it is sold (for example, whether it is purchasable at zero stock). Do not promise lead times unless true; if you state one, put the real figure in `sukla.craft_duration`. |
| **Not ready to show** | Set Status to Draft. |

### Measurements: decide what "2.6" means

Existing listings write sizes like `2.6x10 ft`. The site shows this exactly as typed and does no unit conversion, because `2.6 ft` could mean 2.6 decimal feet or 2 feet 6 inches. Decide one convention for the whole catalogue and write it down:

- If you mean 2 feet 6 inches, `2.5 ft` is the decimal-feet equivalent.
- If you mean 2.6 decimal feet, `2.6 ft` is already right.

Do not mix the two conventions across products.

## 3. Collection template

| Field | Level | What to enter |
|---|---|---|
| **Title** | MUST | The name a shopper should see. The first collection's title appears on product cards. |
| **Handle** | MUST for the menu | The Area Rugs links use these exact handles: `bestseller`, `runners`, `premium-rugs`, `round-rugs`, `shaped-rugs`. |
| **Description** | SHOULD | One or two true sentences. |
| **Image** | SHOULD | A representative rug photo. |
| **Type** | SHOULD | Automated, with conditions. For metafield conditions, enable the metafield definition for collection conditions first. |
| **Sales channel** | MUST | Available to the same channel as your products. |

### Intended collection rules

When a collection with the handle below exists in Shopify, **its membership is used**. If it does not exist, the site falls back to the matching rule shown. If you create the collection, make its conditions mirror this table.

| Handle | Intended membership |
|---|---|
| `bestseller` | Curated: tag `bestseller`, or products you add by hand |
| `runners` | `sukla.rug_format` equals Runner |
| `premium-rugs` | `sukla.premium` equals true |
| `round-rugs` | `sukla.shape` equals Round |
| `shaped-rugs` | `sukla.shape` is anything other than Rectangular, Square or Round (for example Irregular, Oval, Scalloped) |

Round and Shaped are kept separate, matching the menu. The existing `frontpage` collection is titled "Home page" and shows as a badge on product cards. Do not rename or delete it until we decide how the homepage should use it.

## 4. Other Shopify areas

| Area | What to do |
|---|---|
| **Policies** (Settings, then Policies) | Add Shipping and Refund policies. The product page shows a "Shipping & returns" section only when a real policy exists. None existed on 2026-10-16. |
| **Markets and currency** | Every country was priced in USD on 2026-10-16. Enable local-currency Markets if you want exact local checkout prices. |
| **Navigation menus** | The site header is written in code, not read from Shopify menus. Editing Shopify menus changes the Shopify theme only. |
| **Pages and blog** | Not verified whether the site reads Shopify pages or the blog. Treat them as unconnected until checked. |
| **Customers and reviews** | The site does not show ratings or reviews. Do not add any. |

## 5. Current storefront limitations

These are properties of the custom Next.js site, not Shopify requirements. They describe the code as of the commit that added this guide.

- **Title cutting.** A title with ` | `, ` - `, ` – ` or `, ` more than about 20 characters in is cut at that point for display.
- **Description parsing.** Bullets are read from the product's HTML list items. Plain paragraphs show as one block.
- **Collection badge.** The first collection's title is shown as a label on cards.
- **Single option label.** Only the first option's name labels the picker. Products with two options are untested.
- **Product loading limit.** The site loads up to 25 products per request and applies the menu filters to what it loaded. With a large catalogue, filters would miss products beyond that limit. This needs a code change (server-side filters or pagination) before the catalogue passes about 25 products.
- **No exact stock counts.** The site cannot read exact quantities because the API token lacks the inventory permission.
- **No redirects.** No redirects are configured in the Next.js app. A redirect added in Shopify is not applied by this site.

## 6. After saving: test before you rely on it

1. Open the Storefront API result for the product (or the live page) and confirm the metafields you filled actually appear. A definition without Storefront access returns nothing.
2. Reload the live product page. The pages are rendered on demand today, so changes should appear without a rebuild, but I have not measured any caching in front of the Storefront API. If a change does not show, wait a few minutes and reload, then ask me to check.
3. Test the menu filters with a product that matches, one that does not, and one with the value missing. For materials, test a blend such as `Wool, Silk` under both Wool and Silk.
4. If you ever change a product handle, add a redirect on the Next.js side. Ask me; do not rely on a Shopify redirect.

## 7. Pre-publish checklist

- [ ] Title is short; the size appears as `(LxW ft)` only for single-size products
- [ ] Description is a bullet list of true statements
- [ ] At least 3 images, with alt text
- [ ] Price in USD; inventory tracking on, quantity entered, "continue selling" off (unless made to order by choice)
- [ ] Product type, vendor and category set
- [ ] Metafields filled only where the value is real, spelled exactly as listed
- [ ] In the correct collections
- [ ] Available in all the markets you ship to, and published to the storefront sales channel
- [ ] URL handle final
- [ ] Status set to Active
- [ ] Opened the live page on the site to check it
