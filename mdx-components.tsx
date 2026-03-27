import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

type HeadingProps = HTMLAttributes<HTMLHeadingElement>;
type ParagraphProps = HTMLAttributes<HTMLParagraphElement>;
type ListProps = HTMLAttributes<HTMLUListElement>;
type ListItemProps = HTMLAttributes<HTMLLIElement>;
type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement>;
type CodeProps = HTMLAttributes<HTMLElement>;

function flattenText(children: ReactNode): string {
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map((child) => flattenText(child)).join(' ');
  }

  if (children && typeof children === 'object' && 'props' in children) {
    const childProps = children.props as { children?: ReactNode };
    return flattenText(childProps.children);
  }

  return '';
}

function toHeadingId(children: ReactNode): string {
  return flattenText(children)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function createHeading(level: 2 | 3) {
  return function Heading({ children, id, ...props }: HeadingProps) {
    const headingId = id ?? toHeadingId(children);

    if (level === 2) {
      return (
        <h2 id={headingId} className="group mt-12 scroll-mt-[var(--anchor-offset)] text-3xl font-semibold tracking-tight" {...props}>
          <a href={`#${headingId}`} className="no-underline">
            {children}
            <span className="ml-2 text-[var(--text-secondary)] opacity-0 transition-opacity group-hover:opacity-100">#</span>
          </a>
        </h2>
      );
    }

    return (
      <h3 id={headingId} className="group mt-9 scroll-mt-[var(--anchor-offset)] text-2xl font-semibold tracking-tight" {...props}>
        <a href={`#${headingId}`} className="no-underline">
          {children}
          <span className="ml-2 text-[var(--text-secondary)] opacity-0 transition-opacity group-hover:opacity-100">#</span>
        </a>
      </h3>
    );
  };
}

const components: MDXComponents = {
  h1: (props: HeadingProps) => <h1 className="text-5xl font-semibold tracking-tight" {...props} />,
  h2: createHeading(2),
  h3: createHeading(3),
  p: (props: ParagraphProps) => <p className="mt-5 text-lg leading-8 text-[var(--foreground)]" {...props} />,
  ul: (props: ListProps) => <ul className="mt-5 list-disc space-y-2.5 pl-6 text-lg leading-8" {...props} />,
  ol: (props: ListProps) => <ol className="mt-5 list-decimal space-y-2.5 pl-6 text-lg leading-8" {...props} />,
  li: (props: ListItemProps) => <li className="text-base" {...props} />,
  strong: (props: HTMLAttributes<HTMLElement>) => <strong className="font-semibold text-[var(--foreground)]" {...props} />,
  blockquote: (props: HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="mt-6 border-l-2 border-[var(--brand)] pl-4 text-[var(--text-secondary)]" {...props} />
  ),
  code: (props: CodeProps) => <code className="rounded bg-[var(--surface-soft)] px-1.5 py-0.5 text-sm" {...props} />,
  hr: (props: HTMLAttributes<HTMLHRElement>) => <hr className="my-10 border-[var(--border-color)]" {...props} />,
  a: ({ href, ...props }: AnchorProps) => {
    if (href?.startsWith('/')) {
      return <Link href={href} className="text-[var(--brand)] underline decoration-[0.08em] underline-offset-4" {...props} />;
    }

    return (
      <a
        href={href}
        className="text-[var(--brand)] underline decoration-[0.08em] underline-offset-4"
        target="_blank"
        rel="noreferrer"
        {...props}
      />
    );
  },
};

export function useMDXComponents(): MDXComponents {
  return components;
}
