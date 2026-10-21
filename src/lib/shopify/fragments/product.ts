import { imageFragment } from './image';

export const productFragment = `
  fragment product on Product {
    id
    handle
    title
    description
    descriptionHtml
    productType
    tags
    availableForSale
    createdAt
    featuredImage {
      ...image
    }
    images(first: 10) {
      edges {
        node {
          ...image
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    collections(first: 1) {
      edges {
        node {
          id
          handle
          title
        }
      }
    }
    options {
      id
      name
      values
    }
    variants(first: 20) {
      edges {
        node {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          image {
            ...image
          }
          sku
        }
      }
    }
    technique: metafield(namespace: "sukla", key: "technique") { value }
    material: metafield(namespace: "sukla", key: "material") { value }
    color_family: metafield(namespace: "sukla", key: "color_family") { value }
    origin_region: metafield(namespace: "sukla", key: "origin_region") { value }
    care_instructions: metafield(namespace: "sukla", key: "care_instructions") { value }
    pile_height: metafield(namespace: "sukla", key: "pile_height") { value }
    weight: metafield(namespace: "sukla", key: "weight") { value }
    knots_per_sq_inch: metafield(namespace: "sukla", key: "knots_per_sq_inch") { value }
    craft_duration: metafield(namespace: "sukla", key: "craft_duration") { value }
    product_story: metafield(namespace: "sukla", key: "product_story") { value }
    short_description: metafield(namespace: "sukla", key: "short_description") { value }
    style: metafield(namespace: "sukla", key: "style") { value }
    room: metafield(namespace: "sukla", key: "room") { value }
    shape: metafield(namespace: "sukla", key: "shape") { value }
    construction: metafield(namespace: "sukla", key: "construction") { value }
    palette: metafield(namespace: "sukla", key: "palette") { value }
    premium: metafield(namespace: "sukla", key: "premium") { value }
    rug_format: metafield(namespace: "sukla", key: "rug_format") { value }
  }
  ${imageFragment}
`;
