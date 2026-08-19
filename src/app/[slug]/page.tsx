import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DynamicPageClient from '@/components/pages/DynamicPageClient';
import { getConfig } from '@/lib/config';
import { getPageConfig } from '@/lib/content';
import { buildDynamicData } from '@/lib/pageData';
import type { BasePageConfig } from '@/types/page';

export function generateStaticParams() {
  return getConfig().navigation
    .filter((item) => item.type === 'page' && item.target !== 'about')
    .map((item) => ({ slug: item.target }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pageConfig = getPageConfig(slug) as BasePageConfig | null;
  if (!pageConfig) return {};

  return {
    title: pageConfig.title,
    description: pageConfig.description,
    alternates: {
      canonical: `/en/${slug}/`,
      languages: {
        en: `/en/${slug}/`,
        zh: `/zh/${slug}/`,
        'x-default': `/en/${slug}/`,
      },
    },
  };
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { dataByLocale, defaultLocale } = buildDynamicData(slug);
  if (Object.keys(dataByLocale).length === 0) notFound();

  return <DynamicPageClient dataByLocale={dataByLocale} defaultLocale={defaultLocale} />;
}
