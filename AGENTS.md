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
<!-- END:nextjs-agent-rules -->
