'use client';

import { useState } from 'react';

type ShareLinkButtonProps = {
  className?: string;
  onCopied?: () => void;
};

export default function ShareLinkButton({ className, onCopied }: ShareLinkButtonProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  const tooltipMessage =
    status === 'copied'
      ? 'Shareable link copied to your clipboard.'
      : status === 'error'
        ? 'Could not copy the link. Copy the page URL from your browser instead.'
        : 'Copy a link that opens this calculator with your current values.';

  const onCopy = async () => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setStatus('copied');
      onCopied?.();
      window.setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('error');
      window.setTimeout(() => setStatus('idle'), 2000);
    }
  };

  return (
    <div className="group relative inline-flex items-center">
      <button
        type="button"
        onClick={onCopy}
        aria-label="Copy a shareable link with the current calculator values"
        aria-describedby="share-link-tooltip"
        className={className ?? 'btn btn-secondary btn-md'}
      >
        Copy Shareable Link
      </button>

      <span
        id="share-link-tooltip"
        role="tooltip"
        className={`pointer-events-none absolute bottom-[calc(100%+0.55rem)] left-1/2 z-20 w-64 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-left text-xs leading-5 text-gray-100 shadow-lg transition-opacity duration-150 whitespace-normal break-words text-balance ${status !== 'idle' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'}`}
      >
        {tooltipMessage}
      </span>

      <span className="sr-only" aria-live="polite">
        {status === 'copied' ? 'Share link copied.' : status === 'error' ? 'Share link copy failed.' : ''}
      </span>
    </div>
  );
}