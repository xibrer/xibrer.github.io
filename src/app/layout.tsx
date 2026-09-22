import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { LocaleProvider } from '@/components/ui/LocaleProvider';
import { getConfig } from '@/lib/config';
import { getRuntimeI18nConfig } from '@/lib/i18n/config';
import type { SiteConfig } from '@/lib/config';

export async function generateMetadata(): Promise<Metadata> {
  const config = getConfig();
  const runtimeI18n = getRuntimeI18nConfig(config.i18n);
  const openGraphLocale = runtimeI18n.defaultLocale === 'zh' ? 'zh_CN' : 'en_US';

  return {
    metadataBase: new URL(config.site.url),
    title: {
      default: config.site.title,
      template: `%s | ${config.site.title}`,
    },
    description: config.site.description,
    keywords: [config.author.name, 'PhD', 'Research', config.author.institution],
    authors: [{ name: config.author.name }],
    creator: config.author.name,
    publisher: config.author.name,
    icons: {
      // Rounded-corner PNG set (public/favicon*.png). Declaring the real type
      // and both sizes here also removes the duplicate <link rel="icon"> that
      // used to be hand-written into <head>.
      icon: [
        { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
        { url: config.site.favicon, type: 'image/png', sizes: '256x256' },
      ],
    },
    alternates: {
      canonical: '/en/',
      languages: { en: '/en/', zh: '/zh/', 'x-default': '/en/' },
    },
    openGraph: {
      type: 'website',
      locale: openGraphLocale,
      title: config.site.title,
      description: config.site.description,
      siteName: `${config.author.name}'s Academic Website`,
      url: '/en/',
    },
    twitter: {
      card: 'summary',
      title: config.site.title,
      description: config.site.description,
    },
  };
}

function buildLocaleBootstrapScript(config: ReturnType<typeof getRuntimeI18nConfig>): string {
  const serializedConfig = JSON.stringify(config).replace(/</g, '\\u003c');

  return `
    try {
      const cfg = ${serializedConfig};
      const storageKey = 'locale-storage';
      const normalize = (value) => typeof value === 'string' ? value.trim().replace('_', '-').toLowerCase() : '';
      const matchLocale = (candidate) => {
        const normalized = normalize(candidate);
        if (!normalized) return null;
        if (cfg.locales.includes(normalized)) return normalized;
        const language = normalized.split('-')[0];
        if (cfg.locales.includes(language)) return language;
        return null;
      };

      let resolved = null;

      if (cfg.enabled) {
        resolved = matchLocale(location.pathname.split('/').filter(Boolean)[0]);
      }

      if (!cfg.enabled) {
        resolved = cfg.defaultLocale;
      } else if (cfg.persist) {
        resolved = resolved || matchLocale(localStorage.getItem(storageKey));
      }

      if (!resolved) {
        if (cfg.mode === 'fixed') {
          resolved = cfg.fixedLocale;
        } else {
          resolved = matchLocale(navigator.language);
        }
      }

      if (!resolved) {
        resolved = cfg.defaultLocale;
      }

      const root = document.documentElement;
      root.lang = resolved;
      root.setAttribute('data-locale', resolved);

      if (cfg.persist) {
        localStorage.setItem(storageKey, resolved);
      }
    } catch (e) {
      const root = document.documentElement;
      root.lang = '${config.defaultLocale}';
      root.setAttribute('data-locale', '${config.defaultLocale}');
    }
  `;
}

function buildLocalizedConfigMaps(
  locales: string[]
): {
  navigationByLocale: Record<string, SiteConfig['navigation']>;
  siteTitleByLocale: Record<string, string>;
  lastUpdatedByLocale: Record<string, string | undefined>;
} {
  const navigationByLocale: Record<string, SiteConfig['navigation']> = {};
  const siteTitleByLocale: Record<string, string> = {};
  const lastUpdatedByLocale: Record<string, string | undefined> = {};

  for (const locale of locales) {
    const localizedConfig = getConfig(locale);
    navigationByLocale[locale] = localizedConfig.navigation;
    siteTitleByLocale[locale] = localizedConfig.site.title;
    lastUpdatedByLocale[locale] = localizedConfig.site.last_updated;
  }

  return {
    navigationByLocale,
    siteTitleByLocale,
    lastUpdatedByLocale,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = getConfig();
  const runtimeI18n = getRuntimeI18nConfig(config.i18n);
  const targetLocales = runtimeI18n.enabled ? runtimeI18n.locales : [runtimeI18n.defaultLocale];

  const {
    navigationByLocale,
    siteTitleByLocale,
    lastUpdatedByLocale,
  } = buildLocalizedConfigMaps(targetLocales);
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: config.author.name,
    alternateName: '王兴伟',
    url: config.site.url,
    image: `${config.site.url}${config.author.avatar}`,
    jobTitle: config.author.title,
    affiliation: {
      '@type': 'CollegeOrUniversity',
      name: config.author.institution,
      url: 'https://www.buaa.edu.cn/',
    },
    email: `mailto:${config.social.email}`,
    sameAs: [config.social.google_scholar, config.social.github].filter(Boolean),
    knowsAbout: [
      'Mobile and ubiquitous health sensing',
      'Multimodal speech and audio enhancement',
      'Millimeter-wave sensing',
    ],
  };

  return (
    <html lang={runtimeI18n.defaultLocale} className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/fonts/dm-sans-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/montserrat-latin-500-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/fragment-mono-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme-storage');
                const parsed = theme ? JSON.parse(theme) : null;
                const setting = parsed?.state?.theme || 'system';
                const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                const effective = setting === 'dark' ? 'dark' : (setting === 'light' ? 'light' : (prefersDark ? 'dark' : 'light'));
                var root = document.documentElement;
                root.classList.add(effective);
                root.setAttribute('data-theme', effective);
              } catch (e) {
                var root = document.documentElement;
                var pd = false;
                try { pd = window.matchMedia('(prefers-color-scheme: dark)').matches; } catch (_) {}
                root.classList.add(pd ? 'dark' : 'light');
                root.setAttribute('data-theme', pd ? 'dark' : 'light');
              }
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: buildLocaleBootstrapScript(runtimeI18n),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
        />
        <ThemeProvider>
          <LocaleProvider config={runtimeI18n}>
            <Navigation
              items={config.navigation}
              siteTitle={config.site.title}
              enableOnePageMode={config.features.enable_one_page_mode}
              i18n={runtimeI18n}
              itemsByLocale={navigationByLocale}
              siteTitleByLocale={siteTitleByLocale}
            />
            <main className="min-h-screen pt-20 lg:pt-24">
              {children}
            </main>
            <Footer
              lastUpdated={config.site.last_updated}
              lastUpdatedByLocale={lastUpdatedByLocale}
              defaultLocale={runtimeI18n.defaultLocale}
              social={config.social}
              authorName={config.author.name}
              itemsByLocale={navigationByLocale}
              enableOnePageMode={config.features.enable_one_page_mode}
              i18n={runtimeI18n}
            />
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
