---
name: page-content-quality
description: Enforce page, guide, and article creation best practices (UX, structure, localization, and SEO) and keep rules updated as new improvements are discovered. Use this whenever creating or significantly updating a page.
argument-hint: "[scope: page|guide|article|all] [action: create|update|audit]"
---

# Page Content Quality Skill

Use this skill every time a new page, guide, or article is created, and whenever one is significantly updated.

## Mandatory Trigger

Invoke this skill when any task includes:
- Creating a new route/page.
- Creating or editing guides/articles content.
- Updating page layout, metadata, URL structure, or internal linking.

## Source of Truth

- Primary SEO policy: [Project SEO Guidelines](../../../SEO.md)
- Page SEO checklist: [SEO Rules](./SEO_RULES.md)
- AI crawler policy file: `public/llms.txt`
- App-level defaults: [app/siteConfig.ts](../../../app/siteConfig.ts), [app/layout.tsx](../../../app/layout.tsx)

## Required Workflow

1. Classify page intent.
- Decide whether the page is a calculator tool, guide/article, or utility page.
- Match metadata and schema to that intent.

2. Build the page with structure-first quality.
- Clear hero/intro with user intent alignment.
- Use an answer-first first paragraph (inverted pyramid) for informational sections.
- One `h1`, then consistent `h2/h3` hierarchy.
- Prefer semantic sectioning (`<article>`, `<section>`, `<aside>`) when authoring long-form content.
- Use question-based `h2/h3` headings for guides/articles when they match likely user prompts.
- Use lists or tables for formulas, comparisons, and dense reference data.
- Useful internal links to sibling pages.
- Localized copy and slugs for translated routes.

3. Apply SEO rules.
- Follow all items in [SEO Rules](./SEO_RULES.md).
- Ensure canonical + hreflang + sitemap alignment.
- Add suitable JSON-LD and sanitize output safely.
- Ensure selected schema type matches page intent (`WebApplication`, `Article`, `FAQPage`, `HowTo`, `BreadcrumbList`).
- For guides/articles, include author attribution and credentials where available.
- Ensure meaningful image alt text and add captions/context when visuals carry instructional meaning.

4. Validate implementation.
- Run build checks.
- Confirm no broken locale-switch links.
- Confirm route generation includes new pages.
- For major new sections/features, update `public/llms.txt` or document why no update is needed.

5. Maintenance requirement.
- If you discover a better repeatable pattern during implementation, update this skill and/or [SEO Rules](./SEO_RULES.md) in the same change.
- Keep guidance concise, practical, and repository-specific.

## Definition of Done

- Page is structurally clear and consistent with the design system.
- Informational pages use answer-first intros and scannable, extractable structure.
- Metadata, canonical, hreflang, schema, and sitemap are correct.
- Informational pages include author attribution/credentials when available.
- Key content is visible in initial HTML and not blocked behind client-only UI.
- `llms.txt` impact has been reviewed for major section/feature additions.
- Localized routes/slugs and link mapping work across languages.
- Build passes and no new issues were introduced.
- Skill docs were updated if new best practices were identified.
