import { MetadataRoute } from 'next';
import { localizePath, supportedLocales } from './i18n';
import { getCanonicalUrl } from './siteConfig';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const localizedRoutes = supportedLocales.flatMap((locale) => [
    {
      url: getCanonicalUrl(localizePath('/', locale)),
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: locale === 'en' ? 1.0 : 0.95,
    },
    {
      url: getCanonicalUrl(localizePath('/parlay', locale)),
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: locale === 'en' ? 0.9 : 0.85,
    },
  ]);

  return localizedRoutes;
}
