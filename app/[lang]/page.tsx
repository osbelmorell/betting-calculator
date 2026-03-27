import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { singleCalculatorContent } from '../content/calculatorContent';
import BettingCalculator from '../components/BettingCalculator';
import { defaultLocale, isLocale, localizePath } from '../i18n';
import { getCanonicalUrl, schemaOrgUrl, siteConfig } from '../siteConfig';

export async function generateMetadata(props: PageProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLocale(lang)) {
    return {};
  }

  const localizedCopy = singleCalculatorContent[lang].seo;

  return {
    title: { absolute: localizedCopy.title },
    description: localizedCopy.description,
    alternates: {
      canonical: getCanonicalUrl(localizePath('/', lang)),
      languages: {
        en: getCanonicalUrl(localizePath('/', 'en')),
        es: getCanonicalUrl(localizePath('/', 'es')),
        'x-default': getCanonicalUrl(localizePath('/', defaultLocale)),
      },
    },
    openGraph: {
      title: localizedCopy.title,
      description: localizedCopy.description,
      url: getCanonicalUrl(localizePath('/', lang)),
      siteName: siteConfig.name,
      type: 'website',
      locale: lang === 'es' ? 'es_ES' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: localizedCopy.title,
      description: localizedCopy.description,
    },
  };
}

export default async function Home(props: PageProps<'/[lang]'>) {
  const { lang } = await props.params;
  if (!isLocale(lang)) {
    notFound();
  }

  if (lang === defaultLocale) {
    redirect('/');
  }

  const localizedCopy = singleCalculatorContent[lang].seo;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': schemaOrgUrl,
            '@type': 'FAQPage',
            mainEntity: localizedCopy.faq.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          }).replace(/</g, '\\u003c'),
        }}
      />
      <BettingCalculator locale={lang} />
    </>
  );
}
