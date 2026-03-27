# Page SEO Rules

Use this checklist for every new or updated page, guide, or article.

## Metadata Rules

1. Add unique, human-readable title and description.
2. Set canonical URL using shared site config helpers.
3. Set language alternates (`en`, `es`, `x-default`) for localized routes.
4. Include Open Graph and Twitter metadata with coherent title/description.
5. Keep title intent-specific (tool page, guide page, or article page).

## URL and Routing Rules

1. Use localized slugs for localized routes (`/es/...` should use Spanish slugs where applicable).
2. Maintain EN/ES slug mapping for translated content.
3. Add permanent redirects when replacing old slugs.
4. Keep route structure stable; avoid unnecessary URL churn.

## Structured Data Rules

1. Keep global Organization/WebSite/WebApplication schema in the root layout.
2. Add page-specific schema where useful (`Article`, `FAQPage`, `ItemList`).
3. Serialize JSON-LD safely using escaped output (`replace(/</g, '\\u003c')`).
4. Ensure schema values match visible page content.

## Content Quality Rules

1. Match search intent in first screenful (what this page solves).
2. Use a single clear `h1`, then logical `h2`/`h3` hierarchy.
3. Add concise internal links to related calculators/guides.
4. Keep copy specific and actionable; avoid filler content.
5. For translated pages, localize terminology consistently.
6. Ensure hash/anchor navigation accounts for fixed headers (set `scroll-margin-top` / `scroll-padding-top` so targets are not hidden).

## Technical SEO Rules

1. Ensure new pages are included in sitemap generation.
2. Keep robots and canonical strategy aligned.
3. Prefer static rendering/SSG when possible.
4. Use Next.js Metadata API (`metadata` or `generateMetadata`) over ad hoc tags.
5. Validate no broken links or 404 language-switch paths.

## Validation Rules

1. Run `npm run build` before finishing.
2. Fix new TypeScript/ESLint/build issues introduced by the change.
3. Confirm route output includes newly added pages.
4. Report what was implemented and any remaining SEO gaps.
