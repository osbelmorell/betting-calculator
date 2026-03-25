---
name: seo-check
description: Audit and apply SEO best practices across all pages in this repository using the project SEO guidelines. Use this for requests like SEO audit, metadata improvements, schema updates, canonical fixes, sitemap and robots validation, and route-level SEO cleanup.
argument-hint: "[scope: all-pages|route] [focus: metadata|schema|content|technical]"
---

# SEO Check Skill

Use this skill when the user asks to run an SEO pass, improve discoverability, or apply SEO best practices.

## Source of Truth

- Always use [Project SEO Guidelines](../../../SEO.md) as the primary ruleset.
- If a guideline in [Project SEO Guidelines](../../../SEO.md) conflicts with current app behavior, keep changes conservative and avoid breaking behavior.

## Required Workflow

1. Discover pages and routes first.
- For Next.js requests, use Next MCP tools first (for example: `get_routes`, `get_project_metadata`, `get_page_metadata`, `get_errors`, `get_logs`).
- If MCP is unavailable or insufficient, fall back to code inspection and state that fallback.

2. Build a per-route SEO checklist.
- Metadata: title, description, canonical, robots, Open Graph, Twitter.
- Structured data: Organization/WebSite + page-specific schema (FAQ/tool where relevant).
- Technical SEO: sitemap coverage, robots rules, canonical consistency.
- On-page basics: heading hierarchy and keyword clarity where applicable.

3. Apply fixes route-by-route.
- Prefer Next.js Metadata API (`metadata` or `generateMetadata`).
- Keep titles and descriptions concise and human-readable.
- Ensure each important page has a canonical URL.
- Ensure social metadata is present and coherent.

4. Validate after edits.
- Re-run diagnostics (`get_errors` / workspace errors).
- Re-check route metadata where possible with MCP.
- Summarize changes by route and call out residual SEO gaps.

## Implementation Notes for This Repository

- Reuse shared config in [app/siteConfig.ts](../../../app/siteConfig.ts) whenever possible.
- Keep root metadata in [app/layout.tsx](../../../app/layout.tsx) and page-specific overrides in route page files.
- Keep sitemap and robots aligned with canonical URLs in [app/sitemap.ts](../../../app/sitemap.ts) and [app/robots.ts](../../../app/robots.ts).

## Output Expectations

When this skill is invoked, provide:

1. Short audit summary by route.
2. Concrete fixes applied (or proposed if no edits requested).
3. Remaining recommendations ranked by impact.
