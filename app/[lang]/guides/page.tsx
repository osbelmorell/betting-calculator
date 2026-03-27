import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import SavedGuidesPanel from '../../components/SavedGuidesPanel';
import { defaultLocale, isLocale, localizePath } from '../../i18n';
import { getGuideSummaries } from '../../guides/registry';
import { getCanonicalUrl, schemaOrgUrl, siteConfig } from '../../siteConfig';

export async function generateMetadata(props: PageProps<'/[lang]/guides'>): Promise<Metadata> {
  const { lang } = await props.params;

  if (!isLocale(lang)) {
    return {};
  }

  const title = lang === 'es' ? 'Guías de Apuestas | Cuotas, Parlay y Probabilidad' : 'Sports Betting Guides';
  const description =
    lang === 'es'
      ? 'Guías prácticas para entender conversión de líneas, probabilidad implícita, fórmula de parlay y decisiones +EV en apuestas deportivas.'
      : 'Learn sports betting math with practical guides on odds conversion, implied probability, parlay formulas, and +EV decision making.';
  const keywords =
    lang === 'es'
      ? [
          'guias de apuestas deportivas',
          'probabilidad implicita apuestas',
          'formula de parlay',
          'valor esperado apuestas',
          'conversion de cuotas',
          'formula apuestas ev positivo',
          'como usar calculadora ev',
        ]
      : [
          'sports betting guides',
          'betting odds explained',
          'implied probability guide',
          'parlay odds formula',
          'value betting guide',
          'positive ev betting formula',
          'how to use ev calculator',
        ];

  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: {
      canonical: getCanonicalUrl(localizePath('/guides', lang)),
      languages: {
        en: getCanonicalUrl(localizePath('/guides', 'en')),
        es: getCanonicalUrl(localizePath('/guides', 'es')),
        'x-default': getCanonicalUrl(localizePath('/guides', defaultLocale)),
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: getCanonicalUrl(localizePath('/guides', lang)),
      siteName: siteConfig.name,
      locale: lang === 'es' ? 'es_ES' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function LocalizedGuidesIndexPage(props: PageProps<'/[lang]/guides'>) {
  const { lang } = await props.params;

  if (!isLocale(lang)) {
    notFound();
  }

  if (lang === defaultLocale) {
    redirect('/guides');
  }

  const guides = await getGuideSummaries(lang);
  const guideItemList = {
    '@context': schemaOrgUrl,
    '@type': 'ItemList',
    itemListElement: guides.map((guide, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: getCanonicalUrl(localizePath(`/guides/${guide.slug}`, lang)),
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
      <h1 className="text-hero">Guías de Apuestas</h1>
      <p className="text-subtitle mt-4 max-w-2xl">
        Explicaciones paso a paso para entender líneas, probabilidad y cálculos de pago antes de apostar.
      </p>

      <section className="mt-8 rounded-lg border border-[var(--border-color)] bg-[var(--surface)] p-5">
        <h2 className="text-xl font-semibold tracking-tight">
          {lang === 'es' ? 'Empieza con guías de +EV' : 'Start with +EV Guides'}
        </h2>
        <p className="mt-2 text-[var(--text-secondary)]">
          {lang === 'es'
            ? 'Primero aprende la fórmula de valor esperado y luego sigue la guía práctica para evaluar apuestas +EV más rápido.'
            : 'Learn the expected value formula first, then follow the practical walkthrough to run faster +EV checks.'}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={lang === 'es' ? '/es/guides/formula-apuestas-ev-positivo' : '/guides/positive-ev-betting-formula'}
            className="btn btn-secondary btn-md"
          >
            {lang === 'es' ? 'Fórmula de Apuestas +EV' : 'Positive EV Betting Formula'}
          </Link>
          <Link
            href={lang === 'es' ? '/es/guides/como-usar-calculadora-ev' : '/guides/how-to-use-ev-calculator'}
            className="btn btn-secondary btn-md"
          >
            {lang === 'es' ? 'Cómo Usar la Calculadora +EV' : 'How to Use the +EV Calculator'}
          </Link>
        </div>
      </section>

      <div className="mt-10">
        <SavedGuidesPanel lang={lang} />
      </div>

      <section className="mt-2 border-y border-[var(--border-color)]">
        {guides.map((guide) => (
          <article key={guide.slug} className="py-6 first:pt-5 last:pb-5">
            <h2 className="text-xl font-semibold leading-tight">
              <Link
                href={localizePath(`/guides/${guide.slug}`, lang)}
                className="text-[var(--foreground)] transition-colors hover:text-[var(--brand-strong)]"
              >
                {guide.meta.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {guide.meta.readingTimeMinutes ?? 1} {lang === 'es' ? 'min de lectura' : 'min read'}
            </p>
            <p className="mt-2 text-base text-[var(--text-secondary)]">{guide.meta.description}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 rounded-lg border border-[var(--border-color)] bg-[var(--surface)] p-5">
        <h2 className="text-xl font-semibold tracking-tight">
          {lang === 'es' ? 'Herramientas Relacionadas' : 'Related Betting Tools'}
        </h2>
        <p className="mt-2 text-[var(--text-secondary)]">
          {lang === 'es'
            ? 'Aplica cada guía con ejemplos en vivo usando estas calculadoras.'
            : 'Apply each guide with live examples using the calculators below.'}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={localizePath('/', lang)} className="btn btn-secondary btn-md">
            {lang === 'es' ? 'Calculadora Simple' : 'Single Bet Calculator'}
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
    </main>
  );
}
