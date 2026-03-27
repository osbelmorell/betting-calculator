import { MetadataRoute } from 'next';
import { localizePath, supportedLocales } from './i18n';
import { getGuideSummaries } from './guides/registry';
import { getCanonicalUrl } from './siteConfig';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const buildTime = new Date();
  const localizedRoutes = supportedLocales.flatMap((locale) => [
    {
      url: getCanonicalUrl(localizePath('/', locale)),
      lastModified: buildTime,
    },
    {
      url: getCanonicalUrl(localizePath('/odds-converter', locale)),
      lastModified: buildTime,
    },
    {
      url: getCanonicalUrl(localizePath('/parlay', locale)),
      lastModified: buildTime,
    },
    {
      url: getCanonicalUrl(localizePath('/guides', locale)),
      lastModified: buildTime,
    },
  ]);

  const localizedGuides = (
    await Promise.all(
      supportedLocales.map(async (locale) => {
        const guides = await getGuideSummaries(locale);
        return guides.map((guide) => ({
          url: getCanonicalUrl(localizePath(`/guides/${guide.slug}`, locale)),
          lastModified: new Date(guide.meta.updatedAt),
        }));
      }),
    )
  ).flat();

  return [...localizedRoutes, ...localizedGuides];
}
