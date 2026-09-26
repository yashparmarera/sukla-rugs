import { collectionFragment } from '../fragments/collection';

export const getCollectionQuery = `
  query getCollection($handle: String!, $country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      ...collection
    }
  }
  ${collectionFragment}
`;

export const getCollectionsQuery = `
  query getCollections($first: Int = 20, $country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
    collections(first: $first) {
      edges {
        node {
          ...collection
        }
      }
    }
  }
  ${collectionFragment}
`;
