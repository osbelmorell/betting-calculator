import type { Metadata } from 'next';
import Link from 'next/link';
import { getGuideSummaries } from './registry';
import { getCanonicalUrl, schemaOrgUrl, siteConfig } from '../siteConfig';

export const metadata: Metadata = {
  title: 'Sports Betting Guides',
  description:
    'Learn sports betting math with practical guides on odds conversion, implied probability, parlay formulas, and value betting decisions.',
  keywords: [
    'sports betting guides',
    'betting odds explained',
    'implied probability guide',
    'parlay odds formula',
    'value betting guide',
  ],
  alternates: {
    canonical: getCanonicalUrl('/guides'),
    languages: {
      en: getCanonicalUrl('/guides'),
      es: getCanonicalUrl('/es/guides'),
      'x-default': getCanonicalUrl('/guides'),
    },
  },
  openGraph: {
    title: 'Sports Betting Guides',
    description:
      'Learn odds conversion, implied probability, parlay calculations, and betting value with practical examples.',
    url: getCanonicalUrl('/guides'),
    type: 'website',
    siteName: siteConfig.name,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sports Betting Guides',
    description:
      'Learn odds conversion, implied probability, parlay calculations, and betting value with practical examples.',
  },
};

export default async function GuidesIndexPage() {
  const guides = await getGuideSummaries('en');
  const guideItemList = {
    '@context': schemaOrgUrl,
    '@type': 'ItemList',
    itemListElement: guides.map((guide, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: getCanonicalUrl(`/guides/${guide.slug}`),
      name: guide.meta.title,
    })),
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(guideItemList).replace(/</g, '\\u003c'),
        }}
      />
      <h1 className="text-hero">Sports Betting Guides</h1>
      <p className="text-subtitle mt-4 max-w-2xl">
        Step-by-step explainers to help you understand odds, probability, and payout math before you place a bet.
      </p>

      <section className="mt-12 border-y border-[var(--border-color)]">
        {guides.map((guide) => (
          <article key={guide.slug} className="py-6 first:pt-5 last:pb-5">
            <h2 className="text-xl font-semibold leading-tight">
              <Link href={`/guides/${guide.slug}`} className="text-[var(--foreground)] transition-colors hover:text-[var(--brand)]">
                {guide.meta.title}
              </Link>
            </h2>
            <p className="mt-2 text-base text-[var(--text-secondary)]">{guide.meta.description}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 rounded-lg border border-[var(--border-color)] bg-[var(--surface)] p-5">
        <h2 className="text-xl font-semibold tracking-tight">Related Betting Tools</h2>
        <p className="mt-2 text-[var(--text-secondary)]">
          Apply each guide with live examples using the calculators below.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-secondary btn-md">Single Bet Calculator</Link>
          <Link href="/parlay" className="btn btn-secondary btn-md">Parlay Calculator</Link>
          <Link href="/odds-converter" className="btn btn-secondary btn-md">Odds Converter</Link>
        </div>
      </section>
    </main>
  );
}
