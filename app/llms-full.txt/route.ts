import { getCanonicalUrl } from '../siteConfig';

export const dynamic = 'force-static';

const calculators = [
  {
    title: 'Single Bet Calculator',
    path: '/',
    description: 'Compute payout, profit, and implied probability for a single bet.',
  },
  {
    title: 'Parlay Calculator',
    path: '/parlay',
    description: 'Combine multiple legs and calculate total odds and estimated return.',
  },
  {
    title: 'EV Calculator',
    path: '/ev',
    description: 'Estimate expected value and break-even probability from odds and hit rate.',
  },
  {
    title: 'Odds Converter',
    path: '/odds-converter',
    description: 'Convert odds between American, decimal, fractional, and implied probability.',
  },
] as const;

const guides = [
  {
    title: 'Guides Hub (EN)',
    path: '/guides',
    description: 'Index of English betting guides and explainers.',
  },
  {
    title: 'Guides Hub (ES)',
    path: '/es/guides',
    description: 'Index of Spanish betting guides and explainers.',
  },
] as const;

function toListLine(title: string, path: string, description: string): string {
  return `- [${title}](${getCanonicalUrl(path)}): ${description}`;
}

export async function GET(): Promise<Response> {
  const body = [
    '# Calc My Bets - Expanded LLM Context',
    '',
    '> Extended context file for LLMs and agents that need a longer, curated overview of core resources.',
    '',
    'Use canonical URLs where possible. Content is educational and not financial advice.',
    '',
    '## Core Calculators',
    ...calculators.map((item) => toListLine(item.title, item.path, item.description)),
    '',
    '## Core Guide Indexes',
    ...guides.map((item) => toListLine(item.title, item.path, item.description)),
    '',
    '## Discovery Files',
    `- [robots.txt](${getCanonicalUrl('/robots.txt')}): Crawl policy and sitemap reference.`,
    `- [sitemap.xml](${getCanonicalUrl('/sitemap.xml')}): Canonical URL inventory.`,
    `- [llms.txt](${getCanonicalUrl('/llms.txt')}): Primary concise LLM guidance file.`,
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
