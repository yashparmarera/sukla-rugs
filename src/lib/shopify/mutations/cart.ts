import { cartFragment } from '../fragments/cart';

export const createCartMutation = `
  mutation createCart($lineItems: [CartLineInput!], $country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
    cartCreate(input: { lines: $lineItems }) {
      cart {
        ...cart
      }
      userErrors {
        field
        message
      }
    }
  }
  ${cartFragment}
`;

export const addToCartMutation = `
  mutation addToCart($cartId: String!, $lines: [CartLineInput!], $country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...cart
      }
      userErrors {
        field
        message
      }
    }
  }
  ${cartFragment}
`;

export const updateCartMutation = `
  mutation updateCart($cartId: String!, $lines: [CartLineUpdateInput!], $country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...cart
      }
      userErrors {
        field
        message
      }
    }
  }
  ${cartFragment}
`;

export const removeFromCartMutation = `
  mutation removeFromCart($cartId: String!, $lineIds: [ID!], $country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...cart
      }
      userErrors {
        field
        message
      }
    }
  }
  ${cartFragment}
`;

export const getCartQuery = `
  query getCart($cartId: String!, $country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
    cart(id: $cartId) {
      ...cart
    }
  }
  ${cartFragment}
`;
