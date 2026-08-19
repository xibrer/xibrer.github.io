import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DynamicPageClient from '@/components/pages/DynamicPageClient';
import { getConfig } from '@/lib/config';
import { getPageConfig } from '@/lib/content';
import { buildDynamicData } from '@/lib/pageData';
import type { BasePageConfig } from '@/types/page';

export function generateStaticParams() {
  return getConfig('zh').navigation
    .filter((item) => item.type === 'page' && item.target !== 'about')
    .map((item) => ({ slug: item.target }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const config = getPageConfig(slug, 'zh') as BasePageConfig | null;
  if (!config) return {};
  return {
    title: config.title,
    description: config.description,
    alternates: {
      canonical: `/zh/${slug}/`,
      languages: { en: `/en/${slug}/`, zh: `/zh/${slug}/`, 'x-default': `/en/${slug}/` },
    },
  };
}

export default async function ChinesePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { dataByLocale, defaultLocale } = buildDynamicData(slug);
  if (!dataByLocale.zh) notFound();
  return <DynamicPageClient dataByLocale={dataByLocale} defaultLocale={defaultLocale} initialLocale="zh" />;
}
