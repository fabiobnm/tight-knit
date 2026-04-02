import type { Metadata } from 'next';
import { hygraph } from '@/lib/hygraph';
import {
  AI_PAGE_QUERY,
  type AIPageQueryResult,
  type AI,
  type AIImage,
} from '@/lib/queries/AI';
import Gsap404Page from './Gsap404Page';

export const dynamic = 'force-static';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'AI',
  description: 'Explore AI-driven creative visual research and design projects by Tight Knit — pushing the boundaries of AI collaboration in visual storytelling.',
  alternates: { canonical: '/AI' },
};

async function getAI(): Promise<AI | null> {
  const data = await hygraph.request<AIPageQueryResult>(AI_PAGE_QUERY);

  // prendi il primo AI che ha del testo, altrimenti il primo record
  const aiWithText = data.ais.find(ai => ai.text?.html) ?? data.ais[0];

  return aiWithText ?? null;
}

export default async function AIPage() {
  const ai = await getAI();

  if (!ai) return <p>Nessun contenuto AI trovato.</p>;

  return (
    <Gsap404Page
      images={ai.images}      
      text={ai.text}         
    />
  );
}
