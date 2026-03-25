import type { MetadataRoute } from 'next';
import { getCanonicalUrl } from './siteConfig';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/.next/', '/node_modules/'],
    },
    sitemap: getCanonicalUrl('/sitemap.xml'),
  };
}