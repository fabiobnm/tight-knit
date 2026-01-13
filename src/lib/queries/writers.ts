export type WriterBio = {
  markdown: string | null;
};

export type Image = {
  url: string;
};

export type Writer = {
  name: string;
  bio?: WriterBio | null;
  avatar?: Image | null;
  
};

export type WritersPageQueryResult = {
  writers: Writer[];
};

export const WRITERS_PAGE_QUERY = /* GraphQL */ `
 query writers {
    writers{
      name
      bio{
        html
      }
     avatar{url}
    }
  }
`;
