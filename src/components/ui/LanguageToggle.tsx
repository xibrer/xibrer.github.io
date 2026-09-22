'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useLocaleStore } from '@/lib/stores/localeStore';
import type { I18nRuntimeConfig } from '@/types/i18n';

interface LanguageToggleProps {
  i18n: I18nRuntimeConfig;
}

/**
 * Segmented pill switch — the reference page's locale control, which fits this
 * site exactly because there are only ever two locales.
 */
export default function LanguageToggle({ i18n }: LanguageToggleProps) {
  const { locale, setLocale } = useLocaleStore();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!i18n.enabled || !i18n.switcher || i18n.locales.length <= 1) {
    return null;
  }

  if (!mounted) {
    return (
      <div className="ds-locale-toggle">
        <div className="h-4 w-10 rounded-full bg-ds-surface-5 animate-pulse" />
      </div>
    );
  }

  const currentLocale = i18n.locales.includes(locale) ? locale : i18n.defaultLocale;

  const switchLocale = (nextLocale: string) => {
    if (nextLocale === currentLocale) return;
    const segments = pathname.split('/').filter(Boolean);
    if (segments[0] && i18n.locales.includes(segments[0])) segments.shift();
    const suffix = segments.length > 0 ? `/${segments.join('/')}` : '';
    setLocale(nextLocale);
    router.push(`/${nextLocale}${suffix}`);
  };

  return (
    <div className="ds-locale-toggle" role="group" aria-label={i18n.labels[currentLocale] || currentLocale}>
      {i18n.locales.map((localeOption) => {
        const isActive = currentLocale === localeOption;
        const label = i18n.labels[localeOption] || localeOption;

        return (
          <button
            key={localeOption}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => switchLocale(localeOption)}
            aria-current={isActive ? 'true' : undefined}
            title={label}
            className={cn('ds-locale-toggle-item', isActive && 'is-active')}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
