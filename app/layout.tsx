import type { Metadata } from "next";
import { Suspense } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';
import AnalyticsDebugPanel from './components/AnalyticsDebugPanel';
import GlobalCalcToggle from './components/GlobalCalcToggle';
import { defaultLocale } from './i18n';
import { getLocalizedCanonicalUrl, getSocialImageUrl, schemaOrgUrl, siteConfig, siteTitleTemplate } from './siteConfig';
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.defaultTitle,
    template: siteTitleTemplate,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: getLocalizedCanonicalUrl('/', defaultLocale),
    languages: {
      en: getLocalizedCanonicalUrl('/', 'en'),
      es: getLocalizedCanonicalUrl('/', 'es'),
      'x-default': getLocalizedCanonicalUrl('/', defaultLocale),
    },
  },
  openGraph: {
    title: siteConfig.defaultTitle,
    description: siteConfig.openGraphDescription,
    type: 'website',
    siteName: siteConfig.name,
    url: siteConfig.url,
    images: [{ url: getSocialImageUrl(), width: 1200, height: 630, alt: siteConfig.defaultTitle }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.defaultTitle,
    description: siteConfig.twitterDescription,
    images: [getSocialImageUrl()],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const schemaDescription = siteConfig.webApplicationDescription;
  const siteSearchTarget = `${siteConfig.url}/?q={search_term_string}`;

  return (
    <html
      lang={defaultLocale}
      data-scroll-behavior="smooth"
      className="h-full antialiased"
    >
      <body
        className="min-h-full flex flex-col"
        style={
          {
            ['--toggle-top' as string]: '0.75rem',
            ['--toggle-height' as string]: '3rem',
            ['--content-offset' as string]: 'calc((var(--toggle-top) * 2) + var(--toggle-height))',
          } as React.CSSProperties
        }
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[var(--surface)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--foreground)] focus:shadow-[var(--shadow-md)]"
        >
          Skip to main content / Saltar al contenido principal
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': schemaOrgUrl,
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': `${siteConfig.url}#organization`,
                  name: siteConfig.name,
                  url: siteConfig.url,
                },
                {
                  '@type': 'WebSite',
                  '@id': `${siteConfig.url}#website`,
                  name: siteConfig.name,
                  url: siteConfig.url,
                  publisher: {
                    '@id': `${siteConfig.url}#organization`,
                  },
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: siteSearchTarget,
                    'query-input': 'required name=search_term_string',
                  },
                },
                {
                  '@type': 'WebApplication',
                  '@id': `${siteConfig.url}#webapp`,
                  name: siteConfig.name,
                  url: siteConfig.url,
                  applicationCategory: 'UtilityApplication',
                  operatingSystem: 'Any',
                  description: schemaDescription,
                  offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'USD',
                  },
                },
              ],
            }).replace(/</g, '\\u003c'),
          }}
        />
        <Suspense fallback={null}>
          <GlobalCalcToggle />
        </Suspense>
        <div id="main-content" className="flex-1 pt-12 sm:pt-[var(--content-offset)]">
          {children}
        </div>
        <AnalyticsDebugPanel />
        {gaMeasurementId ? <GoogleAnalytics gaId={gaMeasurementId} /> : null}
      </body>
    </html>
  );
}
