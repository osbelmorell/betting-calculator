'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { globalCalcToggleContent } from '../content/calculatorContent';
import { defaultLocale, isLocale, localizePath, supportedLocales, type Locale } from '../i18n';
import { mapGuideSlug } from '../guides/slugMap';
import {
  buildSeededRoute,
  decodeParlayState,
  decodeSingleState,
  encodeSingleState,
  extractSingleStateFromParlay,
  hasValidOdds,
  PARLAY_STATE_PARAM,
  SINGLE_STATE_PARAM,
} from './calculatorState';

export default function GlobalCalcToggle() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const segments = pathname.split('/').filter(Boolean);
  const maybeLocale = segments[0];
  const hasLocalePrefix = !!maybeLocale && isLocale(maybeLocale);
  const currentLocale: Locale = hasLocalePrefix ? maybeLocale : defaultLocale;
  const routeWithoutLocale = `/${segments.slice(hasLocalePrefix ? 1 : 0).join('/')}`;
  const normalizedRoute = routeWithoutLocale === '/' || routeWithoutLocale === '' ? '/' : routeWithoutLocale;

  const singleState = decodeSingleState(searchParams.get(SINGLE_STATE_PARAM) ?? undefined);
  const parlayState = decodeParlayState(searchParams.get(PARLAY_STATE_PARAM) ?? undefined);

  const parlaySeed = singleState && hasValidOdds(singleState.odds) ? encodeSingleState(singleState) : undefined;
  const extractedSingleState = parlayState ? extractSingleStateFromParlay(parlayState) : null;
  const singleSeed = extractedSingleState ? encodeSingleState(extractedSingleState) : undefined;

  const search = searchParams.toString();

  const localeHref = (locale: Locale): string => {
    if (normalizedRoute.startsWith('/guides/')) {
      const currentSlug = normalizedRoute.slice('/guides/'.length);
      const mappedSlug = mapGuideSlug(currentSlug, currentLocale, locale) ?? currentSlug;
      const nextPath = localizePath(`/guides/${mappedSlug}`, locale);
      return search ? `${nextPath}?${search}` : nextPath;
    }

    const nextPath = localizePath(normalizedRoute, locale);
    return search ? `${nextPath}?${search}` : nextPath;
  };

  const labelCopy = globalCalcToggleContent[currentLocale];

  const tabs = [
    { href: buildSeededRoute(localizePath('/', currentLocale), singleSeed), route: '/', label: labelCopy.single },
    { href: buildSeededRoute(localizePath('/parlay', currentLocale), parlaySeed), route: '/parlay', label: labelCopy.parlay },
    { href: localizePath('/odds-converter', currentLocale), route: '/odds-converter', label: labelCopy.odds },
    { href: localizePath('/guides', currentLocale), route: '/guides', label: labelCopy.guides },
  ] as const;

  return (
    <nav
      aria-label={labelCopy.nav}
      className="pointer-events-none fixed left-0 right-0 top-0 z-40 sm:left-1/2 sm:right-auto sm:top-[var(--toggle-top)] sm:-translate-x-1/2"
    >
      <div className="pointer-events-auto flex w-full items-center gap-2 border-b border-[var(--border-color)] bg-[var(--surface)] px-3 py-2 backdrop-blur-md sm:inline-flex sm:w-auto sm:gap-1 sm:rounded-full sm:border sm:p-1 sm:shadow-[var(--shadow-md)]">
        <div className="hide-touch-scrollbar min-w-0 flex-1 overflow-x-auto sm:overflow-visible">
          <div role="tablist" aria-label={labelCopy.calcType} className="inline-flex min-w-max items-center gap-0.5 sm:flex-none sm:rounded-full sm:bg-[var(--surface)] sm:p-0.5">
          {tabs.map((tab) => {
            const isActive = tab.route === '/'
              ? normalizedRoute === '/'
              : normalizedRoute === tab.route || normalizedRoute.startsWith(tab.route + '/');

            return (
              <Link
                key={tab.route}
                href={tab.href}
                role="tab"
                aria-selected={isActive}
                className={`flex shrink-0 items-center justify-center rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200 sm:min-w-20 sm:flex-none sm:px-5 ${
                  isActive
                    ? 'bg-[var(--brand)] text-[var(--brand-foreground)] shadow-sm'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
          </div>
        </div>

        <div role="group" aria-label={labelCopy.language} className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full border border-[var(--border-color)] bg-[var(--surface-soft)] p-0.5 sm:ml-0">
          {supportedLocales.map((locale) => {
            const isActive = locale === currentLocale;

            return (
              <Link
                key={locale}
                href={localeHref(locale)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  isActive
                    ? 'bg-[var(--brand)] text-[var(--brand-foreground)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--foreground)]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {labelCopy.localeNames[locale].slice(0, 2)}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}