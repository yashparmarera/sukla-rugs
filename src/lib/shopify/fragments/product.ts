import { imageFragment } from './image';

export const productFragment = `
  fragment product on Product {
    id
    handle
    title
    description
    descriptionHtml
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
    technique: metafield(namespace: "shukla", key: "technique") { value }
    material: metafield(namespace: "shukla", key: "material") { value }
    color_family: metafield(namespace: "shukla", key: "color_family") { value }
    origin_region: metafield(namespace: "shukla", key: "origin_region") { value }
    care_instructions: metafield(namespace: "shukla", key: "care_instructions") { value }
    pile_height: metafield(namespace: "shukla", key: "pile_height") { value }
    weight: metafield(namespace: "shukla", key: "weight") { value }
    knots_per_sq_inch: metafield(namespace: "shukla", key: "knots_per_sq_inch") { value }
    craft_duration: metafield(namespace: "shukla", key: "craft_duration") { value }
    product_story: metafield(namespace: "shukla", key: "product_story") { value }
  }
  ${imageFragment}
`;
