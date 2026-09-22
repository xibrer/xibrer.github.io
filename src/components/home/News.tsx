'use client';

import { motion } from 'framer-motion';
import { useMessages } from '@/lib/i18n/useMessages';

export interface NewsItem {
    date: string;
    content: string;
}

interface NewsProps {
    items: NewsItem[];
    title?: string;
}

export default function News({ items, title }: NewsProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.news;

    return (
        <motion.section
            className="glass-panel home-content-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <div className="flex flex-col items-start gap-ds-3 mb-4">
                <span className="ds-eyebrow">{messages.sections.updates}</span>
                <h2 className="ds-text-heading2 text-ds-primary">{resolvedTitle}</h2>
            </div>
            <div className="space-y-3">
                {items.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                        <span className="ds-text-xs text-ds-description mt-1 w-16 flex-shrink-0 font-mono">{item.date}</span>
                        <p className="ds-text-caption text-ds-description">{item.content}</p>
                    </div>
                ))}
            </div>
        </motion.section>
    );
}
