import type { Metadata } from 'next';
import HomePageClient from '@/components/home/HomePageClient';
import { getConfig } from '@/lib/config';
import { buildHomeData } from '@/lib/pageData';

export function generateMetadata(): Metadata {
  const config = getConfig('zh');
  return {
    title: { absolute: config.site.title },
    description: config.site.description,
    alternates: {
      canonical: '/zh/',
      languages: { en: '/en/', zh: '/zh/', 'x-default': '/en/' },
    },
    openGraph: { locale: 'zh_CN', title: config.site.title, description: config.site.description },
    twitter: { card: 'summary', title: config.site.title, description: config.site.description },
  };
}

export default function ChineseHome() {
  const { dataByLocale, defaultLocale } = buildHomeData();
  return <HomePageClient dataByLocale={dataByLocale} defaultLocale={defaultLocale} initialLocale="zh" />;
}
