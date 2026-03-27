<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## MCP-first policy for Next.js questions

When a user asks a Next.js-related question, agents must try Next.js MCP tools first before reading source files directly. Prefer MCP calls such as `get_project_metadata`, `get_routes`, `get_page_metadata`, `get_errors`, `get_logs`, and `get_server_action_by_id` when relevant.

If MCP is unavailable, returns no data, or does not cover the request, explicitly fall back to code inspection and mention that fallback in the response.

## Deployment target

This project deploys to Vercel.

When making architecture or performance decisions, default to Vercel best practices:
- Prefer static rendering/SSG and edge caching when possible.
- Avoid middleware/proxy unless strictly needed.
- Use `next.config` redirects/headers over runtime request handling where equivalent.
- Keep metadata routes (like `sitemap.xml` and `robots.txt`) cache-friendly.

## Mandatory Page Quality Skill

For any task that creates or significantly updates a page, guide, or article, invoke and follow:
- [Page Content Quality Skill](.github/skills/page-content-quality/SKILL.md)

This requirement applies to:
- New routes and page files.
- Guide/article content creation or major updates.
- Changes involving metadata, canonical/hreflang, slug mapping, structured data, sitemap, or internal linking.

When implementation reveals a better repeatable approach, update the skill docs in the same change:
- [.github/skills/page-content-quality/SKILL.md](.github/skills/page-content-quality/SKILL.md)
- [.github/skills/page-content-quality/SEO_RULES.md](.github/skills/page-content-quality/SEO_RULES.md)

## Mandatory SEO Check Skill

For any task that requests an SEO audit, metadata/schema improvements, canonical/hreflang updates, sitemap/robots changes, or AI-first discoverability (GEO), invoke and follow:
- [SEO Check Skill](.github/skills/seo-check/SKILL.md)

This requirement applies to:
- SEO audits for a route or the full site.
- Changes involving metadata quality, structured data, internal linking, and indexability controls.
- Requests focused on LLM discoverability, scannability improvements, `llms.txt`, or E-E-A-T enhancements.

When implementation reveals a better repeatable SEO/GEO pattern, update these in the same change:
- [.github/skills/seo-check/SKILL.md](.github/skills/seo-check/SKILL.md)
- [SEO.md](SEO.md)

## Mandatory Calculator Alignment Skill

For any task that creates or significantly updates a calculator route, calculator component, or calculator copy, invoke and follow:
- [Calculator Content Alignment Skill](.github/skills/calculator-content-alignment/SKILL.md)

This requirement applies to:
- New calculator pages/routes.
- New calculator variants or major UI changes.
- Changes to calculator labels, helper text, related tools copy, or localized calculator content keys.

When implementation introduces a better repeatable calculator pattern, update these in the same change:
- [.github/skills/calculator-content-alignment/SKILL.md](.github/skills/calculator-content-alignment/SKILL.md)
- [.github/skills/calculator-content-alignment/CALCULATOR_CONTENT_CONTRACT.md](.github/skills/calculator-content-alignment/CALCULATOR_CONTENT_CONTRACT.md)
<!-- END:nextjs-agent-rules -->
