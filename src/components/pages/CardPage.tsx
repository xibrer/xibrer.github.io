'use client';

import { AnimatePresence, motion } from 'framer-motion';
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
            className="text-accent font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
        />
    ),
    blockquote: ({ children }: React.ComponentProps<'blockquote'>) => (
        <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-600 dark:text-neutral-500">
            {children}
        </blockquote>
    ),
    strong: ({ children }: React.ComponentProps<'strong'>) => <strong className="font-semibold text-primary">{children}</strong>,
    em: ({ children }: React.ComponentProps<'em'>) => <em className="italic">{children}</em>,
    code: ({ children }: React.ComponentProps<'code'>) => (
        <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[0.95em]">{children}</code>
    ),
};

interface CardContentProps {
    item: CardItem;
    embedded: boolean;
    viewProjectLabel: string;
}

function CardContent({ item, embedded, viewProjectLabel }: CardContentProps) {
    return (
        <>
            <div className="flex justify-between items-start gap-4 mb-2">
                <h3 className={`${embedded ? "text-lg" : "text-xl"} font-semibold text-primary`}>{item.title}</h3>
                {item.date && (
                    <span className="shrink-0 text-sm text-neutral-500 font-medium bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
                        {item.date}
                    </span>
                )}
            </div>
            {item.subtitle && (
                <p className={`${embedded ? "text-sm" : "text-base"} text-accent font-medium mb-3`}>{item.subtitle}</p>
            )}
            {item.content && (
                <div className={`${embedded ? "text-sm" : "text-base"} text-neutral-600 dark:text-neutral-500 leading-relaxed`}>
                    <ReactMarkdown components={markdownComponents}>
                        {item.content}
                    </ReactMarkdown>
                </div>
            )}
            {item.tags && (
                <div className="flex flex-wrap gap-2 mt-4">
                    {item.tags.map(tag => (
                        <span key={tag} className="text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50 px-2 py-1 rounded border border-neutral-100 dark:border-neutral-800">
                            {tag}
                        </span>
                    ))}
                </div>
            )}
            {item.link && (
                <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
                >
                    {viewProjectLabel}
                    <ArrowTopRightOnSquareIcon className="h-4 w-4" aria-hidden="true" />
                </a>
            )}
        </>
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
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="border-b border-neutral-200 bg-neutral-50/80 p-2 dark:border-neutral-800 dark:bg-neutral-800/30">
                <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div
                        role="tablist"
                        aria-label={config.title}
                        className="grid min-w-[18rem] gap-1 rounded-xl bg-neutral-100 p-1 dark:bg-neutral-800"
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
                                    className={`relative isolate flex min-w-0 items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                                        isActive
                                            ? 'text-primary'
                                            : 'text-neutral-500 hover:text-primary dark:text-neutral-500'
                                    }`}
                                >
                                    {isActive && (
                                        <motion.span
                                            layoutId={`${instanceId}-project-track`}
                                            className="absolute inset-0 -z-10 rounded-lg bg-white shadow-sm ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-700"
                                            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                                        />
                                    )}
                                    <span className={`text-[0.65rem] tracking-[0.18em] ${isActive ? 'text-accent' : 'text-neutral-400'}`}>
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <span className="truncate">{item.title}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={selectedIndex}
                    id={`${instanceId}-project-panel-${selectedIndex}`}
                    role="tabpanel"
                    aria-labelledby={`${instanceId}-project-tab-${selectedIndex}`}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className={`${embedded ? 'min-h-52 p-4' : 'min-h-60 p-6'}`}
                >
                    <CardContent item={activeItem} embedded={embedded} viewProjectLabel={viewProjectLabel} />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default function CardPage({ config, embedded = false }: { config: CardPageConfig; embedded?: boolean }) {
    const messages = useMessages();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className={embedded ? "mb-4" : "mb-8"}>
                <h1 className={`${embedded ? "text-2xl" : "text-4xl"} font-serif font-bold text-primary mb-4`}>{config.title}</h1>
                {config.description && (
                    <div className={`${embedded ? "text-base" : "text-lg"} text-neutral-600 dark:text-neutral-500 max-w-2xl leading-relaxed`}>
                        <ReactMarkdown components={markdownComponents}>
                            {config.description}
                        </ReactMarkdown>
                    </div>
                )}
            </div>

            {config.layout === 'showcase' ? (
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
                            className={`bg-white dark:bg-neutral-900 ${embedded ? "p-4" : "p-6"} rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-all duration-200 hover:scale-[1.01]`}
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
