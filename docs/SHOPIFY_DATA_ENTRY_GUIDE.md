# Shopify data entry guide for SUKLA RUGS

This guide covers what to fill in, what to leave blank, and what to avoid when you add a product, a collection or anything else in Shopify Admin. It reflects how the Next.js site in `src/` reads your store today. It is not a general Shopify guide.

**Key legend**
- **MUST**: the product or page looks broken or incomplete without it.
- **SHOULD**: the site uses it, or a menu filter depends on it.
- **OPTIONAL**: shown only when filled.
- **BLANK**: leave empty unless you really have the data.

## Golden rules

1. **Blank beats guessed.** The site hides any empty field. It never invents values, so a wrong value is worse than an empty one.
2. **No claims you cannot prove.** That covers certificates, free shipping, dispatch times, ratings and reviews. Do not put these in descriptions or metafields unless they are true and you can stand behind them.
3. **Use the exact spelling from the lists below.** Menu filters match text. "Hand-Knotted" and "Hand Knotted" are different values.
4. **One product per design and colour.** Put sizes inside the product as variants.
5. **Prices are in USD.** Shopify currently prices every country in USD. The site shows approximate local prices, but checkout charges USD.

## 1. Product template

### Product page fields

| Shopify field | Level | What to enter | What the site does with it |
|---|---|---|---|
| **Title** | MUST | A short, readable name followed by the size, for example `Hand Tufted Wool Area Rug (2.6x10 ft)`. Aim for under about 60 characters. | Shown as the page title. If the title is long and contains ` \| `, ` - `, ` – ` or `, ` after about 20 characters, the site cuts it there for display. The site also reads a size like `(2.6x10 ft)` out of the title and shows it as "Listed size". Write it as `LxW ft`. |
| **Description** | MUST | Use a bullet list. Write each bullet as `Lead-in - detail`, for example `Soft underfoot - dense wool pile`. Only claim things that are true of this rug. | The bullets become the "About" feature list. If you leave the short description empty, the first bullet's text becomes the line under the title. Plain paragraphs also work, but they show as one block. |
| **Media** | MUST | At least 3 images. The first image is the main one. Add alt text describing the rug. | The gallery. If a variant has its own image, choosing that variant switches the gallery. |
| **Status** | MUST | Active | Draft products do not appear on the site. |
| **Price** | MUST | Price in USD | Shown on the page and cards. |
| **Compare-at price** | OPTIONAL | Only when there is a real previous price | Leave blank otherwise. |
| **SKU** | SHOULD | Your internal code | Shown in the details table. |
| **Product category** | SHOULD | Rugs | Already set on all current products. |
| **Product type** | SHOULD | `Area Rug` or `Runner` | Shown in the details table. Also used for related-product ranking and filter matching. Keep spelling consistent. |
| **Vendor** | SHOULD | `SUKLA RUGS` | Currently "My Store" on every product. The site does not read it; it only affects Shopify Admin and reports. |
| **Tags** | OPTIONAL | Lowercase, no spaces after commas. Useful ones: `bestseller`, `premium`, `shaped`, `runner`. | Used for the Bestseller menu link, related-product ranking and filter matching. Do not tag decoratively. |
| **Collections** | SHOULD | Add to the right collections (section 3) | The first collection's **title** is shown on the product card and in the details table. Name collections the way a shopper should read them. |
| **Weight** | SHOULD | Real weight | Needed for shipping rates later. |
| **Inventory** | MUST | Track quantity and set the real stock. Turn "continue selling when out of stock" **off**. | Out-of-stock rugs show as unavailable. |
| **Options and variants** | See section 2 | | |
| **SEO title and description** | SHOULD | Short and specific to this rug | The Next.js site does not read these fields. Its page title is the product title plus "\| SUKLA RUGS", and its meta description is the start of the product description. Fill them only for Shopify-hosted pages. |
| **URL handle** | MUST | Short, lowercase and hyphenated, for example `hand-tufted-wool-rug-2-6x10` | It becomes `/products/<handle>`. Changing it later breaks existing links. Decide before you publish. |

### Sales channels and markets

- Publish each product to the sales channel that holds your storefront token. Existing products already appear on the site. Check this on every new product.
- Under Markets, make the product available in every country you ship to. Right now 11 countries (BH, CY, HU, LT, LU, LV, MT, RO, SA, SI, SK) cannot buy any product. The site shows "Not available in X" for them.

### Product metafields (namespace `sukla`)

Create each definition once in Settings, then Custom data, then Products. Turn on **Storefront access** for every one. Then fill them per product.

| Metafield | Type | Level | Allowed values | Notes |
|---|---|---|---|---|
| `sukla.style` | List of single line text | SHOULD | Traditional, Modern, Contemporary, Abstract, Minimalist, Neutral | A rug can have several. Drives the Style menu. |
| `sukla.palette` | List of single line text | SHOULD | Neutral, Ivory, Beige, and your other colour names | Style filters also match here, so a Neutral rug works either way. |
| `sukla.room` | List of single line text | SHOULD | Living Room, Bedroom, Dining Room | Drives the Room menu. |
| `sukla.construction` | Single line text | MUST | Hand Knotted, Hand Tufted, Hand Woven, Handloom | Drives the Construction menu. Also fill `sukla.technique` with the same value, because the cards and the specifications table currently read `technique`. |
| `sukla.technique` | Single line text | MUST | Same as construction | Shown as "Construction" in specifications and on cards. |
| `sukla.material` | Single line text | MUST | Wool, Silk, Jute. For a blend, write `Wool, Silk`. | Do not make this a list. Cards and specifications print the raw text. |
| `sukla.shape` | Single line text | SHOULD | Rectangular, Round, Irregular (Oval or Scalloped also count as shaped) | Round matches Round Rugs. Anything else except Rectangular, Square or Round matches Shaped Rugs. |
| `sukla.rug_format` | Single line text | SHOULD | Area Rug, Runner | Drives the Runners link. |
| `sukla.premium` | True or false | OPTIONAL | true | Set to true only for premium pieces. Leave blank otherwise. |
| `sukla.short_description` | Single line text | OPTIONAL | One sentence, under about 170 characters | Overrides the automatic line under the title. Do not repeat the title. |
| `sukla.color_family` | Single line text | OPTIONAL | For example `Ivory` | Shown in specifications and used by the colour filter. |
| `sukla.origin_region` | Single line text | OPTIONAL | For example `Bhadohi, India` | Specifications. |
| `sukla.pile_height` | Single line text | OPTIONAL | Write it as shoppers should read it, for example `12 mm` | Specifications. |
| `sukla.weight` | Single line text | OPTIONAL | For example `3.2 kg` | Specifications. |
| `sukla.knots_per_sq_inch` | Single line text | BLANK unless real | Real figure only | Specifications. |
| `sukla.craft_duration` | Single line text | BLANK unless real | For example `6 weeks` | Specifications. |
| `sukla.care_instructions` | Multi-line text | OPTIONAL | Real care steps for this rug | Shown in the Care section above the link to the rug care guide. |
| `sukla.product_story` | Multi-line text | OPTIONAL | A real story about this piece | Shown in the About section. |

I did not check how the page formats number-type metafields, so use single line text for the numeric ones.

## 2. Variant scenarios

| Scenario | What to do |
|---|---|
| **One rug, one size** | No options. Leave the default variant, and put the size in the title as `(LxW ft)`. |
| **Same design, several sizes** | One product with one option called `Size`. Use values like `2.6x8 ft`. Give each size its own price, SKU and stock. |
| **Same design, several colours** | Make separate products. The page uses only the first option's name as its label, and I have not tested products with two options. |
| **Runner** | Product type `Runner`, `sukla.rug_format` = Runner, and the size in the title. |
| **Round or shaped rug** | `sukla.shape` = Round or the shape name. Do not use Rectangular. |
| **Premium piece** | `sukla.premium` = true. Do not tag it premium unless you want it to appear that way in other filters. |
| **Bestseller** | Tag `bestseller`, or add it to a collection whose handle is `bestseller`. |
| **On sale** | Set the compare-at price to the real previous price. |
| **Out of stock** | Keep it Active with stock 0 so the page stays live. |
| **Made to order or custom** | Do not promise lead times in the description unless they are true. If you want them, put the real figure in `sukla.craft_duration`. |
| **Not ready to show** | Set Status to Draft. |

## 3. Collection template

| Field | Level | What to enter |
|---|---|---|
| **Title** | MUST | The name a shopper should see. The first collection's title appears on product cards. |
| **Handle** | MUST for the menu | The Area Rugs links use these exact handles: `bestseller`, `runners`, `premium-rugs`, `round-rugs`, `shaped-rugs`. If a handle does not exist, the site falls back to matching product tags and titles. |
| **Description** | SHOULD | One or two true sentences. |
| **Image** | SHOULD | A representative rug photo. |
| **Type** | SHOULD | Automated, with conditions. Use `Tag is equal to bestseller`. For metafield conditions (for example `sukla.rug_format` is Runner), enable the metafield definition for collection conditions first. |
| **Sales channel** | MUST | Available to the same channel as your products. |

The existing `frontpage` collection is titled "Home page" and shows as a badge on product cards. Do not rename or delete it until we decide how the homepage should use it.

## 4. Other Shopify areas

| Area | What to do |
|---|---|
| **Policies** (Settings, then Policies) | Add Shipping and Refund policies. The product page shows a "Shipping & returns" section only when a real policy exists. None exist now. |
| **Markets and currency** | Currently every country is priced in USD. Enable local-currency Markets if you want exact local checkout prices. |
| **Navigation menus** | The site header is written in code, not read from Shopify menus. Editing Shopify menus changes the Shopify theme only. Ask me to change the Next.js menu. |
| **Pages and blog** | I did not check whether the site reads Shopify pages or the blog. Treat them as unconnected until verified. |
| **Customers and reviews** | The site does not show ratings or reviews. Do not add any. |

## 5. Pre-publish checklist

- [ ] Title is short, with the size as `(LxW ft)`
- [ ] Description is a bullet list of true statements
- [ ] At least 3 images, with alt text
- [ ] Price in USD, stock set, "continue selling" off
- [ ] Product type, vendor and category set
- [ ] Metafields filled only where the value is real, spelled exactly as listed
- [ ] In the correct collections
- [ ] Available in all the markets you ship to, and published to the storefront sales channel
- [ ] URL handle final
- [ ] Status set to Active
- [ ] Opened the live page on the site to check it
