import type { MetadataRoute } from 'next';
import { getConfig } from '@/lib/config';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getConfig().site.url.replace(/\/$/, '');
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
