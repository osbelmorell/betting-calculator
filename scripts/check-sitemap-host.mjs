import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const DEFAULT_SITE_URL = 'https://www.calcmybets.com';
const SITEMAP_ARTIFACT_PATH = path.join(process.cwd(), '.next', 'server', 'app', 'sitemap.xml.body');

function normalizeSiteUrl(value) {
  const input = value?.trim() || DEFAULT_SITE_URL;

  try {
    const parsedUrl = new URL(input);

    if (parsedUrl.hostname === 'calcmybets.com') {
      parsedUrl.hostname = 'www.calcmybets.com';
    }

    return parsedUrl.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

function getExpectedHost() {
  const siteUrl = normalizeSiteUrl(
    process.env.SITEMAP_EXPECTED_HOST || process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL,
  );

  return new URL(siteUrl).host;
}

function collectSitemapUrls(xmlContent) {
  const matches = xmlContent.matchAll(/<(?:loc|xhtml:link[^>]*href)=?[^>]*?(?:>(https:\/\/[^<]+)<|href="(https:\/\/[^"]+)")/g);

  return Array.from(matches, (match) => match[1] || match[2]).filter(Boolean);
}

function main() {
  if (!existsSync(SITEMAP_ARTIFACT_PATH)) {
    throw new Error(`Missing sitemap build artifact at ${SITEMAP_ARTIFACT_PATH}. Run Next build first.`);
  }

  const xmlContent = readFileSync(SITEMAP_ARTIFACT_PATH, 'utf8');
  const expectedHost = getExpectedHost();
  const sitemapUrls = collectSitemapUrls(xmlContent);

  if (sitemapUrls.length === 0) {
    throw new Error('No absolute URLs were found in the generated sitemap.');
  }

  const invalidUrls = sitemapUrls.filter((url) => {
    try {
      return new URL(url).host !== expectedHost;
    } catch {
      return true;
    }
  });

  if (invalidUrls.length > 0) {
    const samples = invalidUrls.slice(0, 5).join('\n- ');
    throw new Error(
      `Generated sitemap URLs must use host "${expectedHost}", but found ${invalidUrls.length} invalid URL(s):\n- ${samples}`,
    );
  }

  console.log(`Sitemap host check passed for ${sitemapUrls.length} URL(s) on host ${expectedHost}.`);
}

main();