export const supportedLocales = ['en', 'es'] as const;
export type Locale = (typeof supportedLocales)[number];
export const defaultLocale: Locale = 'en';
export const prefixedLocales = supportedLocales.filter((locale) => locale !== defaultLocale);

export function isLocale(locale: string): locale is Locale {
  return (supportedLocales as readonly string[]).includes(locale);
}

export function localizePath(pathname: string, locale: Locale): string {
  const normalizedPath = pathname === '' ? '/' : pathname;

  if (locale === defaultLocale) {
    return normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
  }

  if (normalizedPath === '/') {
    return `/${locale}`;
  }

  return `/${locale}${normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`}`;
}

export function getPathWithoutLocale(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const maybeLocale = segments[0];

  if (!maybeLocale || !isLocale(maybeLocale)) {
    return pathname === '' ? '/' : pathname;
  }

  const strippedPath = `/${segments.slice(1).join('/')}`;
  return strippedPath === '/' || strippedPath === '' ? '/' : strippedPath;
}

export function localeLabel(locale: Locale): string {
  return locale === 'es' ? 'Español' : 'English';
}
