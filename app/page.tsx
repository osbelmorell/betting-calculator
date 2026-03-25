import type { Metadata } from 'next';
import { singleCalculatorContent } from './content/calculatorContent';
import BettingCalculator from './components/BettingCalculator';
import { NAVIGATION_SEED_PARAM, SINGLE_STATE_PARAM } from './components/calculatorState';
import { getCanonicalUrl, schemaOrgUrl, siteConfig } from './siteConfig';

const metadataCopy = singleCalculatorContent.en.seo;

export const metadata: Metadata = {
  title: metadataCopy.title,
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

export default async function Home(props: PageProps<'/'>) {
  const searchParams = await props.searchParams;
  const initialSharedState = typeof searchParams[SINGLE_STATE_PARAM] === 'string' ? searchParams[SINGLE_STATE_PARAM] : undefined;
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
      <BettingCalculator locale="en" initialSharedState={initialSharedState} incomingSeedState={incomingSeedState} />
    </>
  );
}
