'use client';

import { useId, useRef } from 'react';

type AbbreviationHelpProps = {
  short: string;
  expanded: string;
  className?: string;
};

export default function AbbreviationHelp({ short, expanded, className }: AbbreviationHelpProps) {
  const id = useId();
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const anchorName = `--abbr-anchor-${id.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const tooltipId = `abbr-tooltip-${id.replace(/[^a-zA-Z0-9_-]/g, '')}`;

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
    <span className="abbr-help-wrap">
      <button
        type="button"
        className={`abbr-help${className ? ` ${className}` : ''}`}
        style={{ ['anchorName' as string]: anchorName }}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            hide();
          }
        }}
        aria-describedby={tooltipId}
        aria-label={short}
      >
        <abbr title={expanded}>{short}</abbr>
      </button>
      <span
        id={tooltipId}
        ref={tooltipRef}
        role="tooltip"
        className="abbr-help-tooltip"
        style={{ ['positionAnchor' as string]: anchorName }}
        popover="manual"
      >
        {expanded}
      </span>
    </span>
  );
}
