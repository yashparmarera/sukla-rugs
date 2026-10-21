# Why each Shopify field is filled or left blank

This is the companion to the data entry guide. For every item in that guide it explains the reason behind the fill or leave-blank advice, and what goes wrong if you get it wrong.

**How each reason is sourced**
- **[Code]**: I checked this in the repo's `src/` code.
- **[Shopify]**: standard Shopify behaviour. I did not test it on your store.
- **[Judgment]**: my recommendation, not a technical requirement.

## Three corrections to the first guide

I checked the code again while writing this and found three things the first guide stated too loosely.

1. **SEO title and description do not reach the Next.js site. [Code]** The product page builds its browser title as `<product title> | SUKLA RUGS` and takes its meta description from the product description. The Shopify SEO fields only affect Shopify-hosted pages. For this site, the **title** and the **first part of the description** decide how you look on Google and in link previews.
2. **Vendor is not read by the site. [Code]** The product query does not fetch it. Setting it is still useful inside Shopify (reports, filtering in Admin), but it has no effect on the storefront.
3. **A blank image alt text used to become a generic phrase. [Code]** The product mapper replaced an empty alt text with "SUKLA RUGS Handcrafted Textile", so the product-title fallback in the page never ran. This is now fixed: a blank alt stays empty and each component falls back to its own title. Writing real alt text is still better for screen-reader users.

## 1. The five golden rules

| Rule | Why |
|---|---|
| **Blank beats guessed** | The site is built so an empty field simply disappears. The specifications table, the details table and the feature list all filter out empty values. [Code] A wrong value does the opposite: it is shown to shoppers and matched by filters as if it were true. |
| **No claims you cannot prove** | Earlier in this project I removed a fake 4.9 rating, an "Authentic Bhadohi Certificate" claim, a free-shipping claim and a "Ready for Dispatch" claim that were hard-coded as defaults. The rule is to show only store data. Anything you type in a description or metafield is shown as fact, and it creates a legal and trust risk if it is untrue. [Judgment] |
| **Use the exact spelling from the lists** | Menu filters compare text. `Hand Knotted` matches the Construction link, `Hand-Knotted` may not. List metafields are compared case-insensitively, but not spelling or hyphenation. [Code] |
| **One product per design and colour** | The product page labels its option picker using only the first option's name. Products with two options (Size and Colour) were not tested. Separate products also let each colour have its own photos, handle and description. [Code, Judgment] |
| **Prices are in USD** | All 36 countries are priced in USD in Shopify Markets today. The site shows approximate local prices with a "≈" and discloses the exact USD charge. Entering a price in another currency would be charged as dollars. [Code, Shopify] |

## 2. Product page fields

| Field | Decision | Why | If wrong |
|---|---|---|---|
| **Title** | Fill: short, with size as `(LxW ft)` | It is the page heading, the browser tab title and the link-preview title. [Code] The site reads a size like `2.6x10 ft` from the title to build the "Listed size" row. [Code] A title with ` \| `, ` - `, ` – ` or `, ` more than about 20 characters in is cut at that point for display, and the full title is kept elsewhere. [Code] | A long keyword-stuffed title looks cluttered even with the cut, and the size may not be found if you write it differently. |
| **Description** | Fill: bullet list of true statements | The site reads each bullet from the product's HTML description and turns it into the "About" feature list. [Code] The first bullet's body becomes the short line under the title when you do not set `sukla.short_description`. [Code] The description text is also the page's meta description. [Code] Bullets in the form `Lead-in - detail` give a bold lead-in plus text. [Code] | Plain paragraphs still show, but as one block with no feature list. Pasting from a marketplace can bring in odd formatting. The site shows text only, never the HTML. [Code] |
| **Media** | Fill: 3+ images, first is the main image | The first image is the featured image used on cards, in link previews and as the gallery start. [Code] More images fill the gallery, swipe and zoom. Variant images switch the gallery when that variant is chosen. [Code] | One image makes the page feel thin. A wrong first image is what shoppers and Google see first. |
| **Alt text** | Fill: describe the rug | It is read by screen readers and used when an image fails to load. [Code] A blank alt now falls back to the product title (see correction 3). | A screen-reader user hears the product title for every unlabelled image instead of a description of that view. |
| **Status** | Fill: Active | Draft or archived products are not returned by the Storefront API, so they do not appear on the site. [Shopify] | A product you forgot to activate is invisible. |
| **Price** | Fill: USD | Shown on cards and the page, and used for the cart total. [Code] | Wrong amounts are charged at checkout. |
| **Compare-at price** | Blank unless real | The page shows a struck-through price only when compare-at is higher than the price. [Code] | A made-up "was" price is a misleading discount. Leaving it blank shows only the real price. |
| **SKU** | Fill | Shown in the details table when set. [Code] It is also how you identify the item in orders and stock. [Shopify] | A blank SKU just hides the row. |
| **Product category** | Fill: Rugs | All current products use Rugs. It is Shopify's standard taxonomy field. [Shopify] The site does not read it today. [Code] | No visible effect on the site. It helps Shopify's own search and tax features. |
| **Product type** | Fill: `Area Rug` or `Runner` | Shown in the details table. [Code] Used in related-product ranking and as a source for filter matching, for example "premium" and "runner". [Code] | Inconsistent spelling splits similar rugs apart in the related ranking. |
| **Vendor** | Fill: SUKLA RUGS | Not read by the site (correction 2). It is still shown in Shopify Admin and reports. [Shopify] | It is "My Store" on every product now. Harmless to shoppers, untidy in Admin. |
| **Tags** | Fill only meaningful ones | Used for related-product ranking and as a source for the Bestseller menu link and other filter matching. [Code] | Decorative tags cause products to match filters and related lists they should not. |
| **Collections** | Fill: right ones | The first collection's title is shown on the product card and as the "Collection" row in details. [Code] Menu collection handles also pull products by collection. [Code] | A collection named for internal use (like "Home page") is shown to shoppers as a label. |
| **Weight (Shopify shipping weight)** | Fill: real weight | Used by Shopify to calculate shipping rates at checkout. [Shopify] The site does not read this field. [Code] This is separate from the display metafield `sukla.weight`. | Shipping rates are wrong or missing. |
| **Inventory: track quantity** | Fill: real stock | Shopify marks a variant unavailable at zero stock, and the site shows it as unavailable with a struck-through size button. [Code, Shopify] The site cannot read the exact quantity, because that needs an extra API permission the token lacks. [Code] | Untracked stock stays buyable forever. |
| **Continue selling when out of stock** | Leave off | When on, a variant at zero stock still counts as available. [Shopify] | Shoppers can buy something you cannot ship. |
| **SEO title and description** | Optional | Not read by this site (correction 1). Fill them if you ever use Shopify's own storefront. | None for the Next.js site. |
| **URL handle** | Fill: final before publishing | It becomes `/products/<handle>`. [Code] Changing it later breaks old links, bookmarks and search results unless you add a redirect. [Shopify] | Broken links. |
| **Sales channel** | Fill: storefront channel | The Storefront API token only returns products published to its channel. [Shopify] Existing products appear, which shows the channel is set up. | A product that is Active but not published to the channel is missing from the site. |
| **Markets** | Fill: every country you ship to | The site shows "Not available in X" when a product is not sold in the shopper's country. 11 countries show it today. [Code] | Lost sales in those countries. |

## 3. Product metafields (`sukla.*`)

**Why Storefront access matters for all of them.** The site reads metafields through the Storefront API. A definition without Storefront access returns nothing, even when the product has a value. [Shopify]

**Why blank is correct when unknown.** Specifications and details rows are hidden when empty. Filters only match values that exist. Nothing is filled in on your behalf. [Code]

| Metafield | Decision | Why | If wrong |
|---|---|---|---|
| `sukla.style` | Fill from the list | Drives the Style menu. It is a list, so one rug can be Modern and Minimalist. [Code] | A style not in the list will not match any menu link. |
| `sukla.palette` | Fill with colour names | Style filters also check it, so "Neutral" works as a colour. Neutral is a colour palette more than a design style, which is why it is kept separate. [Code, Judgment] | If left blank, Neutral can only match through `sukla.style`. |
| `sukla.room` | Fill from the list | Drives the Room menu. A list, because one rug suits several rooms. [Code] | A rug missing a room never appears under that room. |
| `sukla.construction` | Fill from the list | Drives the Construction menu and is checked first for construction matching. [Code] | See the next row. |
| `sukla.technique` | Fill with the same value | The specifications table row "Construction" and the product cards read this field, not `construction`. [Code] | Construction is missing on cards and in specifications even though the filter works. |
| `sukla.material` | Fill as single text | Drives the Material menu and shows in specifications and on cards. [Code] It must be plain text. A list would print as `["Wool","Silk"]` on the cards. [Code] | Brackets and quotes appear on the page. |
| `sukla.shape` | Fill from the list | Round Rugs matches `Round`. Shaped Rugs matches any shape other than rectangular, square or round. [Code] | Entering Rectangular for a shaped rug hides it from Shaped Rugs. |
| `sukla.rug_format` | Fill: Area Rug or Runner | Drives the Runners link. [Code] | A runner left blank is only found if its title or tags say "runner". |
| `sukla.premium` | Set `true` only for premium | Premium Rugs matches `true`, or a premium tag or product type. A blank or false value never matches on its own. [Code] | Marking everything premium makes the link meaningless. |
| `sukla.short_description` | Optional | Overrides the automatic line under the title. Capped near 170 characters. [Code] | A repeated title or a very long sentence is cut or dropped. [Code] |
| `sukla.color_family` | Optional | Shown in specifications and used by the colour filter. [Code] | Blank is fine. |
| `sukla.origin_region` | Optional | Shown in specifications. [Code] | Blank is fine. |
| `sukla.pile_height` | Optional | Shown as typed. The site adds no unit. [Code] | A bare number shows without a unit. |
| `sukla.weight` | Optional | Shown as typed in specifications. This is a display value, not shipping weight. [Code] | Confusing it with the Shopify shipping weight. |
| `sukla.knots_per_sq_inch` | Blank unless real | Shown as "Knot density". [Code] | A made-up knot count is a product claim. |
| `sukla.craft_duration` | Blank unless real | Shown as "Craft time". [Code] | A made-up timeline is a delivery promise. |
| `sukla.care_instructions` | Optional | Shown at the top of the Care section, above the link to the care guide. [Code] | Blank leaves only the general guide link. |
| `sukla.product_story` | Optional | Shown in the About section. [Code] | An invented story is a brand and trust risk. |

## 4. Variant scenarios

| Scenario | Why this approach |
|---|---|
| **One rug, one size** | The page ignores Shopify's placeholder variant called "Default Title" and shows no size picker. [Code] The size lives in the title. |
| **Several sizes** | Sizes become buttons labelled with the option name. Each size has its own price, SKU and stock, and the total updates. [Code] |
| **Several colours** | See the golden rule: only the first option's name is used for the label, and two options were not tested. [Code] |
| **Runner** | Gets the Runners link through `rug_format`, and the product type keeps related ranking sensible. [Code] |
| **Round or shaped rug** | `shape` is the only field the Round and Shaped links trust. [Code] |
| **Premium piece** | Use the metafield rather than a tag so the intent is explicit. A tag also works. [Code, Judgment] |
| **Bestseller** | There is no metafield for it. It matches a `bestseller` tag only, or a collection with that handle. [Code] |
| **On sale** | The struck-through price shows only when compare-at is higher than the price. [Code] |
| **Out of stock** | Keep it Active so the page and its links stay live. Shopify marks it unavailable and the site shows it so. [Code, Shopify] Archiving or drafting hides it. |
| **Made to order** | Delivery time is a promise. If you state one, put the real figure in `sukla.craft_duration`. [Judgment] |
| **Not ready** | Draft products never reach the Storefront API. [Shopify] |

## 5. Collection fields

| Field | Decision | Why |
|---|---|---|
| **Title** | Fill: shopper-friendly | It is shown on product cards and in details. [Code] |
| **Handle** | Fill: exact menu handles | The Area Rugs links look up collections by `bestseller`, `runners`, `premium-rugs`, `round-rugs`, `shaped-rugs`. If the handle does not exist, the site falls back to matching tags and titles. [Code] |
| **Description** | Fill: short and true | A line of context for shoppers. [Judgment] |
| **Image** | Fill | The page needs a representative image. [Judgment] |
| **Type: automated** | Use conditions | Products join automatically when tagged or filled in, so you never add them by hand. A metafield condition needs the definition enabled for collection conditions first. [Shopify] |
| **Sales channel** | Fill | A collection not published to the storefront channel does not return products. [Shopify] |
| **`frontpage` collection** | Leave alone | It is titled "Home page" and shows as a badge on cards. Changing it changes what shoppers see, so we should decide the homepage approach together. [Code] |

## 6. Other areas

| Area | Why |
|---|---|
| **Policies** | The "Shipping & returns" section on the product page appears only when a real policy exists in Shopify. None are set, so nothing shows. [Code] Writing your own text is a legal commitment, so use real terms. |
| **Markets and currency** | Everything is priced in USD today. Enabling local-currency Markets lets Shopify show exact local prices. The site then shows them without the "≈". [Code] |
| **Navigation menus** | The header and footer menus are written in code. Editing Shopify menus does not change the Next.js site. [Code] |
| **Pages and blog** | I did not verify whether the site reads Shopify pages or the blog. Treat them as unconnected until checked. |
| **Reviews and ratings** | The site shows none, and I removed the earlier fake rating. Add them only through a real review system. [Code] |

## 7. Why the checklist looks the way it does

| Item | Reason |
|---|---|
| Short title, size as `(LxW ft)` | Page heading, tab title and "Listed size" all come from it. |
| Description as true bullets | Feeds the About list, the line under the title and the meta description. |
| 3+ images with alt text | Gallery quality, accessibility, and link previews. |
| USD price, stock, continue-selling off | Correct charge and no overselling. |
| Product type, vendor, category | Related ranking and Admin tidiness. |
| Metafields filled only where real | Menu filters and spec rows work without any invented data. |
| In the right collections | The card label and the Area Rugs links. |
| Markets and channel | Otherwise the product is hidden or shows "Not available". |
| URL handle final | Avoids broken links. |
| Status Active | Otherwise it does not appear. |
| Checked on the live site | The only way to confirm the above worked on your store. |
