import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from 'react';
import AnalyticsDebugPanel from './components/AnalyticsDebugPanel';
import GlobalCalcToggle from './components/GlobalCalcToggle';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://calcmybets.com'),
  title: {
    default: 'Betting Calculator | Free Odds & Parlay Calculator',
    template: '%s | Betting Calculator',
  },
  description:
    'Free betting calculator with live odds conversion. Calculate single bet payouts, parlays, and implied probability across American, fractional, decimal, and implied formats.',
  keywords: [
    'betting calculator',
    'parlay calculator',
    'american odds converter',
    'decimal odds calculator',
    'implied probability',
    'sports betting calculator',
    'odds converter',
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://calcmybets.com',
  },
  openGraph: {
    title: 'Betting Calculator | Free Odds & Parlay Calculator',
    description:
      'Free single bet and parlay calculator with real-time odds conversion and implied winning percentage.',
    type: 'website',
    siteName: 'Betting Calculator',
    url: 'https://calcmybets.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Betting Calculator | Free Odds & Parlay Calculator',
    description:
      'Single and parlay payout calculator with American, decimal, fractional, and implied odds conversion.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              'name': 'Betting Calculator',
              'url': 'https://calcmybets.com',
              'applicationCategory': 'UtilityApplication',
              'description': 'Free betting calculator with live odds conversion. Calculate single bet payouts, parlays, and implied probability.',
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
      </body>
    </html>
  );
}
