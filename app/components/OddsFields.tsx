import type { OddsValues } from './oddsUtils';

type OddsFieldsProps = {
  idPrefix: string;
  contextLabel?: string;
  values: OddsValues;
  onAmericanChange: (value: string) => void;
  onFractionalChange: (value: string) => void;
  onDecimalChange: (value: string) => void;
  onImpliedChange: (value: string) => void;
};

export default function OddsFields({
  idPrefix,
  contextLabel = 'Odds',
  values,
  onAmericanChange,
  onFractionalChange,
  onDecimalChange,
  onImpliedChange,
}: OddsFieldsProps) {
  return (
    <fieldset className="flex flex-wrap gap-4" aria-label={`${contextLabel} input fields`}>
      <div className="flex min-w-[10rem] flex-1 flex-col gap-2">
        <label htmlFor={`${idPrefix}-american-odds`} className="text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)]">
          American
        </label>
        <input
          id={`${idPrefix}-american-odds`}
          type="text"
          inputMode="numeric"
          aria-label={`${contextLabel} American odds`}
          value={values.american}
          onChange={(event) => onAmericanChange(event.target.value)}
          className="rounded-lg border border-[var(--border-color)] bg-[var(--background)] px-3 py-2 text-sm transition-colors placeholder:text-[var(--text-secondary)] focus:border-[#0071e3] focus:outline-none"
          placeholder="-110"
        />
      </div>

      <div className="flex min-w-[10rem] flex-1 flex-col gap-2">
        <label htmlFor={`${idPrefix}-fractional-odds`} className="text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)]">
          Fractional
        </label>
        <input
          id={`${idPrefix}-fractional-odds`}
          type="text"
          aria-label={`${contextLabel} fractional odds`}
          value={values.fractional}
          onChange={(event) => onFractionalChange(event.target.value)}
          className="rounded-lg border border-[var(--border-color)] bg-[var(--background)] px-3 py-2 text-sm transition-colors placeholder:text-[var(--text-secondary)] focus:border-[#0071e3] focus:outline-none"
          placeholder="10/11"
        />
      </div>

      <div className="flex min-w-[10rem] flex-1 flex-col gap-2">
        <label htmlFor={`${idPrefix}-decimal-odds`} className="text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)]">
          Decimal
        </label>
        <input
          id={`${idPrefix}-decimal-odds`}
          type="number"
          min="1"
          step="0.001"
          aria-label={`${contextLabel} decimal odds`}
          value={values.decimal}
          onChange={(event) => onDecimalChange(event.target.value)}
          className="rounded-lg border border-[var(--border-color)] bg-[var(--background)] px-3 py-2 text-sm transition-colors placeholder:text-[var(--text-secondary)] focus:border-[#0071e3] focus:outline-none"
          placeholder="1.909"
        />
      </div>

      <div className="flex min-w-[10rem] flex-1 flex-col gap-2">
        <label htmlFor={`${idPrefix}-implied-odds`} className="text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)]">
          Probability
        </label>
        <div className="relative">
          <input
            id={`${idPrefix}-implied-odds`}
            type="number"
            min="0"
            max="99.99"
            step="0.01"
            aria-label={`${contextLabel} implied odds percentage`}
            value={values.implied}
            onChange={(event) => onImpliedChange(event.target.value)}
            className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--background)] px-3 py-2 pr-7 text-sm transition-colors placeholder:text-[var(--text-secondary)] focus:border-[#0071e3] focus:outline-none"
            placeholder="52.38"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
            %
          </span>
        </div>
      </div>
    </fieldset>
  );
}
