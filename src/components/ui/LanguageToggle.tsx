'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LanguageIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { useLocaleStore } from '@/lib/stores/localeStore';
import type { I18nRuntimeConfig } from '@/types/i18n';

interface LanguageToggleProps {
  i18n: I18nRuntimeConfig;
}

export default function LanguageToggle({ i18n }: LanguageToggleProps) {
  const { locale, setLocale } = useLocaleStore();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  if (!i18n.enabled || !i18n.switcher || i18n.locales.length <= 1) {
    return null;
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center w-14 h-10 rounded-lg border border-neutral-200 dark:border-[rgba(148,163,184,0.24)] bg-background dark:bg-neutral-800">
        <div className="w-6 h-4 rounded bg-neutral-300 animate-pulse" />
      </div>
    );
  }

  const currentLocale = i18n.locales.includes(locale) ? locale : i18n.defaultLocale;
  const currentLabel = i18n.labels[currentLocale] || currentLocale;

  const switchLocale = (nextLocale: string) => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments[0] && i18n.locales.includes(segments[0])) segments.shift();
    const suffix = segments.length > 0 ? `/${segments.join('/')}` : '';
    setLocale(nextLocale);
    setIsOpen(false);
    router.push(`/${nextLocale}${suffix}`);
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls="language-menu"
        aria-label={currentLabel}
        className={cn(
          'flex items-center justify-center gap-1 px-2 h-10 rounded-lg',
          'glass-control',
          'transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
          'text-neutral-600 hover:text-primary'
        )}
        title={currentLabel}
      >
        <LanguageIcon className="h-4 w-4" />
        <span className="hidden sm:inline text-xs font-medium">{currentLabel}</span>
        <ChevronDownIcon className="h-3.5 w-3.5" />
      </motion.button>

      {isOpen && (
        <motion.div
          id="language-menu"
          role="menu"
          aria-label={currentLabel}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className={cn(
            'absolute right-0 mt-2 w-36 rounded-lg shadow-lg border',
            'bg-background border-neutral-200 dark:border-[rgba(148,163,184,0.24)]',
            'dark:bg-neutral-800 z-50'
          )}
        >
          <div className="py-1">
            {i18n.locales.map((localeOption) => (
              <button
                key={localeOption}
                role="menuitemradio"
                aria-checked={currentLocale === localeOption}
                onClick={() => switchLocale(localeOption)}
                className={cn(
                  'flex items-center justify-between w-full px-3 py-2 text-sm',
                  'hover:bg-accent/10',
                  'transition-colors duration-200',
                  currentLocale === localeOption
                    ? 'text-accent bg-accent/10'
                    : 'text-neutral-700'
                )}
              >
                <span>{i18n.labels[localeOption] || localeOption}</span>
                <span className="text-xs opacity-70">{localeOption.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
