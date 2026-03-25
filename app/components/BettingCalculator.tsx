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
      className="grid min-h-[calc(100dvh-var(--content-offset))] place-items-center px-6 py-8"
      aria-labelledby="single-calculator-title"
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--background)] shadow-[var(--shadow-md)] transition-all duration-300"
        style={{
          maxHeight: "min(calc(100dvh-var(--content-offset)-3rem-4px),56rem)",
        }}
      >
        <section
          className="flex max-h-[inherit] flex-col overflow-hidden"
          aria-describedby="single-calculator-help"
        >
          <div className="border-b border-[var(--border-color)] px-6 py-8 sm:px-8">
            <h1 id="single-calculator-title" className="text-2xl font-semibold tracking-tight">
              Single Bet
            </h1>
            <p id="single-calculator-help" className="mt-2 text-sm text-[var(--text-secondary)]">
              Enter any odds format and the calculator will automatically convert the others.
            </p>
          </div>

          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-8 sm:px-8">
            <div className="flex flex-col gap-3">
              <label htmlFor="bet-amount" className="text-sm font-medium">
                Bet Amount
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
                  $
                </span>
                <input
                  id="bet-amount"
                  type="text"
                  inputMode="decimal"
                  aria-label="Single bet amount in dollars"
                  value={betAmount}
                  onChange={(event) => onBetAmountChange(event.target.value)}
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--background)] px-4 py-3 pl-8 text-sm transition-colors placeholder:text-[var(--text-secondary)] focus:border-[#0071e3] focus:outline-none"
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
            className="space-y-6 border-t border-[var(--border-color)] px-6 py-8 sm:px-8"
          >
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
                Projected Results
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">Winnings</p>
                  <p className="mt-2 text-xl font-semibold leading-tight">
                    <MoneyDisplay value={expectedWinnings} />
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[var(--text-secondary)]">Payout</p>
                  <p className="mt-2 text-xl font-semibold leading-tight">
                    <MoneyDisplay value={expectedPayout} />
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[var(--text-secondary)]">Win %</p>
                  <p className="mt-2 truncate text-xl font-semibold leading-tight">
                    {impliedWinningPercentage.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 max-sm:flex-col">
                <button
                  type="button"
                  onClick={onReset}
                  aria-label="Reset single bet calculator values"
                  className="btn btn-secondary btn-md flex-1 sm:flex-none"
                >
                  Reset
                </button>
                <ShareLinkButton className="btn btn-secondary btn-md flex-1 sm:flex-none" />
              </div>
            </div>
          </footer>
        </section>
      </div>
    </main>
  );
}
