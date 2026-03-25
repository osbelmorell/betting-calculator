import { MetadataRoute } from 'next';
import { getCanonicalUrl } from './siteConfig';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: getCanonicalUrl('/'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: getCanonicalUrl('/parlay'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];
}
