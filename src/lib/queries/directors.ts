// src/lib/queries/directors.ts

export type ProjectImage = {
  url: string;
};

export type Project = {
  title: string;
  client: string;
  thumbnail: ProjectImage | null;
  gallery?: ProjectImage[] | null;
};

export type DirectorInfo = {
  markdown: string | null;
  html: string | null;
};

export type Director = {
  name: string;
  avatar?: ProjectImage | null;
  info?: DirectorInfo | null;
  projects?: Project[] | null;
};

export type DirectorsPageQueryResult = {
  directors: Director[];
};

export const DIRECTORS_PAGE_QUERY = /* GraphQL */ `
  query directors {
    directors {
      name
      avatar {
        url
      }
      info {
        markdown
        html
      }
      projects(first: 100) {
        ... on Project {
          title
          client
          thumbnail {
            url
          }
          gallery {
            url
          }
        }
      }
    }
  }
`;
