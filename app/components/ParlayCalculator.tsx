'use client';

import { useEffect, useMemo, useState } from 'react';
import BetAmountSlider from './BetAmountSlider';
import {
  applySingleSeedToParlayState,
  buildRouteWithState,
  createDefaultParlayState,
  createLeg,
  decodeParlayState,
  decodeSingleState,
  encodeParlayState,
  isDefaultParlayState,
  loadParlayStateFromStorage,
  PARLAY_STATE_PARAM,
  saveParlayStateToStorage,
  type ParlayCalculatorState,
  type ParlayLeg,
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

type ParlayCalculatorProps = {
  initialSharedState?: string;
  incomingSeedState?: string;
};

export default function ParlayCalculator({
  initialSharedState,
  incomingSeedState,
}: ParlayCalculatorProps) {
  const initialState = useMemo<ParlayCalculatorState>(() => {
    return decodeParlayState(initialSharedState) ?? createDefaultParlayState();
  }, [initialSharedState]);

  const [betAmount, setBetAmount] = useState(initialState.betAmount);
  const [legs, setLegs] = useState<ParlayLeg[]>(initialState.legs);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const sharedState = decodeParlayState(initialSharedState);
    const storedState = loadParlayStateFromStorage();
    const seedState = decodeSingleState(incomingSeedState);

    const nextState = sharedState ?? storedState ?? createDefaultParlayState();
    const resolvedState = applySingleSeedToParlayState(nextState, sharedState ? null : seedState);

    const frameId = window.requestAnimationFrame(() => {
      setBetAmount(resolvedState.betAmount);
      setLegs(resolvedState.legs);
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

  const updateLegOdds = (legId: number, updates: Partial<OddsValues>) => {
    setLegs((prev) =>
      prev.map((leg) =>
        leg.id === legId
          ? {
              ...leg,
              odds: {
                ...leg.odds,
                ...updates,
              },
            }
          : leg,
      ),
    );
  };

  const updateLegLabel = (legId: number, label: string) => {
    setLegs((prev) =>
      prev.map((leg) =>
        leg.id === legId
          ? {
              ...leg,
              label,
            }
          : leg,
      ),
    );
  };

  const applyFromDecimal = (legId: number, decimal: number, sourceField?: OddsField) => {
    if (!Number.isFinite(decimal) || decimal <= 1) {
      return;
    }

    setLegs((prev) =>
      prev.map((leg) => {
        if (leg.id !== legId) {
          return leg;
        }

        return {
          ...leg,
          odds: {
            american:
              sourceField === 'american' ? leg.odds.american : toAmerican(decimal).toFixed(0),
            fractional:
              sourceField === 'fractional' ? leg.odds.fractional : toFractional(decimal),
            decimal: sourceField === 'decimal' ? leg.odds.decimal : decimalDisplay(decimal),
            implied: sourceField === 'implied' ? leg.odds.implied : toImplied(decimal).toFixed(2),
          },
        };
      }),
    );
  };

  const onAmericanChange = (legId: number, value: string) => {
    if (!/^-?\d*$/.test(value)) {
      return;
    }

    updateLegOdds(legId, { american: value });
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed === 0) {
      return;
    }

    applyFromDecimal(legId, toDecimalFromAmerican(parsed), 'american');
  };

  const onDecimalChange = (legId: number, value: string) => {
    updateLegOdds(legId, { decimal: value });
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 1) {
      return;
    }

    applyFromDecimal(legId, parsed, 'decimal');
  };

  const onFractionalChange = (legId: number, value: string) => {
    updateLegOdds(legId, { fractional: value });
    const parsed = parseFractional(value);
    if (parsed === null || parsed <= 1) {
      return;
    }

    applyFromDecimal(legId, parsed, 'fractional');
  };

  const onImpliedChange = (legId: number, value: string) => {
    if (value === '') {
      updateLegOdds(legId, { implied: '' });
      return;
    }

    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return;
    }

    const clamped = clampPercent(parsed);
    const displayValue = clamped === parsed ? value : clamped.toString();
    updateLegOdds(legId, { implied: displayValue });

    if (clamped <= 0 || clamped >= 100) {
      return;
    }

    applyFromDecimal(legId, toDecimalFromImplied(clamped), 'implied');
  };

  const addLeg = () => {
    setLegs((prev) => {
      const nextId = prev.length === 0 ? 1 : Math.max(...prev.map((leg) => leg.id)) + 1;
      return [...prev, createLeg(nextId)];
    });
  };

  const removeLeg = (legId: number) => {
    setLegs((prev) => {
      if (prev.length <= 1) {
        return prev;
      }

      return prev.filter((leg) => leg.id !== legId);
    });
  };

  const { combinedDecimal, expectedWinnings, expectedPayout, impliedWinningPercentage } = useMemo(() => {
    const validDecimals = legs
      .map((leg) => Number(leg.odds.decimal))
      .filter((decimal) => Number.isFinite(decimal) && decimal > 1);

    if (validDecimals.length === 0) {
      return {
        combinedDecimal: 0,
        expectedWinnings: 0,
        expectedPayout: 0,
        impliedWinningPercentage: 0,
      };
    }

    const totalDecimal = validDecimals.reduce((acc, decimal) => acc * decimal, 1);
    const stake = parseFormattedNumber(betAmount);
    const implied = toImplied(totalDecimal);

    if (!Number.isFinite(stake) || stake <= 0) {
      return {
        combinedDecimal: totalDecimal,
        expectedWinnings: 0,
        expectedPayout: 0,
        impliedWinningPercentage: implied,
      };
    }

    const payout = stake * totalDecimal;
    const winnings = payout - stake;

    return {
      combinedDecimal: totalDecimal,
      expectedWinnings: winnings,
      expectedPayout: payout,
      impliedWinningPercentage: implied,
    };
  }, [legs, betAmount]);

  const borderProgress = clampPercent(impliedWinningPercentage);
  const progressDegrees = (borderProgress / 100) * 360;

  const state = useMemo<ParlayCalculatorState>(() => ({ betAmount, legs }), [betAmount, legs]);
  const encodedShareState = useMemo(() => encodeParlayState(state), [state]);
  const isDefaultState = useMemo(() => isDefaultParlayState(state), [state]);

  useEffect(() => {
    if (!hasHydrated || typeof window === 'undefined') {
      return;
    }

    saveParlayStateToStorage(state);

    const nextUrl = buildRouteWithState(
      window.location.pathname,
      PARLAY_STATE_PARAM,
      isDefaultState ? undefined : encodedShareState,
    );

    if (`${window.location.pathname}${window.location.search}` !== nextUrl) {
      window.history.replaceState(window.history.state, '', nextUrl);
    }
  }, [encodedShareState, hasHydrated, isDefaultState, state]);

  const resetParlay = () => {
    const resetState = createDefaultParlayState();

    setBetAmount(resetState.betAmount);
    setLegs(resetState.legs);
  };

  return (
    <main
      className="grid min-h-[calc(100dvh-var(--content-offset))] place-items-center p-6"
      aria-labelledby="parlay-calculator-title"
    >
      <div
        className="progress-border max-h-[min(calc(100dvh-var(--content-offset)-3rem),58rem)] w-full max-w-4xl rounded-lg p-[2px] transition-all duration-300"
        style={{
          ['--progress-deg' as string]: `${progressDegrees.toFixed(2)}deg`,
          background:
            'conic-gradient(from -45deg, rgba(59, 130, 246, 1) 0deg var(--progress-deg, 0deg), rgba(59, 130, 246, 0.14) var(--progress-deg, 0deg) 360deg)',
        }}
      >
        <section
          className="flex max-h-[inherit] flex-col overflow-hidden rounded-[7px] bg-black shadow-md"
          aria-describedby="parlay-calculator-help"
        >
          <div className="px-4 pt-4 sm:px-8 sm:pt-8">
            <h1 id="parlay-calculator-title" className="text-lg font-semibold">
              Parlay Calculator
            </h1>
          </div>

          <p id="parlay-calculator-help" className="px-4 pt-1 text-sm text-gray-300 sm:px-8 sm:pt-2">
            Add one odds line per leg. The calculator multiplies all leg decimals to project payout.
          </p>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3 sm:space-y-4 sm:px-8 sm:py-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="parlay-bet-amount">Bet Amount</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  $
                </span>
                <input
                  id="parlay-bet-amount"
                  type="text"
                  inputMode="decimal"
                  aria-label="Parlay bet amount in dollars"
                  value={betAmount}
                  onChange={(event) => onBetAmountChange(event.target.value)}
                  className="w-full rounded-md border-2 border-gray-800 p-2 pl-7"
                  placeholder="100.00"
                />
              </div>
              <BetAmountSlider amount={betAmount} onAmountChange={setBetAmount} max={1000} />
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-200">Parlay Legs</h2>
              <button
                type="button"
                onClick={addLeg}
                aria-label="Add a parlay leg"
                className="btn btn-primary btn-sm"
              >
                Add Leg
              </button>
            </div>

            <div className="flex flex-col gap-4" role="list" aria-label="Parlay leg list">
              {legs.map((leg, index) => (
                <section key={leg.id} role="listitem" className="rounded-md border border-gray-800 p-3 sm:p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-medium">{leg.label.trim() || `Leg ${index + 1}`}</h3>
                    <button
                      type="button"
                      onClick={() => removeLeg(leg.id)}
                      disabled={legs.length <= 1}
                      aria-label={`Remove ${leg.label.trim() || `Leg ${index + 1}`}`}
                      className="btn btn-danger btn-sm text-xs"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mb-3 flex flex-col gap-2">
                    <label htmlFor={`parlay-leg-label-${leg.id}`}>Leg Label</label>
                    <input
                      id={`parlay-leg-label-${leg.id}`}
                      type="text"
                      value={leg.label}
                      onChange={(event) => updateLegLabel(leg.id, event.target.value)}
                      className="rounded-md border-2 border-gray-800 p-2"
                      placeholder={`Leg ${index + 1} (Team, market, etc.)`}
                      aria-label={`Label for leg ${index + 1}`}
                    />
                  </div>

                  <OddsFields
                    idPrefix={`parlay-leg-${leg.id}`}
                    contextLabel={leg.label.trim() || `Leg ${index + 1}`}
                    values={leg.odds}
                    onAmericanChange={(value) => onAmericanChange(leg.id, value)}
                    onFractionalChange={(value) => onFractionalChange(leg.id, value)}
                    onDecimalChange={(value) => onDecimalChange(leg.id, value)}
                    onImpliedChange={(value) => onImpliedChange(leg.id, value)}
                  />
                </section>
              ))}
            </div>
          </div>

          <footer
            aria-live="polite"
            aria-atomic="true"
            className="shrink-0 space-y-3 rounded-b-[7px] border-t border-gray-800 bg-black px-4 py-3 sm:px-8 sm:py-4"
          >
            <p className="text-xs uppercase tracking-wide text-gray-400">Projected Results</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
              <div className="grid min-w-0 grid-rows-[auto_auto] gap-1">
                <p className="truncate whitespace-nowrap text-[11px] text-gray-400" title="Combined Decimal Odds">
                  Combined Decimal
                </p>
                <p className="min-w-0 truncate text-2xl font-bold leading-tight tabular-nums">
                  {combinedDecimal > 1 ? decimalDisplay(combinedDecimal) : '0'}
                </p>
              </div>

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
            <div className="flex items-center gap-2 max-sm:flex-wrap">
              <button
                type="button"
                onClick={resetParlay}
                aria-label="Reset parlay calculator values and legs"
                className="btn btn-secondary btn-md"
              >
                Reset Parlay
              </button>
              <ShareLinkButton className="btn btn-secondary btn-md" />
            </div>
          </footer>
        </section>
      </div>
    </main>
  );
}
