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
      className="flex min-h-[calc(100dvh-var(--content-offset))] flex-col items-center justify-start px-6 py-12 sm:py-16 md:py-20"
      aria-labelledby="parlay-calculator-title"
    >
      <div className="w-full max-w-2xl space-y-12 md:space-y-16">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 id="parlay-calculator-title" className="text-hero">
            Parlay Calculator
          </h1>
          <p id="parlay-calculator-help" className="text-subtitle max-w-lg">
            Build multi-leg parlays and see your combined decimal odds and potential payout calculated in real time.
          </p>
        </div>

        {/* Calculator Card */}
        <div
          className="w-full overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--background)] shadow-[var(--shadow-md)] transition-all duration-300"
          style={{
            maxHeight: "min(calc(100dvh-var(--content-offset)-12rem-4px),70rem)",
          }}
        >
          <section
            className="flex max-h-[inherit] flex-col overflow-hidden"
            aria-describedby="parlay-calculator-help"
          >
            <div className="border-b border-[var(--border-color)] px-6 py-8 sm:px-8">
              <h2 className="text-card-title">Bet & Legs</h2>
            </div>

          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-8 sm:px-8">
            <div className="flex flex-col gap-3">
              <label htmlFor="parlay-bet-amount" className="text-sm font-medium">
                Bet Amount
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
                  $
                </span>
                <input
                  id="parlay-bet-amount"
                  type="text"
                  inputMode="decimal"
                  aria-label="Parlay bet amount in dollars"
                  value={betAmount}
                  onChange={(event) => onBetAmountChange(event.target.value)}
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--background)] px-4 py-3 pl-8 text-sm transition-colors placeholder:text-[var(--text-secondary)] focus:border-[#0071e3] focus:outline-none"
                  placeholder="100.00"
                />
              </div>
              <BetAmountSlider amount={betAmount} onAmountChange={setBetAmount} max={1000} />
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Parlay Legs</h2>
              <button
                type="button"
                onClick={addLeg}
                aria-label="Add a parlay leg"
                className="btn btn-primary btn-sm"
              >
                + Add Leg
              </button>
            </div>

            <div className="flex flex-col gap-4" role="list" aria-label="Parlay leg list">
              {legs.map((leg, index) => (
                <section
                  key={leg.id}
                  role="listitem"
                  className="rounded-lg border border-[var(--border-color)] bg-[var(--background)] p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
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

                  <div className="mb-4 flex flex-col gap-2">
                    <label htmlFor={`parlay-leg-label-${leg.id}`} className="text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)]">
                      Label
                    </label>
                    <input
                      id={`parlay-leg-label-${leg.id}`}
                      type="text"
                      value={leg.label}
                      onChange={(event) => updateLegLabel(leg.id, event.target.value)}
                      className="rounded-lg border border-[var(--border-color)] bg-[var(--background)] px-3 py-2 text-sm transition-colors placeholder:text-[var(--text-secondary)] focus:border-[#0071e3] focus:outline-none"
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
            className="shrink-0 space-y-6 border-t border-[var(--border-color)] px-6 py-8 sm:px-8"
          >
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
                Projected Results
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">Combined</p>
                  <p className="mt-2 truncate text-lg font-semibold">
                    {combinedDecimal > 1 ? decimalDisplay(combinedDecimal) : '0'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[var(--text-secondary)]">Winnings</p>
                  <p className="mt-2 text-lg font-semibold">
                    <MoneyDisplay value={expectedWinnings} />
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[var(--text-secondary)]">Payout</p>
                  <p className="mt-2 text-lg font-semibold">
                    <MoneyDisplay value={expectedPayout} />
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[var(--text-secondary)]">Win %</p>
                  <p className="mt-2 truncate text-lg font-semibold">
                    {impliedWinningPercentage.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 max-sm:flex-col">
                <button
                  type="button"
                  onClick={resetParlay}
                  aria-label="Reset parlay calculator values and legs"
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
      </div>
    </main>
  );
}
