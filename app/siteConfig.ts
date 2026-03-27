import { defaultLocale, isLocale, localizePath, type Locale } from './i18n';

const FALLBACK_SITE_URL = 'https://www.calcmybets.com';
const FALLBACK_SITE_NAME = 'Betting Calculator';
const FALLBACK_DEFAULT_TITLE = 'Betting Calculator | Free Odds & Parlay Calculator';
const FALLBACK_SITE_DESCRIPTION =
  'Free betting calculator with live odds conversion. Calculate single bet payouts, parlays, and implied probability across American, fractional, decimal, and implied formats.';

function readPublicEnv(value: string | undefined, fallback: string): string {
  const normalizedValue = value?.trim();
  return normalizedValue ? normalizedValue : fallback;
}

function normalizeSiteUrl(value: string | undefined): string {
  const siteUrl = readPublicEnv(value, FALLBACK_SITE_URL);
  const trimmedSiteUrl = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;

  try {
    const parsedUrl = new URL(trimmedSiteUrl);

    if (parsedUrl.hostname === 'calcmybets.com') {
      parsedUrl.hostname = 'www.calcmybets.com';
    }

    return parsedUrl.origin;
  } catch {
    return trimmedSiteUrl;
  }
}

export const schemaOrgUrl = 'https://schema.org';

export const siteConfig = {
  name: readPublicEnv(process.env.NEXT_PUBLIC_SITE_NAME, FALLBACK_SITE_NAME),
  url: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  defaultTitle: readPublicEnv(process.env.NEXT_PUBLIC_SITE_DEFAULT_TITLE, FALLBACK_DEFAULT_TITLE),
  description: readPublicEnv(process.env.NEXT_PUBLIC_SITE_DESCRIPTION, FALLBACK_SITE_DESCRIPTION),
  openGraphDescription:
    'Free single bet and parlay calculator with real-time odds conversion and implied winning percentage.',
  twitterDescription:
    'Single and parlay payout calculator with American, decimal, fractional, and implied odds conversion.',
  webApplicationDescription:
    'Free betting calculator with live odds conversion. Calculate single bet payouts, parlays, and implied probability.',
  keywords: [
    'betting calculator',
    'parlay calculator',
    'american odds converter',
    'decimal odds calculator',
    'implied probability',
    'sports betting calculator',
    'odds converter',
  ],
} as const;

export const singleBetPageConfig = {
  title: 'Single Bet Calculator | Free Odds Conversion Tool',
  description:
    'Fast, free single bet calculator. Calculate payouts, winnings, and implied probability instantly. Convert between American, fractional, decimal, and percentage odds formats.',
} as const;

export const parlayPageConfig = {
  title: 'Parlay Calculator | Free Multi-Leg Betting Tool',
  description:
    'Build and calculate parlays with unlimited legs. Convert each leg odds format, calculate combined odds, payouts, and winning probability. Free parlay betting calculator.',
} as const;

export function getCanonicalUrl(pathname: string = '/'): string {
  return new URL(pathname, `${siteConfig.url}/`).toString();
}

export function getLocalizedCanonicalUrl(pathname: string, locale: Locale = defaultLocale): string {
  return getCanonicalUrl(localizePath(pathname, locale));
}

export function resolveLocale(value: string | undefined): Locale {
  if (value && isLocale(value)) {
    return value;
  }

  return defaultLocale;
}

export const siteTitleTemplate = `%s | ${siteConfig.name}`;