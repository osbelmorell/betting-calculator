import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import EvCalculator from '../../components/EvCalculator';
import { evCalculatorSeo } from '../../ev/content';
import { defaultLocale, isLocale, localizePath } from '../../i18n';
import { getCanonicalUrl, schemaOrgUrl, siteConfig } from '../../siteConfig';

export async function generateMetadata(props: PageProps<'/[lang]/ev'>): Promise<Metadata> {
  const { lang } = await props.params;

  if (!isLocale(lang)) {
    return {};
  }

  const localizedCopy = evCalculatorSeo[lang];

  return {
    title: { absolute: localizedCopy.title },
    description: localizedCopy.description,
    keywords:
      lang === 'es'
        ? [
            'calculadora ev',
            'valor esperado apuestas',
            'apuestas ev positivo',
            'probabilidad de equilibrio',
          ]
        : [
            'ev calculator',
            'expected value betting calculator',
            'positive ev betting',
            'break-even probability calculator',
          ],
    alternates: {
      canonical: getCanonicalUrl(localizePath('/ev', lang)),
      languages: {
        en: getCanonicalUrl(localizePath('/ev', 'en')),
        es: getCanonicalUrl(localizePath('/ev', 'es')),
        'x-default': getCanonicalUrl(localizePath('/ev', defaultLocale)),
      },
    },
    openGraph: {
      title: localizedCopy.title,
      description: localizedCopy.description,
      url: getCanonicalUrl(localizePath('/ev', lang)),
      siteName: siteConfig.name,
      type: 'website',
      locale: lang === 'es' ? 'es_ES' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: localizedCopy.title,
      description: localizedCopy.description,
    },
  };
}

export default async function LocalizedEvPage(props: PageProps<'/[lang]/ev'>) {
  const { lang } = await props.params;

  if (!isLocale(lang)) {
    notFound();
  }

  if (lang === defaultLocale) {
    redirect('/ev');
  }

  const localizedCopy = evCalculatorSeo[lang];
  const webApplicationJsonLd = {
    '@context': schemaOrgUrl,
    '@type': 'WebApplication',
    name: localizedCopy.title,
    description: localizedCopy.description,
    url: getCanonicalUrl(localizePath('/ev', lang)),
    applicationCategory: 'FinanceApplication',
    applicationSubCategory: 'Expected Value Calculator',
    inLanguage: lang,
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
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
        name: lang === 'es' ? 'Calculadora EV' : 'EV Calculator',
        item: getCanonicalUrl(localizePath('/ev', lang)),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webApplicationJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': schemaOrgUrl,
            '@type': 'FAQPage',
            mainEntity: localizedCopy.faq.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          }).replace(/</g, '\\u003c'),
        }}
      />
      <EvCalculator locale={lang} />
    </>
  );
}