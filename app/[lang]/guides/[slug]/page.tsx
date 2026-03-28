import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import GuideSectionNav from '../../../components/GuideSectionNav';
import GuideActionsBar from '../../../components/GuideActionsBar';
import { defaultLocale, isLocale, localizePath, prefixedLocales } from '../../../i18n';
import { getGuide, getGuideSlugs, getGuideSummaries } from '../../../guides/registry';
import { mapGuideSlug } from '../../../guides/slugMap';
import { getCanonicalUrl, getSocialImageUrl, schemaOrgUrl, siteConfig } from '../../../siteConfig';

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
    keywords: guide.meta.keywords,
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
      images: [{ url: getSocialImageUrl(), width: 1200, height: 630, alt: guide.meta.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.meta.title,
      description: guide.meta.description,
      images: [getSocialImageUrl()],
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
  const allGuides = await getGuideSummaries(lang);
  if (!guide) {
    notFound();
  }

  const Guide = guide.default;
  const canonicalUrl = getCanonicalUrl(localizePath(`/guides/${slug}`, lang));
  const guidesIndexUrl = getCanonicalUrl(localizePath('/guides', lang));
  const articleAuthor = guide.meta.author ?? {
    type: 'Organization' as const,
    name: siteConfig.name,
    credentials: lang === 'es' ? 'Equipo editorial' : 'Editorial Team',
    url: siteConfig.url,
  };
  const authorJsonLd = articleAuthor.type === 'Person'
    ? {
        '@type': 'Person',
        name: articleAuthor.name,
        ...(articleAuthor.credentials ? { description: articleAuthor.credentials } : {}),
        ...(articleAuthor.url ? { url: articleAuthor.url } : {}),
      }
    : {
        '@type': 'Organization',
        name: articleAuthor.name,
        ...(articleAuthor.url ? { url: articleAuthor.url } : {}),
      };

  const articleJsonLd = {
    '@context': schemaOrgUrl,
    '@type': 'Article',
    headline: guide.meta.title,
    description: guide.meta.description,
    inLanguage: lang,
    datePublished: `${guide.meta.publishedAt}T00:00:00Z`,
    dateModified: `${guide.meta.updatedAt}T00:00:00Z`,
    mainEntityOfPage: canonicalUrl,
    author: authorJsonLd,
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

  const breadcrumbJsonLd = {
    '@context': schemaOrgUrl,
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: lang === 'es' ? 'Inicio' : 'Home',
        item: getCanonicalUrl(localizePath('/', lang)),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: lang === 'es' ? 'Guías' : 'Guides',
        item: guidesIndexUrl,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: guide.meta.title,
        item: canonicalUrl,
      },
    ],
  };

  const sections = [
    { id: 'overview', label: lang === 'es' ? 'Resumen' : 'Overview' },
    { id: 'guide-content', label: lang === 'es' ? 'Guía' : 'Guide' },
    ...(guide.meta.faq?.length ? [{ id: 'common-questions', label: lang === 'es' ? 'Preguntas comunes' : 'Common Questions' }] : []),
    { id: 'tools', label: lang === 'es' ? 'Herramientas' : 'Tools' },
  ];

  return (
    <main role="main" className="mx-auto w-full max-w-7xl px-6 py-12 lg:py-16">
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c'),
        }}
      />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[var(--text-secondary)]">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href={localizePath('/', lang)} className="hover:text-[var(--foreground)]">
              {lang === 'es' ? 'Inicio' : 'Home'}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={localizePath('/guides', lang)} className="hover:text-[var(--foreground)]">
              {lang === 'es' ? 'Guías' : 'Guides'}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-[var(--foreground)]">{guide.meta.title}</li>
        </ol>
      </nav>

      <details className="mt-6 rounded-lg border border-[var(--border-color)] bg-[var(--surface)] p-4 lg:hidden">
        <summary className="cursor-pointer list-none text-sm font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
          {lang === 'es' ? 'Todos los artículos' : 'All Articles'}
        </summary>
        <nav className="mt-3 space-y-1 border-t border-[var(--border-color)] pt-3">
          {allGuides.map((item) => {
            const isActive = item.slug === slug;

            return (
              <Link
                key={item.slug}
                href={localizePath(`/guides/${item.slug}`, lang)}
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
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
              {lang === 'es' ? 'Todos los artículos' : 'All Articles'}
            </p>
            <nav className="mt-3 space-y-1">
              {allGuides.map((item) => {
                const isActive = item.slug === slug;

                return (
                  <Link
                    key={item.slug}
                    href={localizePath(`/guides/${item.slug}`, lang)}
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
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-[var(--text-secondary)]">
              {lang === 'es' ? 'Guías' : 'Guides'}
            </p>
            <h1 className="mt-3 max-w-4xl text-hero">{guide.meta.title}</h1>
            <p className="mt-4 max-w-3xl text-subtitle">{guide.meta.description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--text-secondary)]">
              <span>
                {lang === 'es' ? 'Por' : 'By'} {articleAuthor.name}
                {articleAuthor.credentials ? `, ${articleAuthor.credentials}` : ''}
              </span>
              <time dateTime={guide.meta.publishedAt}>{lang === 'es' ? 'Publicado' : 'Published'} {guide.meta.publishedAt}</time>
              <time dateTime={guide.meta.updatedAt}>{lang === 'es' ? 'Actualizado' : 'Updated'} {guide.meta.updatedAt}</time>
              <span>
                {guide.meta.readingTimeMinutes ?? 1} {lang === 'es' ? 'min de lectura' : 'min read'}
              </span>
            </div>
            <GuideActionsBar
              contentSelector="#guide-content"
              lang={lang}
              title={guide.meta.title}
            />
          </header>

          <div id="guide-content" className="pt-8">
            <Guide />
          </div>

          {guide.meta.faq?.length ? (
            <section id="common-questions" className="mt-14 border-t border-[var(--border-color)] pt-10">
              <h2 className="text-3xl font-semibold tracking-tight">
                {lang === 'es' ? 'Preguntas comunes' : 'Common Questions'}
              </h2>
              <div className="mt-6 space-y-6">
                {guide.meta.faq.map((item) => (
                  <details key={item.question} className="rounded-lg border border-[var(--border-color)] bg-[var(--surface)] p-5 group">
                    <summary className="text-lg font-semibold cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
                      {item.question}
                    </summary>
                    <div className="mt-2 text-base leading-7 text-[var(--text-secondary)]">
                      {item.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ) : null}

          <section id="tools" className="mt-14 border-t border-[var(--border-color)] pt-10">
            <h2 className="text-3xl font-semibold tracking-tight">
              {lang === 'es' ? 'Prueba las calculadoras' : 'Try the Calculators'}
            </h2>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={localizePath('/', lang)} className="btn btn-secondary btn-md">
                {lang === 'es' ? 'Calculadora Simple' : 'Single Calculator'}
              </Link>
              <Link href={localizePath('/parlay', lang)} className="btn btn-secondary btn-md">
                {lang === 'es' ? 'Calculadora Parlay' : 'Parlay Calculator'}
              </Link>
              <Link href={localizePath('/ev', lang)} className="btn btn-secondary btn-md">
                {lang === 'es' ? 'Calculadora +EV' : '+EV Calculator'}
              </Link>
              <Link href={localizePath('/odds-converter', lang)} className="btn btn-secondary btn-md">
                {lang === 'es' ? 'Conversor de Líneas' : 'Odds Converter'}
              </Link>
            </div>
          </section>
        </article>

        <aside className="hidden lg:block">
          <GuideSectionNav title={lang === 'es' ? 'En esta página' : 'On this page'} sections={sections} />
        </aside>
      </div>
    </main>
  );
}
