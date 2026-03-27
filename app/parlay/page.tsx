import type { Metadata } from 'next';
import { parlayCalculatorContent } from '../content/calculatorContent';
import ParlayCalculator from '../components/ParlayCalculator';
import { getCanonicalUrl, schemaOrgUrl, siteConfig } from '../siteConfig';

const metadataCopy = parlayCalculatorContent.en.seo;

export const metadata: Metadata = {
  title: { absolute: metadataCopy.title },
  description: metadataCopy.description,
  alternates: {
    canonical: getCanonicalUrl('/parlay'),
    languages: {
      en: getCanonicalUrl('/parlay'),
      es: getCanonicalUrl('/es/parlay'),
      'x-default': getCanonicalUrl('/parlay'),
    },
  },
  openGraph: {
    title: metadataCopy.title,
    description: metadataCopy.description,
    url: getCanonicalUrl('/parlay'),
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

export default function ParlayPage() {
  const webApplicationJsonLd = {
    '@context': schemaOrgUrl,
    '@type': 'WebApplication',
    name: metadataCopy.title,
    description: metadataCopy.description,
    url: getCanonicalUrl('/parlay'),
    applicationCategory: 'FinanceApplication',
    applicationSubCategory: 'Parlay Calculator',
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
        name: 'Parlay Calculator',
        item: getCanonicalUrl('/parlay'),
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
      <ParlayCalculator locale="en" />
    </>
  );
}
