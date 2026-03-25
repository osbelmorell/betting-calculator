import { prefixedLocales } from '../i18n';

export function generateStaticParams() {
  return prefixedLocales.map((lang) => ({ lang }));
}

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
