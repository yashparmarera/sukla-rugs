import { imageFragment } from './image';

export const collectionFragment = `
  fragment collection on Collection {
    id
    handle
    title
    description
    descriptionHtml
    updatedAt
    image {
      ...image
    }
  }
  ${imageFragment}
`;
