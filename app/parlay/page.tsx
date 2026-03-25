import type { Metadata } from 'next';
import ParlayCalculator from '../components/ParlayCalculator';
import { NAVIGATION_SEED_PARAM, PARLAY_STATE_PARAM } from '../components/calculatorState';
import { getCanonicalUrl, parlayPageConfig, schemaOrgUrl } from '../siteConfig';

export const metadata: Metadata = {
  title: parlayPageConfig.title,
  description: parlayPageConfig.description,
  alternates: {
    canonical: getCanonicalUrl('/parlay'),
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
            'mainEntity': [
              {
                '@type': 'Question',
                'name': 'How do parlay odds work?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Parlay odds multiply together. Each leg\'s decimal odds are multiplied by the next leg\'s odds to create the combined decimal odds. Your potential winnings multiply with each added leg.',
                },
              },
              {
                '@type': 'Question',
                'name': 'What happens if one leg of my parlay loses?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'If any single leg loses, the entire parlay is lost and you forfeit your stake. This is why parlays carry higher risk but offer higher potential rewards.',
                },
              },
              {
                '@type': 'Question',
                'name': 'How many legs can I add to a parlay?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'This calculator supports unlimited parlay legs. However, most sportsbooks limit parlays to 10-15 legs. The more legs you add, the harder it becomes to win, but the higher the potential payout.',
                },
              },
            ],
          }),
        }}
      />
      <ParlayCalculator initialSharedState={initialSharedState} incomingSeedState={incomingSeedState} />
    </>
  );
}
