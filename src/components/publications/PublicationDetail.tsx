import Link from 'next/link';
import Image from 'next/image';
import { DocumentArrowDownIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import type { Publication } from '@/types/publication';
import PublicationVenue from './PublicationVenue';
import FormattedBibTeXText from './FormattedBibTeXText';
import { getConfig } from '@/lib/config';

interface PublicationDetailProps {
  publication: Publication;
  locale: 'en' | 'zh';
}

export default function PublicationDetail({ publication, locale }: PublicationDetailProps) {
  const prefix = `/${locale}`;
  const siteUrl = getConfig().site.url.replace(/\/$/, '');
  const labels = locale === 'zh'
    ? { back: '返回论文列表', abstract: '摘要', citation: 'BibTeX 引用', pdf: '下载 PDF', code: '查看代码' }
    : { back: 'Back to Publications', abstract: 'Abstract', citation: 'BibTeX Citation', pdf: 'Download PDF', code: 'View Code' };
  const scholarlyArticle = {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline: publication.title,
    author: publication.authors.map((author) => ({ '@type': 'Person', name: author.name })),
    datePublished: String(publication.year),
    isPartOf: publication.journal || publication.conference,
    abstract: publication.abstract,
    url: `${siteUrl}${prefix}/publications/${publication.id}/`,
    image: publication.preview ? `${siteUrl}/papers/${publication.preview}` : undefined,
    sameAs: publication.doi ? `https://doi.org/${publication.doi}` : undefined,
  };

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(scholarlyArticle).replace(/</g, '\\u003c') }} />
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href={`${prefix}/publications`} className="inline-flex mb-8 text-sm font-medium text-accent hover:text-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded">
        ← {labels.back}
      </Link>

      <header className="mb-8">
        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-3">
          <PublicationVenue publication={publication} />
        </p>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-primary leading-tight text-balance">
          <FormattedBibTeXText nodes={publication.titleNodes} fallback={publication.title} />
        </h1>
        <p className="mt-5 text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {publication.authors.map((author, index) => (
            <span key={author.name} className={author.isHighlighted ? 'font-semibold text-accent' : undefined}>
              {author.name}{index < publication.authors.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>
      </header>

      {publication.preview && (
        <div className="relative aspect-video mb-8 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50">
          <Image src={`/papers/${publication.preview}`} alt="" fill className="object-cover" sizes="(max-width: 896px) 100vw, 896px" priority />
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-10">
        {publication.pdfUrl && (
          <a href={publication.pdfUrl} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50" target="_blank" rel="noopener noreferrer">
            <DocumentArrowDownIcon className="h-4 w-4" />{labels.pdf}
          </a>
        )}
        {publication.code && (
          <a href={publication.code} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50" target="_blank" rel="noopener noreferrer">
            <CodeBracketIcon className="h-4 w-4" />{labels.code}
          </a>
        )}
      </div>

      {publication.abstract && (
        <section className="mb-10">
          <h2 className="text-2xl font-serif font-bold text-primary mb-4">{labels.abstract}</h2>
          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-pretty">{publication.abstract}</p>
        </section>
      )}

      {publication.bibtex && (
        <section>
          <h2 className="text-2xl font-serif font-bold text-primary mb-4">{labels.citation}</h2>
          <pre className="p-5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-x-auto whitespace-pre-wrap text-sm font-mono text-neutral-700 dark:text-neutral-300">{publication.bibtex}</pre>
        </section>
      )}
    </article>
    </>
  );
}
