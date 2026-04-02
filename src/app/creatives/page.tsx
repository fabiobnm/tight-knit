// src/app/directors/page.tsx
import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import { hygraph } from "@/lib/hygraph";
import {
  DIRECTORS_PAGE_QUERY,
  type DirectorsPageQueryResult,
} from "@/lib/queries/directors";
import DirectorsList from "@/components/DirectorsList/DirectorsList";

export const dynamic='force-static';
export const revalidate= 0;

export const metadata: Metadata = {
  title: "Creatives",
  description: "Discover the creative directors and visual researchers at Tight Knit — working across commercial, film and television.",
  alternates: { canonical: "/creatives" },
};


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
     <h1 style={{ display: 'none' }}>Tight-knit Creatives</h1>
      <main style={{marginTop:'22vH', marginBottom:'20vH'}} className="mx-auto max-w-5xl px-4 py-8 opacityAnim">
        <DirectorsList directors={directors} />
      </main>
    </div>
  );
}
