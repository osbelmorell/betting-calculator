import type { Metadata } from 'next';
import { parlayCalculatorContent } from '../content/calculatorContent';
import ParlayCalculator from '../components/ParlayCalculator';
import { NAVIGATION_SEED_PARAM, PARLAY_STATE_PARAM } from '../components/calculatorState';
import { getCanonicalUrl, schemaOrgUrl, siteConfig } from '../siteConfig';

const metadataCopy = parlayCalculatorContent.en.seo;

export const metadata: Metadata = {
  title: metadataCopy.title,
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

export default async function ParlayPage(props: PageProps<'/parlay'>) {
  const searchParams = await props.searchParams;
  const initialSharedState = typeof searchParams[PARLAY_STATE_PARAM] === 'string' ? searchParams[PARLAY_STATE_PARAM] : undefined;
  const incomingSeedState = typeof searchParams[NAVIGATION_SEED_PARAM] === 'string' ? searchParams[NAVIGATION_SEED_PARAM] : undefined;

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
          }),
        }}
      />
      <ParlayCalculator locale="en" initialSharedState={initialSharedState} incomingSeedState={incomingSeedState} />
    </>
  );
}
