'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { defaultLocale, isLocale, localeLabel, localizePath, supportedLocales, type Locale } from '../i18n';
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
  const hasLocalePrefix = segments.length > 0 && isLocale(segments[0]);
  const currentLocale: Locale = hasLocalePrefix ? segments[0] : defaultLocale;
  const routeWithoutLocale = `/${segments.slice(hasLocalePrefix ? 1 : 0).join('/')}`;
  const normalizedRoute = routeWithoutLocale === '/' || routeWithoutLocale === '' ? '/' : routeWithoutLocale;

  const singleState = decodeSingleState(searchParams.get(SINGLE_STATE_PARAM) ?? undefined);
  const parlayState = decodeParlayState(searchParams.get(PARLAY_STATE_PARAM) ?? undefined);

  const parlaySeed = singleState && hasValidOdds(singleState.odds) ? encodeSingleState(singleState) : undefined;
  const extractedSingleState = parlayState ? extractSingleStateFromParlay(parlayState) : null;
  const singleSeed = extractedSingleState ? encodeSingleState(extractedSingleState) : undefined;

  const search = searchParams.toString();

  const localeHref = (locale: Locale): string => {
    const nextPath = localizePath(normalizedRoute, locale);
    return search ? `${nextPath}?${search}` : nextPath;
  };

  const labelCopy = currentLocale === 'es'
    ? { single: 'Simple', parlay: 'Parlay', nav: 'Navegacion de calculadora', calcType: 'Tipo de calculadora', language: 'Idioma' }
    : { single: 'Single', parlay: 'Parlay', nav: 'Calculator navigation', calcType: 'Calculator type', language: 'Language' };

  const tabs = [
    { href: buildSeededRoute(localizePath('/', currentLocale), singleSeed), route: '/', label: labelCopy.single },
    { href: buildSeededRoute(localizePath('/parlay', currentLocale), parlaySeed), route: '/parlay', label: labelCopy.parlay },
  ] as const;

  return (
    <nav
      aria-label={labelCopy.nav}
      className="pointer-events-none fixed left-1/2 top-[var(--toggle-top)] z-40 -translate-x-1/2"
    >
      <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--surface)] p-1.5 shadow-[var(--shadow-md)] backdrop-blur-md">
        <div role="tablist" aria-label={labelCopy.calcType} className="inline-flex h-[var(--toggle-height)] items-center gap-0.5 rounded-full bg-[var(--surface)] p-0.5">
          {tabs.map((tab) => {
            const isActive = normalizedRoute === tab.route;

            return (
              <Link
                key={tab.route}
                href={tab.href}
                role="tab"
                aria-selected={isActive}
                className={`flex min-w-20 items-center justify-center rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
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

        <div role="group" aria-label={labelCopy.language} className="inline-flex items-center gap-1 rounded-full border border-[var(--border-color)] bg-[var(--surface-soft)] px-1 py-1">
          {supportedLocales.map((locale) => {
            const isActive = locale === currentLocale;

            return (
              <Link
                key={locale}
                href={localeHref(locale)}
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  isActive
                    ? 'bg-[var(--brand)] text-[var(--brand-foreground)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--foreground)]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {localeLabel(locale).slice(0, 2)}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}