// src/lib/queries/AI.ts

export type AIImage = {
  image: {
    url: string;
  };
  size: number;
  top: number;
  left: number;
  speed:number
};

export type AI = {
  id: string;
  text: {
  html: string;
} | null;
  images: AIImage[]; // viene da images { ... }
};

export type AIPageQueryResult = {
  ais: AI[];
};

export const AI_PAGE_QUERY = /* GraphQL */ `
  query Ai {
    ais {
      id
      text{ html }
      images (first:100) {
        image {
          url
        }
        size
        top
        left
        speed
      }
    }
  }
`;
