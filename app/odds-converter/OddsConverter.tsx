'use client';

import Link from 'next/link';
import { useState } from 'react';
import { oddsConverterContent } from './content';
import type { Locale } from '../i18n';
import { trackCalculatorEvent } from '../components/analytics';
import OddsFields from '../components/OddsFields';
import {
  clampPercent,
  decimalDisplay,
  parseFractional,
  toAmerican,
  toDecimalFromAmerican,
  toDecimalFromImplied,
  toFractional,
  toImplied,
  type OddsField,
  type OddsValues,
} from '../components/oddsUtils';

type OddsConverterProps = {
  locale?: Locale;
};

export default function OddsConverter({ locale = 'en' }: OddsConverterProps) {
  const copy = oddsConverterContent[locale];
  const [odds, setOdds] = useState<OddsValues>({
    american: '-110',
    decimal: '1.909',
    fractional: '10/11',
    implied: '52.38',
  });

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

  const applyExampleScenario = () => {
    trackCalculatorEvent('odds_example_applied', { source: 'guided_example', legCount: 1 });
    setOdds({
      american: '+150',
      decimal: '2.500',
      fractional: '3/2',
      implied: '40.00',
    });
  };

  return (
    <main
      className="flex min-h-[calc(100dvh-var(--content-offset))] flex-col items-center justify-start px-6 py-12 sm:py-16 md:py-20"
      aria-labelledby="odds-converter-title"
    >
      <div className="w-full max-w-2xl space-y-12 md:space-y-16">
        <div className="space-y-4">
          <h1 id="odds-converter-title" className="text-hero">{copy.title}</h1>
          <p className="text-subtitle max-w-lg">{copy.subtitle}</p>
          <section aria-label={copy.quickStartTitle} className="rounded-xl border border-[var(--border-color)] bg-[var(--surface)] px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">{copy.quickStartTitle}</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-[var(--foreground)]">
              {copy.quickStartSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
        </div>

        <div className="calculator-surface w-full overflow-hidden rounded-2xl">
          <section className="space-y-6 px-6 py-8 sm:px-8" aria-labelledby="odds-converter-card-title">
            <h2 id="odds-converter-card-title" className="text-card-title">{copy.converterCardTitle}</h2>
            <p className="text-sm text-[var(--text-secondary)]">{copy.autoUpdateHint}</p>
            <section className="rounded-lg border border-[var(--border-color)] bg-[var(--surface-soft)] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">{copy.exampleTitle}</p>
              <p className="mt-2 text-sm text-[var(--foreground)]">{copy.exampleSummary}</p>
              <button type="button" onClick={applyExampleScenario} className="btn btn-secondary btn-sm mt-3">
                {copy.exampleCta}
              </button>
            </section>
            <OddsFields
              idPrefix="odds-converter"
              locale={locale}
              contextLabel={copy.title}
              values={odds}
              onAmericanChange={onAmericanChange}
              onFractionalChange={onFractionalChange}
              onDecimalChange={onDecimalChange}
              onImpliedChange={onImpliedChange}
            />
            <p className="text-sm text-[var(--text-secondary)]">
              {locale === 'es' ? '¿No sabes qué formato usar?' : 'Not sure which odds format to use?'}{' '}
              <Link href={locale === 'es' ? '/es/guides/lineas-americanas-a-decimales' : '/guides/american-odds-to-decimal'} className="text-[var(--brand)] underline underline-offset-2 hover:opacity-90">
                {locale === 'es' ? 'Aprende este paso' : 'Learn this step'}
              </Link>
            </p>
          </section>
        </div>
      </div>

      <div className="w-full max-w-2xl space-y-8 pt-10 pb-16 md:pt-12 md:pb-20">
        <section className="space-y-4">
          <h2 className="text-section-title">{copy.howItWorksTitle}</h2>
          <p className="text-base leading-relaxed text-[var(--foreground)]">{copy.howItWorksBody}</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-section-title">{copy.formatsTitle}</h2>
          <p className="text-base leading-relaxed text-[var(--foreground)]">{copy.formatsBody}</p>
        </section>

        <section className="space-y-4" aria-labelledby="odds-table-title">
          <h2 id="odds-table-title" className="text-section-title">{copy.tableTitle}</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            {locale === 'es' ? '¿Cómo leer probabilidad implícita en la tabla?' : 'How to read implied probability in the table?'}{' '}
            <Link href={locale === 'es' ? '/es/guides/guia-probabilidad-implicita' : '/guides/implied-probability-guide'} className="text-[var(--brand)] underline underline-offset-2 hover:opacity-90">
              {locale === 'es' ? 'Aprende este paso' : 'Learn this step'}
            </Link>
          </p>
          <div className="overflow-x-auto rounded-xl border border-[var(--border-color)] bg-[var(--surface)]">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border-color)] bg-[var(--surface-soft)]">
                  <th scope="col" className="px-4 py-3 font-semibold">{copy.tableColumns.american}</th>
                  <th scope="col" className="px-4 py-3 font-semibold">{copy.tableColumns.decimal}</th>
                  <th scope="col" className="px-4 py-3 font-semibold">{copy.tableColumns.fractional}</th>
                  <th scope="col" className="px-4 py-3 font-semibold">{copy.tableColumns.implied}</th>
                </tr>
              </thead>
              <tbody>
                {copy.tableRows.map((row) => (
                  <tr key={`${row.american}-${row.decimal}`} className="border-b border-[var(--border-color)] last:border-0">
                    <td className="px-4 py-3">{row.american}</td>
                    <td className="px-4 py-3">{row.decimal}</td>
                    <td className="px-4 py-3">{row.fractional}</td>
                    <td className="px-4 py-3">{row.implied}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-section-title">{copy.relatedToolsTitle}</h2>
          <div className="flex flex-wrap gap-3">
            <Link href={locale === 'es' ? '/es' : '/'} className="btn btn-secondary btn-md">
              {copy.relatedSingle}
            </Link>
            <Link href={locale === 'es' ? '/es/parlay' : '/parlay'} className="btn btn-secondary btn-md">
              {copy.relatedParlay}
            </Link>
            <Link href={locale === 'es' ? '/es/ev' : '/ev'} className="btn btn-secondary btn-md">
              {locale === 'es' ? 'Calculadora +EV' : '+EV Calculator'}
            </Link>
            <Link href={locale === 'es' ? '/es/guides' : '/guides'} className="btn btn-secondary btn-md">
              {copy.relatedGuides}
            </Link>
          </div>
        </section>

        <section className="space-y-6">
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
