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

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
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

      <article className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] px-6 py-8 sm:px-10">
        <Guide />
      </article>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-secondary btn-md">Single Calculator</Link>
        <Link href="/parlay" className="btn btn-secondary btn-md">Parlay Calculator</Link>
        <Link href="/odds-converter" className="btn btn-secondary btn-md">Odds Converter</Link>
      </div>
    </main>
  );
}
