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
      <div className="flex min-w-[10.5rem] flex-1 flex-col gap-2">
        <label htmlFor={`${idPrefix}-american-odds`}>American Odds</label>
        <input
          id={`${idPrefix}-american-odds`}
          type="text"
          inputMode="numeric"
          aria-label={`${contextLabel} American odds`}
          value={values.american}
          onChange={(event) => onAmericanChange(event.target.value)}
          className="rounded-md border-2 border-gray-800 p-2"
          placeholder="-110"
        />
      </div>

      <div className="flex min-w-[10.5rem] flex-1 flex-col gap-2">
        <label htmlFor={`${idPrefix}-fractional-odds`}>Fractional Odds</label>
        <input
          id={`${idPrefix}-fractional-odds`}
          type="text"
          aria-label={`${contextLabel} fractional odds`}
          value={values.fractional}
          onChange={(event) => onFractionalChange(event.target.value)}
          className="rounded-md border-2 border-gray-800 p-2"
          placeholder="10/11"
        />
      </div>

      <div className="flex min-w-[10.5rem] flex-1 flex-col gap-2">
        <label htmlFor={`${idPrefix}-decimal-odds`}>Decimal Odds</label>
        <input
          id={`${idPrefix}-decimal-odds`}
          type="number"
          min="1"
          step="0.001"
          aria-label={`${contextLabel} decimal odds`}
          value={values.decimal}
          onChange={(event) => onDecimalChange(event.target.value)}
          className="rounded-md border-2 border-gray-800 p-2"
          placeholder="1.909"
        />
      </div>

      <div className="flex min-w-[10.5rem] flex-1 flex-col gap-2">
        <label htmlFor={`${idPrefix}-implied-odds`}>Implied Odds (%)</label>
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
            className="w-full rounded-md border-2 border-gray-800 p-2 pr-7"
            placeholder="52.38"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            %
          </span>
        </div>
      </div>
    </fieldset>
  );
}
