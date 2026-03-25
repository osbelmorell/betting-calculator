import type { Metadata } from "next";
import { Suspense } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';
import AnalyticsDebugPanel from './components/AnalyticsDebugPanel';
import GlobalCalcToggle from './components/GlobalCalcToggle';
import { schemaOrgUrl, siteConfig, siteTitleTemplate } from './siteConfig';
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
    canonical: siteConfig.url,
  },
  openGraph: {
    title: siteConfig.defaultTitle,
    description: siteConfig.openGraphDescription,
    type: 'website',
    siteName: siteConfig.name,
    url: siteConfig.url,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.defaultTitle,
    description: siteConfig.twitterDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html
      lang="en"
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': schemaOrgUrl,
              '@type': 'WebApplication',
              'name': siteConfig.name,
              'url': siteConfig.url,
              'applicationCategory': 'UtilityApplication',
              'description': siteConfig.webApplicationDescription,
              'offers': {
                '@type': 'Offer',
                'price': '0',
                'priceCurrency': 'USD',
              },
            }),
          }}
        />
        <Suspense fallback={<div className="h-[var(--content-offset)]" aria-hidden="true" />}>
          <GlobalCalcToggle />
        </Suspense>
        <div className="flex-1 pt-[var(--content-offset)]">
          {children}
        </div>
        <AnalyticsDebugPanel />
        {gaMeasurementId ? <GoogleAnalytics gaId={gaMeasurementId} /> : null}
      </body>
    </html>
  );
}
