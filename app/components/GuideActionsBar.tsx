'use client';

import { useEffect, useRef, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type ListenState = 'idle' | 'playing' | 'paused';

interface Bookmark {
  title: string;
  url: string;
}

interface Props {
  contentSelector: string;
  lang: string;
  title: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LANG_MAP: Record<string, string> = {
  en: 'en-US',
  es: 'es-ES',
};

const STORAGE_KEY = 'guide-bookmarks';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readBookmarks(): Bookmark[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as Bookmark[];
  } catch {
    return [];
  }
}

function writeBookmarks(bookmarks: Bookmark[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function GuideActionsBar({ contentSelector, lang, title }: Props) {
  const [ttsSupported, setTtsSupported] = useState(false);
  const [listenState, setListenState] = useState<ListenState>('idle');
  const [shareState, setShareState] = useState<'idle' | 'copied'>('idle');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setTtsSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
    const currentPath = `${window.location.pathname}${window.location.search}`;
    setIsBookmarked(readBookmarks().some((b) => b.url === currentPath));
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const locale = LANG_MAP[lang] ?? 'en-US';
  const isEs = lang === 'es';

  // ── Listen ─────────────────────────────────────────────────────────────────

  function handlePlay() {
    if (listenState === 'paused') {
      window.speechSynthesis.resume();
      setListenState('playing');
      return;
    }

    const el = document.querySelector(contentSelector);
    if (!el) return;
    const text = (el as HTMLElement).innerText ?? (el as HTMLElement).textContent ?? '';
    if (!text.trim()) return;

    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = locale;
    utter.onend = () => setListenState('idle');
    utter.onerror = () => setListenState('idle');
    utteranceRef.current = utter;
    window.speechSynthesis.speak(utter);
    setListenState('playing');
  }

  function handlePause() {
    window.speechSynthesis.pause();
    setListenState('paused');
  }

  function handleStop() {
    window.speechSynthesis.cancel();
    setListenState('idle');
  }

  // ── Share ──────────────────────────────────────────────────────────────────

  async function handleShare() {
    const currentUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({ title, url: currentUrl });
      } else {
        await navigator.clipboard.writeText(currentUrl);
        setShareState('copied');
        setTimeout(() => setShareState('idle'), 2000);
      }
    } catch {
      // user cancelled or clipboard unavailable — silent fail
    }
  }

  // ── Bookmark ───────────────────────────────────────────────────────────────

  function handleBookmark() {
    const currentPath = `${window.location.pathname}${window.location.search}`;
    const bookmarks = readBookmarks();

    const normalizedBookmarks = bookmarks.map((b) => {
      if (!b.url.startsWith('http://') && !b.url.startsWith('https://')) {
        return b;
      }

      try {
        const parsed = new URL(b.url);
        return { ...b, url: `${parsed.pathname}${parsed.search}` };
      } catch {
        return b;
      }
    });

    if (isBookmarked) {
      writeBookmarks(normalizedBookmarks.filter((b) => b.url !== currentPath));
      setIsBookmarked(false);
    } else {
      writeBookmarks([...normalizedBookmarks, { title, url: currentPath }]);
      setIsBookmarked(true);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2" role="toolbar" aria-label={isEs ? 'Acciones del artículo' : 'Article actions'}>

      {/* ── Listen ── */}
      {ttsSupported && (
        <>
          {listenState === 'idle' || listenState === 'paused' ? (
            <button
              onClick={handlePlay}
              className="action-btn"
              aria-label={listenState === 'paused' ? (isEs ? 'Reanudar lectura' : 'Resume reading') : (isEs ? 'Escuchar artículo' : 'Listen to article')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4" aria-hidden="true">
                <path d="M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.891a1.5 1.5 0 0 0 0-2.538L6.3 2.841Z" />
              </svg>
              {listenState === 'paused' ? (isEs ? 'Reanudar' : 'Resume') : (isEs ? 'Escuchar' : 'Listen')}
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="action-btn action-btn--active"
              aria-label={isEs ? 'Pausar lectura' : 'Pause reading'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4" aria-hidden="true">
                <path d="M5.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75A.75.75 0 0 0 7.25 3h-1.5ZM12.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75a.75.75 0 0 0-.75-.75h-1.5Z" />
              </svg>
              {isEs ? 'Pausar' : 'Pause'}
            </button>
          )}

          {listenState !== 'idle' && (
            <button
              onClick={handleStop}
              className="action-btn action-btn--danger"
              aria-label={isEs ? 'Detener lectura' : 'Stop reading'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4" aria-hidden="true">
                <path d="M5.25 3A2.25 2.25 0 0 0 3 5.25v9.5A2.25 2.25 0 0 0 5.25 17h9.5A2.25 2.25 0 0 0 17 14.75v-9.5A2.25 2.25 0 0 0 14.75 3h-9.5Z" />
              </svg>
              {isEs ? 'Detener' : 'Stop'}
            </button>
          )}

          {listenState !== 'idle' && <div className="h-5 w-px bg-[var(--border-color)]" aria-hidden="true" />}
        </>
      )}

      {/* ── Share ── */}
      <button
        onClick={handleShare}
        className="action-btn"
        aria-label={isEs ? 'Compartir artículo' : 'Share article'}
        aria-live="polite"
      >
        {shareState === 'copied' ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4" aria-hidden="true">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
            </svg>
            {isEs ? '¡Copiado!' : 'Copied!'}
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4" aria-hidden="true">
              <path d="M13 4.5a2.5 2.5 0 1 1 .702 1.737L6.97 9.604a2.518 2.518 0 0 1 0 .792l6.733 3.367a2.5 2.5 0 1 1-.671 1.341l-6.733-3.367a2.5 2.5 0 1 1 0-3.474l6.733-3.366A2.52 2.52 0 0 1 13 4.5Z" />
            </svg>
            {isEs ? 'Compartir' : 'Share'}
          </>
        )}
      </button>

      {/* ── Bookmark ── */}
      <button
        onClick={handleBookmark}
        className={isBookmarked ? 'action-btn action-btn--active' : 'action-btn'}
        aria-label={isBookmarked ? (isEs ? 'Quitar marcador' : 'Remove bookmark') : (isEs ? 'Guardar artículo' : 'Save article')}
        aria-pressed={isBookmarked}
      >
        {isBookmarked ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4" aria-hidden="true">
            <path fillRule="evenodd" d="M10 2c-1.716 0-3.408.106-5.07.31C3.806 2.45 3 3.414 3 4.517V17.25a.75.75 0 0 0 1.075.676L10 15.082l5.925 2.844A.75.75 0 0 0 17 17.25V4.517c0-1.103-.806-2.068-1.93-2.207A41.403 41.403 0 0 0 10 2Z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
          </svg>
        )}
        {isBookmarked ? (isEs ? 'Guardado' : 'Saved') : (isEs ? 'Guardar' : 'Save')}
      </button>

    </div>
  );
}
