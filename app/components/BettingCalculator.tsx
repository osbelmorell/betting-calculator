'use client';

import { useEffect, useMemo, useState } from 'react';
import BetAmountSlider from './BetAmountSlider';
import {
  buildRouteWithState,
  createDefaultSingleState,
  decodeSingleState,
  encodeSingleState,
  hasValidOdds,
  isDefaultSingleState,
  loadSingleStateFromStorage,
  saveSingleStateToStorage,
  SINGLE_STATE_PARAM,
  type SingleCalculatorState,
} from './calculatorState';
import MoneyDisplay from './MoneyDisplay';
import OddsFields from './OddsFields';
import ShareLinkButton from './ShareLinkButton';
import {
  clampPercent,
  decimalDisplay,
  formatBetAmountInput,
  parseFormattedNumber,
  parseFractional,
  toAmerican,
  toDecimalFromAmerican,
  toDecimalFromImplied,
  toFractional,
  toImplied,
  type OddsField,
  type OddsValues,
} from './oddsUtils';

type BettingCalculatorProps = {
  initialSharedState?: string;
  incomingSeedState?: string;
};

export default function BettingCalculator({
  initialSharedState,
  incomingSeedState,
}: BettingCalculatorProps) {
  const initialState = useMemo<SingleCalculatorState>(() => {
    return decodeSingleState(initialSharedState) ?? createDefaultSingleState();
  }, [initialSharedState]);

  const [betAmount, setBetAmount] = useState(initialState.betAmount);
  const [odds, setOdds] = useState<OddsValues>(initialState.odds);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const sharedState = decodeSingleState(initialSharedState);
    const storedState = loadSingleStateFromStorage();
    const seededState = decodeSingleState(incomingSeedState);

    const nextState = sharedState ?? storedState ?? createDefaultSingleState();
    const resolvedState = !sharedState && seededState && hasValidOdds(seededState.odds) ? seededState : nextState;

    const frameId = window.requestAnimationFrame(() => {
      setBetAmount(resolvedState.betAmount);
      setOdds(resolvedState.odds);
      setHasHydrated(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [incomingSeedState, initialSharedState]);

  const onBetAmountChange = (value: string) => {
    const formatted = formatBetAmountInput(value);

    if (formatted === null) {
      return;
    }

    setBetAmount(formatted);
  };

  const applyFromDecimal = (decimal: number, sourceField?: OddsField) => {
    if (!Number.isFinite(decimal) || decimal <= 1) {
      return;
    }

    setOdds((prev) => ({
      american: sourceField === 'american' ? prev.american : toAmerican(decimal).toFixed(0),
      fractional: sourceField === 'fractional' ? prev.fractional : toFractional(decimal),
      decimal: sourceField === 'decimal' ? prev.decimal : decimalDisplay(decimal),
      implied: sourceField === 'implied' ? prev.implied : toImplied(decimal).toFixed(2),
    }));
  };

  const onAmericanChange = (value: string) => {
    if (!/^-?\d*$/.test(value)) {
      return;
    }

    setOdds((prev) => ({ ...prev, american: value }));
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed === 0) {
      return;
    }

    applyFromDecimal(toDecimalFromAmerican(parsed), 'american');
  };

  const onDecimalChange = (value: string) => {
    setOdds((prev) => ({ ...prev, decimal: value }));
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 1) {
      return;
    }

    applyFromDecimal(parsed, 'decimal');
  };

  const onFractionalChange = (value: string) => {
    setOdds((prev) => ({ ...prev, fractional: value }));
    const parsed = parseFractional(value);
    if (parsed === null || parsed <= 1) {
      return;
    }

    applyFromDecimal(parsed, 'fractional');
  };

  const onImpliedChange = (value: string) => {
    if (value === '') {
      setOdds((prev) => ({ ...prev, implied: '' }));
      return;
    }

    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return;
    }

    const clamped = clampPercent(parsed);
    const displayValue = clamped === parsed ? value : clamped.toString();
    setOdds((prev) => ({ ...prev, implied: displayValue }));

    if (clamped <= 0 || clamped >= 100) {
      return;
    }

    applyFromDecimal(toDecimalFromImplied(clamped), 'implied');
  };

  const { expectedWinnings, expectedPayout, impliedWinningPercentage } = useMemo(() => {
    const stake = parseFormattedNumber(betAmount);
    const decimal = Number(odds.decimal);

    if (!Number.isFinite(decimal) || decimal <= 1) {
      return {
        expectedWinnings: 0,
        expectedPayout: 0,
        impliedWinningPercentage: 0,
      };
    }

    if (!Number.isFinite(stake) || stake <= 0) {
      return {
        expectedWinnings: 0,
        expectedPayout: 0,
        impliedWinningPercentage: toImplied(decimal),
      };
    }

    const payout = stake * decimal;
    const winnings = payout - stake;

    return {
      expectedWinnings: winnings,
      expectedPayout: payout,
      impliedWinningPercentage: toImplied(decimal),
    };
  }, [betAmount, odds.decimal]);

  const borderProgress = clampPercent(impliedWinningPercentage);
  const progressDegrees = (borderProgress / 100) * 360;

  const state = useMemo<SingleCalculatorState>(() => ({ betAmount, odds }), [betAmount, odds]);
  const encodedShareState = useMemo(() => encodeSingleState(state), [state]);
  const isDefaultState = useMemo(() => isDefaultSingleState(state), [state]);

  useEffect(() => {
    if (!hasHydrated || typeof window === 'undefined') {
      return;
    }

    saveSingleStateToStorage(state);

    const nextUrl = buildRouteWithState(
      window.location.pathname,
      SINGLE_STATE_PARAM,
      isDefaultState ? undefined : encodedShareState,
    );

    if (`${window.location.pathname}${window.location.search}` !== nextUrl) {
      window.history.replaceState(window.history.state, '', nextUrl);
    }
  }, [encodedShareState, hasHydrated, isDefaultState, state]);

  const onReset = () => {
    const resetState = createDefaultSingleState();

    setBetAmount(resetState.betAmount);
    setOdds(resetState.odds);
  };

  return (
    <main
      className="grid min-h-[calc(100dvh-var(--content-offset))] place-items-center p-6"
      aria-labelledby="single-calculator-title"
    >
      <div
        className="progress-border max-h-[min(calc(100dvh-var(--content-offset)-3rem-4px),52rem)] w-full max-w-md rounded-lg p-[2px] transition-all duration-300"
        style={{
          ['--progress-deg' as string]: `${progressDegrees.toFixed(2)}deg`,
          background:
            'conic-gradient(from -45deg, rgba(59, 130, 246, 1) 0deg var(--progress-deg, 0deg), rgba(59, 130, 246, 0.14) var(--progress-deg, 0deg) 360deg)',
        }}
      >
        <section
          className="flex max-h-[inherit] flex-col overflow-hidden rounded-[7px] bg-black shadow-md"
          aria-describedby="single-calculator-help"
        >
          <div className="px-4 pt-4 sm:px-8 sm:pt-8">
            <h1 id="single-calculator-title" className="text-lg font-semibold">
              Single Bet Calculator
            </h1>
          </div>

          <p id="single-calculator-help" className="px-4 pt-1 text-sm text-gray-300 sm:px-8 sm:pt-2">
            Enter any one odds format and the calculator will automatically convert the others.
          </p>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3 sm:space-y-4 sm:px-8 sm:py-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="bet-amount">Bet Amount</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  $
                </span>
                <input
                  id="bet-amount"
                  type="text"
                  inputMode="decimal"
                  aria-label="Single bet amount in dollars"
                  value={betAmount}
                  onChange={(event) => onBetAmountChange(event.target.value)}
                  className="w-full rounded-md border-2 border-gray-800 p-2 pl-7"
                  placeholder="100.00"
                />
              </div>
              <BetAmountSlider amount={betAmount} onAmountChange={setBetAmount} max={1000} />
            </div>

            <OddsFields
              idPrefix="single"
              contextLabel="Single bet"
              values={odds}
              onAmericanChange={onAmericanChange}
              onFractionalChange={onFractionalChange}
              onDecimalChange={onDecimalChange}
              onImpliedChange={onImpliedChange}
            />
          </div>

          <footer
            aria-live="polite"
            aria-atomic="true"
            className="space-y-3 border-t border-gray-800 px-4 py-3 sm:px-8 sm:py-4"
          >
            <p className="text-xs uppercase tracking-wide text-gray-400">Projected Results</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              <div className="grid min-w-0 grid-rows-[auto_auto] gap-1">
                <p className="truncate whitespace-nowrap text-[11px] text-gray-400" title="Expected Winnings">
                  Expected Winnings
                </p>
                <p className="min-w-0 text-2xl font-bold leading-tight tabular-nums">
                  <MoneyDisplay value={expectedWinnings} />
                </p>
              </div>

              <div className="grid min-w-0 grid-rows-[auto_auto] gap-1">
                <p className="truncate whitespace-nowrap text-[11px] text-gray-400" title="Expected Payout">
                  Expected Payout
                </p>
                <p className="min-w-0 text-2xl font-bold leading-tight tabular-nums">
                  <MoneyDisplay value={expectedPayout} />
                </p>
              </div>

              <div className="grid min-w-0 grid-rows-[auto_auto] gap-1">
                <p
                  className="truncate whitespace-nowrap text-[11px] text-gray-400"
                  title="Implied Winning Percentage"
                >
                  Implied Win %
                </p>
                <p className="min-w-0 truncate text-2xl font-bold leading-tight tabular-nums">
                  {impliedWinningPercentage.toFixed(2)}%
                </p>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 max-sm:flex-wrap">
                <button
                  type="button"
                  onClick={onReset}
                  aria-label="Reset single bet calculator values"
                  className="btn btn-secondary btn-md"
                >
                  Reset Bet
                </button>
                <ShareLinkButton className="btn btn-secondary btn-md" />
              </div>
            </div>
          </footer>
        </section>
      </div>
    </main>
  );
}
