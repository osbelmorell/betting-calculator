import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { defaultLocale, isLocale, localizePath } from '../../i18n';
import OddsConverter from '../../odds-converter/OddsConverter';
import { oddsConverterSeo } from '../../odds-converter/content';
import { getCanonicalUrl, schemaOrgUrl, siteConfig } from '../../siteConfig';

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
    },
    twitter: {
      card: 'summary_large_image',
      title: localizedCopy.title,
      description: localizedCopy.description,
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
