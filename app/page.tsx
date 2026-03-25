
import type { Metadata } from 'next';
import BettingCalculator from './components/BettingCalculator';
import { NAVIGATION_SEED_PARAM, SINGLE_STATE_PARAM } from './components/calculatorState';

export const metadata: Metadata = {
  title: 'Single Bet Calculator | Free Odds Conversion Tool',
  description:
    'Fast, free single bet calculator. Calculate payouts, winnings, and implied probability instantly. Convert between American, fractional, decimal, and percentage odds formats.',
  alternates: {
    canonical: 'https://calcmybets.com',
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
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': [
              {
                '@type': 'Question',
                'name': 'How do I use the single bet calculator?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Enter your bet amount and odds in any format (American, decimal, fractional, or implied probability). The calculator instantly converts all formats and shows your potential winnings and payout.',
                },
              },
              {
                '@type': 'Question',
                'name': 'What is implied probability?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Implied probability is the conversion of betting odds into a percentage representing the likelihood of an outcome. For example, -110 American odds implies approximately 52.38% probability.',
                },
              },
              {
                '@type': 'Question',
                'name': 'How do I convert American odds to decimal?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Positive American odds: (American odds / 100) + 1. Negative American odds: (100 / |American odds|) + 1. Or use this calculator to convert instantly.',
                },
              },
            ],
          }),
        }}
      />
      <BettingCalculator initialSharedState={initialSharedState} incomingSeedState={incomingSeedState} />
    </>
  );
}
