// src/lib/queries/directors.ts

export type ProjectImage = {
  url: string;
    mimeType?: string | null; // aggiungi questa riga

};

export type Project = {
  title: string;
  client: string;
  thumbnail: ProjectImage | null;
  gallery?: ProjectImage[] | null;
  linkGallery?: string | null; 
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
    directors(first: 100, orderBy: name_ASC) {
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
            mimeType
          }
          linkGallery
          gallery (first: 100){
            url
            mimeType
          }
        }
      }
    }
  }
`;
