import type { ComponentType } from 'react';
import type { Locale } from '../i18n';
import { guideSlugPairs, mapGuideSlug } from './slugMap';

export type GuideFaqItem = {
  question: string;
  answer: string;
};

export type GuideMeta = {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  keywords: string[];
  faq?: GuideFaqItem[];
};

type GuideModule = {
  default: ComponentType;
  meta: GuideMeta;
};

const guideDefinitions = [
  {
    ...guideSlugPairs[0],
    loadEn: () => import('@/content/guides/en/american-odds-to-decimal.mdx') as Promise<GuideModule>,
    loadEs: () => import('@/content/guides/es/american-odds-to-decimal.mdx') as Promise<GuideModule>,
  },
  {
    ...guideSlugPairs[1],
    loadEn: () => import('@/content/guides/en/implied-probability-guide.mdx') as Promise<GuideModule>,
    loadEs: () => import('@/content/guides/es/implied-probability-guide.mdx') as Promise<GuideModule>,
  },
  {
    ...guideSlugPairs[2],
    loadEn: () => import('@/content/guides/en/parlay-odds-formula.mdx') as Promise<GuideModule>,
    loadEs: () => import('@/content/guides/es/parlay-odds-formula.mdx') as Promise<GuideModule>,
  },
  {
    ...guideSlugPairs[3],
    loadEn: () => import('@/content/guides/en/what-does-minus-110-mean.mdx') as Promise<GuideModule>,
    loadEs: () => import('@/content/guides/es/what-does-minus-110-mean.mdx') as Promise<GuideModule>,
  },
  {
    ...guideSlugPairs[4],
    loadEn: () => import('@/content/guides/en/value-betting-with-implied-probability.mdx') as Promise<GuideModule>,
    loadEs: () => import('@/content/guides/es/value-betting-with-implied-probability.mdx') as Promise<GuideModule>,
  },
  {
    ...guideSlugPairs[5],
    loadEn: () => import('@/content/guides/en/parlay-vs-straight-bets.mdx') as Promise<GuideModule>,
    loadEs: () => import('@/content/guides/es/parlay-vs-straight-bets.mdx') as Promise<GuideModule>,
  },
] as const;

export function getGuideSlugs(locale: Locale): string[] {
  return guideDefinitions.map((guide) => guide[locale]);
}

export async function getGuide(locale: Locale, slug: string): Promise<GuideModule | null> {
  const match = guideDefinitions.find((guide) => guide[locale] === slug);
  if (!match) {
    return null;
  }

  return locale === 'es' ? match.loadEs() : match.loadEn();
}

export async function getGuideSummaries(locale: Locale): Promise<Array<{ slug: string; meta: GuideMeta }>> {
  const slugs = getGuideSlugs(locale);
  const guides = await Promise.all(
    slugs.map(async (slug) => {
      const guide = await getGuide(locale, slug);
      return guide ? { slug, meta: guide.meta } : null;
    }),
  );

  return guides.filter((guide): guide is { slug: string; meta: GuideMeta } => guide !== null);
}
