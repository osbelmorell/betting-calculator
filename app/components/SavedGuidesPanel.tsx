'use client';

import Link from 'next/link';
import { useState } from 'react';

const STORAGE_KEY = 'guide-bookmarks';
const INITIAL_VISIBLE_COUNT = 4;

interface Bookmark {
  title: string;
  url: string;
}

function readBookmarks(): Bookmark[] {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as unknown;
    if (!Array.isArray(raw)) {
      return [];
    }

    // Normalize and dedupe malformed entries from localStorage to keep UI stable.
    const unique = new Map<string, Bookmark>();

    for (const item of raw) {
      if (!item || typeof item !== 'object') continue;

      const maybeTitle = (item as { title?: unknown }).title;
      const maybeUrl = (item as { url?: unknown }).url;

      if (typeof maybeTitle !== 'string' || typeof maybeUrl !== 'string') continue;

      const title = maybeTitle.trim();
      const url = maybeUrl.trim();

      if (!title || !url) continue;

      unique.set(url, { title, url });
    }

    return [...unique.values()];
  } catch {
    return [];
  }
}

function writeBookmarks(bookmarks: Bookmark[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}

interface Props {
  lang: string;
}

export default function SavedGuidesPanel({ lang }: Props) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    return readBookmarks();
  });
  const [isExpanded, setIsExpanded] = useState(false);

  // Don't render anything when there are no bookmarks.
  if (bookmarks.length === 0) return null;

  const isEs = lang === 'es';
  const shouldCollapse = bookmarks.length > INITIAL_VISIBLE_COUNT;
  const visibleBookmarks = isExpanded ? bookmarks : bookmarks.slice(0, INITIAL_VISIBLE_COUNT);
  const hiddenCount = Math.max(bookmarks.length - INITIAL_VISIBLE_COUNT, 0);
  const listId = 'saved-guides-list';

  function remove(url: string) {
    const updated = bookmarks.filter((b) => b.url !== url);
    writeBookmarks(updated);
    setBookmarks(updated);

    if (updated.length <= INITIAL_VISIBLE_COUNT) {
      setIsExpanded(false);
    }
  }

  function clearAll() {
    writeBookmarks([]);
    setBookmarks([]);
  }

  return (
    <section
      aria-label={isEs ? 'Artículos guardados' : 'Saved articles'}
      className="mb-10 rounded-xl border border-[var(--brand)] bg-[var(--surface)] p-5"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* Filled bookmark icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5 shrink-0 text-[var(--brand)]"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 2c-1.716 0-3.408.106-5.07.31C3.806 2.45 3 3.414 3 4.517V17.25a.75.75 0 0 0 1.075.676L10 15.082l5.925 2.844A.75.75 0 0 0 17 17.25V4.517c0-1.103-.806-2.068-1.93-2.207A41.403 41.403 0 0 0 10 2Z"
              clipRule="evenodd"
            />
          </svg>
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            {isEs ? 'Artículos guardados' : 'Saved Articles'}
          </h2>
          <span className="rounded-full bg-[var(--surface-soft)] px-2 py-0.5 text-xs font-medium text-[var(--text-secondary)]">
            {bookmarks.length}
          </span>
        </div>
        <button
          onClick={clearAll}
          className="text-xs text-[var(--text-secondary)] underline-offset-2 hover:text-red-500 hover:underline"
          aria-label={isEs ? 'Borrar todos los guardados' : 'Clear all saved articles'}
        >
          {isEs ? 'Borrar todo' : 'Clear all'}
        </button>
      </div>

      <ul id={listId} className="mt-4 divide-y divide-[var(--border-color)]">
        {visibleBookmarks.map((b) => (
          <li key={b.url} className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
            <Link
              href={b.url}
              className="flex-1 truncate text-sm font-medium text-[var(--foreground)] transition-colors hover:text-[var(--brand)]"
              title={b.title}
            >
              {b.title}
            </Link>
            <button
              onClick={() => remove(b.url)}
              className="shrink-0 rounded p-1 text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-soft)] hover:text-red-500"
              aria-label={isEs ? `Quitar "${b.title}"` : `Remove "${b.title}"`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-4"
                aria-hidden="true"
              >
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </button>
          </li>
        ))}
      </ul>

      {shouldCollapse ? (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            aria-controls={listId}
            className="text-sm font-medium text-[var(--brand)] underline-offset-2 hover:underline"
          >
            {isExpanded
              ? isEs
                ? 'Mostrar menos'
                : 'Show less'
              : isEs
                ? `Mostrar ${hiddenCount} más`
                : `Show ${hiddenCount} more`}
          </button>
        </div>
      ) : null}
    </section>
  );
}
