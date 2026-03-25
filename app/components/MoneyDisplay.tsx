'use client';

import { useId, useRef } from 'react';
import { formatMoney, formatMoneyCompact } from './oddsUtils';

type Props = { value: number; className?: string };

export default function MoneyDisplay({ value, className }: Props) {
  const id = useId();
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const anchorName = `--money-anchor-${id.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const tooltipId = `money-tooltip-${id.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  const compact = formatMoneyCompact(value);
  const full = formatMoney(value);

  if (compact === full) {
    return <span className={className}>{full}</span>;
  }

  const show = () => {
    if (!tooltipRef.current || tooltipRef.current.matches(':popover-open')) {
      return;
    }

    tooltipRef.current.showPopover();
  };

  const hide = () => {
    if (!tooltipRef.current || !tooltipRef.current.matches(':popover-open')) {
      return;
    }

    tooltipRef.current.hidePopover();
  };

  return (
    <span className="money-abbr-wrap">
      <button
        type="button"
        className={`money-abbr${className ? ` ${className}` : ''}`}
        style={{ ['anchorName' as string]: anchorName }}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        aria-describedby={tooltipId}
        aria-label={full}
      >
        {compact}
      </button>
      <span
        id={tooltipId}
        ref={tooltipRef}
        role="tooltip"
        className="money-tooltip"
        style={{ ['positionAnchor' as string]: anchorName }}
        popover="manual"
      >
        {full}
      </span>
    </span>
  );
}
