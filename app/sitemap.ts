import { MetadataRoute } from 'next';
import { localizePath, supportedLocales } from './i18n';
import { getGuideSlugs } from './guides/registry';
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
      url: getCanonicalUrl(localizePath('/odds-converter', locale)),
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: locale === 'en' ? 0.92 : 0.87,
    },
    {
      url: getCanonicalUrl(localizePath('/parlay', locale)),
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: locale === 'en' ? 0.9 : 0.85,
    },
    {
      url: getCanonicalUrl(localizePath('/guides', locale)),
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: locale === 'en' ? 0.88 : 0.83,
    },
  ]);

  const localizedGuides = supportedLocales.flatMap((locale) =>
    getGuideSlugs(locale).map((slug) => ({
      url: getCanonicalUrl(localizePath(`/guides/${slug}`, locale)),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: locale === 'en' ? 0.82 : 0.78,
    })),
  );

  return [...localizedRoutes, ...localizedGuides];
}
