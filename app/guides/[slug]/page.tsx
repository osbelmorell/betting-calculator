import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getGuide, getGuideSlugs } from '../registry';
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

  if (!guide) {
    notFound();
  }

  const Guide = guide.default;
  const articleJsonLd = {
    '@context': schemaOrgUrl,
    '@type': 'Article',
    headline: guide.meta.title,
    description: guide.meta.description,
    datePublished: guide.meta.publishedAt,
    dateModified: guide.meta.updatedAt,
    mainEntityOfPage: getCanonicalUrl(`/guides/${slug}`),
    author: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
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

      <div id="overview" className="border-b border-[var(--border-color)] pb-8">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-[var(--text-secondary)]">Guides</p>
        <h1 className="mt-3 max-w-4xl text-hero">{guide.meta.title}</h1>
        <p className="mt-4 max-w-3xl text-subtitle">{guide.meta.description}</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--text-secondary)]">
          <span>Published {guide.meta.publishedAt}</span>
          <span>Updated {guide.meta.updatedAt}</span>
        </div>
      </div>

      <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_260px]">
        <article id="guide-content" className="min-w-0 pb-4">
          <Guide />

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
          <div className="sticky top-28 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)]">On this page</p>
            <nav className="mt-3 space-y-1">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block rounded px-2 py-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]"
                >
                  {section.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      </div>
    </main>
  );
}
