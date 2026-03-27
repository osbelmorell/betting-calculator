import { notFound } from 'next/navigation';
import { isLocale, prefixedLocales } from '../i18n';

export function generateStaticParams() {
  return prefixedLocales.map((lang) => ({ lang }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  return <div lang={lang}>{children}</div>;
}
