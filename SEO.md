# SEO Best Practices Guidelines for Betting Calculator

This document outlines SEO best practices that all agents must follow when making updates to the betting-calculator application. These guidelines cover technical SEO, on-page optimization, performance, and Next.js-specific implementations.

---

## 1. Metadata & Head Tags

### Required Meta Tags
- **Title Tag** (`<title>`): 50-60 characters, include primary keyword, readable and compelling
- **Meta Description**: 150-160 characters, summarize page content with call-to-action
- **Viewport**: Always include `<meta name="viewport" content="width=device-width, initial-scale=1" />`
- **Charset**: Include `<meta charset="utf-8" />`
- **Open Graph Tags** (social sharing):
  - `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- **Twitter Cards**:
  - `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`

### Next.js Implementation (v16+)
Use the Metadata API in `layout.tsx` and page components:

```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Betting Calculator | Fast Odds & Parlay Calculations',
  description: 'Calculate betting odds instantly. Support for moneyline, spread, totals, and parlay bets.',
  keywords: ['betting calculator', 'odds calculator', 'parlay calculator'],
  openGraph: {
    title: 'Betting Calculator',
    description: 'Fast and accurate betting odds calculations',
    url: 'https://bettingcalculator.com',
    siteName: 'Betting Calculator',
    images: [{
      url: 'https://bettingcalculator.com/og-image.png',
      width: 1200,
      height: 630,
    }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Betting Calculator',
    description: 'Fast and accurate betting odds calculations',
    images: ['https://bettingcalculator.com/twitter-image.png'],
  },
};
```

For dynamic metadata:
```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    title: `${params.name} - Betting Calculator`,
    description: `Calculate ${params.name} betting odds with our free tool.`,
  };
}
```

---

## 2. Structured Data & Schema Markup

### Required Schema Markups
- **Organization Schema**: Include in root layout
- **Website Schema**: With search action support
- **BreadcrumbList**: For multi-level navigation
- **FAQPage Schema**: For FAQ sections
- **Tool/Application Schema**: For the calculator itself

### Implementation
Place in `layout.tsx` or use JSON-LD in script tags:

```typescript
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Application',
      'name': 'Betting Calculator',
      'url': 'https://bettingcalculator.com',
      'applicationCategory': 'UtilityApplication',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD',
      },
    }),
  }}
/>
```

---

## 3. On-Page Optimization

### Heading Hierarchy
- Use **one `<h1>` per page** (main page title, not site name)
- Use `<h2>` for major sections
- Use `<h3>`, `<h4>` for subsections
- Never skip heading levels
- Include target keywords naturally in headings

### Content Guidelines
- **Primary Keyword**: Include in first 100 words
- **Keyword Density**: Maintain 1-2% density (natural placement)
- **LSI Keywords**: Use related keywords and synonyms naturally
- **Content Length**: Aim for 300+ words per page (1,500+ for cornerstone content)
- **Readability**: Keep paragraphs to 3-4 sentences max
- **Scanability**: Use bullets, numbered lists, and bold text

### Internal Linking
- Link to related pages with descriptive anchor text (avoid "click here")
- Minimum 2-3 internal links per 1,000 words
- Use keyword-rich URLs in links
- Ensure all links are valid (no 404s)

---

## 4. URL Structure & Site Architecture

### URL Best Practices
- **Lowercase**: All URLs lowercase
- **Hyphens**: Use hyphens to separate words (not underscores)
- **Descriptive**: URLs should describe content (`/parlay-calculator` not `/tool-3`)
- **Avoid**: Query parameters for canonical content, special characters, tracking params
- **Length**: Keep under 75 characters when possible

### Site Structure
- Create logical hierarchy: Home → Category → Specific Tool
- Example: `/` → `/calculators/` → `/calculators/parlay/`
- Ensure breadcrumb navigation implementation

---

## 5. Core Web Vitals & Performance

### Essential Metrics (Google's Core Web Vitals)
- **LCP (Largest Contentful Paint)**: < 2.5 seconds
- **FID (First Input Delay)**: < 100 milliseconds (CWV 2024: INP instead)
- **INP (Interaction to Next Paint)**: < 200 milliseconds (replaces FID in 2024)
- **CLS (Cumulative Layout Shift)**: < 0.1
- **TTFB (Time to First Byte)**: < 600 milliseconds

### Next.js Performance Optimization
- Use `next/image` for all images (automatic optimization):
  ```typescript
  import Image from 'next/image';
  
  <Image
    src="/image.png"
    alt="Descriptive alt text for SEO"
    width={1200}
    height={630}
    priority={true} // for above-fold images
  />
  ```
- Implement lazy loading for below-fold content
- Code splitting via dynamic imports:
  ```typescript
  import dynamic from 'next/dynamic';
  
  const HeavyComponent = dynamic(() => import('./heavy'), {
    loading: () => <div>Loading...</div>,
  });
  ```
- Minimize third-party scripts (analytics, ads)
- Enable compression in `next.config.ts`

---

## 6. Mobile Optimization

### Mobile-First Requirements
- **Responsive Design**: Test on 320px, 768px, 1024px, 1440px breakpoints
- **Touch Targets**: Minimum 48x48px for interactive elements
- **Font Size**: Minimum 16px for body text (prevents zoom on iOS)
- **Viewport Meta Tag**: Must be present
- **Mobile Testing**: Use Google Mobile-Friendly Test before deployment

### Implementation Guidelines
- Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`)
- Test all inputs on mobile
- Ensure sliders and interactive components work on touch devices

---

## 7. Technical SEO Requirements

### XML Sitemaps
- Create `public/sitemap.xml` with all canonical URLs
- Include priority and change frequency
- Submit to Google Search Console
- For dynamic content, generate programmatically:
  ```typescript
  // app/sitemap.ts
  import { MetadataRoute } from 'next';
  
  export default function sitemap(): MetadataRoute.Sitemap {
    return [
      { url: 'https://bettingcalculator.com', changeFrequency: 'daily', priority: 1 },
      { url: 'https://bettingcalculator.com/parlay', changeFrequency: 'weekly', priority: 0.8 },
    ];
  }
  ```

### Robots.txt
- Place in `public/robots.txt`
- Allow search engines to crawl, disallow admin/private pages
- Reference sitemap location

### Canonical Tags
- Add to every page to prevent duplicate content:
  ```typescript
  export const metadata: Metadata = {
    alternates: {
      canonical: 'https://bettingcalculator.com/page',
    },
  };
  ```

### Redirects
- Use 301 redirects for moved pages (permanent)
- Use 302 redirects for temporary changes
- Configure in `next.config.ts`:
  ```typescript
  redirects: async () => {
    return [
      { source: '/old-page', destination: '/new-page', permanent: true },
    ];
  }
  ```

---

## 8. Image Optimization for SEO

### Image Best Practices
- **Alt Text**: Descriptive, keyword-relevant (aim for 8-12 words)
  - Bad: `alt="image"`
  - Good: `alt="Parlay betting calculator showing odds calculation"`
- **File Names**: Descriptive, hyphenated (e.g., `parlay-calculator-interface.png`)
- **File Size**: Compress to < 200KB for web (except hero images)
- **Formats**: Use WebP with fallbacks for broader compatibility
- **Dimensions**: Specify width and height to prevent layout shift

### Implementation
```typescript
import Image from 'next/image';

<Image
  src="/betting-calculator-interface.png"
  alt="Betting calculator interface showing odds, stake, and potential winnings"
  width={800}
  height={600}
  quality={85}
/>
```

---

## 9. Content & Keyword Strategy

### Keyword Research
- Target long-tail keywords (4+ words) for tools/calculators
- Examples: "how to calculate parlay odds", "betting odds calculator free"
- Use tools: Google Keyword Planner, SEMrush, Ahrefs
- Analyze competitor keywords

### Content Pillars for Betting Calculator
1. **Moneyline Odds Calculation**
2. **Spread Betting Odds**
3. **Parlay/Accumulator Betting**
4. **Implied Probability Calculator**
5. **ROI & Profit Margin Calculations**

### Each Page Should Include
- Clear problem statement (what does this calculator solve?)
- Step-by-step usage instructions
- Real-world examples
- FAQ section with schema markup
- Related tools/resources (internal links)

---

## 10. Link Strategy

### External Links
- Link to authoritative sources (betting commissions, sports regulatory bodies)
- Use `rel="external"` for non-affiliated links
- Limit to 3-5 external links per page
- Verify links quarterly for broken links

### Internal Linking Best Practices
- Link from high-authority pages to new pages (boosting them)
- Use descriptive anchor text with keywords
- Avoid "nofollow" on internal links unless necessary
- Create topic clusters linking related content

---

## 11. Accessibility for SEO

### WCAG 2.1 AA Compliance (impacts SEO, UX, & rankings)
- **Color Contrast**: Minimum 4.5:1 for body text
- **ARIA Labels**: Use for interactive elements
  ```typescript
  <button aria-label="Reset calculator">Reset</button>
  ```
- **Skip Links**: Provide ability to skip to main content
- **Keyboard Navigation**: All features accessible via keyboard
- **Form Labels**: Associate labels with inputs
  ```typescript
  <label htmlFor="odds-input">Odds</label>
  <input id="odds-input" type="number" />
  ```

---

## 12. Testing & Monitoring

### Pre-Deployment Checklist
- [ ] Title tag: 50-60 characters, keyword-inclusive
- [ ] Meta description: 150-160 characters with call-to-action
- [ ] H1: One per page, unique
- [ ] Mobile-friendly (Google Mobile-Friendly Test)
- [ ] Core Web Vitals tested (PageSpeed Insights)
- [ ] Schema markup validated (Schema.org Validator)
- [ ] No broken internal links
- [ ] Alt text on all images
- [ ] Internal links: 2+ on content pages

### Monitoring Tools
- **Google Search Console**: Monitor indexing, search performance, manual actions
- **Google Analytics 4**: Track user behavior, conversions
- **PageSpeed Insights**: Track Core Web Vitals
- **Lighthouse**: Run locally for performance audits
- **Schema.org Validator**: Validate structured data

---

## 13. AI-First GEO (Generative Engine Optimization)

Use this section whenever changes are intended to improve discoverability in LLM surfaces (for example ChatGPT, Gemini, and Perplexity).

### Content Structure and Scannability
- Use inverted pyramid writing for informational content: answer/definition first, supporting detail after.
- Prefer semantic sectioning for long-form pages: `<article>`, `<section>`, and `<aside>` where appropriate.
- Use question-based section headings (`h2`/`h3`) when they match likely user prompts.
- Present formulas, comparisons, and multi-step instructions in lists or tables to keep data extractable.

### Technical SEO for AI Systems
- Keep critical explanatory content visible in initial HTML payload (SSR/SSG-friendly), not only behind client-side interactions.
- Choose JSON-LD by page intent and keep it aligned with visible content:
  - Calculator/tool routes: `WebApplication` (+ `FAQPage` when FAQ exists)
  - Guide/article routes: `Article` (+ `FAQPage`, `HowTo`, `BreadcrumbList` where applicable)
  - Site-wide: `Organization` and `WebSite`
- For images with instructional value, include context-rich alt text and captions/nearby explanatory text.

### `llms.txt` Maintenance
- For new major routes, features, or content sections, review and update `public/llms.txt`.
- If `public/llms.txt` does not yet exist, treat this as a high-priority SEO/GEO gap and document it in the audit summary.

### E-E-A-T for Informational Content
- Include author bylines and credentials on guides/articles where available.
- Prefer `Person` (or `Person` + `Organization`) in guide/article schema instead of organization-only attribution when expert authorship is known.
- Keep tone factual, direct, and evidence-oriented; avoid unsupported claims and marketing-heavy phrasing.

### Monthly Review
- Check Search Console for indexing issues
- Review Core Web Vitals trends
- Monitor keyword rankings
- Check for broken links
- Analyze traffic sources and conversions

---

## 13. Next.js-Specific SEO Setup

### Essential Files & Configuration
1. **`app/layout.tsx`**: Global metadata, schema markup
2. **`public/robots.txt`**: Search engine directives
3. **`public/sitemap.xml`** or **`app/sitemap.ts`**: Site structure
4. **`next.config.ts`**: Redirects, rewrites, image optimization
5. **`app/manifest.ts`**: PWA manifest (optional but recommended)

### Next.js SEO Best Practices
- Use App Router (newer than Pages Router)
- Generate static pages where possible (better for SEO)
- Use `generateStaticParams()` for dynamic routes
- Implement ISR (Incremental Static Regeneration) when needed
- Avoid client-side rendering for meta tags (doesn't help SEO)

---

## 14. Common SEO Mistakes to Avoid

❌ **DON'T**:
- Use rel="nofollow" on internal links
- Add meta keywords (outdated, ignored by Google)
- Shoot for exact keyword matching (use variations/synonyms)
- Ignore Core Web Vitals
- Duplicate content across pages without canonicals
- Use auto-generated or low-quality content
- Hide content from search engines
- Redirect homepage traffic artificially
- Overuse H1 tags (one per page maximum)
- Ignore mobile experience

✅ **DO**:
- Write for humans first, search engines second
- Update content regularly
- Monitor Search Console for issues
- Test on real devices and networks
- Focus on user intent over keyword density
- Keep internal linking natural
- Maintain site security (HTTPS)
- Use descriptive URLs
- Implement proper redirects for moved content

---

## 15. Monthly SEO Audit Checklist

- [ ] All pages have unique, compelling title tags
- [ ] Meta descriptions are updated and accurate
- [ ] H1 hierarchy is correct
- [ ] Images have descriptive alt text
- [ ] Internal links are relevant and working
- [ ] No duplicate content detected
- [ ] Core Web Vitals are within acceptable range
- [ ] Mobile usability is excellent
- [ ] Schema markup is valid
- [ ] Sitemaps are updated
- [ ] No indexing issues in Search Console
- [ ] Backlinks are healthy (no suspicious links)

---

## References & Tools

- [Google Search Central](https://developers.google.com/search)
- [Web.dev by Google](https://web.dev/)
- [Next.js SEO Best Practices](https://nextjs.org/learn/seo/introduction-to-seo)
- [Moz SEO Beginner's Guide](https://moz.com/beginners-guide-to-seo)
- [Schema.org Documentation](https://schema.org/)
- Tools: Google PageSpeed Insights, Lighthouse, Search Console, SEMrush

---

## Version History

- **v1.0** (March 2026): Initial SEO guidelines based on 2024-2026 best practices, Next.js 16
