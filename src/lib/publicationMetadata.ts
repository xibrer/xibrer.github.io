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
  const description = publication.abstract || publication.description || config.site.description;
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
