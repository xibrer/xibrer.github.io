import type { Metadata } from 'next';
import HomePageClient from '@/components/home/HomePageClient';
import { getConfig } from '@/lib/config';
import { buildHomeData } from '@/lib/pageData';

export function generateMetadata(): Metadata {
  const config = getConfig('en');
  return {
    title: { absolute: config.site.title },
    description: config.site.description,
    alternates: {
      canonical: '/en/',
      languages: { en: '/en/', zh: '/zh/', 'x-default': '/en/' },
    },
    openGraph: { locale: 'en_US', title: config.site.title, description: config.site.description },
    twitter: { card: 'summary', title: config.site.title, description: config.site.description },
  };
}

export default function EnglishHome() {
  const { dataByLocale, defaultLocale } = buildHomeData();
  return <HomePageClient dataByLocale={dataByLocale} defaultLocale={defaultLocale} initialLocale="en" />;
}
