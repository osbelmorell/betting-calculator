import type { Metadata } from 'next';
import ParlayCalculator from '../components/ParlayCalculator';
import { NAVIGATION_SEED_PARAM, PARLAY_STATE_PARAM } from '../components/calculatorState';
import { getCanonicalUrl, schemaOrgUrl } from '../siteConfig';

const metadataCopy = {
  title: 'Parlay Calculator | Free Multi-Leg Betting Tool',
  description:
    'Build and calculate parlays with unlimited legs. Convert each leg odds format, calculate combined odds, payouts, and winning probability. Free parlay betting calculator.',
  faq: [
    {
      question: 'How do parlay odds work?',
      answer:
        "Parlay odds multiply together. Each leg's decimal odds are multiplied by the next leg's odds to create the combined decimal odds. Your potential winnings multiply with each added leg.",
    },
    {
      question: 'What happens if one leg of my parlay loses?',
      answer:
        'If any single leg loses, the entire parlay is lost and you forfeit your stake. This is why parlays carry higher risk but offer higher potential rewards.',
    },
    {
      question: 'How many legs can I add to a parlay?',
      answer:
        'This calculator supports unlimited parlay legs. However, most sportsbooks limit parlays to 10-15 legs. The more legs you add, the harder it becomes to win, but the higher the potential payout.',
    },
  ],
} as const;

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
