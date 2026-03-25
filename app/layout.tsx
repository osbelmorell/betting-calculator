import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL('https://betting-calculator.local'),
  title: {
    default: 'Betting Calculator',
    template: '%s | Betting Calculator',
  },
  description:
    'Calculate single bet and parlay payouts with live odds conversion across American, fractional, decimal, and implied formats.',
  keywords: [
    'betting calculator',
    'parlay calculator',
    'american odds converter',
    'decimal odds calculator',
    'implied probability',
    'sports betting tools',
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Betting Calculator',
    description:
      'Free single bet and parlay calculator with real-time odds conversion and implied winning percentage.',
    type: 'website',
    siteName: 'Betting Calculator',
  },
  twitter: {
    card: 'summary',
    title: 'Betting Calculator',
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
        <GlobalCalcToggle />
        <div className="flex-1 pt-[var(--content-offset)]">
          {children}
        </div>
      </body>
    </html>
  );
}
