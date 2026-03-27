import type { Locale } from '../i18n';

export const guideSlugPairs = [
  {
    en: 'american-odds-to-decimal',
    es: 'lineas-americanas-a-decimales',
  },
  {
    en: 'implied-probability-guide',
    es: 'guia-probabilidad-implicita',
  },
  {
    en: 'parlay-odds-formula',
    es: 'formula-cuotas-parlay',
  },
  {
    en: 'what-does-minus-110-mean',
    es: 'que-significa-menos-110',
  },
  {
    en: 'value-betting-with-implied-probability',
    es: 'valor-en-apuestas-con-probabilidad-implicita',
  },
  {
    en: 'parlay-vs-straight-bets',
    es: 'parlay-vs-apuesta-simple',
  },
] as const;

export function mapGuideSlug(slug: string, fromLocale: Locale, toLocale: Locale): string | null {
  const match = guideSlugPairs.find((guide) => guide[fromLocale] === slug);
  return match ? match[toLocale] : null;
}
