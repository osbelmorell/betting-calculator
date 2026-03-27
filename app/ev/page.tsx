import type { Metadata } from 'next';
import EvCalculator from '../components/EvCalculator';
import { evCalculatorSeo } from './content';
import { getCanonicalUrl, schemaOrgUrl, siteConfig } from '../siteConfig';

const metadataCopy = evCalculatorSeo.en;

export const metadata: Metadata = {
  title: { absolute: metadataCopy.title },
  description: metadataCopy.description,
  keywords: [
    'ev calculator',
    'expected value betting calculator',
    'positive ev betting',
    'break-even probability calculator',
  ],
  alternates: {
    canonical: getCanonicalUrl('/ev'),
    languages: {
      en: getCanonicalUrl('/ev'),
      es: getCanonicalUrl('/es/ev'),
      'x-default': getCanonicalUrl('/ev'),
    },
  },
  openGraph: {
    title: metadataCopy.title,
    description: metadataCopy.description,
    url: getCanonicalUrl('/ev'),
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

export default function EvPage() {
  const webApplicationJsonLd = {
    '@context': schemaOrgUrl,
    '@type': 'WebApplication',
    name: metadataCopy.title,
    description: metadataCopy.description,
    url: getCanonicalUrl('/ev'),
    applicationCategory: 'FinanceApplication',
    applicationSubCategory: 'Expected Value Calculator',
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
        name: 'EV Calculator',
        item: getCanonicalUrl('/ev'),
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
      <EvCalculator locale="en" />
    </>
  );
}