import type { Metadata } from 'next';
import { singleCalculatorContent } from './content/calculatorContent';
import BettingCalculator from './components/BettingCalculator';
import { getCanonicalUrl, schemaOrgUrl, siteConfig } from './siteConfig';

const metadataCopy = singleCalculatorContent.en.seo;

export const metadata: Metadata = {
  title: { absolute: metadataCopy.title },
  description: metadataCopy.description,
  alternates: {
    canonical: getCanonicalUrl('/'),
    languages: {
      en: getCanonicalUrl('/'),
      es: getCanonicalUrl('/es'),
      'x-default': getCanonicalUrl('/'),
    },
  },
  openGraph: {
    title: metadataCopy.title,
    description: metadataCopy.description,
    url: getCanonicalUrl('/'),
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

export default function Home() {
  return (
    <>
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
      <BettingCalculator locale="en" />
    </>
  );
}
