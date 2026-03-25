"use client";

import { useState } from 'react';
import type { OddsField, OddsValues } from './oddsUtils';

type OddsFieldsProps = {
  idPrefix: string;
  contextLabel?: string;
  values: OddsValues;
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

const formatOptions: FormatOption[] = [
  {
    key: 'american',
    label: 'American',
    shortLabel: 'US',
    placeholder: '-110',
    type: 'text',
    pattern: '-?[0-9]+',
  },
  {
    key: 'decimal',
    label: 'Decimal',
    shortLabel: 'Dec',
    placeholder: '1.909',
    type: 'number',
    min: '1',
    step: '0.001',
  },
  {
    key: 'fractional',
    label: 'Fractional',
    shortLabel: 'Frac',
    placeholder: '10/11',
    type: 'text',
  },
  {
    key: 'implied',
    label: 'Probability',
    shortLabel: 'Prob',
    placeholder: '52.38',
    type: 'number',
    min: '0',
    max: '99.99',
    step: '0.01',
    suffix: '%',
  },
];

export default function OddsFields({
  idPrefix,
  contextLabel = 'Odds',
  values,
  onAmericanChange,
  onFractionalChange,
  onDecimalChange,
  onImpliedChange,
}: OddsFieldsProps) {
  const [activeFormat, setActiveFormat] = useState<OddsField>('american');

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

  return (
    <fieldset className="space-y-4" aria-label={`${contextLabel} input fields`}>
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-soft)] p-1">
        <div role="tablist" aria-label={`${contextLabel} odds format selector`} className="grid grid-cols-4 gap-1">
          {formatOptions.map((option) => {
            const isActive = option.key === activeFormat;

            return (
              <button
                key={option.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFormat(option.key)}
                className={`rounded-lg px-2 py-2 text-xs font-medium transition-colors sm:text-sm ${
                  isActive
                    ? 'bg-[var(--brand)] text-white'
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

      <div className="flex flex-col gap-2">
        <label htmlFor={`${idPrefix}-${activeOption.key}-odds`} className="text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)]">
          Enter {activeOption.label}
        </label>
        <div className="relative">
          <input
            id={`${idPrefix}-${activeOption.key}-odds`}
            type={activeOption.type}
            pattern={activeOption.pattern}
            min={activeOption.min}
            max={activeOption.max}
            step={activeOption.step}
            aria-label={`${contextLabel} ${activeOption.label.toLowerCase()} odds`}
            value={activeValue}
            onChange={(event) => onActiveChange(event.target.value)}
            className={`w-full rounded-lg border border-[var(--border-color)] bg-[var(--surface)] px-3 py-3 text-base sm:text-sm transition-colors placeholder:text-[var(--text-secondary)] focus:outline-none ${activeOption.suffix ? 'pr-7' : ''}`}
            placeholder={activeOption.placeholder}
          />
          {activeOption.suffix ? (
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
              {activeOption.suffix}
            </span>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
          Converted
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {convertedOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setActiveFormat(option.key)}
              className="rounded-lg border border-[var(--border-color)] bg-[var(--surface)] px-3 py-2 text-left transition-colors hover:border-[var(--brand)]/40 hover:bg-[var(--surface-soft)]"
              aria-label={`Switch active odds input to ${option.label}`}
            >
              <p className="text-[11px] font-medium uppercase tracking-widest text-[var(--text-secondary)]">{option.label}</p>
              <p className="mt-1 truncate text-sm font-semibold">
                {values[option.key]}
                {option.suffix ?? ''}
              </p>
            </button>
          ))}
        </div>
      </div>
    </fieldset>
  );
}
