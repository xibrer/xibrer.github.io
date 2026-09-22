'use client';

import { useLocaleStore } from '@/lib/stores/localeStore';
import { useMessages } from '@/lib/i18n/useMessages';

interface FooterProps {
  lastUpdated?: string;
  lastUpdatedByLocale?: Record<string, string | undefined>;
  defaultLocale?: string;
}

export default function Footer({ lastUpdated, lastUpdatedByLocale, defaultLocale = 'en' }: FooterProps) {
  const locale = useLocaleStore((state) => state.locale);
  const messages = useMessages();

  const resolvedLastUpdated =
    lastUpdatedByLocale?.[locale] ||
    (defaultLocale ? lastUpdatedByLocale?.[defaultLocale] : undefined) ||
    lastUpdated ||
    new Date().toLocaleDateString(locale || 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <footer>
      <div className="ds-container pb-6">
        <div className="w-full h-px bg-ds-border-subtle" />
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 pt-5">
          <p className="ds-text-xs text-ds-description">
            {messages.footer.lastUpdated}: {resolvedLastUpdated}
          </p>
        </div>
      </div>
    </footer>
  );
}
