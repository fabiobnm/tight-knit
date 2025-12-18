export type Contact = {
  id: string;
  contacts?: {
    html: string | null;
  } | null;
  text?: {
    html: string | null;
  } | null;
};

export type ContactPageQueryResult = {
  contacts: Contact[];
};

export const CONTACT_PAGE_QUERY = /* GraphQL */ `
query contact{
  contacts{
    contacts{html}
    text{html}
    id
  }
}
`;
