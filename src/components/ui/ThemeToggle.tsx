'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { useThemeStore, type Theme } from '@/lib/stores/themeStore';
import { useMessages } from '@/lib/i18n/useMessages';
import { cn } from '@/lib/utils';

interface ThemeOption {
  value: Theme;
  label: string;
  icon: ReactNode;
}

function useThemeOptions(): ThemeOption[] {
  const messages = useMessages();

  return [
    {
      value: 'system',
      label: messages.theme.system,
      icon: <ComputerDesktopIcon className="h-4 w-4" />,
    },
    {
      value: 'light',
      label: messages.theme.light,
      icon: <SunIcon className="h-4 w-4" />,
    },
    {
      value: 'dark',
      label: messages.theme.dark,
      icon: <MoonIcon className="h-4 w-4" />,
    },
  ];
}

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);
  const messages = useMessages();
  const themes = useThemeOptions();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center w-10 h-10 rounded-ds-pill glass-control">
        <div className="w-4 h-4 rounded-full bg-ds-surface-5 animate-pulse" />
      </div>
    );
  }

  const currentTheme = themes.find((t) => t.value === theme) || themes[0];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          const order: Theme[] = ['dark', 'light', 'system'];
          const index = order.indexOf(theme);
          const next = order[(index + 1) % order.length];
          setTheme(next);
        }}
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-ds-pill',
          'glass-control',
          'transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
          'text-ds-description hover:text-ds-primary'
        )}
        title={`${messages.theme.currentTheme}: ${currentTheme.label}. ${messages.theme.cycleTheme}.`}
        aria-label={`${messages.theme.currentTheme}: ${currentTheme.label}. ${messages.theme.cycleTheme}.`}
      >
        <motion.div
          key={theme}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {theme === 'system' ? (
            <ComputerDesktopIcon className="h-4 w-4" />
          ) : theme === 'dark' ? (
            <MoonIcon className="h-4 w-4" />
          ) : (
            <SunIcon className="h-4 w-4" />
          )}
        </motion.div>
      </motion.button>
    </div>
  );
}

export function ThemeToggleDropdown() {
  const { theme, setTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messages = useMessages();
  const themes = useThemeOptions();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center w-10 h-10 rounded-ds-pill glass-control">
        <div className="w-4 h-4 rounded-full bg-ds-surface-5 animate-pulse" />
      </div>
    );
  }

  const currentTheme = themes.find((t) => t.value === theme) || themes[0];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-ds-pill',
          'glass-control',
          'transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
          'text-ds-description hover:text-ds-primary'
        )}
        title={`${messages.theme.currentTheme}: ${currentTheme.label}`}
        aria-label={`${messages.theme.currentTheme}: ${currentTheme.label}`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <motion.div
          key={theme}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {currentTheme.icon}
        </motion.div>
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className={cn(
            'ds-glass-dropdown absolute right-0 mt-2 w-36 z-50'
          )}
        >
          <div className="py-1">
            {themes.map((themeOption) => (
              <button
                key={themeOption.value}
                onClick={() => {
                  setTheme(themeOption.value);
                  setIsOpen(false);
                }}
                className={cn(
                  'ds-text-caption flex items-center w-full px-3 py-2',
                  'hover:bg-ds-hover',
                  'transition-colors duration-200',
                  theme === themeOption.value
                    ? 'text-ds-brand bg-accent/10'
                    : 'text-ds-secondary'
                )}
              >
                <span className="mr-2">{themeOption.icon}</span>
                {themeOption.label}
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
