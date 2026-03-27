import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { defaultLocale, isLocale, localizePath, prefixedLocales } from '../../../i18n';
import { getGuide, getGuideSlugs } from '../../../guides/registry';
import { mapGuideSlug } from '../../../guides/slugMap';
import { getCanonicalUrl, schemaOrgUrl, siteConfig } from '../../../siteConfig';

export const dynamicParams = false;

export function generateStaticParams() {
  return prefixedLocales.flatMap((lang) => getGuideSlugs(lang).map((slug) => ({ lang, slug })));
}

export async function generateMetadata(props: PageProps<'/[lang]/guides/[slug]'>): Promise<Metadata> {
  const { lang, slug } = await props.params;

  if (!isLocale(lang)) {
    return {};
  }

  const guide = await getGuide(lang, slug);
  if (!guide) {
    return {};
  }

  const englishSlug = mapGuideSlug(slug, lang, 'en') ?? slug;
  const spanishSlug = mapGuideSlug(slug, lang, 'es') ?? slug;

  return {
    title: guide.meta.title,
    description: guide.meta.description,
    alternates: {
      canonical: getCanonicalUrl(localizePath(`/guides/${slug}`, lang)),
      languages: {
        en: getCanonicalUrl(localizePath(`/guides/${englishSlug}`, 'en')),
        es: getCanonicalUrl(localizePath(`/guides/${spanishSlug}`, 'es')),
        'x-default': getCanonicalUrl(localizePath(`/guides/${englishSlug}`, defaultLocale)),
      },
    },
    openGraph: {
      title: guide.meta.title,
      description: guide.meta.description,
      type: 'article',
      url: getCanonicalUrl(localizePath(`/guides/${slug}`, lang)),
      siteName: siteConfig.name,
      locale: lang === 'es' ? 'es_ES' : 'en_US',
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

export default async function LocalizedGuidePage(props: PageProps<'/[lang]/guides/[slug]'>) {
  const { lang, slug } = await props.params;

  if (!isLocale(lang)) {
    notFound();
  }

  if (lang === defaultLocale) {
    const englishSlug = mapGuideSlug(slug, lang, 'en') ?? slug;
    redirect(`/guides/${englishSlug}`);
  }

  const guide = await getGuide(lang, slug);
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
    mainEntityOfPage: getCanonicalUrl(localizePath(`/guides/${slug}`, lang)),
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
        <Link href={localizePath('/', lang)} className="btn btn-secondary btn-md">Calculadora Simple</Link>
        <Link href={localizePath('/parlay', lang)} className="btn btn-secondary btn-md">Calculadora Parlay</Link>
        <Link href={localizePath('/odds-converter', lang)} className="btn btn-secondary btn-md">Conversor de Líneas</Link>
      </div>
    </main>
  );
}
