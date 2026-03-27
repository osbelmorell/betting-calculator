import type { Metadata } from 'next';
import OddsConverter from './OddsConverter';
import { oddsConverterSeo } from './content';
import { getCanonicalUrl, schemaOrgUrl, siteConfig } from '../siteConfig';

const metadataCopy = oddsConverterSeo.en;

export const metadata: Metadata = {
  title: { absolute: metadataCopy.title },
  description: metadataCopy.description,
  alternates: {
    canonical: getCanonicalUrl('/odds-converter'),
    languages: {
      en: getCanonicalUrl('/odds-converter'),
      es: getCanonicalUrl('/es/odds-converter'),
      'x-default': getCanonicalUrl('/odds-converter'),
    },
  },
  openGraph: {
    title: metadataCopy.title,
    description: metadataCopy.description,
    url: getCanonicalUrl('/odds-converter'),
    siteName: siteConfig.name,
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: metadataCopy.title,
    description: metadataCopy.description,
  },
};

export default function OddsConverterPage() {
  const webApplicationJsonLd = {
    '@context': schemaOrgUrl,
    '@type': 'WebApplication',
    name: metadataCopy.title,
    description: metadataCopy.description,
    url: getCanonicalUrl('/odds-converter'),
    applicationCategory: 'FinanceApplication',
    applicationSubCategory: 'Odds Converter',
    inLanguage: 'en',
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
        name: 'Home',
        item: getCanonicalUrl('/'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Odds Converter',
        item: getCanonicalUrl('/odds-converter'),
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
            mainEntity: metadataCopy.faq.map((item) => ({
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
      <OddsConverter locale="en" />
    </>
  );
}
