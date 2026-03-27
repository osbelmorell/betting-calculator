import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import type { AnchorHTMLAttributes, HTMLAttributes } from 'react';

type HeadingProps = HTMLAttributes<HTMLHeadingElement>;
type ParagraphProps = HTMLAttributes<HTMLParagraphElement>;
type ListProps = HTMLAttributes<HTMLUListElement>;
type ListItemProps = HTMLAttributes<HTMLLIElement>;
type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement>;

const components: MDXComponents = {
  h1: (props: HeadingProps) => <h1 className="text-hero mt-8" {...props} />,
  h2: (props: HeadingProps) => <h2 className="text-section-title mt-10" {...props} />,
  h3: (props: HeadingProps) => <h3 className="text-card-title mt-8" {...props} />,
  p: (props: ParagraphProps) => <p className="mt-4 text-base leading-relaxed" {...props} />,
  ul: (props: ListProps) => <ul className="mt-4 list-disc space-y-2 pl-6" {...props} />,
  ol: (props: ListProps) => <ol className="mt-4 list-decimal space-y-2 pl-6" {...props} />,
  li: (props: ListItemProps) => <li className="text-base" {...props} />,
  a: ({ href, ...props }: AnchorProps) => {
    if (href?.startsWith('/')) {
      return <Link href={href} className="text-[var(--brand)] underline" {...props} />;
    }

    return (
      <a
        href={href}
        className="text-[var(--brand)] underline"
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
