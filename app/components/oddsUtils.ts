export type OddsField = 'american' | 'fractional' | 'decimal' | 'implied';

export type OddsValues = {
  american: string;
  fractional: string;
  decimal: string;
  implied: string;
};

export function toAmerican(decimalOdds: number): number {
  if (decimalOdds >= 2) {
    return (decimalOdds - 1) * 100;
  }

  return -100 / (decimalOdds - 1);
}

export function toDecimalFromAmerican(americanOdds: number): number {
  if (americanOdds > 0) {
    return 1 + americanOdds / 100;
  }

  return 1 + 100 / Math.abs(americanOdds);
}

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

export function toFractional(decimalOdds: number): string {
  const fractional = decimalOdds - 1;
  const precision = 1000;
  const numerator = Math.round(fractional * precision);
  const denominator = precision;
  const divisor = gcd(numerator, denominator);

  return `${numerator / divisor}/${denominator / divisor}`;
}

export function parseFractional(input: string): number | null {
  const value = input.trim();
  if (!value.includes('/')) {
    return null;
  }

  const [left, right] = value.split('/');
  const numerator = Number(left);
  const denominator = Number(right);

  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator <= 0) {
    return null;
  }

  return 1 + numerator / denominator;
}

export function toImplied(decimalOdds: number): number {
  return 100 / decimalOdds;
}

export function toDecimalFromImplied(impliedPercent: number): number {
  return 100 / impliedPercent;
}

export function formatMoney(value: number): string {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatMoneyCompact(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 1_000_000_000) {
    return `${sign}$${(abs / 1_000_000_000).toFixed(abs >= 100_000_000_000 ? 0 : 2).replace(/\.?0+$/, '')}B`;
  }
  if (abs >= 1_000_000) {
    return `${sign}$${(abs / 1_000_000).toFixed(abs >= 100_000_000 ? 0 : 2).replace(/\.?0+$/, '')}M`;
  }
  if (abs >= 10_000) {
    return `${sign}$${(abs / 1_000).toFixed(abs >= 100_000 ? 0 : 1).replace(/\.?0+$/, '')}K`;
  }
  return formatMoney(value);
}

export function parseFormattedNumber(value: string): number {
  const normalized = value.replace(/,/g, '').trim();

  if (normalized === '') {
    return Number.NaN;
  }

  return Number(normalized);
}

export function formatBetAmountInput(value: string): string | null {
  const normalized = value.replace(/,/g, '').trim();

  if (normalized === '') {
    return '';
  }

  if (!/^\d*\.?\d*$/.test(normalized)) {
    return null;
  }

  const hasDecimal = normalized.includes('.');
  const [rawIntegerPart, decimalPart = ''] = normalized.split('.');
  const integerPart = rawIntegerPart === '' ? '0' : rawIntegerPart.replace(/^0+(?=\d)/, '');
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (hasDecimal) {
    return `${formattedIntegerPart}.${decimalPart}`;
  }

  return formattedIntegerPart;
}

export function decimalDisplay(value: number): string {
  return value.toFixed(3).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
}

export function clampPercent(value: number): number {
  return Math.min(99.99, Math.max(0, value));
}
