// src/app/writers/page.tsx
import Header from "@/components/Header/Header";
import { hygraph } from "@/lib/hygraph";
import {
  WRITERS_PAGE_QUERY,
  type WritersPageQueryResult,
} from "@/lib/queries/writers";

import WritersList from "@/components/WritersList/WritersList";

export const dynamic='force-static';
export const revalidate= 0;


async function getWriters() {
  const data = await hygraph.request<WritersPageQueryResult>(
    WRITERS_PAGE_QUERY
  );
  return data.writers;
}

export default async function WritersPage() {
  const writers = await getWriters();

  return (
    <div>
      <Header />
      <main style={{marginTop:'22vH', marginBottom:'20vH'}} className="mx-auto max-w-5xl px-4 py-8">
        <WritersList writers={writers} />
      </main>
    </div>
  );
}
