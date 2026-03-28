"use client";

import { useState } from 'react';
import { oddsFieldsContent } from '../content/calculatorContent';
import type { Locale } from '../i18n';
import type { OddsField, OddsValues } from './oddsUtils';

type OddsFieldsProps = {
  idPrefix: string;
  contextLabel?: string;
  locale?: Locale;
  values: OddsValues;
  activeFormat?: OddsField;
  onActiveFormatChange?: (format: OddsField) => void;
  showFormatSelector?: boolean;
  showConvertedOptions?: boolean;
  convertedOptionsInteractive?: boolean;
  onAmericanChange: (value: string) => void;
  onFractionalChange: (value: string) => void;
  onDecimalChange: (value: string) => void;
  onImpliedChange: (value: string) => void;
};

type FormatOption = {
  key: OddsField;
  label: string;
  shortLabel: string;
  placeholder: string;
  type: 'text' | 'number';
  pattern?: string;
  min?: string;
  max?: string;
  step?: string;
  suffix?: string;
};

function getFormatOptions(locale: Locale): FormatOption[] {
  const content = oddsFieldsContent[locale];

  return [
    {
      key: 'american',
      label: content.formats.american.label,
      shortLabel: content.formats.american.shortLabel,
      placeholder: content.formats.american.placeholder,
      type: 'text',
      pattern: '-?[0-9]+',
    },
    {
      key: 'decimal',
      label: content.formats.decimal.label,
      shortLabel: content.formats.decimal.shortLabel,
      placeholder: content.formats.decimal.placeholder,
      type: 'number',
      min: '1',
      step: '0.001',
    },
    {
      key: 'fractional',
      label: content.formats.fractional.label,
      shortLabel: content.formats.fractional.shortLabel,
      placeholder: content.formats.fractional.placeholder,
      type: 'text',
    },
    {
      key: 'implied',
      label: content.formats.implied.label,
      shortLabel: content.formats.implied.shortLabel,
      placeholder: content.formats.implied.placeholder,
      type: 'number',
      min: '0',
      max: '99.99',
      step: '0.01',
      suffix: content.formats.implied.suffix,
    },
  ];
}

export default function OddsFields({
  idPrefix,
  contextLabel = 'Odds',
  locale = 'en',
  values,
  activeFormat: controlledActiveFormat,
  onActiveFormatChange,
  showFormatSelector = true,
  showConvertedOptions = true,
  convertedOptionsInteractive = true,
  onAmericanChange,
  onFractionalChange,
  onDecimalChange,
  onImpliedChange,
}: OddsFieldsProps) {
  const formatOptions = getFormatOptions(locale);
  const [localActiveFormat, setLocalActiveFormat] = useState<OddsField>('american');
  const activeFormat = controlledActiveFormat ?? localActiveFormat;

  const setActiveFormat = (format: OddsField) => {
    if (onActiveFormatChange) {
      onActiveFormatChange(format);
      return;
    }

    setLocalActiveFormat(format);
  };

  const activeOption = formatOptions.find((option) => option.key === activeFormat) ?? formatOptions[0];
  const activeValue = values[activeOption.key];

  const onActiveChange = (value: string) => {
    if (activeOption.key === 'american') {
      onAmericanChange(value);
      return;
    }

    if (activeOption.key === 'decimal') {
      onDecimalChange(value);
      return;
    }

    if (activeOption.key === 'fractional') {
      onFractionalChange(value);
      return;
    }

    onImpliedChange(value);
  };

  const convertedOptions = formatOptions.filter((option) => option.key !== activeFormat);

  const copy = oddsFieldsContent[locale];

  return (
    <fieldset className="space-y-4" aria-label={`${contextLabel} ${copy.inputFields}`}>
      {showFormatSelector ? (
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] p-1">
          <div role="tablist" aria-label={`${contextLabel} ${copy.selector}`} className="grid grid-cols-4 gap-1">
            {formatOptions.map((option) => {
              const isActive = option.key === activeFormat;

              return (
                <button
                  key={option.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveFormat(option.key)}
                  className={`rounded-lg px-2 py-2 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--brand)] focus-visible:outline-offset-2 sm:text-sm ${
                    isActive
                      ? 'bg-[var(--brand)] text-[var(--brand-foreground)]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--border-color)]/40 hover:text-[var(--foreground)]'
                  }`}
                >
                  <span className="sm:hidden">{option.shortLabel}</span>
                  <span className="hidden sm:inline">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <label htmlFor={`${idPrefix}-${activeOption.key}-odds`} className="text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)]">
          {copy.enter} {activeOption.label}
        </label>
        <div className="relative">
          <input
            id={`${idPrefix}-${activeOption.key}-odds`}
            type={activeOption.type}
            pattern={activeOption.pattern}
            min={activeOption.min}
            max={activeOption.max}
            step={activeOption.step}
            aria-label={`${contextLabel} ${activeOption.label.toLowerCase()} ${copy.oddsLabel}`}
            value={activeValue}
            onChange={(event) => onActiveChange(event.target.value)}
            className={`w-full rounded-lg border border-[var(--border-color)] bg-[var(--surface)] px-3 py-3 text-base sm:text-sm transition-colors placeholder:text-[var(--text-placeholder)] focus:outline-none ${activeOption.suffix ? 'pr-7' : ''}`}
            placeholder={activeOption.placeholder}
          />
          {activeOption.suffix ? (
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
              {activeOption.suffix}
            </span>
          ) : null}
        </div>
      </div>

      {showConvertedOptions ? (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
            {copy.converted}
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {convertedOptions.map((option) => (
              convertedOptionsInteractive ? (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setActiveFormat(option.key)}
                  className="rounded-lg border border-[var(--border-color)] bg-[var(--surface)] px-3 py-2 text-left transition-colors hover:border-[var(--brand)]/40 hover:bg-[var(--surface-soft)]"
                  aria-label={`${copy.switchInput} ${option.label}`}
                >
                  <p className="text-[11px] font-medium uppercase tracking-widest text-[var(--text-secondary)]">{option.label}</p>
                  <p className="mt-1 truncate text-sm font-semibold">
                    {values[option.key]}
                    {option.suffix ?? ''}
                  </p>
                </button>
              ) : (
                <div
                  key={option.key}
                  className="rounded-lg border border-[var(--border-color)] bg-[var(--surface)] px-3 py-2 text-left"
                >
                  <p className="text-[11px] font-medium uppercase tracking-widest text-[var(--text-secondary)]">{option.label}</p>
                  <p className="mt-1 truncate text-sm font-semibold">
                    {values[option.key]}
                    {option.suffix ?? ''}
                  </p>
                </div>
              )
            ))}
          </div>
        </div>
      ) : null}
    </fieldset>
  );
}
