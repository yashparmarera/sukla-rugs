# Shukla Rugs Shopify Theme

Online Store 2.0 theme migration for Shukla Rugs.

## Development

Use Shopify CLI from the repository root:

```text
shopify theme dev --path shopify-theme
```

The existing Next.js storefront remains the reference implementation and is not modified by the theme migration.

## Foundation status

- Theme layout and asset hooks are in place.
- Global design settings and tokens are defined.
- Header and footer section groups are defined.
- Reusable icon, price, and button snippets are defined.
- Homepage sections, product, collection, cart, search, editorial, account, and brand entrance surfaces are implemented in the theme.
- Dedicated page templates are available for find your rug, custom rugs, design consultation, trade, artisans, process, story, sustainability, rug care, and rug size. They use the reusable `service-experience` section; assign a `page.<handle>` template to a Shopify page to use one.
- Testimonials can be configured as theme-editor blocks; replace them with a review provider or approved review metaobject source before production.
- Configure Shopify-hosted images through image pickers and connect real products, collections, pages, blogs, forms, and policies before publishing.

Do not add mock commerce data to this theme. Missing Shopify data should render an explicit empty state until the data contract is completed.
