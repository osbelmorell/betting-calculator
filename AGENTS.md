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
<!-- END:nextjs-agent-rules -->
