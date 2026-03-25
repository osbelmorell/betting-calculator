import {
  formatBetAmountInput,
  type OddsValues,
} from './oddsUtils';

export type SingleCalculatorState = {
  betAmount: string;
  odds: OddsValues;
};

export type ParlayLeg = {
  id: number;
  label: string;
  odds: OddsValues;
};

export type ParlayCalculatorState = {
  betAmount: string;
  legs: ParlayLeg[];
};

export const DEFAULT_BET_AMOUNT = '100';
export const SINGLE_STATE_PARAM = 'single';
export const PARLAY_STATE_PARAM = 'parlay';
export const NAVIGATION_SEED_PARAM = 'seed';

const SINGLE_STORAGE_KEY = 'betting-calculator:single';
const PARLAY_STORAGE_KEY = 'betting-calculator:parlay';

export function emptyOdds(): OddsValues {
  return {
    american: '',
    fractional: '',
    decimal: '',
    implied: '',
  };
}

export function createLeg(id: number): ParlayLeg {
  return {
    id,
    label: `Leg ${id}`,
    odds: emptyOdds(),
  };
}

export function createDefaultSingleState(): SingleCalculatorState {
  return {
    betAmount: DEFAULT_BET_AMOUNT,
    odds: emptyOdds(),
  };
}

export function createDefaultParlayState(): ParlayCalculatorState {
  return {
    betAmount: DEFAULT_BET_AMOUNT,
    legs: [createLeg(1), createLeg(2)],
  };
}

function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function normalizeBetAmount(value: unknown, fallback = DEFAULT_BET_AMOUNT): string {
  const raw = typeof value === 'string' ? value : fallback;
  const formatted = formatBetAmountInput(raw);

  return formatted === null ? fallback : formatted;
}

function normalizeOddsValues(value: unknown): OddsValues {
  const candidate = value as Partial<OddsValues> | null | undefined;

  return {
    american: normalizeString(candidate?.american),
    fractional: normalizeString(candidate?.fractional),
    decimal: normalizeString(candidate?.decimal),
    implied: normalizeString(candidate?.implied),
  };
}

function normalizeParlayLegs(value: unknown): ParlayLeg[] {
  if (!Array.isArray(value) || value.length === 0) {
    return createDefaultParlayState().legs;
  }

  return value.map((item, index) => {
    const candidate = item as Partial<ParlayLeg> | null | undefined;
    const legNumber = index + 1;

    return {
      id: legNumber,
      label: normalizeString(candidate?.label) || `Leg ${legNumber}`,
      odds: normalizeOddsValues(candidate?.odds),
    };
  });
}

export function normalizeSingleState(value: unknown): SingleCalculatorState {
  const candidate = value as Partial<SingleCalculatorState> | null | undefined;

  return {
    betAmount: normalizeBetAmount(candidate?.betAmount),
    odds: normalizeOddsValues(candidate?.odds),
  };
}

export function normalizeParlayState(value: unknown): ParlayCalculatorState {
  const candidate = value as Partial<ParlayCalculatorState> | null | undefined;

  return {
    betAmount: normalizeBetAmount(candidate?.betAmount),
    legs: normalizeParlayLegs(candidate?.legs),
  };
}

export function hasValidOdds(odds: OddsValues): boolean {
  const decimal = Number(odds.decimal);

  return Number.isFinite(decimal) && decimal > 1;
}

export function isDefaultSingleState(state: SingleCalculatorState): boolean {
  return (
    state.betAmount === DEFAULT_BET_AMOUNT &&
    state.odds.american === '' &&
    state.odds.fractional === '' &&
    state.odds.decimal === '' &&
    state.odds.implied === ''
  );
}

export function isDefaultParlayState(state: ParlayCalculatorState): boolean {
  const defaultState = createDefaultParlayState();

  return JSON.stringify(state) === JSON.stringify(defaultState);
}

export function applySingleSeedToParlayState(
  baseState: ParlayCalculatorState,
  seedState: SingleCalculatorState | null,
): ParlayCalculatorState {
  if (!seedState || !hasValidOdds(seedState.odds)) {
    return baseState;
  }

  const [firstLeg, ...remainingLegs] = baseState.legs.length > 0 ? baseState.legs : [createLeg(1)];

  return {
    betAmount: seedState.betAmount,
    legs: [
      {
        ...firstLeg,
        odds: normalizeOddsValues(seedState.odds),
      },
      ...remainingLegs,
    ],
  };
}

export function extractSingleStateFromParlay(state: ParlayCalculatorState): SingleCalculatorState | null {
  const firstLeg = state.legs[0];

  if (!firstLeg || !hasValidOdds(firstLeg.odds)) {
    return null;
  }

  return {
    betAmount: state.betAmount,
    odds: normalizeOddsValues(firstLeg.odds),
  };
}

function encodeBase64Url(value: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(value, 'utf-8')
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');
  }

  const bytes = new TextEncoder().encode(value);
  let binary = '';

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function decodeBase64Url(value: string): string | null {
  try {
    const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');

    if (typeof Buffer !== 'undefined') {
      return Buffer.from(padded, 'base64').toString('utf-8');
    }

    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));

    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

function parseEncodedState<T>(encodedValue: string | undefined, normalize: (value: unknown) => T): T | null {
  if (!encodedValue) {
    return null;
  }

  const decoded = decodeBase64Url(encodedValue);
  if (!decoded) {
    return null;
  }

  try {
    return normalize(JSON.parse(decoded));
  } catch {
    return null;
  }
}

export function encodeSingleState(state: SingleCalculatorState): string {
  return encodeBase64Url(JSON.stringify(normalizeSingleState(state)));
}

export function encodeParlayState(state: ParlayCalculatorState): string {
  return encodeBase64Url(JSON.stringify(normalizeParlayState(state)));
}

export function decodeSingleState(encodedValue: string | undefined): SingleCalculatorState | null {
  return parseEncodedState(encodedValue, normalizeSingleState);
}

export function decodeParlayState(encodedValue: string | undefined): ParlayCalculatorState | null {
  return parseEncodedState(encodedValue, normalizeParlayState);
}

function loadStoredState<T>(key: string, normalize: (value: unknown) => T): T | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedValue = window.localStorage.getItem(key);
  if (!storedValue) {
    return null;
  }

  try {
    return normalize(JSON.parse(storedValue));
  } catch {
    return null;
  }
}

function saveStoredState<T>(key: string, state: T): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(state));
}

export function loadSingleStateFromStorage(): SingleCalculatorState | null {
  return loadStoredState(SINGLE_STORAGE_KEY, normalizeSingleState);
}

export function loadParlayStateFromStorage(): ParlayCalculatorState | null {
  return loadStoredState(PARLAY_STORAGE_KEY, normalizeParlayState);
}

export function saveSingleStateToStorage(state: SingleCalculatorState): void {
  saveStoredState(SINGLE_STORAGE_KEY, normalizeSingleState(state));
}

export function saveParlayStateToStorage(state: ParlayCalculatorState): void {
  saveStoredState(PARLAY_STORAGE_KEY, normalizeParlayState(state));
}

export function buildRouteWithState(pathname: string, paramName: string, encodedState?: string): string {
  const params = new URLSearchParams();

  if (encodedState) {
    params.set(paramName, encodedState);
  }

  const queryString = params.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
}

export function buildSeededRoute(pathname: string, encodedSeed?: string): string {
  const params = new URLSearchParams();

  if (encodedSeed) {
    params.set(NAVIGATION_SEED_PARAM, encodedSeed);
  }

  const queryString = params.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
}