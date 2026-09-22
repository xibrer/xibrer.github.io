import type { Metadata } from 'next';
import { getAllPublications } from '@/lib/pageData';
import { getConfig } from '@/lib/config';

export function getPublication(id: string, locale: string) {
  return getAllPublications(locale).find((publication) => publication.id === id);
}

export function getPublicationMetadata(id: string, locale: 'en' | 'zh'): Metadata {
  const publication = getPublication(id, locale);
  if (!publication) return {};
  const config = getConfig(locale);
  const path = `/${locale}/publications/${publication.id}/`;
  // Prefer the one-line `description` for metadata: the `abstract` field now
  // holds the full published abstract (1500-2100 chars), which search engines
  // and social cards truncate. The abstract is still rendered on the page and
  // emitted in the ScholarlyArticle JSON-LD.
  const description = publication.description || publication.abstract || config.site.description;
  return {
    title: publication.title,
    description,
    authors: publication.authors.map((author) => ({ name: author.name })),
    alternates: {
      canonical: path,
      languages: {
        en: `/en/publications/${publication.id}/`,
        zh: `/zh/publications/${publication.id}/`,
        'x-default': `/en/publications/${publication.id}/`,
      },
    },
    openGraph: {
      type: 'article',
      title: publication.title,
      description,
      url: path,
      publishedTime: `${publication.year}-01-01`,
      authors: publication.authors.map((author) => author.name),
    },
  };
}
