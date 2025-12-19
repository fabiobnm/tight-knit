// src/lib/queries/AI.ts

export type AIImage = {
  image: {
    url: string;
  };
  size: number;
  top: number;
  left: number;
};

export type AI = {
  id: string;
  images: AIImage[]; // viene da images { ... }
};

export type AIPageQueryResult = {
  ais: AI[];
};

export const AI_PAGE_QUERY = /* GraphQL */ `
  query Ai {
    ais {
      id
      images (first:100) {
        image {
          url
        }
        size
        top
        left
      }
    }
  }
`;
