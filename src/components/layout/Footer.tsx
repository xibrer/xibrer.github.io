'use client';

import Link from 'next/link';
import { useLocaleStore } from '@/lib/stores/localeStore';
import { useMessages } from '@/lib/i18n/useMessages';
import type { SiteConfig } from '@/lib/config';
import type { I18nRuntimeConfig } from '@/types/i18n';

interface FooterProps {
  lastUpdated?: string;
  lastUpdatedByLocale?: Record<string, string | undefined>;
  defaultLocale?: string;
  social?: SiteConfig['social'];
  authorName?: string;
  itemsByLocale?: Record<string, SiteConfig['navigation']>;
  enableOnePageMode?: boolean;
  i18n?: I18nRuntimeConfig;
}

/**
 * Three-slot footer: contact details, copyright/update metadata, and quick
 * navigation. On an academic homepage the footer doubles as the contact card,
 * so the primary links live here rather than behind another page.
 */
export default function Footer({
  lastUpdated,
  lastUpdatedByLocale,
  defaultLocale = 'en',
  social,
  authorName,
  itemsByLocale,
  enableOnePageMode,
  i18n,
}: FooterProps) {
  const locale = useLocaleStore((state) => state.locale);
  const messages = useMessages();

  const resolvedLastUpdated =
    lastUpdatedByLocale?.[locale] ||
    (defaultLocale ? lastUpdatedByLocale?.[defaultLocale] : undefined) ||
    lastUpdated ||
    new Date().toLocaleDateString(locale || 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // Derive the copyright year from the last-updated string so the statically
  // rendered HTML and the hydrated output always agree.
  const parsedLastUpdated = resolvedLastUpdated ? Date.parse(resolvedLastUpdated) : NaN;
  const copyrightYear = Number.isNaN(parsedLastUpdated)
    ? new Date().getFullYear()
    : new Date(parsedLastUpdated).getFullYear();

  const contacts = [
    social?.email ? { label: messages.profile.email, href: `mailto:${social.email}` } : null,
    social?.google_scholar ? { label: 'Google Scholar', href: social.google_scholar } : null,
    social?.orcid ? { label: 'ORCID', href: social.orcid } : null,
    social?.github ? { label: 'GitHub', href: social.github } : null,
    social?.linkedin ? { label: 'LinkedIn', href: social.linkedin } : null,
  ].filter((entry): entry is { label: string; href: string } => entry !== null);

  const navItems = itemsByLocale?.[locale] || itemsByLocale?.[defaultLocale] || [];

  const localizeHref = (item: SiteConfig['navigation'][number]) => {
    if (!i18n?.enabled) return item.href;
    const prefix = `/${locale}`;
    if (enableOnePageMode) {
      return item.href === '/' ? prefix : `${prefix}/#${item.target}`;
    }
    return item.href === '/' ? prefix : `${prefix}${item.href}`;
  };

  return (
    <footer>
      <div className="ds-container pb-ds-6">
        <div className="w-full h-px bg-ds-border-subtle" />
        <div className="flex flex-col items-center gap-ds-4 pt-ds-5 xl:grid xl:grid-cols-3 xl:items-center xl:gap-ds-5">
          <nav
            aria-label={messages.footer.contact}
            className="flex flex-wrap items-center justify-center gap-x-ds-4 gap-y-ds-2 xl:justify-self-start"
          >
            {contacts.map((entry) => (
              <a
                key={entry.label}
                href={entry.href}
                target={entry.href.startsWith('mailto:') ? undefined : '_blank'}
                rel={entry.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                className="ds-text-caption text-ds-secondary transition-colors hover:text-ds-brand"
              >
                {entry.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col items-center gap-1 text-center">
            <p className="ds-text-caption text-ds-description">
              © {copyrightYear} {authorName || 'Xingwei Wang'}
            </p>
            <p className="ds-text-xs text-ds-description">
              {messages.footer.lastUpdated}: {resolvedLastUpdated} · {messages.footer.builtWithPrism}
            </p>
          </div>

          <nav
            aria-label={messages.footer.quickLinks}
            className="flex flex-wrap items-center justify-center gap-x-ds-4 gap-y-ds-2 xl:justify-self-end"
          >
            {navItems.map((item) => (
              <Link
                key={item.target}
                href={localizeHref(item)}
                prefetch={true}
                className="ds-text-caption text-ds-description transition-colors hover:text-ds-primary"
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
