'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    CalendarIcon,
    BookOpenIcon,
    DocumentTextIcon,
    DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { Publication } from '@/types/publication';
import { PublicationPageConfig } from '@/types/page';
import { cn } from '@/lib/utils';
import { useMessages } from '@/lib/i18n/useMessages';
import FormattedBibTeXText from './FormattedBibTeXText';
import PublicationVenue from './PublicationVenue';
import CopyButton from './CopyButton';

interface PublicationsListProps {
    config: PublicationPageConfig;
    publications: Publication[];
    embedded?: boolean;
}

export default function PublicationsList({ config, publications, embedded = false }: PublicationsListProps) {
    const messages = useMessages();
    const pathname = usePathname();
    const localePrefix = pathname.startsWith('/zh') ? '/zh' : '/en';
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
    const [selectedType, setSelectedType] = useState<string | 'all'>('all');
    const [showFilters, setShowFilters] = useState(false);
    const [expandedBibtexId, setExpandedBibtexId] = useState<string | null>(null);
    const [expandedAbstractId, setExpandedAbstractId] = useState<string | null>(null);

    // Extract unique years and types for filters
    const years = useMemo(() => {
        const uniqueYears = Array.from(new Set(publications.map(p => p.year)));
        return uniqueYears.sort((a, b) => b - a);
    }, [publications]);

    const types = useMemo(() => {
        const uniqueTypes = Array.from(new Set(publications.map(p => p.type)));
        return uniqueTypes.sort();
    }, [publications]);

    // Filter publications
    const filteredPublications = useMemo(() => {
        return publications.filter(pub => {
            const matchesSearch =
                pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pub.authors.some(author => author.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                pub.journal?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pub.conference?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesYear = selectedYear === 'all' || pub.year === selectedYear;
            const matchesType = selectedType === 'all' || pub.type === selectedType;

            return matchesSearch && matchesYear && matchesType;
        });
    }, [publications, searchQuery, selectedYear, selectedType]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className="mb-8 flex flex-col items-start gap-ds-3">
                <span className="ds-eyebrow">{messages.sections.peerReviewed}</span>
                <h1 className={embedded ? "ds-text-heading2 text-ds-primary" : "ds-text-heading1 text-ds-primary"}>{config.title}</h1>
                {config.description && (
                    <p className={`${embedded ? "ds-text-body" : "ds-text-subtitle"} text-ds-description max-w-2xl`}>
                        {config.description}
                    </p>
                )}
            </div>

            {/* Search and Filter Controls */}
            <div className="mb-8 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-ds-placeholder" />
                        <input
                            type="text"
                            placeholder={messages.publications.searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-ds-media border border-ds-border-default bg-ds-surface-3 text-ds-primary placeholder:text-ds-placeholder transition-colors focus:border-ds-border-hover focus:outline-none"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn(
                            "ds-btn-s",
                            showFilters ? "ds-btn-primary" : "ds-btn-secondary"
                        )}
                    >
                        <FunnelIcon className="h-5 w-5" />
                        {messages.publications.filters}
                    </button>
                </div>

                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="p-4 bg-ds-surface-3 rounded-ds-media border border-ds-border-default flex flex-wrap gap-6">
                                {/* Year Filter */}
                                <div className="space-y-2">
                                    <label className="ds-text-caption font-medium text-ds-secondary flex items-center">
                                        <CalendarIcon className="h-4 w-4 mr-1" /> {messages.publications.year}
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => setSelectedYear('all')}
                                            className={cn(
                                                "ds-btn-xs",
                                                selectedYear === 'all' ? "ds-btn-primary" : "ds-btn-secondary"
                                            )}
                                        >
                                            {messages.common.all}
                                        </button>
                                        {years.map(year => (
                                            <button
                                                key={year}
                                                onClick={() => setSelectedYear(year)}
                                                className={cn(
                                                    "ds-btn-xs",
                                                    selectedYear === year ? "ds-btn-primary" : "ds-btn-secondary"
                                                )}
                                            >
                                                {year}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Type Filter */}
                                <div className="space-y-2">
                                    <label className="ds-text-caption font-medium text-ds-secondary flex items-center">
                                        <BookOpenIcon className="h-4 w-4 mr-1" /> {messages.publications.type}
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => setSelectedType('all')}
                                            className={cn(
                                                "ds-btn-xs",
                                                selectedType === 'all' ? "ds-btn-primary" : "ds-btn-secondary"
                                            )}
                                        >
                                            {messages.common.all}
                                        </button>
                                        {types.map(type => (
                                            <button
                                                key={type}
                                                onClick={() => setSelectedType(type)}
                                                className={cn(
                                                    "ds-btn-xs capitalize",
                                                    selectedType === type ? "ds-btn-primary" : "ds-btn-secondary"
                                                )}
                                            >
                                                {type.replace('-', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Publications Grid */}
            <div className="space-y-6">
                {filteredPublications.length === 0 ? (
                    <div className="ds-text-body text-center py-12 text-ds-description">
                        {messages.publications.noResults}
                    </div>
                ) : (
                    filteredPublications.map((pub, index) => (
                        <motion.div
                            key={pub.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 * index }}
                            className="ds-card p-6 transition-colors duration-200 hover:border-ds-border-hover"
                        >
                            <div className="flex flex-col md:flex-row gap-6">
                                {pub.preview && (
                                    <div className="w-full md:w-48 flex-shrink-0">
                                        <div className="aspect-video md:aspect-[4/3] relative rounded-ds-media overflow-hidden bg-ds-surface-3 border border-ds-border-default">
                                            <Image
                                                src={`/papers/${pub.preview}`}
                                                alt={pub.title}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="flex-grow">
                                    <h3 className={embedded ? "ds-text-title text-ds-primary mb-2" : "ds-text-subtitle text-ds-primary mb-2"}>
                                        <Link href={`${localePrefix}/publications/${pub.id}`} className="transition-colors hover:text-ds-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded-sm">
                                            <FormattedBibTeXText nodes={pub.titleNodes} fallback={pub.title} />
                                        </Link>
                                    </h3>
                                    <p className={`${embedded ? "ds-text-caption" : "ds-text-body"} text-ds-description mb-2`}>
                                        {pub.authors.map((author, idx) => (
                                            <span key={idx}>
                                                <span className={`${author.isHighlighted ? 'font-medium text-ds-brand' : ''} ${author.isCoAuthor ? `underline underline-offset-4 ${author.isHighlighted ? 'decoration-accent' : 'decoration-neutral-400'}` : ''}`}>
                                                    {author.name}
                                                </span>
                                                {author.isCorresponding && (
                                                    <sup className={`ml-0 ${author.isHighlighted ? 'text-ds-brand' : 'text-ds-description'}`}>†</sup>
                                                )}
                                                {idx < pub.authors.length - 1 && ', '}
                                            </span>
                                        ))}
                                    </p>
                                    <p className="ds-text-caption font-medium text-ds-secondary mb-3">
                                        <PublicationVenue publication={pub} />
                                    </p>

                                    {pub.description && (
                                        <p className="ds-text-caption text-ds-description mb-4 line-clamp-3">
                                            {pub.description}
                                        </p>
                                    )}

                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {pub.doi && (
                                            <a
                                                href={`https://doi.org/${pub.doi}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="ds-btn-secondary ds-btn-xs"
                                            >
                                                DOI
                                            </a>
                                        )}
                                        {pub.code && (
                                            <a
                                                href={pub.code}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="ds-btn-secondary ds-btn-xs"
                                            >
                                                {messages.publications.code}
                                            </a>
                                        )}

                                        {pub.pdfUrl && (
                                            <a
                                                href={pub.pdfUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="ds-btn-secondary ds-btn-xs"
                                            >
                                                <DocumentArrowDownIcon className="h-3 w-3" />
                                                {messages.publications.pdf}
                                            </a>
                                        )}
                                        {pub.abstract && (
                                            <button
                                                onClick={() => setExpandedAbstractId(expandedAbstractId === pub.id ? null : pub.id)}
                                                className={cn(
                                                    "ds-btn-xs",
                                                    expandedAbstractId === pub.id ? "ds-btn-primary" : "ds-btn-secondary"
                                                )}
                                            >
                                                <DocumentTextIcon className="h-3 w-3" />
                                                {messages.publications.abstract}
                                            </button>
                                        )}
                                        {pub.bibtex && (
                                            <button
                                                onClick={() => setExpandedBibtexId(expandedBibtexId === pub.id ? null : pub.id)}
                                                className={cn(
                                                    "ds-btn-xs",
                                                    expandedBibtexId === pub.id ? "ds-btn-primary" : "ds-btn-secondary"
                                                )}
                                            >
                                                <BookOpenIcon className="h-3 w-3" />
                                                {messages.publications.bibtex}
                                            </button>
                                        )}
                                    </div>

                                    <AnimatePresence>
                                        {expandedAbstractId === pub.id && pub.abstract ? (
                                            <motion.div
                                                key="abstract"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden mt-4"
                                            >
                                                <div className="bg-ds-surface-3 rounded-ds-media p-4 border border-ds-border-default">
                                                    <p className="ds-text-caption text-ds-description leading-[1.75]">
                                                        {pub.abstract}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ) : null}
                                        {expandedBibtexId === pub.id && pub.bibtex ? (
                                            <motion.div
                                                key="bibtex"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden mt-4"
                                            >
                                                <div className="bg-ds-code rounded-ds-media border border-ds-border-default overflow-hidden">
                                                    <div className="flex items-center justify-between px-4 py-3 border-b border-ds-border-default">
                                                        <div className="flex items-center gap-[7px]">
                                                            <span className="w-[11px] h-[11px] rounded-full bg-[#ff5f57]" />
                                                            <span className="w-[11px] h-[11px] rounded-full bg-[#febc2e]" />
                                                            <span className="w-[11px] h-[11px] rounded-full bg-[#28c840]" />
                                                        </div>
                                                        <CopyButton value={pub.bibtex} />
                                                    </div>
                                                    <pre className="p-4 text-xs text-ds-secondary overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
                                                        {pub.bibtex}
                                                    </pre>
                                                </div>
                                            </motion.div>
                                        ) : null}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
}
