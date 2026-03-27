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

  const sections = [
    { id: 'overview', label: lang === 'es' ? 'Resumen' : 'Overview' },
    { id: 'guide-content', label: lang === 'es' ? 'Guia' : 'Guide' },
    ...(guide.meta.faq?.length ? [{ id: 'common-questions', label: lang === 'es' ? 'Preguntas comunes' : 'Common Questions' }] : []),
    { id: 'tools', label: lang === 'es' ? 'Herramientas' : 'Tools' },
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
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-[var(--text-secondary)]">
          {lang === 'es' ? 'Guias' : 'Guides'}
        </p>
        <h1 className="mt-3 max-w-4xl text-hero">{guide.meta.title}</h1>
        <p className="mt-4 max-w-3xl text-subtitle">{guide.meta.description}</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--text-secondary)]">
          <span>{lang === 'es' ? 'Publicado' : 'Published'} {guide.meta.publishedAt}</span>
          <span>{lang === 'es' ? 'Actualizado' : 'Updated'} {guide.meta.updatedAt}</span>
        </div>
      </div>

      <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_260px]">
        <article id="guide-content" className="min-w-0 pb-4">
          <Guide />

          {guide.meta.faq?.length ? (
            <section id="common-questions" className="mt-14 border-t border-[var(--border-color)] pt-10">
              <h2 className="text-3xl font-semibold tracking-tight">
                {lang === 'es' ? 'Preguntas comunes' : 'Common Questions'}
              </h2>
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
            <h2 className="text-3xl font-semibold tracking-tight">
              {lang === 'es' ? 'Prueba las calculadoras' : 'Try the Calculators'}
            </h2>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={localizePath('/', lang)} className="btn btn-secondary btn-md">Calculadora Simple</Link>
              <Link href={localizePath('/parlay', lang)} className="btn btn-secondary btn-md">Calculadora Parlay</Link>
              <Link href={localizePath('/odds-converter', lang)} className="btn btn-secondary btn-md">Conversor de Líneas</Link>
            </div>
          </section>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
              {lang === 'es' ? 'En esta pagina' : 'On this page'}
            </p>
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
