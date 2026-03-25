'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Locale } from '../i18n';
import { singleCalculatorContent } from '../content/calculatorContent';
import { getStickyBarVariant, trackCalculatorEvent, type StickyBarVariant } from './analytics';
import BetAmountSlider from './BetAmountSlider';
import {
  buildRouteWithState,
  createDefaultSingleState,
  decodeSingleState,
  encodeSingleState,
  hasValidOdds,
  isDefaultSingleState,
  loadSingleStateFromStorage,
  NAVIGATION_SEED_PARAM,
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
  locale?: Locale;
  initialSharedState?: string;
  incomingSeedState?: string;
};

export default function BettingCalculator({
  locale = 'en',
  initialSharedState,
  incomingSeedState,
}: BettingCalculatorProps) {
  const copy = singleCalculatorContent[locale].ui;

  const initialState = useMemo<SingleCalculatorState>(() => {
    return decodeSingleState(initialSharedState) ?? createDefaultSingleState();
  }, [initialSharedState]);

  const [betAmount, setBetAmount] = useState(initialState.betAmount);
  const [odds, setOdds] = useState<OddsValues>(initialState.odds);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [stickyVariant] = useState<StickyBarVariant>(() => getStickyBarVariant());
  const hasTrackedFirstInput = useRef(false);
  const hasTrackedFirstCalc = useRef(false);

  useEffect(() => {
    const params = typeof window === 'undefined' ? null : new URLSearchParams(window.location.search);
    const sharedFromUrl = decodeSingleState(params?.get(SINGLE_STATE_PARAM) ?? undefined);
    const seedFromUrl = decodeSingleState(params?.get(NAVIGATION_SEED_PARAM) ?? undefined);

    const sharedState = decodeSingleState(initialSharedState) ?? sharedFromUrl;
    const storedState = loadSingleStateFromStorage();
    const seededState = decodeSingleState(incomingSeedState) ?? seedFromUrl;

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
    if (!hasTrackedFirstInput.current) {
      hasTrackedFirstInput.current = true;
      trackCalculatorEvent('single_first_input', { source: 'bet_amount', betAmount, legCount: 1 });
    }

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
    if (!hasTrackedFirstInput.current) {
      hasTrackedFirstInput.current = true;
      trackCalculatorEvent('single_first_input', { source: 'american', betAmount, legCount: 1 });
    }

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
    if (!hasTrackedFirstInput.current) {
      hasTrackedFirstInput.current = true;
      trackCalculatorEvent('single_first_input', { source: 'decimal', betAmount, legCount: 1 });
    }

    setOdds((prev) => ({ ...prev, decimal: value }));
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 1) {
      return;
    }

    applyFromDecimal(parsed, 'decimal');
  };

  const onFractionalChange = (value: string) => {
    if (!hasTrackedFirstInput.current) {
      hasTrackedFirstInput.current = true;
      trackCalculatorEvent('single_first_input', { source: 'fractional', betAmount, legCount: 1 });
    }

    setOdds((prev) => ({ ...prev, fractional: value }));
    const parsed = parseFractional(value);
    if (parsed === null || parsed <= 1) {
      return;
    }

    applyFromDecimal(parsed, 'fractional');
  };

  const onImpliedChange = (value: string) => {
    if (!hasTrackedFirstInput.current) {
      hasTrackedFirstInput.current = true;
      trackCalculatorEvent('single_first_input', { source: 'implied', betAmount, legCount: 1 });
    }

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

  useEffect(() => {
    if (!hasTrackedFirstCalc.current && expectedPayout > 0) {
      hasTrackedFirstCalc.current = true;
      trackCalculatorEvent('single_first_calc', {
        payoutBucket: Math.floor(expectedPayout),
        betAmount,
        legCount: 1,
      });
    }
  }, [betAmount, expectedPayout]);

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
    trackCalculatorEvent('single_reset', { betAmount, legCount: 1 });
    const resetState = createDefaultSingleState();

    setBetAmount(resetState.betAmount);
    setOdds(resetState.odds);
  };

  return (
    <main
      className="flex min-h-[calc(100dvh-var(--content-offset))] flex-col items-center justify-start px-6 py-12 pb-36 sm:py-16 sm:pb-16 md:py-20"
      aria-labelledby="single-calculator-title"
    >
      <div className="w-full max-w-2xl space-y-12 md:space-y-16">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 id="single-calculator-title" className="text-hero">
            {copy.title}
          </h1>
          <p id="single-calculator-help" className="text-subtitle max-w-lg">
            {copy.subtitle}
          </p>
        </div>

        {/* Calculator Card */}
        <div
          className="calculator-surface w-full overflow-hidden rounded-2xl transition-all duration-300"
          style={{
            maxHeight: "min(calc(100dvh-var(--content-offset)-12rem-4px),56rem)",
          }}
        >
          <section
            className="flex max-h-[inherit] flex-col overflow-hidden"
            aria-describedby="single-calculator-help"
          >
            <div className="border-b border-[var(--border-color)] px-6 py-8 sm:px-8">
              <h2 className="text-card-title">{copy.cardTitle}</h2>
            </div>

          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-8 sm:px-8">
            <div className="flex flex-col gap-3">
              <label htmlFor="bet-amount" className="text-sm font-medium">
                {copy.betAmount}
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
                  $
                </span>
                <input
                  id="bet-amount"
                  type="text"
                  inputMode="decimal"
                  aria-label={copy.betAmountAria}
                  value={betAmount}
                  onChange={(event) => onBetAmountChange(event.target.value)}
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--surface)] px-4 py-3 pl-8 text-sm transition-colors placeholder:text-[var(--text-placeholder)] focus:border-[var(--brand)] focus:outline-none"
                  placeholder="100.00"
                />
              </div>
              <BetAmountSlider locale={locale} amount={betAmount} onAmountChange={setBetAmount} max={1000} />
            </div>

            <OddsFields
              idPrefix="single"
              locale={locale}
              contextLabel={copy.shareLabel}
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
            className="results-shell space-y-6 px-6 py-8 sm:px-8"
          >
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
                {copy.results}
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="result-stat">
                  <p className="text-xs text-[var(--text-secondary)]">{copy.winnings}</p>
                  <p key={`single-winnings-${expectedWinnings.toFixed(2)}`} className="calc-value-pop mt-2 text-xl font-semibold leading-tight">
                    <MoneyDisplay value={expectedWinnings} />
                  </p>
                </div>

                <div className="result-stat">
                  <p className="text-xs text-[var(--text-secondary)]">{copy.payout}</p>
                  <p key={`single-payout-${expectedPayout.toFixed(2)}`} className="calc-value-pop mt-2 text-xl font-semibold leading-tight">
                    <MoneyDisplay value={expectedPayout} />
                  </p>
                </div>

                <div className="result-stat">
                  <p className="text-xs text-[var(--text-secondary)]">{copy.winPct}</p>
                  <p key={`single-winp-${impliedWinningPercentage.toFixed(2)}`} className="calc-value-pop mt-2 truncate text-xl font-semibold leading-tight">
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
                  aria-label={copy.resetAria}
                  className="btn btn-secondary btn-md flex-1 sm:flex-none"
                >
                  {copy.reset}
                </button>
                <ShareLinkButton
                  locale={locale}
                  className="btn btn-secondary btn-md flex-1 sm:flex-none"
                  onCopied={() => trackCalculatorEvent('single_share_copied', { betAmount, legCount: 1 })}
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
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">{copy.winnings}</p>
            <p key={`single-sticky-win-${expectedWinnings.toFixed(2)}`} className="calc-value-pop mt-1 text-base font-semibold leading-tight">
              <MoneyDisplay value={expectedWinnings} />
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">{copy.payout}</p>
            <p key={`single-sticky-pay-${expectedPayout.toFixed(2)}`} className="calc-value-pop mt-1 text-base font-semibold leading-tight">
              <MoneyDisplay value={expectedPayout} />
            </p>
          </div>
          {stickyVariant === 'expanded' ? (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">{copy.winPct}</p>
              <p key={`single-sticky-winp-${impliedWinningPercentage.toFixed(2)}`} className="calc-value-pop mt-1 text-base font-semibold leading-tight">
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
          <h2 className="text-section-title">{copy.howToTitle}</h2>
          <div className="space-y-4 text-base leading-relaxed text-[var(--foreground)]">
            <p>{copy.howToIntro}</p>
            <ol className="space-y-3 list-decimal list-inside">
              {copy.howToSteps.map(([title, description]) => (
                <li key={title}><strong>{title}</strong> — {description}</li>
              ))}
            </ol>
            <p>{copy.howToOutro}</p>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-section-title">{copy.oddsFormatsTitle}</h2>
          <div className="space-y-4 text-base leading-relaxed text-[var(--foreground)]">
            <p>{copy.oddsIntro}</p>
            <div className="space-y-4">
              {copy.oddsSections.map(([title, description]) => (
                <div key={title}>
                  <h3 className="font-semibold">{title}</h3>
                  <p>{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-section-title">{copy.faqTitle}</h2>
          <div className="space-y-6">
            {copy.faqItems.map(([title, description]) => (
              <div key={title}>
                <h3 className="font-semibold text-base">{title}</h3>
                <p className="mt-2 text-base text-[var(--foreground)]">{description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
