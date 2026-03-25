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
        className="pointer-events-auto inline-flex h-[var(--toggle-height)] items-center gap-0.5 rounded-full border border-[var(--border-color)] bg-[var(--surface)] p-1 shadow-[var(--shadow-md)] backdrop-blur-md"
      >
        {tabs.map((tab) => {
          const isActive = pathname === tab.route;

          return (
            <Link
              key={tab.route}
              href={tab.href}
              role="tab"
              aria-selected={isActive}
              className={`flex min-w-20 items-center justify-center rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[var(--brand)] text-[var(--brand-foreground)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]'
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