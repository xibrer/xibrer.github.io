import type { MetadataRoute } from 'next';
import { getConfig } from '@/lib/config';
import { getAllPublications } from '@/lib/pageData';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const config = getConfig();
  const baseUrl = config.site.url.replace(/\/$/, '');
  const pages = ['', 'publications', 'projects', 'awards', 'cv'];
  const locales = ['en', 'zh'];
  const updated = new Date('2026-08-19');

  const pageEntries = locales.flatMap((locale) => pages.map((page) => ({
    url: `${baseUrl}/${locale}/${page}`,
    lastModified: updated,
    changeFrequency: page === '' ? 'monthly' as const : 'yearly' as const,
    priority: page === '' ? 1 : 0.8,
  })));

  const publicationEntries = locales.flatMap((locale) => getAllPublications(locale).map((publication) => ({
    url: `${baseUrl}/${locale}/publications/${publication.id}/`,
    lastModified: updated,
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  })));

  return [...pageEntries, ...publicationEntries];
}
