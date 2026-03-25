import type { Metadata } from 'next';
import ParlayCalculator from '../components/ParlayCalculator';
import { NAVIGATION_SEED_PARAM, PARLAY_STATE_PARAM } from '../components/calculatorState';

export const metadata: Metadata = {
  title: 'Parlay Calculator',
  description:
    'Build parlays with add/remove legs, convert each leg odds format, and calculate combined decimal odds, payout, and implied winning percentage.',
};

export default async function ParlayPage(props: PageProps<'/parlay'>) {
  const searchParams = await props.searchParams;
  const initialSharedState = typeof searchParams[PARLAY_STATE_PARAM] === 'string' ? searchParams[PARLAY_STATE_PARAM] : undefined;
  const incomingSeedState = typeof searchParams[NAVIGATION_SEED_PARAM] === 'string' ? searchParams[NAVIGATION_SEED_PARAM] : undefined;

  return <ParlayCalculator initialSharedState={initialSharedState} incomingSeedState={incomingSeedState} />;
}
