import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import ParlayCalculator from '../../components/ParlayCalculator';
import { NAVIGATION_SEED_PARAM, PARLAY_STATE_PARAM } from '../../components/calculatorState';
import { defaultLocale, isLocale, localizePath } from '../../i18n';
import { getCanonicalUrl, schemaOrgUrl } from '../../siteConfig';

const copy = {
  en: {
    title: 'Parlay Calculator | Free Multi-Leg Betting Tool',
    description:
      'Build and calculate parlays with unlimited legs. Convert each leg odds format, calculate combined odds, payouts, and winning probability. Free parlay betting calculator.',
    faq: [
      {
        question: 'How do parlay odds work?',
        answer:
          "Parlay odds multiply together. Each leg's decimal odds are multiplied by the next leg's odds to create the combined decimal odds. Your potential winnings multiply with each added leg.",
      },
      {
        question: 'What happens if one leg of my parlay loses?',
        answer:
          'If any single leg loses, the entire parlay is lost and you forfeit your stake. This is why parlays carry higher risk but offer higher potential rewards.',
      },
      {
        question: 'How many legs can I add to a parlay?',
        answer:
          'This calculator supports unlimited parlay legs. However, most sportsbooks limit parlays to 10-15 legs. The more legs you add, the harder it becomes to win, but the higher the potential payout.',
      },
    ],
  },
  es: {
    title: 'Calculadora de Parlay | Herramienta Gratis de Apuestas Multiples',
    description:
      'Crea y calcula parlays con piernas ilimitadas. Convierte el formato de cuotas de cada pierna, calcula cuotas combinadas, pagos y probabilidad de acierto. Calculadora de parlay gratis.',
    faq: [
      {
        question: 'Como funcionan las cuotas de un parlay?',
        answer:
          'Las cuotas del parlay se multiplican entre si. Las cuotas decimales de cada pierna se multiplican para crear la cuota decimal combinada. Tus ganancias potenciales crecen con cada pierna agregada.',
      },
      {
        question: 'Que pasa si una pierna de mi parlay pierde?',
        answer:
          'Si una sola pierna pierde, se pierde todo el parlay y tu stake. Por eso los parlays tienen mayor riesgo, pero tambien mayor recompensa potencial.',
      },
      {
        question: 'Cuantas piernas puedo agregar a un parlay?',
        answer:
          'Esta calculadora soporta piernas ilimitadas. Sin embargo, la mayoria de las casas de apuestas limita los parlays entre 10 y 15 piernas. Cuantas mas piernas agregues, mas dificil es acertar, pero mayor el pago potencial.',
      },
    ],
  },
} as const;

export async function generateMetadata(props: PageProps<'/[lang]/parlay'>): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLocale(lang)) {
    return {};
  }

  const localizedCopy = copy[lang];

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
  const localizedCopy = copy[lang];

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
