'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { evCalculatorContent } from '../ev/content';
import type { Locale } from '../i18n';
import { trackCalculatorEvent } from './analytics';
import BetAmountSlider from './BetAmountSlider';
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

const EV_STORAGE_KEY = 'betting-calculator:ev';
const EV_STATE_PARAM = 'ev';

type EvState = {
  betAmount: string;
  odds: OddsValues;
  estimatedProbability: string;
};

function defaultState(): EvState {
  return {
    betAmount: '100',
    odds: {
      american: '-110',
      decimal: '1.909',
      fractional: '10/11',
      implied: '52.38',
    },
    estimatedProbability: '55',
  };
}

function normalizeState(value: unknown): EvState {
  const candidate = value as Partial<EvState> | null | undefined;
  const fallback = defaultState();

  const normalizedAmount = formatBetAmountInput(typeof candidate?.betAmount === 'string' ? candidate.betAmount : fallback.betAmount);
  const normalizedProbability = typeof candidate?.estimatedProbability === 'string' ? candidate.estimatedProbability : fallback.estimatedProbability;

  return {
    betAmount: normalizedAmount ?? fallback.betAmount,
    odds: {
      american: typeof candidate?.odds?.american === 'string' ? candidate.odds.american : fallback.odds.american,
      decimal: typeof candidate?.odds?.decimal === 'string' ? candidate.odds.decimal : fallback.odds.decimal,
      fractional: typeof candidate?.odds?.fractional === 'string' ? candidate.odds.fractional : fallback.odds.fractional,
      implied: typeof candidate?.odds?.implied === 'string' ? candidate.odds.implied : fallback.odds.implied,
    },
    estimatedProbability: normalizedProbability,
  };
}

function encodeState(state: EvState): string {
  return encodeURIComponent(JSON.stringify(state));
}

function decodeState(value: string | null | undefined): EvState | null {
  if (!value) {
    return null;
  }

  try {
    return normalizeState(JSON.parse(decodeURIComponent(value)));
  } catch {
    return null;
  }
}

type EvCalculatorProps = {
  locale?: Locale;
};

export default function EvCalculator({ locale = 'en' }: EvCalculatorProps) {
  const copy = evCalculatorContent[locale];
  const [betAmount, setBetAmount] = useState(defaultState().betAmount);
  const [odds, setOdds] = useState<OddsValues>(defaultState().odds);
  const [estimatedProbability, setEstimatedProbability] = useState(defaultState().estimatedProbability);
  const [hasHydrated, setHasHydrated] = useState(false);
  const hasTrackedFirstInput = useRef(false);
  const hasTrackedFirstCalc = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const sharedState = decodeState(params.get(EV_STATE_PARAM));

    const storedRaw = window.localStorage.getItem(EV_STORAGE_KEY);
    let storedState: EvState | null = null;
    if (storedRaw) {
      try {
        storedState = normalizeState(JSON.parse(storedRaw));
      } catch {
        storedState = null;
      }
    }
    const resolved = sharedState ?? storedState ?? defaultState();

    const frameId = window.requestAnimationFrame(() => {
      setBetAmount(resolved.betAmount);
      setOdds(resolved.odds);
      setEstimatedProbability(resolved.estimatedProbability);
      setHasHydrated(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  const onBetAmountChange = useCallback((value: string) => {
    if (!hasTrackedFirstInput.current) {
      hasTrackedFirstInput.current = true;
      trackCalculatorEvent('ev_first_input', { source: 'bet_amount', betAmount, legCount: 1 });
    }

    const formatted = formatBetAmountInput(value);
    if (formatted === null) {
      return;
    }

    setBetAmount(formatted);
  }, [betAmount]);

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
      trackCalculatorEvent('ev_first_input', { source: 'american', betAmount, legCount: 1 });
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
      trackCalculatorEvent('ev_first_input', { source: 'decimal', betAmount, legCount: 1 });
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
      trackCalculatorEvent('ev_first_input', { source: 'fractional', betAmount, legCount: 1 });
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
      trackCalculatorEvent('ev_first_input', { source: 'implied', betAmount, legCount: 1 });
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

  const onEstimatedProbabilityChange = (value: string) => {
    if (!hasTrackedFirstInput.current) {
      hasTrackedFirstInput.current = true;
      trackCalculatorEvent('ev_first_input', { source: 'estimated_probability', betAmount, legCount: 1 });
    }

    if (value === '') {
      setEstimatedProbability('');
      return;
    }

    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return;
    }

    const clamped = clampPercent(parsed);
    const displayValue = clamped === parsed ? value : clamped.toString();
    setEstimatedProbability(displayValue);
  };

  const {
    expectedValueAmount,
    expectedValuePercent,
    breakEvenProbability,
    edgePercent,
    expectedProfitIfWin,
    expectedLossIfLose,
  } = useMemo(() => {
    const stake = parseFormattedNumber(betAmount);
    const decimal = Number(odds.decimal);
    const projectedProbability = Number(estimatedProbability);

    if (!Number.isFinite(stake) || stake <= 0 || !Number.isFinite(decimal) || decimal <= 1 || !Number.isFinite(projectedProbability)) {
      return {
        expectedValueAmount: 0,
        expectedValuePercent: 0,
        breakEvenProbability: Number.isFinite(decimal) && decimal > 1 ? toImplied(decimal) : 0,
        edgePercent: 0,
        expectedProfitIfWin: 0,
        expectedLossIfLose: Number.isFinite(stake) && stake > 0 ? stake : 0,
      };
    }

    const winProbability = clampPercent(projectedProbability) / 100;
    const loseProbability = 1 - winProbability;
    const profitIfWin = stake * (decimal - 1);
    const lossIfLose = stake;
    const evAmount = winProbability * profitIfWin - loseProbability * lossIfLose;
    const evPercent = (evAmount / stake) * 100;
    const breakEven = toImplied(decimal);

    return {
      expectedValueAmount: evAmount,
      expectedValuePercent: evPercent,
      breakEvenProbability: breakEven,
      edgePercent: projectedProbability - breakEven,
      expectedProfitIfWin: profitIfWin,
      expectedLossIfLose: lossIfLose,
    };
  }, [betAmount, estimatedProbability, odds.decimal]);

  useEffect(() => {
    if (!hasTrackedFirstCalc.current && hasTrackedFirstInput.current && (expectedValueAmount !== 0 || edgePercent !== 0)) {
      hasTrackedFirstCalc.current = true;
      trackCalculatorEvent('ev_first_calc', {
        payoutBucket: Math.floor(expectedProfitIfWin),
        betAmount,
        legCount: 1,
      });
    }
  }, [betAmount, edgePercent, expectedProfitIfWin, expectedValueAmount]);

  const currentState = useMemo<EvState>(
    () => ({ betAmount, odds, estimatedProbability }),
    [betAmount, estimatedProbability, odds],
  );

  useEffect(() => {
    if (!hasHydrated || typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(EV_STORAGE_KEY, JSON.stringify(currentState));
  }, [currentState, hasHydrated]);

  const getShareUrl = useCallback(() => {
    if (typeof window === 'undefined') {
      return '';
    }

    const params = new URLSearchParams();
    params.set(EV_STATE_PARAM, encodeState(currentState));

    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  }, [currentState]);

  const onReset = () => {
    trackCalculatorEvent('ev_reset', { betAmount, legCount: 1 });
    const nextDefault = defaultState();
    setBetAmount(nextDefault.betAmount);
    setOdds(nextDefault.odds);
    setEstimatedProbability(nextDefault.estimatedProbability);
  };

  const statusLabel = expectedValueAmount > 0.005
    ? copy.statusPositive
    : expectedValueAmount < -0.005
      ? copy.statusNegative
      : copy.statusNeutral;

  const statusHint = expectedValueAmount > 0.005
    ? copy.statusPositiveHint
    : expectedValueAmount < -0.005
      ? copy.statusNegativeHint
      : copy.statusNeutralHint;

  const projectedProbability = Number(estimatedProbability);
  const projectedProbabilityDisplay = Number.isFinite(projectedProbability)
    ? clampPercent(projectedProbability)
    : 0;

  const evPer100Dollars = expectedValuePercent;
  const evPer100Message = (() => {
    if (locale === 'es') {
      if (evPer100Dollars > 0.005) {
        return `Si hicieras esta misma apuesta muchas veces, ganarías en promedio unos $${Math.abs(evPer100Dollars).toFixed(2)} por cada $100 apostados.`;
      }

      if (evPer100Dollars < -0.005) {
        return `Si hicieras esta misma apuesta muchas veces, perderías en promedio unos $${Math.abs(evPer100Dollars).toFixed(2)} por cada $100 apostados.`;
      }

      return 'Si hicieras esta misma apuesta muchas veces, quedarías cerca de $0 por cada $100 apostados.';
    }

    if (evPer100Dollars > 0.005) {
      return `If you made this same bet many times, you would win about $${Math.abs(evPer100Dollars).toFixed(2)} on average for every $100 staked.`;
    }

    if (evPer100Dollars < -0.005) {
      return `If you made this same bet many times, you would lose about $${Math.abs(evPer100Dollars).toFixed(2)} on average for every $100 staked.`;
    }

    return 'If you made this same bet many times, you would land close to $0 for every $100 staked.';
  })();

  const statusDataPoints = locale === 'es'
    ? `Resumen rápido: tú estimas ganar ${projectedProbabilityDisplay.toFixed(2)} de cada 100 apuestas, y necesitas ${breakEvenProbability.toFixed(2)} de cada 100 para quedar en equilibrio. Diferencia: ${edgePercent.toFixed(2)} puntos. ${evPer100Message}`
    : `Quick check: you estimate winning ${projectedProbabilityDisplay.toFixed(2)} out of 100 bets, and you need ${breakEvenProbability.toFixed(2)} out of 100 to break even. Difference: ${edgePercent.toFixed(2)} points. ${evPer100Message}`;

  const outcomeToneClass = expectedValueAmount > 0.005
    ? 'text-[var(--brand)]'
    : expectedValueAmount < -0.005
      ? 'text-red-500'
      : 'text-[var(--foreground)]';

  const statusToneClass = expectedValueAmount > 0.005
    ? 'border-[var(--brand)]/40 bg-[var(--brand)]/10 text-[var(--brand)]'
    : expectedValueAmount < -0.005
      ? 'border-red-500/40 bg-red-500/10 text-red-500'
      : 'border-[var(--border-color)] bg-[var(--surface)] text-[var(--foreground)]';

  const estimatedProbabilityRangeValue = (() => {
    const parsed = Number(estimatedProbability);
    if (!Number.isFinite(parsed)) {
      return 0;
    }

    return clampPercent(parsed);
  })();

  return (
    <main
      className="flex min-h-[calc(100dvh-var(--content-offset))] flex-col items-center justify-start px-6 py-12 pb-36 sm:py-16 sm:pb-16 md:py-20"
      aria-labelledby="ev-calculator-title"
    >
      <div className="w-full max-w-2xl space-y-12 md:space-y-16">
        <div className="space-y-4">
          <h1 id="ev-calculator-title" className="text-hero">{copy.title}</h1>
          <p id="ev-calculator-help" className="text-subtitle max-w-lg">{copy.subtitle}</p>
        </div>

        <div
          className="calculator-surface w-full overflow-hidden rounded-2xl transition-all duration-300"
          style={{
            maxHeight: 'min(calc(100dvh-var(--content-offset)-12rem-4px),58rem)',
          }}
        >
          <section className="flex max-h-[inherit] flex-col overflow-hidden" aria-describedby="ev-calculator-help">
            <div className="border-b border-[var(--border-color)] px-6 py-8 sm:px-8">
              <h2 className="text-card-title">{copy.cardTitle}</h2>
            </div>

            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-8 sm:px-8">
              <div className="flex flex-col gap-3">
                <label htmlFor="ev-bet-amount" className="text-sm font-medium">{copy.betAmount}</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">$</span>
                  <input
                    id="ev-bet-amount"
                    type="text"
                    inputMode="decimal"
                    aria-label={copy.betAmountAria}
                    value={betAmount}
                    onChange={(event) => onBetAmountChange(event.target.value)}
                    className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--surface)] px-4 py-3 pl-8 text-sm transition-colors placeholder:text-[var(--text-placeholder)] focus:border-[var(--brand)] focus:outline-none"
                    placeholder="100.00"
                  />
                </div>
                <BetAmountSlider locale={locale} amount={betAmount} onAmountChange={onBetAmountChange} max={1000} />
              </div>

              <OddsFields
                idPrefix="ev"
                locale={locale}
                contextLabel={copy.shareLabel}
                values={odds}
                onAmericanChange={onAmericanChange}
                onFractionalChange={onFractionalChange}
                onDecimalChange={onDecimalChange}
                onImpliedChange={onImpliedChange}
              />

              <div className="flex flex-col gap-2">
                <label htmlFor="ev-estimated-probability" className="text-sm font-medium">{copy.estimatedProbability}</label>
                <div className="relative">
                  <input
                    id="ev-estimated-probability"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    max="99.99"
                    step="0.01"
                    value={estimatedProbability}
                    onChange={(event) => onEstimatedProbabilityChange(event.target.value)}
                    aria-label={copy.estimatedProbabilityAria}
                    className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--surface)] px-4 py-3 pr-8 text-sm transition-colors placeholder:text-[var(--text-placeholder)] focus:border-[var(--brand)] focus:outline-none"
                    placeholder="55"
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">%</span>
                </div>
                <div className="space-y-1 pt-1">
                  <input
                    id="ev-estimated-probability-range"
                    type="range"
                    min="0"
                    max="99.99"
                    step="0.01"
                    value={estimatedProbabilityRangeValue}
                    onChange={(event) => onEstimatedProbabilityChange(event.target.value)}
                    aria-label={locale === 'es' ? 'Control deslizante de probabilidad estimada' : 'Estimated probability slider'}
                    className="h-2 w-full cursor-pointer accent-[var(--brand)]"
                  />
                  <div className="text-xs text-[var(--text-secondary)]">
                    {locale === 'es' ? 'Ajuste rápido con deslizador' : 'Quick adjust with slider'}
                  </div>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">{copy.estimatedProbabilityHint}</p>
              </div>
            </div>

            <footer aria-live="polite" aria-atomic="true" className="results-shell space-y-6 px-6 py-8 sm:px-8">
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">{copy.results}</p>
                <div className={`mb-3 rounded-lg border px-4 py-3 text-sm font-semibold ${statusToneClass}`}>
                  {statusLabel}
                </div>
                <p className="mb-4 text-sm text-[var(--text-secondary)]">
                  {statusHint} {statusDataPoints}
                </p>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div className="result-stat">
                    <p className="text-[10px] leading-tight whitespace-nowrap text-[var(--text-secondary)]">{copy.evAmount}</p>
                    <p className={`mt-2 text-xl font-semibold leading-tight ${outcomeToneClass}`}>
                      <MoneyDisplay value={expectedValueAmount} />
                    </p>
                  </div>
                  <div className="result-stat">
                    <p className="text-[10px] leading-tight whitespace-nowrap text-[var(--text-secondary)]">{copy.evPercent}</p>
                    <p className={`mt-2 text-xl font-semibold leading-tight ${outcomeToneClass}`}>{expectedValuePercent.toFixed(2)}%</p>
                  </div>
                  <div className="result-stat">
                    <p className="text-[10px] leading-tight whitespace-nowrap text-[var(--text-secondary)]">{copy.breakEven}</p>
                    <p className="mt-2 text-xl font-semibold leading-tight">{breakEvenProbability.toFixed(2)}%</p>
                  </div>
                  <div className="result-stat">
                    <p className="text-[10px] leading-tight whitespace-nowrap text-[var(--text-secondary)]">{copy.edge}</p>
                    <p className={`mt-2 text-xl font-semibold leading-tight ${outcomeToneClass}`}>{edgePercent.toFixed(2)}%</p>
                  </div>
                  <div className="result-stat">
                    <p className="text-[10px] leading-tight whitespace-nowrap text-[var(--text-secondary)]">{copy.expectedPayout}</p>
                    <p className="mt-2 text-xl font-semibold leading-tight"><MoneyDisplay value={expectedProfitIfWin} /></p>
                  </div>
                  <div className="result-stat">
                    <p className="text-[10px] leading-tight whitespace-nowrap text-[var(--text-secondary)]">{copy.expectedLoss}</p>
                    <p className="mt-2 text-xl font-semibold leading-tight"><MoneyDisplay value={-expectedLossIfLose} /></p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={onReset}
                  aria-label={copy.resetAria}
                  className="btn btn-secondary btn-md"
                >
                  {copy.reset}
                </button>
                <ShareLinkButton
                  locale={locale}
                  className="btn btn-secondary btn-md"
                  getShareUrl={getShareUrl}
                  onCopied={() => trackCalculatorEvent('ev_share_copied', { betAmount, legCount: 1 })}
                />
              </div>
            </footer>
          </section>
        </div>

        <aside
          aria-live="polite"
          aria-atomic="true"
          className="fixed inset-x-4 bottom-4 z-30 rounded-2xl border border-[var(--border-color)] bg-[var(--surface)]/95 p-4 shadow-[var(--shadow-lg)] backdrop-blur-md sm:hidden"
        >
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">{copy.betAmount}</p>
              <p key={`ev-sticky-bet-${betAmount}`} className="calc-value-pop mt-1 text-base font-semibold leading-tight">
                <MoneyDisplay value={parseFloat(betAmount) || 0} />
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">{copy.evAmount}</p>
              <p key={`ev-sticky-amount-${expectedValueAmount.toFixed(2)}`} className={`calc-value-pop mt-1 text-base font-semibold leading-tight ${outcomeToneClass}`}>
                <MoneyDisplay value={expectedValueAmount} />
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">{copy.edge}</p>
              <p key={`ev-sticky-edge-${edgePercent.toFixed(2)}`} className={`calc-value-pop mt-1 text-base font-semibold leading-tight ${outcomeToneClass}`}>
                {edgePercent.toFixed(2)}%
              </p>
            </div>
          </div>
        </aside>

        <section className="space-y-4">
          <h2 className="text-section-title">{copy.howToTitle}</h2>
          <p className="text-base leading-relaxed text-[var(--foreground)]">{copy.howToBody}</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-section-title">{locale === 'es' ? 'Como se calcula' : 'How EV Is Calculated'}</h2>
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--surface)] p-5">
            <p className="text-base font-semibold text-[var(--foreground)]">
              EV = (P(win) x Profit if Win) - (P(lose) x Stake)
            </p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {locale === 'es'
                ? 'P(lose) = 1 - P(win). El edge se calcula como: tu probabilidad estimada - probabilidad de equilibrio del mercado.'
                : 'P(lose) = 1 - P(win). Edge is calculated as: your estimated probability - market break-even probability.'}
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-section-title">{copy.relatedToolsTitle}</h2>
          <div className="flex flex-wrap gap-3">
            <Link href={locale === 'es' ? '/es' : '/'} className="btn btn-secondary btn-md">{copy.relatedSingle}</Link>
            <Link href={locale === 'es' ? '/es/parlay' : '/parlay'} className="btn btn-secondary btn-md">{copy.relatedParlay}</Link>
            <Link href={locale === 'es' ? '/es/odds-converter' : '/odds-converter'} className="btn btn-secondary btn-md">{copy.relatedOdds}</Link>
            <Link href={locale === 'es' ? '/es/guides' : '/guides'} className="btn btn-secondary btn-md">{copy.relatedGuides}</Link>
            <Link
              href={locale === 'es' ? '/es/guides/formula-apuestas-ev-positivo' : '/guides/positive-ev-betting-formula'}
              className="btn btn-secondary btn-md"
            >
              {locale === 'es' ? 'Fórmula de Apuestas +EV' : 'Positive EV Formula Guide'}
            </Link>
            <Link
              href={locale === 'es' ? '/es/guides/como-usar-calculadora-ev' : '/guides/how-to-use-ev-calculator'}
              className="btn btn-secondary btn-md"
            >
              {locale === 'es' ? 'Cómo Usar la Calculadora +EV' : 'How to Use the +EV Calculator'}
            </Link>
          </div>
        </section>

        <section className="space-y-6 pb-12">
          <h2 className="text-section-title">{copy.faqTitle}</h2>
          <div className="space-y-6">
            {copy.faq.map((item) => (
              <div key={item.question}>
                <h3 className="font-semibold text-base">{item.question}</h3>
                <p className="mt-2 text-base text-[var(--foreground)]">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}