'use client';

import { motion } from 'framer-motion';
import React, { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import { CardItem, CardPageConfig } from '@/types/page';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { useMessages } from '@/lib/i18n/useMessages';

const markdownComponents = {
    p: ({ children }: React.ComponentProps<'p'>) => <p className="mb-3 last:mb-0">{children}</p>,
    ul: ({ children }: React.ComponentProps<'ul'>) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
    ol: ({ children }: React.ComponentProps<'ol'>) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
    li: ({ children }: React.ComponentProps<'li'>) => <li className="mb-1">{children}</li>,
    a: ({ ...props }) => (
        <a
            {...props}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ds-brand underline underline-offset-4 decoration-1 transition-colors hover:text-ds-brand-soft"
        />
    ),
    blockquote: ({ children }: React.ComponentProps<'blockquote'>) => (
        <blockquote className="border-l-2 border-ds-border-divider pl-4 italic my-4 text-ds-description">
            {children}
        </blockquote>
    ),
    strong: ({ children }: React.ComponentProps<'strong'>) => <strong className="font-medium text-ds-primary">{children}</strong>,
    em: ({ children }: React.ComponentProps<'em'>) => <em className="italic">{children}</em>,
    code: ({ children }: React.ComponentProps<'code'>) => (
        <code className="px-1.5 py-0.5 rounded bg-ds-code font-mono text-[0.95em]">{children}</code>
    ),
};

interface CardContentProps {
    item: CardItem;
    embedded: boolean;
    viewProjectLabel: string;
}

function CardContent({ item, embedded, viewProjectLabel }: CardContentProps) {
    return (
        <div className="flex flex-1 flex-col">
            <div className="flex justify-between items-start gap-4 mb-2">
                <h3 className={embedded ? "ds-text-title text-ds-primary" : "ds-text-subtitle text-ds-primary"}>{item.title}</h3>
                {item.date && (
                    <span className="ds-text-xs shrink-0 text-ds-description font-mono bg-ds-code border border-ds-border-subtle px-2 py-1 rounded-ds-sm">
                        {item.date}
                    </span>
                )}
            </div>
            {item.subtitle && (
                <p className={`${embedded ? "ds-text-caption" : "ds-text-body"} text-ds-brand mb-3`}>{item.subtitle}</p>
            )}
            {item.content && (
                <div className={`${embedded ? "ds-text-caption" : "ds-text-body"} text-ds-description leading-[1.75]`}>
                    <ReactMarkdown components={markdownComponents}>
                        {item.content}
                    </ReactMarkdown>
                </div>
            )}
            {item.tags && (
                <div className="flex flex-wrap gap-2 mt-4">
                    {item.tags.map(tag => (
                        <span key={tag} className="ds-text-xs font-mono text-ds-description bg-ds-code border border-ds-border-subtle px-2 py-1 rounded-ds-sm">
                            {tag}
                        </span>
                    ))}
                </div>
            )}
            {item.link && (
                <div className="mt-auto pt-4">
                    <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ds-btn-secondary ds-btn-s w-fit"
                    >
                        {viewProjectLabel}
                        <ArrowTopRightOnSquareIcon aria-hidden="true" />
                    </a>
                </div>
            )}
        </div>
    );
}

interface ProjectShowcaseProps {
    config: CardPageConfig;
    embedded: boolean;
    viewProjectLabel: string;
}

function ProjectShowcase({ config, embedded, viewProjectLabel }: ProjectShowcaseProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const instanceId = useId().replace(/:/g, '');
    const selectedIndex = Math.min(activeIndex, Math.max(config.items.length - 1, 0));
    const activeItem = config.items[selectedIndex];

    useEffect(() => {
        setActiveIndex(0);
    }, [config]);

    if (!activeItem) {
        return null;
    }

    const selectAndFocus = (index: number) => {
        setActiveIndex(index);
        tabRefs.current[index]?.focus();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
        let nextIndex: number | null = null;

        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            nextIndex = (index + 1) % config.items.length;
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            nextIndex = (index - 1 + config.items.length) % config.items.length;
        } else if (event.key === 'Home') {
            nextIndex = 0;
        } else if (event.key === 'End') {
            nextIndex = config.items.length - 1;
        }

        if (nextIndex !== null) {
            event.preventDefault();
            selectAndFocus(nextIndex);
        }
    };

    return (
        <div className="glass-inset overflow-hidden">
            <div className="border-b border-ds-border-default p-2">
                <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div
                        role="tablist"
                        aria-label={config.title}
                        className="grid min-w-[18rem] gap-1 rounded-ds-pill border border-ds-border-default bg-ds-surface-3 p-1"
                        style={{ gridTemplateColumns: `repeat(${config.items.length}, minmax(8rem, 1fr))` }}
                    >
                        {config.items.map((item, index) => {
                            const isActive = index === selectedIndex;

                            return (
                                <button
                                    key={item.title}
                                    ref={(element) => { tabRefs.current[index] = element; }}
                                    id={`${instanceId}-project-tab-${index}`}
                                    type="button"
                                    role="tab"
                                    aria-selected={isActive}
                                    aria-controls={`${instanceId}-project-panel-${index}`}
                                    tabIndex={isActive ? 0 : -1}
                                    onMouseEnter={() => setActiveIndex(index)}
                                    onFocus={() => setActiveIndex(index)}
                                    onClick={() => setActiveIndex(index)}
                                    onKeyDown={(event) => handleKeyDown(event, index)}
                                    className={`ds-text-caption relative isolate flex min-w-0 items-center gap-2 rounded-ds-pill px-3 py-2.5 text-left font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                                        isActive
                                            ? 'text-ds-primary'
                                            : 'text-ds-description hover:text-ds-primary'
                                    }`}
                                >
                                    {isActive && (
                                        <motion.span
                                            layoutId={`${instanceId}-project-track`}
                                            className="absolute inset-0 -z-10 rounded-ds-pill bg-ds-raised shadow-[0_1px_3px_rgba(0,0,0,.08)]"
                                            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                                        />
                                    )}
                                    <span className={`font-mono text-[0.65rem] tracking-[0.18em] ${isActive ? 'text-ds-brand' : 'text-ds-placeholder'}`}>
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <span className="truncate">{item.title}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="grid">
                {config.items.map((item, index) => {
                    const isActive = index === selectedIndex;

                    return (
                        <motion.div
                            key={item.title}
                            id={`${instanceId}-project-panel-${index}`}
                            role="tabpanel"
                            aria-labelledby={`${instanceId}-project-tab-${index}`}
                            aria-hidden={!isActive}
                            inert={!isActive}
                            initial={false}
                            animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : 12 }}
                            transition={{ duration: 0.18, ease: 'easeOut' }}
                            className={`col-start-1 row-start-1 flex flex-col ${embedded ? 'min-h-52 p-4' : 'min-h-60 p-6'} ${
                                isActive
                                    ? 'relative z-10 pointer-events-auto'
                                    : 'pointer-events-none select-none'
                            }`}
                        >
                            <CardContent item={item} embedded={embedded} viewProjectLabel={viewProjectLabel} />
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

export default function CardPage({ config, embedded = false }: { config: CardPageConfig; embedded?: boolean }) {
    const messages = useMessages();

    return (
        <motion.div
            className={embedded ? 'glass-panel home-content-panel' : undefined}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className={embedded ? "mb-4" : "mb-8"}>
                <div className="flex flex-col items-start gap-ds-3">
                    <span className="ds-eyebrow">{messages.sections.openSource}</span>
                    <h1 className={embedded ? "ds-text-heading2 text-ds-primary" : "ds-text-heading1 text-ds-primary"}>{config.title}</h1>
                    {config.description && (
                        <div className={`${embedded ? "ds-text-body" : "ds-text-subtitle"} text-ds-description max-w-2xl leading-[1.75]`}>
                            <ReactMarkdown components={markdownComponents}>
                                {config.description}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>

            {/* The sliding showcase is a homepage device only: on the standalone
                page (`embedded === false`) the items stack as plain blocks, which
                is easier to scan and to link into. */}
            {config.layout === 'showcase' && embedded ? (
                <ProjectShowcase
                    config={config}
                    embedded={embedded}
                    viewProjectLabel={messages.common.viewProject}
                />
            ) : (
                <div className={`grid ${embedded ? "gap-4" : "gap-6"}`}>
                    {config.items.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 * index }}
                            className={`glass-inset glass-interactive ${embedded ? "p-4" : "p-6"} transition-colors duration-200`}
                        >
                            <CardContent
                                item={item}
                                embedded={embedded}
                                viewProjectLabel={messages.common.viewProject}
                            />
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
