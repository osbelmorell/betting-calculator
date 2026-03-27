import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import GuideSectionNav from '../../components/GuideSectionNav';
import { getGuide, getGuideSlugs, getGuideSummaries } from '../registry';
import { mapGuideSlug } from '../slugMap';
import { getCanonicalUrl, schemaOrgUrl, siteConfig } from '../../siteConfig';

export const dynamicParams = false;

export function generateStaticParams() {
  return getGuideSlugs('en').map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<'/guides/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const guide = await getGuide('en', slug);
  const spanishSlug = mapGuideSlug(slug, 'en', 'es') ?? slug;

  if (!guide) {
    return {};
  }

  return {
    title: guide.meta.title,
    description: guide.meta.description,
    alternates: {
      canonical: getCanonicalUrl(`/guides/${slug}`),
      languages: {
        en: getCanonicalUrl(`/guides/${slug}`),
        es: getCanonicalUrl(`/es/guides/${spanishSlug}`),
        'x-default': getCanonicalUrl(`/guides/${slug}`),
      },
    },
    openGraph: {
      title: guide.meta.title,
      description: guide.meta.description,
      type: 'article',
      url: getCanonicalUrl(`/guides/${slug}`),
      siteName: siteConfig.name,
      locale: 'en_US',
      publishedTime: guide.meta.publishedAt,
      modifiedTime: guide.meta.updatedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.meta.title,
      description: guide.meta.description,
    },
  };
}

export default async function GuidePage(props: PageProps<'/guides/[slug]'>) {
  const { slug } = await props.params;
  const guide = await getGuide('en', slug);
  const allGuides = await getGuideSummaries('en');

  if (!guide) {
    notFound();
  }

  const Guide = guide.default;
  const articleJsonLd = {
    '@context': schemaOrgUrl,
    '@type': 'Article',
    headline: guide.meta.title,
    description: guide.meta.description,
    datePublished: `${guide.meta.publishedAt}T00:00:00Z`,
    dateModified: `${guide.meta.updatedAt}T00:00:00Z`,
    mainEntityOfPage: getCanonicalUrl(`/guides/${slug}`),
    author: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  const faqJsonLd = guide.meta.faq
    ? {
        '@context': schemaOrgUrl,
        '@type': 'FAQPage',
        mainEntity: guide.meta.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }
    : null;

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'guide-content', label: 'Guide' },
    ...(guide.meta.faq?.length ? [{ id: 'common-questions', label: 'Common Questions' }] : []),
    { id: 'tools', label: 'Tools' },
  ];

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-12 lg:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c'),
          }}
        />
      ) : null}

      <details className="mt-6 rounded-lg border border-[var(--border-color)] bg-[var(--surface)] p-4 lg:hidden">
        <summary className="cursor-pointer list-none text-sm font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
          All Articles
        </summary>
        <nav className="mt-3 space-y-1 border-t border-[var(--border-color)] pt-3">
          {allGuides.map((item) => {
            const isActive = item.slug === slug;

            return (
              <Link
                key={item.slug}
                href={`/guides/${item.slug}`}
                className={`block rounded px-2 py-1.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-[var(--surface-soft)] font-medium text-[var(--foreground)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.meta.title}
              </Link>
            );
          })}
        </nav>
      </details>

      <div className="mt-8 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)_220px]">
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)]">All Articles</p>
            <nav className="mt-3 space-y-1">
              {allGuides.map((item) => {
                const isActive = item.slug === slug;

                return (
                  <Link
                    key={item.slug}
                    href={`/guides/${item.slug}`}
                    className={`block rounded px-2 py-1.5 text-sm transition-colors ${
                      isActive
                        ? 'bg-[var(--surface-soft)] font-medium text-[var(--foreground)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.meta.title}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        <article className="min-w-0 pb-4">
          <header id="overview" className="border-b border-[var(--border-color)] pb-8">
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-[var(--text-secondary)]">Guides</p>
            <h1 className="mt-3 max-w-4xl text-hero">{guide.meta.title}</h1>
            <p className="mt-4 max-w-3xl text-subtitle">{guide.meta.description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--text-secondary)]">
              <time dateTime={guide.meta.publishedAt}>Published {guide.meta.publishedAt}</time>
              <time dateTime={guide.meta.updatedAt}>Updated {guide.meta.updatedAt}</time>
            </div>
          </header>

          <div id="guide-content" className="pt-8">
            <Guide />
          </div>

          {guide.meta.faq?.length ? (
            <section id="common-questions" className="mt-14 border-t border-[var(--border-color)] pt-10">
              <h2 className="text-3xl font-semibold tracking-tight">Common Questions</h2>
              <div className="mt-6 space-y-6">
                {guide.meta.faq.map((item) => (
                  <div key={item.question} className="rounded-lg border border-[var(--border-color)] bg-[var(--surface)] p-5">
                    <h3 className="text-lg font-semibold">{item.question}</h3>
                    <p className="mt-2 text-base leading-7 text-[var(--text-secondary)]">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <section id="tools" className="mt-14 border-t border-[var(--border-color)] pt-10">
            <h2 className="text-3xl font-semibold tracking-tight">Try the Calculators</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/" className="btn btn-secondary btn-md">Single Calculator</Link>
              <Link href="/parlay" className="btn btn-secondary btn-md">Parlay Calculator</Link>
              <Link href="/odds-converter" className="btn btn-secondary btn-md">Odds Converter</Link>
            </div>
          </section>
        </article>

        <aside className="hidden lg:block">
          <GuideSectionNav title="On this page" sections={sections} />
        </aside>
      </div>
    </main>
  );
}
