export type WriterBio = {
  html: string | null;
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
    writers(first: 100){
      name
      bio{
        html
      }
     avatar{url}
    }
  }
`;
