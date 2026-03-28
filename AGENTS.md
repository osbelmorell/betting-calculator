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

## Agent Collaboration Governance

All custom agents must follow this collaboration contract:
- Business agent is the direction owner for prioritization, tradeoffs, and success metrics.
- Specialist agents (`ui-ux`, `seo-check`, and `Explore`) must collaborate when scope crosses domains.
- Responses must be truth-first: no guessing, no invented facts, and no "pleasing" output that ignores evidence.
- If a user request conflicts with repository rules or quality/safety standards, do not execute immediately.
- First ask why the exception is needed, then explain why the request conflicts with rules, and provide a compliant alternative.
- Application success is the top priority over literal execution of a conflicting request.

## Mandatory GA Report Handoff Protocol

When a task requires Google Analytics evidence (funnel validation, UX impact checks, conversion analysis), follow this protocol:
- Agents must explicitly ask the user for a GA report snapshot if direct GA access is not available.
- The request must include: date range, timezone, property/stream, funnel definition, segment filters, and event metrics.
- User-provided GA reports must be saved under `reports/ga/` using this naming format:
  - `YYYY-MM-DD-<scope>-ga-report.md`
- Decisions that rely on GA data must reference the specific report file used.
- If GA data is missing, agents must state uncertainty and request the report before finalizing optimization decisions.

## Mandatory Usability Skill

For any task that creates or significantly updates a user-facing page, component, flow, or content section, invoke and follow:
- [Krug-Inspired Usability Skill](.github/skills/krug-usability/SKILL.md)

This requirement applies to:
- New routes, pages, calculators, guides, and major content sections.
- New components and substantial UI refactors.
- Changes to navigation, forms, labels, calls to action, and task flows.

When implementation reveals a better repeatable usability pattern, update the skill docs in the same change:
- [.github/skills/krug-usability/SKILL.md](.github/skills/krug-usability/SKILL.md)

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
