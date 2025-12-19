// src/app/AI/page.tsx

import { hygraph } from '@/lib/hygraph';
import {
  AI_PAGE_QUERY,
  type AIPageQueryResult,
  type AIImage,
} from '@/lib/queries/AI';
import Gsap404Page from './Gsap404Page';

export const dynamic='force-static';
export const revalidate= 0;

async function getAIImages(): Promise<AIImage[]> {
  const data = await hygraph.request<AIPageQueryResult>(AI_PAGE_QUERY);
  const first = data.ais[0];
  return first?.images ?? [];
}

export default async function AIPage() {
  const images = await getAIImages();
  return <Gsap404Page images={images} />;
}
