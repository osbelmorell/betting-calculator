import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import BettingCalculator from '../components/BettingCalculator';
import { NAVIGATION_SEED_PARAM, SINGLE_STATE_PARAM } from '../components/calculatorState';
import { defaultLocale, isLocale, localizePath, type Locale } from '../i18n';
import { getCanonicalUrl, schemaOrgUrl } from '../siteConfig';

const copy = {
  en: {
    title: 'Single Bet Calculator | Free Odds Conversion Tool',
    description:
      'Fast, free single bet calculator. Calculate payouts, winnings, and implied probability instantly. Convert between American, fractional, decimal, and percentage odds formats.',
    faq: [
      {
        question: 'How do I use the single bet calculator?',
        answer:
          'Enter your bet amount and odds in any format (American, decimal, fractional, or implied probability). The calculator instantly converts all formats and shows your potential winnings and payout.',
      },
      {
        question: 'What is implied probability?',
        answer:
          'Implied probability is the conversion of betting odds into a percentage representing the likelihood of an outcome. For example, -110 American odds implies approximately 52.38% probability.',
      },
      {
        question: 'How do I convert American odds to decimal?',
        answer:
          'Positive American odds: (American odds / 100) + 1. Negative American odds: (100 / |American odds|) + 1. Or use this calculator to convert instantly.',
      },
    ],
  },
  es: {
    title: 'Calculadora de Apuesta Simple | Conversor de Cuotas Gratis',
    description:
      'Calculadora de apuesta simple rapida y gratis. Calcula pagos, ganancias y probabilidad implicita al instante. Convierte entre cuotas americanas, fraccionales, decimales y porcentaje.',
    faq: [
      {
        question: 'Como uso la calculadora de apuesta simple?',
        answer:
          'Ingresa el monto de tu apuesta y las cuotas en cualquier formato (americano, decimal, fraccional o probabilidad implicita). La calculadora convierte al instante todos los formatos y muestra tus ganancias y pago potencial.',
      },
      {
        question: 'Que es la probabilidad implicita?',
        answer:
          'La probabilidad implicita es la conversion de las cuotas a un porcentaje que representa la probabilidad de un resultado. Por ejemplo, cuotas americanas -110 implican aproximadamente 52.38% de probabilidad.',
      },
      {
        question: 'Como convierto cuotas americanas a decimales?',
        answer:
          'Cuotas americanas positivas: (cuota americana / 100) + 1. Cuotas negativas: (100 / |cuota americana|) + 1. O usa esta calculadora para convertir al instante.',
      },
    ],
  },
} as const;

function resolvePageLocale(lang: string): Locale {
  return isLocale(lang) ? lang : defaultLocale;
}

export async function generateMetadata(props: PageProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLocale(lang)) {
    return {};
  }

  const localizedCopy = copy[lang];

  return {
    title: localizedCopy.title,
    description: localizedCopy.description,
    alternates: {
      canonical: getCanonicalUrl(localizePath('/', lang)),
      languages: {
        en: getCanonicalUrl(localizePath('/', 'en')),
        es: getCanonicalUrl(localizePath('/', 'es')),
        'x-default': getCanonicalUrl(localizePath('/', defaultLocale)),
      },
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

  const searchParams = await props.searchParams;
  const initialSharedState = typeof searchParams[SINGLE_STATE_PARAM] === 'string' ? searchParams[SINGLE_STATE_PARAM] : undefined;
  const incomingSeedState = typeof searchParams[NAVIGATION_SEED_PARAM] === 'string' ? searchParams[NAVIGATION_SEED_PARAM] : undefined;
  const localizedCopy = copy[resolvePageLocale(lang)];

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
      <BettingCalculator locale={lang} initialSharedState={initialSharedState} incomingSeedState={incomingSeedState} />
    </>
  );
}
