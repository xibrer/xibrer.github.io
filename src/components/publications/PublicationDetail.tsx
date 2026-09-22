import Link from 'next/link';
import Image from 'next/image';
import { DocumentArrowDownIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import type { Publication } from '@/types/publication';
import PublicationVenue from './PublicationVenue';
import FormattedBibTeXText from './FormattedBibTeXText';
import CopyButton from './CopyButton';
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
    <article className="ds-container-prose pt-ds-7 pb-ds-11">
      <Link href={`${prefix}/publications`} className="ds-text-caption inline-flex mb-8 font-medium text-ds-brand transition-colors hover:text-ds-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded">
        ← {labels.back}
      </Link>

      <header className="mb-8">
        <p className="ds-text-caption font-medium text-ds-description mb-3">
          <PublicationVenue publication={publication} />
        </p>
        <h1 className="ds-text-heading1 text-ds-primary text-balance">
          <FormattedBibTeXText nodes={publication.titleNodes} fallback={publication.title} />
        </h1>
        <p className="ds-text-body mt-5 text-ds-description">
          {publication.authors.map((author, index) => (
            <span key={author.name} className={author.isHighlighted ? 'font-medium text-ds-brand' : undefined}>
              {author.name}{index < publication.authors.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>
      </header>

      {publication.preview && (
        <div className="relative aspect-video mb-8 overflow-hidden rounded-ds-media border border-ds-border-default bg-ds-surface-3">
          <Image src={`/papers/${publication.preview}`} alt="" fill className="object-cover" sizes="(max-width: 896px) 100vw, 896px" priority />
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-10">
        {publication.pdfUrl && (
          <a href={publication.pdfUrl} className="ds-btn-primary ds-btn-m" target="_blank" rel="noopener noreferrer">
            <DocumentArrowDownIcon />{labels.pdf}
          </a>
        )}
        {publication.code && (
          <a href={publication.code} className="ds-btn-secondary ds-btn-m" target="_blank" rel="noopener noreferrer">
            <CodeBracketIcon />{labels.code}
          </a>
        )}
      </div>

      {publication.abstract && (
        <section className="mb-10">
          <h2 className="ds-text-heading2 text-ds-primary mb-4">{labels.abstract}</h2>
          <p className="ds-text-body text-ds-description leading-[1.75] text-pretty">{publication.abstract}</p>
        </section>
      )}

      {publication.bibtex && (
        <section>
          <h2 className="ds-text-heading2 text-ds-primary mb-4">{labels.citation}</h2>
          <div className="bg-ds-code rounded-ds-media border border-ds-border-default overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-ds-border-default">
              <div className="flex items-center gap-[7px]">
                <span className="w-[11px] h-[11px] rounded-full bg-[#ff5f57]" />
                <span className="w-[11px] h-[11px] rounded-full bg-[#febc2e]" />
                <span className="w-[11px] h-[11px] rounded-full bg-[#28c840]" />
              </div>
              <CopyButton value={publication.bibtex} />
            </div>
            <pre className="p-5 text-xs text-ds-secondary overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">{publication.bibtex}</pre>
          </div>
        </section>
      )}
    </article>
    </>
  );
}
