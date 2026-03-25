'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getStickyBarVariant, trackCalculatorEvent, type StickyBarVariant } from './analytics';
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
  const [stickyVariant] = useState<StickyBarVariant>(() => getStickyBarVariant());
  const hasTrackedFirstInput = useRef(false);
  const hasTrackedFirstCalc = useRef(false);

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
    if (!hasTrackedFirstInput.current) {
      hasTrackedFirstInput.current = true;
      trackCalculatorEvent('parlay_first_input', { source: 'bet_amount', betAmount, legCount: legs.length });
    }

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
    if (!hasTrackedFirstInput.current) {
      hasTrackedFirstInput.current = true;
      trackCalculatorEvent('parlay_first_input', { source: 'american', betAmount, legCount: legs.length });
    }

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
    if (!hasTrackedFirstInput.current) {
      hasTrackedFirstInput.current = true;
      trackCalculatorEvent('parlay_first_input', { source: 'decimal', betAmount, legCount: legs.length });
    }

    updateLegOdds(legId, { decimal: value });
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 1) {
      return;
    }

    applyFromDecimal(legId, parsed, 'decimal');
  };

  const onFractionalChange = (legId: number, value: string) => {
    if (!hasTrackedFirstInput.current) {
      hasTrackedFirstInput.current = true;
      trackCalculatorEvent('parlay_first_input', { source: 'fractional', betAmount, legCount: legs.length });
    }

    updateLegOdds(legId, { fractional: value });
    const parsed = parseFractional(value);
    if (parsed === null || parsed <= 1) {
      return;
    }

    applyFromDecimal(legId, parsed, 'fractional');
  };

  const onImpliedChange = (legId: number, value: string) => {
    if (!hasTrackedFirstInput.current) {
      hasTrackedFirstInput.current = true;
      trackCalculatorEvent('parlay_first_input', { source: 'implied', betAmount, legCount: legs.length });
    }

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
    trackCalculatorEvent('parlay_leg_added', { betAmount, legCount: legs.length + 1 });
    setLegs((prev) => {
      const nextId = prev.length === 0 ? 1 : Math.max(...prev.map((leg) => leg.id)) + 1;
      return [...prev, createLeg(nextId)];
    });
  };

  const removeLeg = (legId: number) => {
    if (legs.length > 1) {
      trackCalculatorEvent('parlay_leg_removed', { betAmount, legCount: legs.length - 1 });
    }

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

  useEffect(() => {
    if (!hasTrackedFirstCalc.current && expectedPayout > 0) {
      hasTrackedFirstCalc.current = true;
      trackCalculatorEvent('parlay_first_calc', {
        payoutBucket: Math.floor(expectedPayout),
        betAmount,
        legCount: legs.length,
      });
    }
  }, [betAmount, expectedPayout, legs.length]);

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
    trackCalculatorEvent('parlay_reset', { betAmount, legCount: legs.length });
    const resetState = createDefaultParlayState();

    setBetAmount(resetState.betAmount);
    setLegs(resetState.legs);
  };

  return (
    <main
      className="flex min-h-[calc(100dvh-var(--content-offset))] flex-col items-center justify-start px-6 py-12 pb-36 sm:py-16 sm:pb-16 md:py-20"
      aria-labelledby="parlay-calculator-title"
    >
      <div className="w-full max-w-2xl space-y-12 md:space-y-16">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 id="parlay-calculator-title" className="text-hero">
            Parlay Calculator
          </h1>
          <p id="parlay-calculator-help" className="text-subtitle max-w-lg">
            Build parlays fast: choose a format per leg, enter once, and get live combined payouts.
          </p>
        </div>

        {/* Calculator Card */}
        <div
          className="calculator-surface w-full overflow-hidden rounded-2xl transition-all duration-300"
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
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--surface)] px-4 py-3 pl-8 text-sm transition-colors placeholder:text-[var(--text-secondary)] focus:border-[var(--brand)] focus:outline-none"
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
                  className="rounded-lg border border-[var(--border-color)] bg-[var(--surface-soft)] p-4"
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
                      className="rounded-lg border border-[var(--border-color)] bg-[var(--surface)] px-3 py-2 text-sm transition-colors placeholder:text-[var(--text-secondary)] focus:border-[var(--brand)] focus:outline-none"
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
            className="results-shell shrink-0 space-y-6 px-6 py-8 sm:px-8"
          >
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
                Projected Results
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="result-stat">
                  <p className="text-xs text-[var(--text-secondary)]">Combined</p>
                  <p key={`parlay-combined-${combinedDecimal.toFixed(3)}`} className="calc-value-pop mt-2 truncate text-lg font-semibold">
                    {combinedDecimal > 1 ? decimalDisplay(combinedDecimal) : '0'}
                  </p>
                </div>

                <div className="result-stat">
                  <p className="text-xs text-[var(--text-secondary)]">Winnings</p>
                  <p key={`parlay-winnings-${expectedWinnings.toFixed(2)}`} className="calc-value-pop mt-2 text-lg font-semibold">
                    <MoneyDisplay value={expectedWinnings} />
                  </p>
                </div>

                <div className="result-stat">
                  <p className="text-xs text-[var(--text-secondary)]">Payout</p>
                  <p key={`parlay-payout-${expectedPayout.toFixed(2)}`} className="calc-value-pop mt-2 text-lg font-semibold">
                    <MoneyDisplay value={expectedPayout} />
                  </p>
                </div>

                <div className="result-stat">
                  <p className="text-xs text-[var(--text-secondary)]">Win %</p>
                  <p key={`parlay-winp-${impliedWinningPercentage.toFixed(2)}`} className="calc-value-pop mt-2 truncate text-lg font-semibold">
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
                <ShareLinkButton
                  className="btn btn-secondary btn-md flex-1 sm:flex-none"
                  onCopied={() => trackCalculatorEvent('parlay_share_copied', { betAmount, legCount: legs.length })}
                />
              </div>
            </div>
          </footer>
        </section>
      </div>

      <aside
        aria-live="polite"
        aria-atomic="true"
        className={`fixed inset-x-4 bottom-4 z-30 rounded-2xl border border-[var(--border-color)] bg-[var(--surface)]/95 shadow-[var(--shadow-lg)] backdrop-blur-md sm:hidden ${stickyVariant === 'expanded' ? 'p-5' : 'p-4'}`}
      >
        <div className={`grid gap-3 ${stickyVariant === 'expanded' ? 'grid-cols-3' : 'grid-cols-2'}`}>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Winnings</p>
            <p key={`parlay-sticky-win-${expectedWinnings.toFixed(2)}`} className="calc-value-pop mt-1 text-base font-semibold leading-tight">
              <MoneyDisplay value={expectedWinnings} />
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Payout</p>
            <p key={`parlay-sticky-pay-${expectedPayout.toFixed(2)}`} className="calc-value-pop mt-1 text-base font-semibold leading-tight">
              <MoneyDisplay value={expectedPayout} />
            </p>
          </div>
          {stickyVariant === 'expanded' ? (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Win %</p>
              <p key={`parlay-sticky-winp-${impliedWinningPercentage.toFixed(2)}`} className="calc-value-pop mt-1 text-base font-semibold leading-tight">
                {impliedWinningPercentage.toFixed(2)}%
              </p>
            </div>
          ) : null}
        </div>
      </aside>
      </div>

      {/* Editorial Content Section */}
      <div className="w-full max-w-2xl space-y-8 px-6 py-16 md:py-20">
        <section className="space-y-6">
          <h2 className="text-section-title">How Parlay Odds Work</h2>
          <div className="space-y-4 text-base leading-relaxed text-[var(--foreground)]">
            <p>
              A parlay combines multiple bets into one. All legs must win for the parlay to cash. The odds multiply together, meaning your potential payout grows exponentially—but so does the risk.
            </p>
            <p>
              <strong>Example:</strong> If you combine three legs with decimal odds of 2.0, 1.5, and 2.0, your combined decimal odds = 2.0 × 1.5 × 2.0 = 6.0. A $100 parlay wins $600 total ($500 profit).
            </p>
            <p>
              The key advantage of parlays: one $100 bet can have the winning power of $600 (6x return). The key risk: if any single leg loses, the entire parlay loses—no partial payouts.
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-section-title">How to Build a Parlay with This Calculator</h2>
          <div className="space-y-4 text-base leading-relaxed text-[var(--foreground)]">
            <p>
              Building a parlay is simple:
            </p>
            <ol className="space-y-3 list-decimal list-inside">
              <li><strong>Enter your parlay bet amount</strong> — Your total stake across all legs</li>
              <li><strong>Add your first leg</strong> — Enter odds in any format; calculator converts automatically</li>
              <li><strong>Click "+ Add Leg"</strong> — Keep adding as many legs as you want</li>
              <li><strong>Watch the combined odds multiply</strong> — Each leg multiplies the last, growing your potential payout</li>
              <li><strong>Remove any leg</strong> — If you change your mind, remove that leg (must have at least 1)</li>
              <li><strong>View your combined payout</strong> — See what you could win if all legs hit</li>
            </ol>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-section-title">Parlay Betting FAQs</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-base">What happens if one leg of my parlay loses?</h3>
              <p className="mt-2 text-base text-[var(--foreground)]">
                The entire parlay loses. There are no partial payouts in traditional parlays. If you hit 5 out of 6 legs, you get nothing. This is why parlays are high-risk, high-reward bets.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-base">How many legs can I add to a parlay?</h3>
              <p className="mt-2 text-base text-[var(--foreground)]">
                This calculator supports unlimited legs. Most sportsbooks limit parlays to 10–15 legs. The more legs you add, the lower your probability of cashing, but the higher your potential payout. A 10-leg parlay at 2.0 decimal odds would return 1024x your bet.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-base">What's the difference between a parlay and a round-robin?</h3>
              <p className="mt-2 text-base text-[var(--foreground)]">
                A parlay combines all legs into one bet (all-or-nothing). A round-robin automatically creates multiple smaller parlays from your legs (2-leg combos, 3-leg combos, etc.), so you can cash even if some legs lose. Most sportsbooks handle round-robins; this calculator focuses on single parlays.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-base">How do I calculate implied probability for a parlay?</h3>
              <p className="mt-2 text-base text-[var(--foreground)]">
                Convert your combined decimal odds to implied probability using: (1 ÷ combined decimal) × 100. If your combined odds are 6.0, your implied winning probability is (1 ÷ 6.0) × 100 = 16.67%. This calculator shows this automatically.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-base">Can I share or save my parlay?</h3>
              <p className="mt-2 text-base text-[var(--foreground)]">
                Yes. Click the "Share" button to copy a shareable link with all your legs and odds encoded in the URL. You can send it to friends or save it for later. The calculator also saves your last parlay locally.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
