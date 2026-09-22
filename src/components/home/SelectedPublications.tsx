'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Publication } from '@/types/publication';
import { useMessages } from '@/lib/i18n/useMessages';
import FormattedBibTeXText from '@/components/publications/FormattedBibTeXText';
import PublicationVenue from '@/components/publications/PublicationVenue';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';

interface SelectedPublicationsProps {
    publications: Publication[];
    title?: string;
    enableOnePageMode?: boolean;
}

export default function SelectedPublications({ publications, title, enableOnePageMode = false }: SelectedPublicationsProps) {
    const messages = useMessages();
    const pathname = usePathname();
    const localePrefix = pathname.startsWith('/zh') ? '/zh' : '/en';
    const resolvedTitle = title || messages.home.selectedPublications;

    return (
        <motion.section
            className="glass-panel home-content-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className="flex flex-wrap items-end justify-between gap-ds-4 mb-4">
                <div className="flex flex-col items-start gap-ds-3">
                    <span className="ds-eyebrow">{messages.sections.peerReviewed}</span>
                    <h2 className="ds-text-heading2 text-ds-primary">{resolvedTitle}</h2>
                </div>
                <Link
                    href={enableOnePageMode ? `${localePrefix}/#publications` : `${localePrefix}/publications`}
                    prefetch={true}
                    className="ds-text-caption text-ds-brand transition-colors hover:text-ds-brand-soft"
                >
                    {messages.home.viewAll} →
                </Link>
            </div>
            <div className="space-y-4">
                {publications.map((pub, index) => (
                    <motion.div
                        key={pub.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className="glass-inset glass-interactive p-4 transition-colors duration-200"
                    >
                        <h3 className="ds-text-title text-ds-primary mb-2">
                            <Link href={`${localePrefix}/publications/${pub.id}`} className="transition-colors hover:text-ds-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded-sm">
                                <FormattedBibTeXText nodes={pub.titleNodes} fallback={pub.title} />
                            </Link>
                        </h3>
                        <p className="ds-text-caption text-ds-description mb-1">
                            {pub.authors.map((author, idx) => (
                                <span key={idx}>
                                    <span className={`${author.isHighlighted ? 'font-medium text-ds-brand' : ''} ${author.isCoAuthor ? `underline underline-offset-4 ${author.isHighlighted ? 'decoration-accent' : 'decoration-neutral-400'}` : ''}`}>
                                        {author.name}
                                    </span>
                                    {author.isCorresponding && (
                                        <sup className={`ml-0 ${author.isHighlighted ? 'text-ds-brand' : 'text-ds-description'}`}>+</sup>
                                    )}
                                    {idx < pub.authors.length - 1 && ', '}
                                </span>
                            ))}
                        </p>
                        <p className="ds-text-caption text-ds-description mb-2">
                            <PublicationVenue publication={pub} />
                        </p>
                        {pub.description && (
                            <p className="ds-text-caption text-ds-description line-clamp-2">
                                {pub.description}
                            </p>
                        )}
                        {pub.pdfUrl && (
                            <a
                                href={pub.pdfUrl}
                                data-track={`pdf:${pub.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ds-btn-secondary ds-btn-xs w-fit mt-3"
                            >
                                <DocumentArrowDownIcon className="h-3 w-3" />
                                PDF
                            </a>
                        )}
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
