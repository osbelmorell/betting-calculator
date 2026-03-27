import type { Locale } from '../i18n';

type FaqItem = {
  question: string;
  answer: string;
};

export type EvCalculatorCopy = {
  title: string;
  subtitle: string;
  cardTitle: string;
  betAmount: string;
  betAmountAria: string;
  estimatedProbability: string;
  estimatedProbabilityAria: string;
  estimatedProbabilityHint: string;
  results: string;
  evAmount: string;
  evPercent: string;
  breakEven: string;
  edge: string;
  expectedPayout: string;
  expectedLoss: string;
  statusPositive: string;
  statusNegative: string;
  statusNeutral: string;
  statusPositiveHint: string;
  statusNegativeHint: string;
  statusNeutralHint: string;
  reset: string;
  resetAria: string;
  shareLabel: string;
  howToTitle: string;
  howToBody: string;
  relatedToolsTitle: string;
  relatedSingle: string;
  relatedParlay: string;
  relatedOdds: string;
  relatedGuides: string;
  faqTitle: string;
  faq: ReadonlyArray<FaqItem>;
};

export const evCalculatorSeo: Record<Locale, { title: string; description: string; faq: ReadonlyArray<FaqItem> }> = {
  en: {
    title: '+EV Calculator | Expected Value Betting Tool',
    description:
      'Free +EV calculator for sports betting. Enter stake, odds, and your estimated win probability to see expected value, ROI, edge, and break-even probability instantly.',
    faq: [
      {
        question: 'What is a +EV bet?',
        answer:
          'A +EV bet is a wager where your expected value is above zero. It means your projected long-term return is positive given your estimated win probability and the market price.',
      },
      {
        question: 'How is expected value calculated?',
        answer:
          'Expected value is calculated as: (win probability x profit if win) - (lose probability x stake). If the result is positive, the bet is +EV.',
      },
      {
        question: 'What is break-even probability?',
        answer:
          'Break-even probability is the minimum win rate needed to have zero expected value at the current odds. If your estimate is higher than break-even, the bet may be +EV.',
      },
    ],
  },
  es: {
    title: 'Calculadora +EV | Valor Esperado en Apuestas',
    description:
      'Calculadora +EV gratis para apuestas deportivas. Ingresa monto, cuota y tu probabilidad estimada para ver valor esperado, ROI, edge y probabilidad de equilibrio al instante.',
    faq: [
      {
        question: 'Que es una apuesta +EV?',
        answer:
          'Una apuesta +EV es una jugada con valor esperado mayor que cero. Significa que tu retorno proyectado a largo plazo es positivo segun tu probabilidad estimada y la cuota del mercado.',
      },
      {
        question: 'Como se calcula el valor esperado?',
        answer:
          'El valor esperado se calcula asi: (probabilidad de ganar x ganancia si acierta) - (probabilidad de perder x monto apostado). Si el resultado es positivo, la apuesta es +EV.',
      },
      {
        question: 'Que es la probabilidad de equilibrio?',
        answer:
          'La probabilidad de equilibrio es la tasa minima de acierto necesaria para tener valor esperado cero con esa cuota. Si tu estimacion es mayor, la apuesta puede ser +EV.',
      },
    ],
  },
};

export const evCalculatorContent: Record<Locale, EvCalculatorCopy> = {
  en: {
    title: '+EV Calculator',
    subtitle: 'Enter your bet size, market odds, and your best win estimate to quickly see if a bet is worth it.',
    cardTitle: 'Inputs',
    betAmount: 'Bet Amount',
    betAmountAria: 'Bet amount in dollars for expected value calculation',
    estimatedProbability: 'Your Estimated Win Probability',
    estimatedProbabilityAria: 'Your estimated probability of winning in percentage',
    estimatedProbabilityHint: 'Use your own win estimate (your best guess), not the sportsbook number.',
    results: 'Expected Value Results',
    evAmount: 'EV Amount',
    evPercent: 'EV %',
    breakEven: 'Break-Even',
    edge: 'Edge %',
    expectedPayout: 'Win Profit',
    expectedLoss: 'Loss',
    statusPositive: 'Positive EV (+EV)',
    statusNegative: 'Negative EV (-EV)',
    statusNeutral: 'Break-even (0 EV)',
    statusPositiveHint: 'This looks like a value bet because your win estimate is higher than the win rate needed to break even.',
    statusNegativeHint: 'This likely is not a value bet because your win estimate is lower than the win rate needed to break even.',
    statusNeutralHint: 'This is close to a fair price, so there is no clear advantage either way.',
    reset: 'Reset',
    resetAria: 'Reset +EV calculator values',
    shareLabel: 'expected value bet',
    howToTitle: 'How to Use This +EV Calculator',
    howToBody:
      'Set your stake, enter the market odds in any format, and input your projected win probability. The tool then compares your projection against the break-even probability and computes expected value in dollars and percent.',
    relatedToolsTitle: 'Related Tools and Guides',
    relatedSingle: 'Single Bet Calculator',
    relatedParlay: 'Parlay Calculator',
    relatedOdds: 'Odds Converter',
    relatedGuides: 'Betting Guides',
    faqTitle: 'Expected Value FAQs',
    faq: evCalculatorSeo.en.faq,
  },
  es: {
    title: 'Calculadora +EV',
    subtitle: 'Ingresa tu monto, la cuota del mercado y tu mejor estimación para ver rápido si la apuesta vale la pena.',
    cardTitle: 'Entradas',
    betAmount: 'Monto de la Apuesta',
    betAmountAria: 'Monto de apuesta en dolares para calcular valor esperado',
    estimatedProbability: 'Tu Probabilidad Estimada de Acierto',
    estimatedProbabilityAria: 'Tu probabilidad estimada de acierto en porcentaje',
    estimatedProbabilityHint: 'Usa tu propia estimación de acierto (tu mejor cálculo), no la probabilidad de la casa.',
    results: 'Resultados de Valor Esperado',
    evAmount: 'Valor Esperado',
    evPercent: 'EV %',
    breakEven: 'Equilibrio',
    edge: 'Edge %',
    expectedPayout: 'Ganancia',
    expectedLoss: 'Perdida',
    statusPositive: 'Valor positivo (+EV)',
    statusNegative: 'Valor negativo (-EV)',
    statusNeutral: 'En equilibrio (0 EV)',
    statusPositiveHint: 'Esta parece una apuesta con valor porque tu estimación de acierto es mayor que la necesaria para quedar en equilibrio.',
    statusNegativeHint: 'Probablemente no es una apuesta con valor porque tu estimación de acierto es menor que la necesaria para quedar en equilibrio.',
    statusNeutralHint: 'Esta cuota está cerca de un precio justo, así que no hay una ventaja clara.',
    reset: 'Reiniciar',
    resetAria: 'Restablecer valores de la calculadora +EV',
    shareLabel: 'apuesta con valor esperado',
    howToTitle: 'Como usar esta calculadora +EV',
    howToBody:
      'Define tu monto, ingresa la cuota del mercado en cualquier formato y agrega tu probabilidad proyectada. La herramienta compara tu estimacion con la probabilidad de equilibrio y calcula valor esperado en dolares y porcentaje.',
    relatedToolsTitle: 'Herramientas y guias relacionadas',
    relatedSingle: 'Calculadora de Apuesta Simple',
    relatedParlay: 'Calculadora Parlay',
    relatedOdds: 'Conversor de Cuotas',
    relatedGuides: 'Guias de Apuestas',
    faqTitle: 'Preguntas frecuentes de valor esperado',
    faq: evCalculatorSeo.es.faq,
  },
};