import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { ComponentType } from 'react';
import type { Locale } from '../i18n';
import { guideSlugPairs } from './slugMap';

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
  readingTimeMinutes?: number;
};

type GuideModule = {
  default: ComponentType;
  meta: GuideMeta;
};

const WORDS_PER_MINUTE = 220;
const readingTimeCache = new Map<string, number>();

const guideDefinitions = [
  {
    ...guideSlugPairs[0],
    sourceEn: 'american-odds-to-decimal.mdx',
    sourceEs: 'american-odds-to-decimal.mdx',
    loadEn: () => import('@/content/guides/en/american-odds-to-decimal.mdx') as Promise<GuideModule>,
    loadEs: () => import('@/content/guides/es/american-odds-to-decimal.mdx') as Promise<GuideModule>,
  },
  {
    ...guideSlugPairs[1],
    sourceEn: 'implied-probability-guide.mdx',
    sourceEs: 'implied-probability-guide.mdx',
    loadEn: () => import('@/content/guides/en/implied-probability-guide.mdx') as Promise<GuideModule>,
    loadEs: () => import('@/content/guides/es/implied-probability-guide.mdx') as Promise<GuideModule>,
  },
  {
    ...guideSlugPairs[2],
    sourceEn: 'parlay-odds-formula.mdx',
    sourceEs: 'parlay-odds-formula.mdx',
    loadEn: () => import('@/content/guides/en/parlay-odds-formula.mdx') as Promise<GuideModule>,
    loadEs: () => import('@/content/guides/es/parlay-odds-formula.mdx') as Promise<GuideModule>,
  },
  {
    ...guideSlugPairs[3],
    sourceEn: 'what-does-minus-110-mean.mdx',
    sourceEs: 'what-does-minus-110-mean.mdx',
    loadEn: () => import('@/content/guides/en/what-does-minus-110-mean.mdx') as Promise<GuideModule>,
    loadEs: () => import('@/content/guides/es/what-does-minus-110-mean.mdx') as Promise<GuideModule>,
  },
  {
    ...guideSlugPairs[4],
    sourceEn: 'value-betting-with-implied-probability.mdx',
    sourceEs: 'value-betting-with-implied-probability.mdx',
    loadEn: () => import('@/content/guides/en/value-betting-with-implied-probability.mdx') as Promise<GuideModule>,
    loadEs: () => import('@/content/guides/es/value-betting-with-implied-probability.mdx') as Promise<GuideModule>,
  },
  {
    ...guideSlugPairs[5],
    sourceEn: 'parlay-vs-straight-bets.mdx',
    sourceEs: 'parlay-vs-straight-bets.mdx',
    loadEn: () => import('@/content/guides/en/parlay-vs-straight-bets.mdx') as Promise<GuideModule>,
    loadEs: () => import('@/content/guides/es/parlay-vs-straight-bets.mdx') as Promise<GuideModule>,
  },
] as const;

function stripMetaExport(source: string): string {
  return source.replace(/^export\s+const\s+meta\s*=\s*\{[\s\S]*?\n\};\s*/m, '');
}

function countWords(source: string): number {
  const withoutCodeBlocks = source.replace(/```[\s\S]*?```/g, ' ');
  const withoutInlineCode = withoutCodeBlocks.replace(/`[^`]*`/g, ' ');
  const normalizedText = withoutInlineCode.replace(/[^\p{L}\p{N}'-]+/gu, ' ').trim();

  if (!normalizedText) {
    return 0;
  }

  return normalizedText.split(/\s+/).length;
}

async function getReadingTimeMinutes(locale: Locale, slug: string, sourcePath: string): Promise<number> {
  const cacheKey = `${locale}:${slug}`;
  const cached = readingTimeCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const absolutePath = path.join(process.cwd(), 'content', 'guides', locale, sourcePath);
  const source = await readFile(absolutePath, 'utf8');
  const words = countWords(stripMetaExport(source));
  const minutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));

  readingTimeCache.set(cacheKey, minutes);

  return minutes;
}

export function getGuideSlugs(locale: Locale): string[] {
  return guideDefinitions.map((guide) => guide[locale]);
}

export async function getGuide(locale: Locale, slug: string): Promise<GuideModule | null> {
  const match = guideDefinitions.find((guide) => guide[locale] === slug);
  if (!match) {
    return null;
  }

  const [guide, readingTimeMinutes] = await Promise.all([
    locale === 'es' ? match.loadEs() : match.loadEn(),
    getReadingTimeMinutes(locale, slug, locale === 'es' ? match.sourceEs : match.sourceEn),
  ]);

  return {
    ...guide,
    meta: {
      ...guide.meta,
      readingTimeMinutes,
    },
  };
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
