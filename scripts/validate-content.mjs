import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse } from 'smol-toml';
import { entries as parseBibTeXEntries } from 'bibtex-parse';
import { z } from 'zod';

const workspace = process.cwd();

const navigationItemSchema = z.object({
  title: z.string().min(1),
  type: z.enum(['section', 'page', 'link']),
  target: z.string().min(1),
  href: z.string().min(1),
});

const configSchema = z.object({
  site: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    favicon: z.string().min(1).optional(),
    last_updated: z.string().min(1).optional(),
    url: z.url().optional(),
  }),
  author: z.object({
    name: z.string().min(1),
    title: z.string().min(1),
    institution: z.string().min(1),
    avatar: z.string().min(1).optional(),
  }),
  social: z.record(z.string(), z.union([z.string(), z.array(z.string())])).optional(),
  navigation: z.array(navigationItemSchema).min(1),
});

const localizedConfigSchema = z.object({
  site: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    last_updated: z.string().min(1).optional(),
  }),
  author: z.object({
    name: z.string().min(1),
    title: z.string().min(1),
    institution: z.string().min(1),
  }),
  navigation: z.array(navigationItemSchema).min(1),
});

const publicationPageSchema = z.object({
  type: z.literal('publication'),
  title: z.string().min(1),
  source: z.string().min(1),
  pdfs: z.record(z.string(), z.string()).optional(),
});

function readToml(relativePath) {
  const absolutePath = path.join(workspace, relativePath);
  return parse(fs.readFileSync(absolutePath, 'utf8'));
}

function assertPublicAsset(publicUrl, source) {
  if (!publicUrl.startsWith('/')) return;
  const assetPath = path.join(workspace, 'public', decodeURIComponent(publicUrl.slice(1)));
  if (!fs.existsSync(assetPath)) {
    throw new Error(`${source} references missing public asset: ${publicUrl}`);
  }
}

export function validateContent() {
  const baseConfig = configSchema.parse(readToml('content/config.toml'));
  const zhConfig = localizedConfigSchema.parse(readToml('content_zh/config.toml'));
  const publicationConfig = publicationPageSchema.parse(readToml('content/publications.toml'));
  const zhPublicationConfig = publicationPageSchema.parse(readToml('content_zh/publications.toml'));

  assertPublicAsset(baseConfig.site.favicon || '', 'content/config.toml');
  assertPublicAsset(baseConfig.author.avatar || '', 'content/config.toml');

  const bibPath = path.join(workspace, 'content', publicationConfig.source);
  const publications = parseBibTeXEntries(fs.readFileSync(bibPath, 'utf8'));
  const ids = new Set();

  for (const publication of publications) {
    if (!publication.key || !publication.type || !publication.TITLE || !publication.AUTHOR || !publication.YEAR) {
      throw new Error(`Publication ${publication.key || '<unknown>'} is missing a required BibTeX field`);
    }
    if (ids.has(publication.key)) {
      throw new Error(`Duplicate BibTeX citation key: ${publication.key}`);
    }
    ids.add(publication.key);
  }

  for (const [id, pdfUrl] of Object.entries(publicationConfig.pdfs || {})) {
    if (!ids.has(id)) throw new Error(`PDF mapping references unknown publication: ${id}`);
    assertPublicAsset(pdfUrl, 'content/publications.toml');
  }

  for (const [id, pdfUrl] of Object.entries(zhPublicationConfig.pdfs || {})) {
    if (!ids.has(id)) throw new Error(`Chinese PDF mapping references unknown publication: ${id}`);
    assertPublicAsset(pdfUrl, 'content_zh/publications.toml');
  }

  const navigationTargets = new Set(baseConfig.navigation.filter((item) => item.type === 'page').map((item) => item.target));
  for (const target of navigationTargets) {
    if (target === 'about') continue;
    const configPath = path.join(workspace, 'content', `${target}.toml`);
    if (!fs.existsSync(configPath)) throw new Error(`Navigation target is missing its page config: ${target}`);
  }

  return {
    locales: [baseConfig, zhConfig].length,
    publications: publications.length,
    navigationItems: baseConfig.navigation.length,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const summary = validateContent();
  console.log(`Content valid: ${summary.locales} locales, ${summary.publications} publications, ${summary.navigationItems} navigation items.`);
}
