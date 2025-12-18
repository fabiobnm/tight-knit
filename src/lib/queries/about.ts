// src/lib/queries/about.ts

export type About = {
  id: string;
  aboutUs?: {
    html: string | null;
  } | null;
   services?: string | null; //  multi line text = String
};

export type AboutPageQueryResult = {
  abouts: About[];
};

export const ABOUT_PAGE_QUERY = /* GraphQL */ `
  query about {
    abouts {
      aboutUs {
        html
      }
      id
      services
    }
  }
`;
