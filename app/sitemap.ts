import { MetadataRoute } from 'next';
import { localizePath, supportedLocales } from './i18n';
import { getGuideSummaries } from './guides/registry';
import { mapGuideSlug } from './guides/slugMap';
import { getCanonicalUrl } from './siteConfig';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const buildTime = new Date();
  const localizeLanguages = (pathname: string) => ({
    en: getCanonicalUrl(localizePath(pathname, 'en')),
    es: getCanonicalUrl(localizePath(pathname, 'es')),
    'x-default': getCanonicalUrl(localizePath(pathname, 'en')),
  });

  const localizedRoutes = supportedLocales.flatMap((locale) => {
    const localizedUrl = (pathname: string) => getCanonicalUrl(localizePath(pathname, locale));

    return [
      {
        url: localizedUrl('/'),
        lastModified: buildTime,
        alternates: {
          languages: localizeLanguages('/'),
        },
      },
      {
        url: localizedUrl('/odds-converter'),
        lastModified: buildTime,
        alternates: {
          languages: localizeLanguages('/odds-converter'),
        },
      },
      {
        url: localizedUrl('/parlay'),
        lastModified: buildTime,
        alternates: {
          languages: localizeLanguages('/parlay'),
        },
      },
      {
        url: localizedUrl('/ev'),
        lastModified: buildTime,
        alternates: {
          languages: localizeLanguages('/ev'),
        },
      },
      {
        url: localizedUrl('/guides'),
        lastModified: buildTime,
        alternates: {
          languages: localizeLanguages('/guides'),
        },
      },
    ];
  });

  const localizedGuides = (
    await Promise.all(
      supportedLocales.map(async (locale) => {
        const guides = await getGuideSummaries(locale);
        return guides.map((guide) => ({
          url: getCanonicalUrl(localizePath(`/guides/${guide.slug}`, locale)),
          lastModified: new Date(guide.meta.updatedAt),
          alternates: {
            languages: {
              en: getCanonicalUrl(
                localizePath(`/guides/${mapGuideSlug(guide.slug, locale, 'en') ?? guide.slug}`, 'en'),
              ),
              es: getCanonicalUrl(
                localizePath(`/guides/${mapGuideSlug(guide.slug, locale, 'es') ?? guide.slug}`, 'es'),
              ),
              'x-default': getCanonicalUrl(
                localizePath(`/guides/${mapGuideSlug(guide.slug, locale, 'en') ?? guide.slug}`, 'en'),
              ),
            },
          },
        }));
      }),
    )
  ).flat();

  return [...localizedRoutes, ...localizedGuides];
}
