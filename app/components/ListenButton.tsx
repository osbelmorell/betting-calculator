'use client';

import { useEffect, useRef, useState } from 'react';

type State = 'idle' | 'playing' | 'paused';

const LANG_MAP: Record<string, string> = {
  en: 'en-US',
  es: 'es-ES',
};

interface Props {
  contentSelector: string;
  lang: string;
}

export default function ListenButton({ contentSelector, lang }: Props) {
  const [state, setState] = useState<State>('idle');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        window.speechSynthesis?.cancel();
      }
    };
  }, []);

  if (!supported) return null;

  const locale = LANG_MAP[lang] ?? 'en-US';
  const label = lang === 'es' ? 'Escuchar' : 'Listen';
  const pauseLabel = lang === 'es' ? 'Pausar' : 'Pause';
  const resumeLabel = lang === 'es' ? 'Reanudar' : 'Resume';
  const stopLabel = lang === 'es' ? 'Detener' : 'Stop';

  function handlePlay() {
    if (state === 'paused') {
      window.speechSynthesis.resume();
      setState('playing');
      return;
    }

    const el = document.querySelector(contentSelector);
    if (!el) return;

    const text = (el as HTMLElement).innerText ?? (el as HTMLElement).textContent ?? '';
    if (!text.trim()) return;

    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = locale;
    utter.onend = () => setState('idle');
    utter.onerror = () => setState('idle');
    utteranceRef.current = utter;

    window.speechSynthesis.speak(utter);
    setState('playing');
  }

  function handlePause() {
    window.speechSynthesis.pause();
    setState('paused');
  }

  function handleStop() {
    window.speechSynthesis.cancel();
    setState('idle');
  }

  return (
    <div className="mt-4 flex items-center gap-2">
      {state === 'idle' || state === 'paused' ? (
        <button
          onClick={state === 'paused' ? handlePlay : handlePlay}
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-color)] bg-[var(--surface)] px-3.5 py-1.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)]"
          aria-label={state === 'paused' ? resumeLabel : label}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-4"
            aria-hidden="true"
          >
            <path d="M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.891a1.5 1.5 0 0 0 0-2.538L6.3 2.841Z" />
          </svg>
          {state === 'paused' ? resumeLabel : label}
        </button>
      ) : (
        <button
          onClick={handlePause}
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--brand)] bg-[var(--surface)] px-3.5 py-1.5 text-sm font-medium text-[var(--brand)] transition-colors hover:bg-[var(--surface-soft)]"
          aria-label={pauseLabel}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-4"
            aria-hidden="true"
          >
            <path d="M5.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75A.75.75 0 0 0 7.25 3h-1.5ZM12.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75a.75.75 0 0 0-.75-.75h-1.5Z" />
          </svg>
          {pauseLabel}
        </button>
      )}

      {state !== 'idle' && (
        <button
          onClick={handleStop}
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-color)] bg-[var(--surface)] px-3.5 py-1.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-red-500 hover:text-red-500"
          aria-label={stopLabel}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-4"
            aria-hidden="true"
          >
            <path d="M5.25 3A2.25 2.25 0 0 0 3 5.25v9.5A2.25 2.25 0 0 0 5.25 17h9.5A2.25 2.25 0 0 0 17 14.75v-9.5A2.25 2.25 0 0 0 14.75 3h-9.5Z" />
          </svg>
          {stopLabel}
        </button>
      )}
    </div>
  );
}
