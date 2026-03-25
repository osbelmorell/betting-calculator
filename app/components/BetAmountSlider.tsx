'use client';

import { useMemo } from 'react';
import { parseFormattedNumber } from './oddsUtils';

type BetAmountSliderProps = {
  amount: string;
  onAmountChange: (value: string) => void;
  min?: number;
  max?: number;
};

function formatSliderAmount(value: number): string {
  if (Number.isInteger(value)) {
    return value.toString();
  }

  return value.toFixed(2).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
}

function findNearestValue(values: number[], target: number): number {
  let nearest = values[0];

  for (const value of values) {
    if (Math.abs(value - target) < Math.abs(nearest - target)) {
      nearest = value;
    }
  }

  return nearest;
}

export default function BetAmountSlider({
  amount,
  onAmountChange,
  min = 0,
  max = 1000,
}: BetAmountSliderProps) {
  const quickAmounts = useMemo(() => {
    const candidates = [10, 25, 50, 100, 250, 500, 1000];
    return candidates.filter((value) => value >= min && value <= max);
  }, [min, max]);

  const allowedValues = useMemo(() => {
    const values = new Set<number>([min, max]);
    const initialSteps = [0.25, 0.5, 1, 5, 10];

    for (const value of initialSteps) {
      if (value >= min && value <= max) {
        values.add(value);
      }
    }

    const tensStart = Math.max(20, Math.ceil(min / 10) * 10);
    for (let value = tensStart; value <= max; value += 10) {
      values.add(value);
    }

    return Array.from(values).sort((a, b) => a - b);
  }, [min, max]);

  const sliderValue = useMemo(() => {
    const numericAmount = parseFormattedNumber(amount);

    if (!Number.isFinite(numericAmount)) {
      return min;
    }

    if (numericAmount < min) {
      return min;
    }

    if (numericAmount > max) {
      return max;
    }

    return findNearestValue(allowedValues, numericAmount);
  }, [amount, min, max, allowedValues]);

  const onSliderChange = (value: string) => {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
      return;
    }

    const snapped = findNearestValue(allowedValues, numericValue);
    onAmountChange(formatSliderAmount(snapped));
  };

  return (
    <div className="flex flex-col gap-2">
      {quickAmounts.length > 0 ? (
        <div className="flex flex-wrap gap-2" aria-label="Quick bet amount presets">
          {quickAmounts.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => onAmountChange(formatSliderAmount(value))}
              className="btn btn-secondary btn-sm !min-h-8 !px-3"
              aria-label={`Set bet amount to ${value.toLocaleString()} dollars`}
            >
              ${value.toLocaleString()}
            </button>
          ))}
        </div>
      ) : null}
      <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
        <span className="uppercase tracking-widest">Range</span>
        <span className="font-medium">${min.toLocaleString()} – ${max.toLocaleString()}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={0.25}
        value={sliderValue}
        onChange={(event) => onSliderChange(event.target.value)}
        className="h-1.5 w-full cursor-pointer rounded-full bg-[var(--border-color)] appearance-none accent-[#0071e3]"
        aria-label="Bet amount slider"
        style={{
          background: `linear-gradient(90deg, #0071e3 ${((sliderValue - min) / (max - min)) * 100}%, var(--border-color) ${((sliderValue - min) / (max - min)) * 100}%)`
        }}
      />
    </div>
  );
}
