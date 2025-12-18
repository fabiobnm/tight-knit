// src/app/directors/page.tsx
import Header from "@/components/Header/Header";
import { hygraph } from "@/lib/hygraph";
import {
  DIRECTORS_PAGE_QUERY,
  type DirectorsPageQueryResult,
} from "@/lib/queries/directors";
import DirectorsList from "@/components/DirectorsList/DirectorsList";

async function getDirectors() {
  const data = await hygraph.request<DirectorsPageQueryResult>(
    DIRECTORS_PAGE_QUERY
  );
  return data.directors;
}

export default async function DirectorsPage() {
  const directors = await getDirectors();

  return (
    <div>
      <Header />
      <main style={{marginTop:'100px'}} className="mx-auto max-w-5xl px-4 py-8">
        <DirectorsList directors={directors} />
      </main>
    </div>
  );
}
