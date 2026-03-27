export type CalculatorEventName =
  | 'single_first_input'
  | 'single_first_calc'
  | 'single_reset'
  | 'single_share_copied'
  | 'parlay_first_input'
  | 'parlay_first_calc'
  | 'parlay_reset'
  | 'parlay_leg_added'
  | 'parlay_leg_removed'
  | 'parlay_share_copied'
  | 'ev_first_input'
  | 'ev_first_calc'
  | 'ev_reset'
  | 'ev_share_copied';

export type StickyBarVariant = 'compact' | 'expanded';

const STICKY_BAR_VARIANT_KEY = 'bc_sticky_bar_variant_v1';

type RawPayload = Record<string, string | number | boolean | undefined | null>;

function parseBetAmount(value: string | number | boolean | undefined | null): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : Number.NaN;
  }

  if (typeof value !== 'string') {
    return Number.NaN;
  }

  const numeric = Number(value.replace(/,/g, '').trim());
  return Number.isFinite(numeric) ? numeric : Number.NaN;
}

function bucketStake(amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) {
    return '0';
  }

  if (amount < 25) {
    return '1-24';
  }

  if (amount < 100) {
    return '25-99';
  }

  if (amount < 250) {
    return '100-249';
  }

  if (amount < 1000) {
    return '250-999';
  }

  return '1000+';
}

export function getStickyBarVariant(): StickyBarVariant {
  if (typeof window === 'undefined') {
    return 'compact';
  }

  const existing = window.localStorage.getItem(STICKY_BAR_VARIANT_KEY);
  if (existing === 'compact' || existing === 'expanded') {
    return existing;
  }

  const assigned: StickyBarVariant = Math.random() < 0.5 ? 'compact' : 'expanded';
  window.localStorage.setItem(STICKY_BAR_VARIANT_KEY, assigned);
  return assigned;
}

function normalizePayload(eventName: CalculatorEventName, payload: RawPayload): Record<string, string | number | boolean> {
  const normalized: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === null) {
      continue;
    }

    normalized[key] = value;
  }

  const calculator = eventName.startsWith('single_')
    ? 'single'
    : eventName.startsWith('parlay_')
      ? 'parlay'
      : 'ev';
  const source = normalized.source;
  const betAmount = parseBetAmount(payload.betAmount);
  const legCount = typeof payload.legCount === 'number' ? payload.legCount : undefined;

  normalized.calculator = calculator;
  normalized.event_version = 1;
  normalized.page_path = typeof window !== 'undefined' ? window.location.pathname : '/';
  normalized.sticky_variant = getStickyBarVariant();

  if (Number.isFinite(betAmount)) {
    normalized.stake_bucket = bucketStake(betAmount);
    normalized.stake_amount = Number(betAmount.toFixed(2));
  }

  if (typeof source === 'string' && ['american', 'decimal', 'fractional', 'implied', 'bet_amount'].includes(source)) {
    normalized.odds_format = source;
  }

  if (typeof legCount === 'number' && Number.isFinite(legCount)) {
    normalized.leg_count = legCount;
  }

  return normalized;
}

export function trackCalculatorEvent(
  eventName: CalculatorEventName,
  payload: RawPayload = {},
): void {
  if (typeof window === 'undefined') {
    return;
  }

  const normalizedPayload = normalizePayload(eventName, payload);

  const detail = {
    eventName,
    ...normalizedPayload,
    ts: Date.now(),
  };

  window.dispatchEvent(new CustomEvent('betting-calculator:event', { detail }));

  const analyticsWindow = window as Window & {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, options?: { props?: Record<string, unknown> }) => void;
  };

  analyticsWindow.dataLayer?.push({
    event: eventName,
    ...normalizedPayload,
  });

  analyticsWindow.gtag?.('event', eventName, normalizedPayload);
  analyticsWindow.plausible?.(eventName, { props: normalizedPayload });
}
