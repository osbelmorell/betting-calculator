'use client';

import { useEffect, useMemo, useState } from 'react';

type SectionLink = {
  id: string;
  label: string;
};

type GuideSectionNavProps = {
  title: string;
  sections: SectionLink[];
};

export default function GuideSectionNav({ title, sections }: GuideSectionNavProps) {
  const sectionIds = useMemo(() => sections.map((section) => section.id), [sections]);
  const [activeSectionId, setActiveSectionId] = useState(sectionIds[0] ?? '');

  useEffect(() => {
    if (sectionIds.length === 0) {
      return;
    }

    const observedSections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (observedSections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));

        if (visibleEntries[0]) {
          setActiveSectionId(visibleEntries[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: '-18% 0px -64% 0px',
        threshold: [0, 1],
      },
    );

    observedSections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, [sectionIds]);

  if (sections.length === 0) {
    return null;
  }

  return (
    <div className="sticky top-28 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)]">{title}</p>
      <nav className="mt-3 space-y-1">
        {sections.map((section) => {
          const isActive = section.id === activeSectionId;

          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              aria-current={isActive ? 'location' : undefined}
              className={`block rounded px-2 py-1.5 text-sm transition-colors ${
                isActive
                  ? 'bg-[var(--surface-soft)] font-medium text-[var(--foreground)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]'
              }`}
            >
              {section.label}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
