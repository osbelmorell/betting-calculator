'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Locale } from '../i18n';
import { oddsFieldsContent, parlayCalculatorContent } from '../content/calculatorContent';
import { trackCalculatorEvent } from './analytics';
import BetAmountSlider from './BetAmountSlider';
import {
  applySingleSeedToParlayState,
  buildRouteWithState,
  createDefaultParlayState,
  createLeg,
  decodeParlayState,
  decodeSingleState,
  encodeParlayState,
  loadParlayStateFromStorage,
  NAVIGATION_SEED_PARAM,
  PARLAY_STATE_PARAM,
  saveParlayStateToStorage,
  type ParlayCalculatorState,
  type ParlayLeg,
} from './calculatorState';
import MoneyDisplay from './MoneyDisplay';
import OddsFields from './OddsFields';
import ShareLinkButton from './ShareLinkButton';
import AbbreviationHelp from './AbbreviationHelp';
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
  locale?: Locale;
  initialSharedState?: string;
  incomingSeedState?: string;
};

export default function ParlayCalculator({
  locale = 'en',
  initialSharedState,
  incomingSeedState,
}: ParlayCalculatorProps) {
  const copy = parlayCalculatorContent[locale].ui;
  const oddsFieldsCopy = oddsFieldsContent[locale];

  const initialState = useMemo<ParlayCalculatorState>(() => {
    return decodeParlayState(initialSharedState) ?? createDefaultParlayState();
  }, [initialSharedState]);

  const [betAmount, setBetAmount] = useState(initialState.betAmount);
  const [legs, setLegs] = useState<ParlayLeg[]>(initialState.legs);
  const [activeOddsFormat, setActiveOddsFormat] = useState<OddsField>('american');
  const [hasHydrated, setHasHydrated] = useState(false);
  const hasTrackedFirstInput = useRef(false);
  const hasTrackedFirstCalc = useRef(false);

  const oddsFormatOptions = useMemo(
    () => [
      {
        key: 'american' as const,
        label: oddsFieldsCopy.formats.american.label,
        shortLabel: oddsFieldsCopy.formats.american.shortLabel,
      },
      {
        key: 'decimal' as const,
        label: oddsFieldsCopy.formats.decimal.label,
        shortLabel: oddsFieldsCopy.formats.decimal.shortLabel,
      },
      {
        key: 'fractional' as const,
        label: oddsFieldsCopy.formats.fractional.label,
        shortLabel: oddsFieldsCopy.formats.fractional.shortLabel,
      },
      {
        key: 'implied' as const,
        label: oddsFieldsCopy.formats.implied.label,
        shortLabel: oddsFieldsCopy.formats.implied.shortLabel,
      },
    ],
    [oddsFieldsCopy],
  );

  useEffect(() => {
    const params = typeof window === 'undefined' ? null : new URLSearchParams(window.location.search);
    const sharedFromUrl = decodeParlayState(params?.get(PARLAY_STATE_PARAM) ?? undefined);
    const seedFromUrl = decodeSingleState(params?.get(NAVIGATION_SEED_PARAM) ?? undefined);

    const sharedState = decodeParlayState(initialSharedState) ?? sharedFromUrl;
    const storedState = loadParlayStateFromStorage();
    const seedState = decodeSingleState(incomingSeedState) ?? seedFromUrl;

    const nextState = sharedState ?? storedState ?? createDefaultParlayState();
    const resolvedState = applySingleSeedToParlayState(nextState, sharedState ? null : seedState);

    const frameId = window.requestAnimationFrame(() => {
      setBetAmount(resolvedState.betAmount);
      setLegs(resolvedState.legs);
      setHasHydrated(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [incomingSeedState, initialSharedState]);

  const onBetAmountChange = useCallback((value: string) => {
    if (!hasTrackedFirstInput.current) {
      hasTrackedFirstInput.current = true;
      trackCalculatorEvent('parlay_first_input', { source: 'bet_amount', betAmount, legCount: legs.length });
    }

    const formatted = formatBetAmountInput(value);

    if (formatted === null) {
      return;
    }

    setBetAmount(formatted);
  }, [betAmount, legs.length]);

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

  useEffect(() => {
    if (!hasHydrated || typeof window === 'undefined') {
      return;
    }

    saveParlayStateToStorage(state);
  }, [hasHydrated, state]);

  const getShareUrl = useCallback(() => {
    if (typeof window === 'undefined') {
      return '';
    }

    const encodedShareState = encodeParlayState(state);

    return `${window.location.origin}${buildRouteWithState(window.location.pathname, PARLAY_STATE_PARAM, encodedShareState)}`;
  }, [state]);

  const resetParlay = () => {
    trackCalculatorEvent('parlay_reset', { betAmount, legCount: legs.length });
    const resetState = createDefaultParlayState();

    setBetAmount(resetState.betAmount);
    setLegs(resetState.legs);
    setActiveOddsFormat('american');
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
            {copy.title}
          </h1>
          <p id="parlay-calculator-help" className="text-subtitle max-w-lg">
            {copy.subtitle}
          </p>
          <p className="text-sm text-[var(--text-secondary)]">
            {locale === 'es' ? '¿Qué es un parlay? Una apuesta con varias piernas donde todas deben acertarse.' : 'What is a parlay? A multi-leg bet where every leg must win.'}{' '}
            <Link href={locale === 'es' ? '/es/guides/parlay-vs-straight-bets' : '/guides/parlay-vs-straight-bets'} className="text-[var(--brand)] underline underline-offset-2 hover:opacity-90">
              {locale === 'es' ? 'Aprende más' : 'Learn more'}
            </Link>
          </p>
          <section aria-label={copy.quickStartTitle} className="rounded-xl border border-[var(--border-color)] bg-[var(--surface)] px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">{copy.quickStartTitle}</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-[var(--foreground)]">
              {copy.quickStartSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
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
              <h2 className="text-card-title">{copy.cardTitle}</h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{copy.autoUpdateHint}</p>
            </div>

          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-8 sm:px-8">
            <div className="flex flex-col gap-3">
              <label htmlFor="parlay-bet-amount" className="text-sm font-medium">
                {copy.betAmount}
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
                  $
                </span>
                <input
                  id="parlay-bet-amount"
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

            <h2 className="text-sm font-semibold">{copy.legs}</h2>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
                {oddsFieldsCopy.selector}
              </p>
              <div className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] p-1">
                <div
                  role="tablist"
                  aria-label={oddsFieldsCopy.selector}
                  className="grid grid-cols-4 gap-1"
                >
                  {oddsFormatOptions.map((option) => {
                    const isActive = option.key === activeOddsFormat;

                    return (
                      <button
                        key={option.key}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setActiveOddsFormat(option.key)}
                        className={`rounded-lg px-2 py-2 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--brand)] focus-visible:outline-offset-2 sm:text-sm ${
                          isActive
                            ? 'bg-[var(--brand)] text-[var(--brand-foreground)]'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--border-color)]/40 hover:text-[var(--foreground)]'
                        }`}
                      >
                        <span className="sm:hidden whitespace-nowrap">{option.shortLabel}</span>
                        <span className="hidden sm:inline whitespace-nowrap">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">
                {locale === 'es' ? '¿Necesitas ayuda con formatos de cuotas?' : 'Need help with odds formats?'}{' '}
                <Link href={locale === 'es' ? '/es/guides/lineas-americanas-a-decimales' : '/guides/american-odds-to-decimal'} className="text-[var(--brand)] underline underline-offset-2 hover:opacity-90">
                  {locale === 'es' ? 'Aprende este paso' : 'Learn this step'}
                </Link>
              </p>
            </div>

            <div className="flex flex-col gap-4" role="list" aria-label={copy.legListAria}>
              {legs.map((leg, index) => (
                <section
                  key={leg.id}
                  role="listitem"
                  className="rounded-lg border border-[var(--border-color)] bg-[var(--surface-soft)] p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-medium">{leg.label.trim() || `${copy.leg} ${index + 1}`}</h3>
                    <button
                      type="button"
                      onClick={() => removeLeg(leg.id)}
                      disabled={legs.length <= 1}
                      aria-label={`${copy.removeAria} ${leg.label.trim() || `${copy.leg} ${index + 1}`}`}
                      className="btn btn-danger btn-sm text-xs"
                    >
                      {copy.remove}
                    </button>
                  </div>

                  <div className="mb-4 flex flex-col gap-2">
                    <label htmlFor={`parlay-leg-label-${leg.id}`} className="text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)]">
                      {copy.label}
                    </label>
                    <input
                      id={`parlay-leg-label-${leg.id}`}
                      type="text"
                      value={leg.label}
                      onChange={(event) => updateLegLabel(leg.id, event.target.value)}
                      className="rounded-lg border border-[var(--border-color)] bg-[var(--surface)] px-3 py-2 text-sm transition-colors placeholder:text-[var(--text-placeholder)] focus:border-[var(--brand)] focus:outline-none"
                      placeholder={locale === 'es'
                        ? `${copy.leg} ${index + 1} (Equipo, mercado, etc.)`
                        : `${copy.leg} ${index + 1} (Team, market, etc.)`}
                      aria-label={`${copy.label} ${copy.leg.toLowerCase()} ${index + 1}`}
                    />
                    <p className="text-xs text-[var(--text-secondary)]">
                      {locale === 'es' ? 'Opcional: usa una nota corta para identificar este pick.' : 'Optional: use a short note to identify this pick.'}
                    </p>
                  </div>

                  <OddsFields
                    idPrefix={`parlay-leg-${leg.id}`}
                    locale={locale}
                    contextLabel={leg.label.trim() || `${copy.leg} ${index + 1}`}
                    values={leg.odds}
                    activeFormat={activeOddsFormat}
                    showFormatSelector={false}
                    showConvertedOptions={true}
                    convertedOptionsInteractive={false}
                    onAmericanChange={(value) => onAmericanChange(leg.id, value)}
                    onFractionalChange={(value) => onFractionalChange(leg.id, value)}
                    onDecimalChange={(value) => onDecimalChange(leg.id, value)}
                    onImpliedChange={(value) => onImpliedChange(leg.id, value)}
                  />
                </section>
              ))}
            </div>

            <div className="flex justify-start">
              <button
                type="button"
                onClick={addLeg}
                aria-label={copy.addLegAria}
                className="btn btn-primary btn-sm"
              >
                {copy.addLeg}
              </button>
            </div>
          </div>

          <footer
            aria-live="polite"
            aria-atomic="true"
            className="results-shell shrink-0 space-y-6 px-6 py-8 sm:px-8"
          >
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
                {copy.projectedResults}
              </p>
              <p className="mb-4 text-sm text-[var(--text-secondary)]">
                {locale === 'es'
                  ? 'Regla clave: si falla una pierna, pierde todo el parlay.'
                  : 'Key rule: if one leg loses, the entire parlay loses.'}
              </p>
              <p className="mb-4 text-sm text-[var(--text-secondary)]">
                {locale === 'es' ? '¿Cómo leer cuota combinada y probabilidad?' : 'How to read combined odds and win probability?'}{' '}
                <Link href={locale === 'es' ? '/es/guides/formula-cuotas-parlay' : '/guides/parlay-odds-formula'} className="text-[var(--brand)] underline underline-offset-2 hover:opacity-90">
                  {locale === 'es' ? 'Aprende este paso' : 'Learn this step'}
                </Link>
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="result-stat">
                  <p className="text-xs text-[var(--text-secondary)]">{copy.combined}</p>
                  <p key={`parlay-combined-${combinedDecimal.toFixed(3)}`} className="calc-value-pop mt-2 truncate text-lg font-semibold">
                    {combinedDecimal > 1 ? decimalDisplay(combinedDecimal) : '0'}
                  </p>
                </div>

                <div className="result-stat">
                  <p className="text-xs text-[var(--text-secondary)]">{copy.winnings}</p>
                  <p key={`parlay-winnings-${expectedWinnings.toFixed(2)}`} className="calc-value-pop mt-2 text-xl font-semibold">
                    <MoneyDisplay value={expectedWinnings} />
                  </p>
                </div>

                <div className="result-stat">
                  <p className="text-xs text-[var(--text-secondary)]">{copy.payout}</p>
                  <p key={`parlay-payout-${expectedPayout.toFixed(2)}`} className="calc-value-pop mt-2 text-lg font-semibold">
                    <MoneyDisplay value={expectedPayout} />
                  </p>
                </div>

                <div className="result-stat">
                  <p className="text-xs text-[var(--text-secondary)]">
                    <AbbreviationHelp
                      short={copy.winPct}
                      expanded={locale === 'es' ? 'Porcentaje de probabilidad implícita de acierto del parlay.' : 'Implied win probability percentage for this parlay.'}
                    />
                  </p>
                  <p key={`parlay-winp-${impliedWinningPercentage.toFixed(2)}`} className="calc-value-pop mt-2 truncate text-lg font-semibold">
                    {impliedWinningPercentage.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={resetParlay}
                  aria-label={copy.resetAria}
                  className="btn btn-secondary btn-md"
                >
                  {copy.reset}
                </button>
                <ShareLinkButton
                  locale={locale}
                  className="btn btn-secondary btn-md"
                  getShareUrl={getShareUrl}
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
        className="fixed inset-x-4 bottom-4 z-30 rounded-2xl border border-[var(--border-color)] bg-[var(--surface)]/95 shadow-[var(--shadow-lg)] backdrop-blur-md sm:hidden p-4"
      >
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">{locale === 'es' ? 'Apuestas' : copy.betAmount}</p>
            <p key={`parlay-sticky-bet-${betAmount}`} className="calc-value-pop mt-1 text-base font-semibold leading-tight">
              <MoneyDisplay value={parseFloat(betAmount) || 0} />
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">{copy.winnings}</p>
            <p key={`parlay-sticky-win-${expectedWinnings.toFixed(2)}`} className="calc-value-pop mt-1 text-base font-semibold leading-tight">
              <MoneyDisplay value={expectedWinnings} />
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">{copy.payout}</p>
            <p key={`parlay-sticky-pay-${expectedPayout.toFixed(2)}`} className="calc-value-pop mt-1 text-base font-semibold leading-tight">
              <MoneyDisplay value={expectedPayout} />
            </p>
          </div>
        </div>
      </aside>
      </div>

      {/* Editorial Content Section */}
      <div className="w-full max-w-2xl space-y-8 pt-10 pb-16 md:pt-12 md:pb-20">
        <section className="space-y-6">
          <h2 className="text-section-title">{copy.howItWorks}</h2>
          <div className="space-y-4 text-base leading-relaxed text-[var(--foreground)]">
            <p>{copy.howItWorksIntro}</p>
            <p><strong>{locale === 'es' ? 'Ejemplo:' : 'Example:'}</strong> {copy.howItWorksExample}</p>
            <p>{copy.howItWorksOutro}</p>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-section-title">{copy.buildParlay}</h2>
          <div className="space-y-4 text-base leading-relaxed text-[var(--foreground)]">
            <p>{copy.buildIntro}</p>
            <ol className="space-y-3 list-decimal list-inside">
              {copy.buildSteps.map(([title, description]) => (
                <li key={title}><strong>{title}</strong> — {description}</li>
              ))}
            </ol>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-section-title">{copy.relatedToolsTitle}</h2>
          <p className="text-base leading-relaxed text-[var(--foreground)]">{copy.relatedToolsBody}</p>
          <div className="flex flex-wrap gap-3">
            <Link href={locale === 'es' ? '/es' : '/'} className="btn btn-secondary btn-md">
              {copy.relatedSingle}
            </Link>
            <Link href={locale === 'es' ? '/es/ev' : '/ev'} className="btn btn-secondary btn-md">
              {copy.relatedEv}
            </Link>
            <Link href={locale === 'es' ? '/es/odds-converter' : '/odds-converter'} className="btn btn-secondary btn-md">
              {copy.relatedOdds}
            </Link>
            <Link href={locale === 'es' ? '/es/guides' : '/guides'} className="btn btn-secondary btn-md">
              {copy.relatedGuides}
            </Link>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-section-title">{copy.faq}</h2>
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
