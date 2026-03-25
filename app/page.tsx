

import type { Metadata } from 'next';
import BettingCalculator from './components/BettingCalculator';
import { NAVIGATION_SEED_PARAM, SINGLE_STATE_PARAM } from './components/calculatorState';

export const metadata: Metadata = {
  title: 'Single Bet Calculator',
  description:
    'Calculate single bet payout, winnings, implied probability, and convert odds between American, fractional, decimal, and implied formats.',
};

export default async function Home(props: PageProps<'/'>) {
  const searchParams = await props.searchParams;
  const initialSharedState = typeof searchParams[SINGLE_STATE_PARAM] === 'string' ? searchParams[SINGLE_STATE_PARAM] : undefined;
  const incomingSeedState = typeof searchParams[NAVIGATION_SEED_PARAM] === 'string' ? searchParams[NAVIGATION_SEED_PARAM] : undefined;

  return <BettingCalculator initialSharedState={initialSharedState} incomingSeedState={incomingSeedState} />;
}
