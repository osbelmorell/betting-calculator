---
name: seo-check
description: Audit and apply SEO best practices across all pages in this repository using the project SEO guidelines. Use this for requests like SEO audit, metadata improvements, schema updates, canonical fixes, sitemap and robots validation, and route-level SEO cleanup.
argument-hint: "[scope: all-pages|route] [focus: metadata|schema|content|technical|geo]"
---

# SEO Check Skill

Use this skill when the user asks to run an SEO pass, improve discoverability, or apply SEO best practices.

## Source of Truth

- Always use [Project SEO Guidelines](../../../SEO.md) as the primary ruleset.
- For AI discovery policy and maintenance, use `public/llms.txt` when present.
- Always align recommendations with Google's [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), especially for crawlability, people-first content, title/snippet quality, descriptive links, and duplicate URL control.
- If a guideline in [Project SEO Guidelines](../../../SEO.md) conflicts with current app behavior, keep changes conservative and avoid breaking behavior.
- If a guideline in [Project SEO Guidelines](../../../SEO.md) conflicts with the SEO Starter Guide, prioritize Google guidance and note the conflict in your summary.
- Deployment target is Vercel; prefer Vercel-friendly defaults (static rendering/SSG, edge caching, and `next.config` redirects/headers over runtime middleware when equivalent).

## SEO Principles (Google-Aligned)

- Start with eligibility: ensure pages can be crawled, rendered, indexed, and internally discovered before tuning metadata.
- Focus on people-first value: useful, reliable, unique, and well-maintained content outperforms checklist-only optimization.
- Make changes iterative: SEO impact can take weeks (or longer), so avoid overreacting to short-term swings.
- Improve click clarity: titles and snippets should accurately describe page value, not just include terms.
- Use technical controls sparingly and correctly: canonical, redirects, robots, hreflang, and structured data should reduce ambiguity, not add complexity.

## Must-Cover Audit Areas

For each route in scope, assess all categories below:

- Discovery and indexability
	- Confirm URL is intended to be indexed.
	- Confirm no accidental blocks via robots/meta robots.
	- Confirm sitemap inclusion for indexable canonical routes.
	- Confirm Google can render important content/resources similarly to users.
- URL and architecture quality
	- Use descriptive, human-readable URLs.
	- Group related content in coherent directories.
	- Provide clear internal paths between calculators, guide hubs, and guide details.
- Duplicate URL control
	- Ensure one preferred canonical per page intent.
	- Prefer redirects from deprecated/duplicate paths when possible.
	- Use canonical tags where redirects are not appropriate.
- Search appearance quality
	- Unique title per page intent.
	- Concise, specific meta description aligned with on-page content.
	- Consistent Open Graph/Twitter metadata.
	- Optional structured data only when valid and useful.
- Content usefulness and readability
	- Satisfies user intent for the route type (tool, guide hub, guide detail).
	- For guides/articles, apply inverted pyramid writing: answer/definition first, then detail.
	- Readable structure with clear headings and scannable sections.
	- Prefer question-based `h2`/`h3` headings for guide/article sections when it improves intent matching.
	- Use extractable formatting (lists/tables) for formulas, comparisons, and multi-step instructions.
	- Avoid thin, stale, or near-duplicate content.
	- Add helpful context, examples, and supporting references where needed.
- Links and navigation signals
	- Internal links use descriptive anchor text.
	- Links connect related tasks (calculator <-> relevant guides).
	- Outbound links are trustworthy and contextual.
- Media SEO
	- Images are high-quality, near relevant text, and have descriptive alt text.
	- Add captions/context for non-decorative images when meaning is not obvious from nearby text.
	- Video pages include descriptive titles/text and standalone discoverable URLs where applicable.
- Localization and canonical parity
	- EN/ES versions maintain equivalent metadata quality.
	- hreflang/canonical relationships are coherent.
	- No broken localized internal links.
- Structured data completeness
	- Keep root Organization/WebSite schema and add route-intent schema (`WebApplication`, `Article`, `FAQPage`, `BreadcrumbList`, `HowTo` where applicable).
	- Ensure JSON-LD only contains claims visible on-page.
	- Serialize JSON-LD safely (`replace(/</g, '\\u003c')`) when injecting script content.
- Rendering visibility (AI-first)
	- Ensure critical explanatory content is available in initial HTML (SSR/SSG-friendly), not JS-only.
	- Avoid hiding key route value behind client-only interactions.
- AI crawler policy (`llms.txt`)
	- For new major routes/features/sections, verify `public/llms.txt` reflects the new capability.
	- If `llms.txt` is missing, call it out as a high-priority gap in the audit summary.
- E-E-A-T signals for informational content
	- Guides/articles should include author attribution and credentials where available.
	- Prefer `Person` (or `Person` + `Organization`) author schema over organization-only attribution for expert guides.

## What Not to Prioritize

Do not spend sprint time on low-value or outdated tactics unless a user explicitly asks:

- `meta keywords` tags.
- Keyword stuffing or artificial keyword density targets.
- Domain/TLD keyword tricks.
- Arbitrary word-count targets as ranking guarantees.
- Heading count/order obsession for ranking-only reasons.
- Treating E-E-A-T as a direct technical ranking toggle.

## Required Workflow

1. Discover pages and routes first.
- For Next.js requests, use Next MCP tools first (for example: `get_routes`, `get_project_metadata`, `get_page_metadata`, `get_errors`, `get_logs`).
- If MCP is unavailable or insufficient, fall back to code inspection and state that fallback.

2. Build a per-route SEO checklist.
- Metadata: title, description, canonical, robots, Open Graph, Twitter.
- Search-result quality: unique, clear title and snippet candidates that match real page intent.
- Structured data: Organization/WebSite + page-specific schema (FAQ/tool/article) only when accurate and complete.
- Breadcrumb signals: add `BreadcrumbList` schema and visible breadcrumb links for deeper routes where appropriate.
- Internal links: ensure descriptive anchor text and at least one clear path to related calculators/guides.
- Localization parity: verify EN/ES pages have equivalent metadata quality and working hreflang/canonical mapping.
- Technical SEO: sitemap coverage, robots rules, canonical consistency, duplicate URL controls.
- Content usefulness: intent coverage, readability, freshness, and uniqueness.
- GEO coverage: inverted pyramid intro, semantic sectioning, question-led headings (when useful), extractable list/table formatting, initial HTML visibility, and byline/credentials for guide intent.
- AI policy coverage: confirm whether `public/llms.txt` needs updating for the requested change.

3. Apply fixes route-by-route.
- Prefer Next.js Metadata API (`metadata` or `generateMetadata`).
- Keep titles and descriptions concise, specific, and human-readable.
- Ensure each important page has a canonical URL.
- Ensure social metadata is present and coherent.
- Ensure indexability intent is explicit (`index,follow` for public pages; intentional exclusions documented).
- For article/guide detail routes, include breadcrumb navigation and `BreadcrumbList` JSON-LD when missing.
- For hub/index routes, add contextual internal link modules (for example, related tools) when navigation is sparse.
- For guide/article routes, make sure the first paragraph contains a direct answer/summary and headings support natural-language discovery.
- Add/repair page-intent JSON-LD and ensure schema claims match visible content.
- For informational content, add byline/author metadata and credentials if available.
- When major features/sections ship, update `public/llms.txt` or explicitly log why no update is required.
- Improve or remove weak/duplicative sections when content quality is the primary gap.
- Do not spend effort on `meta keywords`; prioritize crawlability, title links, snippets, internal links, media context, and content usefulness.

4. Validate after edits.
- Re-run diagnostics (`get_errors` / workspace errors).
- Re-check route metadata where possible with MCP.
- Run `npm run build` for route generation and static output validation.
- Confirm GEO checks were addressed (intro quality, heading clarity, schema fit, and initial HTML visibility).
- Confirm `llms.txt` handling (updated, unchanged with reason, or missing and reported).
- Summarize changes by route and call out residual SEO gaps.
- Include an expectations note: measurable impact may take several weeks.

## Route-Specific Priorities for This Project

- Calculator pages (`/[lang]`, `/[lang]/odds-converter`, `/[lang]/parlay`)
	- Prioritize intent match, clear benefit-driven title/snippet, and strong internal links to relevant guides.
	- Ensure interactive UI does not hide key explanatory content from crawlers.
- Guides hub (`/[lang]/guides`)
	- Prioritize discoverable index structure and descriptive links to guide details.
	- Maintain `ItemList`-style discoverability signals where implemented.
- Guide detail pages (`/[lang]/guides/[slug]`)
	- Prioritize unique title/description, canonical correctness, and article/FAQ schema accuracy.
	- Ensure breadcrumbs and contextual cross-links to calculators are present.

## Implementation Notes for This Repository

- Reuse shared config in [app/siteConfig.ts](../../../app/siteConfig.ts) whenever possible.
- Keep root metadata in [app/layout.tsx](../../../app/layout.tsx) and page-specific overrides in route page files.
- Keep sitemap and robots aligned with canonical URLs in [app/sitemap.ts](../../../app/sitemap.ts) and [app/robots.ts](../../../app/robots.ts).
- For guides hubs, keep `ItemList` schema and ensure clear links to core calculator routes.
- For guide detail routes, keep `Article`/`FAQPage` schema aligned with MDX content and add breadcrumb signals.

## Audit Rubric (Use in Reports)

Score each route `Pass`, `Needs Work`, or `Missing` for:

- Crawl and index controls
- Canonical and duplicate URL handling
- Title and snippet quality
- Internal linking and anchor clarity
- Structured data validity/relevance
- Content usefulness and freshness
- Image/video discoverability signals
- Localization and hreflang parity

Prioritize fixes in this order:

1. Blocking issues (noindex/blocked/canonical errors)
2. Misleading or duplicate titles/snippets
3. Missing internal discovery paths
4. Weak content usefulness/freshness
5. Enhanced result eligibility (structured data/media refinements)

## Output Expectations

When this skill is invoked, provide:

1. Short audit summary by route.
2. Concrete fixes applied (or proposed if no edits requested).
3. GEO coverage summary (scannability, schema, initial HTML visibility, llms.txt, and E-E-A-T).
4. Explicit note when MCP was unavailable and code inspection fallback was used.
5. A short timeline expectation for impact (for example, "reassess in 2-6 weeks").
6. Remaining recommendations ranked by impact.
