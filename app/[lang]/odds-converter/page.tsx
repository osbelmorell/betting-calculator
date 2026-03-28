import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { defaultLocale, isLocale, localizePath } from '../../i18n';
import OddsConverter from '../../odds-converter/OddsConverter';
import { oddsConverterSeo } from '../../odds-converter/content';
import { getCanonicalUrl, getSocialImageUrl, schemaOrgUrl, siteConfig } from '../../siteConfig';

export async function generateMetadata(props: PageProps<'/[lang]/odds-converter'>): Promise<Metadata> {
  const { lang } = await props.params;

  if (!isLocale(lang)) {
    return {};
  }

  const localizedCopy = oddsConverterSeo[lang];

  return {
    title: { absolute: localizedCopy.title },
    description: localizedCopy.description,
    alternates: {
      canonical: getCanonicalUrl(localizePath('/odds-converter', lang)),
      languages: {
        en: getCanonicalUrl(localizePath('/odds-converter', 'en')),
        es: getCanonicalUrl(localizePath('/odds-converter', 'es')),
        'x-default': getCanonicalUrl(localizePath('/odds-converter', defaultLocale)),
      },
    },
    openGraph: {
      title: localizedCopy.title,
      description: localizedCopy.description,
      url: getCanonicalUrl(localizePath('/odds-converter', lang)),
      siteName: siteConfig.name,
      type: 'website',
      locale: lang === 'es' ? 'es_ES' : 'en_US',
      images: [{ url: getSocialImageUrl(), width: 1200, height: 630, alt: localizedCopy.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: localizedCopy.title,
      description: localizedCopy.description,
      images: [getSocialImageUrl()],
    },
  };
}

export default async function OddsConverterPage(props: PageProps<'/[lang]/odds-converter'>) {
  const { lang } = await props.params;

  if (!isLocale(lang)) {
    notFound();
  }

  if (lang === defaultLocale) {
    redirect('/odds-converter');
  }

  const localizedCopy = oddsConverterSeo[lang];
  const webApplicationJsonLd = {
    '@context': schemaOrgUrl,
    '@type': 'WebApplication',
    name: localizedCopy.title,
    description: localizedCopy.description,
    url: getCanonicalUrl(localizePath('/odds-converter', lang)),
    applicationCategory: 'FinanceApplication',
    applicationSubCategory: 'Odds Converter',
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
        name: lang === 'es' ? 'Conversor de Líneas' : 'Odds Converter',
        item: getCanonicalUrl(localizePath('/odds-converter', lang)),
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
      <OddsConverter locale={lang} />
    </>
  );
}
