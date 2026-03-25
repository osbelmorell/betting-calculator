import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { parlayCalculatorContent } from '../../content/calculatorContent';
import ParlayCalculator from '../../components/ParlayCalculator';
import { NAVIGATION_SEED_PARAM, PARLAY_STATE_PARAM } from '../../components/calculatorState';
import { defaultLocale, isLocale, localizePath } from '../../i18n';
import { getCanonicalUrl, schemaOrgUrl, siteConfig } from '../../siteConfig';

export async function generateMetadata(props: PageProps<'/[lang]/parlay'>): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLocale(lang)) {
    return {};
  }

  const localizedCopy = parlayCalculatorContent[lang].seo;

  return {
    title: localizedCopy.title,
    description: localizedCopy.description,
    alternates: {
      canonical: getCanonicalUrl(localizePath('/parlay', lang)),
      languages: {
        en: getCanonicalUrl(localizePath('/parlay', 'en')),
        es: getCanonicalUrl(localizePath('/parlay', 'es')),
        'x-default': getCanonicalUrl(localizePath('/parlay', defaultLocale)),
      },
    },
    openGraph: {
      title: localizedCopy.title,
      description: localizedCopy.description,
      url: getCanonicalUrl(localizePath('/parlay', lang)),
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

export default async function ParlayPage(props: PageProps<'/[lang]/parlay'>) {
  const { lang } = await props.params;
  if (!isLocale(lang)) {
    notFound();
  }

  if (lang === defaultLocale) {
    redirect('/parlay');
  }

  const searchParams = await props.searchParams;
  const initialSharedState = typeof searchParams[PARLAY_STATE_PARAM] === 'string' ? searchParams[PARLAY_STATE_PARAM] : undefined;
  const incomingSeedState = typeof searchParams[NAVIGATION_SEED_PARAM] === 'string' ? searchParams[NAVIGATION_SEED_PARAM] : undefined;
  const localizedCopy = parlayCalculatorContent[lang].seo;

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
          }),
        }}
      />
      <ParlayCalculator locale={lang} initialSharedState={initialSharedState} incomingSeedState={incomingSeedState} />
    </>
  );
}
