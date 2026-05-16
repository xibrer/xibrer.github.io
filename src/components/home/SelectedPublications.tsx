'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Publication } from '@/types/publication';
import { useMessages } from '@/lib/i18n/useMessages';
import FormattedBibTeXText from '@/components/publications/FormattedBibTeXText';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';

interface SelectedPublicationsProps {
    publications: Publication[];
    title?: string;
    enableOnePageMode?: boolean;
}

export default function SelectedPublications({ publications, title, enableOnePageMode = false }: SelectedPublicationsProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.selectedPublications;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-serif font-bold text-primary">{resolvedTitle}</h2>
                <Link
                    href={enableOnePageMode ? "/#publications" : "/publications"}
                    prefetch={true}
                    className="text-accent hover:text-accent-dark text-sm font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
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
                        className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg shadow-sm border border-neutral-200 dark:border-[rgba(148,163,184,0.24)] hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                    >
                        <h3 className="font-semibold text-primary mb-2 leading-tight">
                            <FormattedBibTeXText nodes={pub.titleNodes} fallback={pub.title} />
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-500 mb-1">
                            {pub.authors.map((author, idx) => (
                                <span key={idx}>
                                    <span className={`${author.isHighlighted ? 'font-semibold text-accent' : ''} ${author.isCoAuthor ? `underline underline-offset-4 ${author.isHighlighted ? 'decoration-accent' : 'decoration-neutral-400'}` : ''}`}>
                                        {author.name}
                                    </span>
                                    {author.isCorresponding && (
                                        <sup className={`ml-0 ${author.isHighlighted ? 'text-accent' : 'text-neutral-600 dark:text-neutral-500'}`}>+</sup>
                                    )}
                                    {idx < pub.authors.length - 1 && ', '}
                                </span>
                            ))}
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-500 mb-2">
                            {pub.journal || pub.conference}
                        </p>
                        {pub.description && (
                            <p className="text-sm text-neutral-500 dark:text-neutral-500 line-clamp-2">
                                {pub.description}
                            </p>
                        )}
                        {pub.pdfUrl && (
                            <a
                                href={pub.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-2.5 py-1 mt-2 rounded-md text-xs font-medium bg-white dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-accent hover:text-white transition-colors border border-neutral-200 dark:border-neutral-600"
                            >
                                <DocumentArrowDownIcon className="h-3 w-3 mr-1" />
                                PDF
                            </a>
                        )}
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}