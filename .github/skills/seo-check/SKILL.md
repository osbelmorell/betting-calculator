---
name: seo-check
description: Audit and apply SEO best practices across all pages in this repository using the project SEO guidelines. Use this for requests like SEO audit, metadata improvements, schema updates, canonical fixes, sitemap and robots validation, and route-level SEO cleanup.
argument-hint: "[scope: all-pages|route] [focus: metadata|schema|content|technical]"
---

# SEO Check Skill

Use this skill when the user asks to run an SEO pass, improve discoverability, or apply SEO best practices.

## Source of Truth

- Always use [Project SEO Guidelines](../../../SEO.md) as the primary ruleset.
- Always align recommendations with Google's [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), especially for title/snippet quality, descriptive links, duplicate URL control, and useful content.
- If a guideline in [Project SEO Guidelines](../../../SEO.md) conflicts with current app behavior, keep changes conservative and avoid breaking behavior.
- Deployment target is Vercel; prefer Vercel-friendly defaults (static rendering/SSG, edge caching, and `next.config` redirects/headers over runtime middleware when equivalent).

## Required Workflow

1. Discover pages and routes first.
- For Next.js requests, use Next MCP tools first (for example: `get_routes`, `get_project_metadata`, `get_page_metadata`, `get_errors`, `get_logs`).
- If MCP is unavailable or insufficient, fall back to code inspection and state that fallback.

2. Build a per-route SEO checklist.
- Metadata: title, description, canonical, robots, Open Graph, Twitter.
- Search-result quality: unique, human-readable title and description that accurately reflect page intent.
- Structured data: Organization/WebSite + page-specific schema (FAQ/tool where relevant).
- Breadcrumb signals: add `BreadcrumbList` schema and visible breadcrumb links for deeper routes where appropriate.
- Internal links: ensure descriptive anchor text and at least one clear path to related calculators/guides.
- Localization parity: verify EN/ES pages have equivalent metadata quality and working hreflang/canonical mapping.
- Technical SEO: sitemap coverage, robots rules, canonical consistency.
- On-page basics: heading hierarchy and keyword clarity where applicable.

3. Apply fixes route-by-route.
- Prefer Next.js Metadata API (`metadata` or `generateMetadata`).
- Keep titles and descriptions concise and human-readable.
- Ensure each important page has a canonical URL.
- Ensure social metadata is present and coherent.
- For article/guide detail routes, include breadcrumb navigation and `BreadcrumbList` JSON-LD when missing.
- For hub/index routes, add contextual internal link modules (for example, related tools) when navigation is sparse.
- Do not spend effort on `meta keywords`; prioritize title links, snippets, internal links, and content usefulness.

4. Validate after edits.
- Re-run diagnostics (`get_errors` / workspace errors).
- Re-check route metadata where possible with MCP.
- Run `npm run build` for route generation and static output validation.
- Summarize changes by route and call out residual SEO gaps.

## Implementation Notes for This Repository

- Reuse shared config in [app/siteConfig.ts](../../../app/siteConfig.ts) whenever possible.
- Keep root metadata in [app/layout.tsx](../../../app/layout.tsx) and page-specific overrides in route page files.
- Keep sitemap and robots aligned with canonical URLs in [app/sitemap.ts](../../../app/sitemap.ts) and [app/robots.ts](../../../app/robots.ts).
- For guides hubs, keep `ItemList` schema and ensure clear links to core calculator routes.
- For guide detail routes, keep `Article`/`FAQPage` schema aligned with MDX content and add breadcrumb signals.

## Output Expectations

When this skill is invoked, provide:

1. Short audit summary by route.
2. Concrete fixes applied (or proposed if no edits requested).
3. Remaining recommendations ranked by impact.
4. Explicit note when MCP was unavailable and code inspection fallback was used.
