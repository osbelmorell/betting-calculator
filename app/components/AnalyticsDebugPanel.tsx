'use client';

import { useMemo, useState, useEffect } from 'react';

type EventDetail = {
  eventName: string;
  ts: number;
  [key: string]: string | number | boolean;
};

const MAX_EVENTS = 15;

export default function AnalyticsDebugPanel() {
  const [events, setEvents] = useState<EventDetail[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const onEvent = (event: Event) => {
      const customEvent = event as CustomEvent<EventDetail>;
      const detail = customEvent.detail;
      if (!detail || typeof detail.eventName !== 'string') {
        return;
      }

      setEvents((prev) => [detail, ...prev].slice(0, MAX_EVENTS));
    };

    window.addEventListener('betting-calculator:event', onEvent as EventListener);
    return () => window.removeEventListener('betting-calculator:event', onEvent as EventListener);
  }, []);

  const prettyEvents = useMemo(() => {
    return events.map((entry) => {
      const timestamp = new Date(entry.ts).toLocaleTimeString();
      return `${timestamp} ${entry.eventName}\n${JSON.stringify(entry, null, 2)}`;
    });
  }, [events]);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="btn btn-secondary btn-sm"
        aria-label="Toggle analytics debug panel"
      >
        Analytics {events.length > 0 ? `(${events.length})` : ''}
      </button>

      {isOpen ? (
        <section className="mt-2 max-h-[60dvh] w-[min(26rem,calc(100vw-2rem))] overflow-auto rounded-xl border border-[var(--border-color)] bg-[var(--background)] p-3 shadow-[var(--shadow-lg)]">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Event Stream</h2>
            <button
              type="button"
              onClick={() => setEvents([])}
              className="text-xs text-[var(--text-secondary)] hover:text-[var(--foreground)]"
            >
              Clear
            </button>
          </div>

          {prettyEvents.length === 0 ? (
            <p className="text-xs text-[var(--text-secondary)]">No events yet. Interact with a calculator to see telemetry.</p>
          ) : (
            <div className="space-y-2">
              {prettyEvents.map((entry, index) => (
                <pre key={`${index}-${events[index]?.ts ?? 'x'}`} className="overflow-x-auto rounded-md border border-[var(--border-color)] bg-black/80 p-2 text-[11px] leading-4 text-green-200">
                  {entry}
                </pre>
              ))}
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
