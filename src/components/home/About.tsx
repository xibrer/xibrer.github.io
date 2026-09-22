'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useMessages } from '@/lib/i18n/useMessages';

interface AboutProps {
    content: string;
    title?: string;
}

export default function About({ content, title }: AboutProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.about;

    return (
        <motion.section
            className="glass-panel home-content-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
        >
            <h2 className="ds-text-heading2 text-ds-primary mb-4">{resolvedTitle}</h2>
            <div className="ds-text-body text-ds-description leading-[1.75]">
                <ReactMarkdown
                    components={{
                        h1: ({ children }) => <h1 className="ds-text-heading1 text-ds-primary mt-8 mb-4">{children}</h1>,
                        h2: ({ children }) => <h2 className="ds-text-heading2 text-ds-primary mt-8 mb-4">{children}</h2>,
                        h3: ({ children }) => <h3 className="ds-text-title text-ds-primary mt-6 mb-3">{children}</h3>,
                        p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1 ml-4">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1 ml-4">{children}</ol>,
                        li: ({ children }) => <li className="mb-1">{children}</li>,
                        a: ({ ...props }) => (
                            <a
                                {...props}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-ds-brand underline underline-offset-4 decoration-1 transition-colors hover:text-ds-brand-soft"
                            />
                        ),
                        blockquote: ({ children }) => (
                            <blockquote className="border-l-2 border-ds-border-divider pl-4 italic my-4 text-ds-description">
                                {children}
                            </blockquote>
                        ),
                        strong: ({ children }) => <strong className="font-medium text-ds-primary">{children}</strong>,
                        em: ({ children }) => <em className="italic text-ds-description">{children}</em>,
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </motion.section>
    );
}
