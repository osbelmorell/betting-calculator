'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  buildSeededRoute,
  decodeParlayState,
  decodeSingleState,
  encodeSingleState,
  extractSingleStateFromParlay,
  hasValidOdds,
  PARLAY_STATE_PARAM,
  SINGLE_STATE_PARAM,
} from './calculatorState';

export default function GlobalCalcToggle() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const singleState = decodeSingleState(searchParams.get(SINGLE_STATE_PARAM) ?? undefined);
  const parlayState = decodeParlayState(searchParams.get(PARLAY_STATE_PARAM) ?? undefined);

  const parlaySeed = singleState && hasValidOdds(singleState.odds) ? encodeSingleState(singleState) : undefined;
  const extractedSingleState = parlayState ? extractSingleStateFromParlay(parlayState) : null;
  const singleSeed = extractedSingleState ? encodeSingleState(extractedSingleState) : undefined;

  const tabs = [
    { href: buildSeededRoute('/', singleSeed), route: '/', label: 'Single' },
    { href: buildSeededRoute('/parlay', parlaySeed), route: '/parlay', label: 'Parlay' },
  ] as const;

  return (
    <nav
      aria-label="Calculator navigation"
      className="pointer-events-none fixed left-1/2 top-[var(--toggle-top)] z-40 -translate-x-1/2"
    >
      <div
        role="tablist"
        aria-label="Calculator type"
        className="pointer-events-auto inline-flex h-[var(--toggle-height)] rounded-full border border-gray-700/90 bg-gray-950/95 p-1 shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur"
      >
        {tabs.map((tab) => {
          const isActive = pathname === tab.route;

          return (
            <Link
              key={tab.route}
              href={tab.href}
              role="tab"
              aria-selected={isActive}
              className={`flex h-full min-w-24 items-center justify-center rounded-full px-4 text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-blue-500 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.24)]'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-gray-100'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}