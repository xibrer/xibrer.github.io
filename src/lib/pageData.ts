import { getConfig } from '@/lib/config';
import { getMarkdownContent, getBibtexContent, getTomlContent, getPageConfig } from '@/lib/content';
import { parseBibTeX } from '@/lib/bibtexParser';
import type { HomePageLocaleData } from '@/components/home/HomePageClient';
import type { DynamicPageLocaleData } from '@/components/pages/DynamicPageClient';
import type { Publication } from '@/types/publication';
import type { BasePageConfig, PublicationPageConfig, TextPageConfig, CardPageConfig, CardItem } from '@/types/page';
import { getRuntimeI18nConfig } from '@/lib/i18n/config';

interface SectionConfig {
  id: string;
  type: 'markdown' | 'publications' | 'list' | 'card';
  title?: string;
  source?: string;
  filter?: string;
  limit?: number;
  content?: string;
  publications?: Publication[];
  items?: Array<{ date: string; content: string }>;
  cardItems?: CardItem[];
}

type PageData =
  | { type: 'about'; id: string; sections: SectionConfig[] }
  | { type: 'publication'; id: string; config: PublicationPageConfig; publications: Publication[] }
  | { type: 'text'; id: string; config: TextPageConfig; content: string }
  | { type: 'card'; id: string; config: CardPageConfig };

export function mergePublicationPdfs(publications: Publication[], locale?: string) {
  const publicationConfig = getPageConfig('publications', locale) as PublicationPageConfig | null;
  if (!publicationConfig?.pdfs) return publications;

  return publications.map((publication) => ({
    ...publication,
    pdfUrl: publication.pdfUrl || publicationConfig.pdfs?.[publication.id],
  }));
}

export function getAllPublications(locale?: string): Publication[] {
  return mergePublicationPdfs(parseBibTeX(getBibtexContent('publications.bib', locale), locale), locale);
}

function processSections(sections: SectionConfig[], locale?: string): SectionConfig[] {
  return sections.map((section) => {
    switch (section.type) {
      case 'markdown':
        return { ...section, content: section.source ? getMarkdownContent(section.source, locale) : '' };
      case 'publications': {
        const publications = getAllPublications(locale);
        const filtered = section.filter === 'selected'
          ? publications.filter((publication) => publication.selected)
          : publications;
        return { ...section, publications: filtered.slice(0, section.limit || 5) };
      }
      case 'list': {
        const data = section.source
          ? getTomlContent<{ news: Array<{ date: string; content: string }> }>(section.source, locale)
          : null;
        return { ...section, items: data?.news || [] };
      }
      case 'card': {
        const data = section.source
          ? getTomlContent<{ items: CardItem[] }>(section.source, locale)
          : null;
        return { ...section, cardItems: data?.items || [] };
      }
      default:
        return section;
    }
  });
}

export function loadHomePageData(locale?: string): HomePageLocaleData {
  const config = getConfig(locale);
  const enableOnePageMode = config.features.enable_one_page_mode;
  const aboutConfig = getPageConfig<{
    profile?: { research_interests?: string[] };
    sections?: SectionConfig[];
  }>('about', locale);

  let pagesToShow: PageData[] = [];

  if (enableOnePageMode) {
    pagesToShow = config.navigation
      .filter((item) => item.type === 'page')
      .map((item): PageData | null => {
        const rawConfig = getPageConfig(item.target, locale);
        if (!rawConfig) return null;

        const pageConfig = rawConfig as BasePageConfig;
        if (pageConfig.type === 'about' || 'sections' in (rawConfig as object)) {
          return {
            type: 'about',
            id: item.target,
            sections: processSections((rawConfig as { sections: SectionConfig[] }).sections || [], locale),
          };
        }
        if (pageConfig.type === 'publication') {
          return {
            type: 'publication',
            id: item.target,
            config: pageConfig as PublicationPageConfig,
            publications: getAllPublications(locale),
          };
        }
        if (pageConfig.type === 'text') {
          const textConfig = pageConfig as TextPageConfig;
          return {
            type: 'text',
            id: item.target,
            config: textConfig,
            content: getMarkdownContent(textConfig.source, locale),
          };
        }
        if (pageConfig.type === 'card') {
          return { type: 'card', id: item.target, config: pageConfig as CardPageConfig };
        }
        return null;
      })
      .filter((item): item is PageData => item !== null);
  } else if (aboutConfig) {
    pagesToShow = [{
      type: 'about',
      id: 'about',
      sections: processSections(aboutConfig.sections || [], locale),
    }];
  }

  return {
    author: config.author,
    social: config.social,
    features: config.features,
    enableOnePageMode,
    researchInterests: aboutConfig?.profile?.research_interests,
    pagesToShow,
  };
}

export function buildHomeData() {
  const baseConfig = getConfig();
  const i18n = getRuntimeI18nConfig(baseConfig.i18n);
  const locales = i18n.enabled ? i18n.locales : [i18n.defaultLocale];
  const dataByLocale = Object.fromEntries(locales.map((locale) => [locale, loadHomePageData(locale)]));

  return { dataByLocale, defaultLocale: i18n.defaultLocale };
}

export function loadDynamicPageData(slug: string, locale?: string): DynamicPageLocaleData | null {
  const pageConfig = getPageConfig(slug, locale) as BasePageConfig | null;
  if (!pageConfig) return null;

  if (pageConfig.type === 'publication') {
    return {
      type: 'publication',
      config: pageConfig as PublicationPageConfig,
      publications: getAllPublications(locale),
    };
  }
  if (pageConfig.type === 'text') {
    const textConfig = pageConfig as TextPageConfig;
    return { type: 'text', config: textConfig, content: getMarkdownContent(textConfig.source, locale) };
  }
  if (pageConfig.type === 'card') {
    return { type: 'card', config: pageConfig as CardPageConfig };
  }
  return null;
}

export function buildDynamicData(slug: string) {
  const baseConfig = getConfig();
  const i18n = getRuntimeI18nConfig(baseConfig.i18n);
  const locales = i18n.enabled ? i18n.locales : [i18n.defaultLocale];
  const dataByLocale: Record<string, DynamicPageLocaleData> = {};

  for (const locale of locales) {
    const data = loadDynamicPageData(slug, locale);
    if (data) dataByLocale[locale] = data;
  }

  return { dataByLocale, defaultLocale: i18n.defaultLocale };
}
