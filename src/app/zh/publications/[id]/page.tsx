import { notFound } from 'next/navigation';
import PublicationDetail from '@/components/publications/PublicationDetail';
import { getAllPublications } from '@/lib/pageData';
import { getPublication, getPublicationMetadata } from '@/lib/publicationMetadata';

export function generateStaticParams() {
  return getAllPublications('zh').map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return getPublicationMetadata(id, 'zh');
}

export default async function ChinesePublicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const publication = getPublication(id, 'zh');
  if (!publication) notFound();
  return <PublicationDetail publication={publication} locale="zh" />;
}
