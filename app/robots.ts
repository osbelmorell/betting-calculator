import type { MetadataRoute } from 'next';
import { getCanonicalUrl, siteConfig } from './siteConfig';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/.next/', '/node_modules/'],
    },
    host: siteConfig.url,
    sitemap: getCanonicalUrl('/sitemap.xml'),
  };
}