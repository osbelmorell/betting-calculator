import type { Locale } from '../i18n';

type FaqItem = {
  question: string;
  answer: string;
};

type OddsConverterCopy = {
  title: string;
  subtitle: string;
  quickStartTitle: string;
  quickStartSteps: ReadonlyArray<string>;
  converterCardTitle: string;
  autoUpdateHint: string;
  howItWorksTitle: string;
  howItWorksBody: string;
  formatsTitle: string;
  formatsBody: string;
  tableTitle: string;
  tableColumns: {
    american: string;
    decimal: string;
    fractional: string;
    implied: string;
  };
  tableRows: ReadonlyArray<{
    american: string;
    decimal: string;
    fractional: string;
    implied: string;
  }>;
  relatedToolsTitle: string;
  relatedSingle: string;
  relatedParlay: string;
  relatedGuides: string;
  faqTitle: string;
  faq: ReadonlyArray<FaqItem>;
};

export const oddsConverterSeo: Record<Locale, { title: string; description: string; faq: ReadonlyArray<FaqItem> }> = {
  en: {
    title: 'Odds Converter | Free American, Decimal & Fractional Calculator',
    description:
      'Free odds converter for American, decimal, fractional, and implied probability. Convert betting odds instantly with examples and a quick reference table.',
    faq: [
      {
        question: 'How do you convert American odds to decimal odds?',
        answer:
          'For positive American odds, divide by 100 and add 1. For negative American odds, divide 100 by the absolute value and add 1. This converter does the math automatically.',
      },
      {
        question: 'What is implied probability in betting?',
        answer:
          'Implied probability is the percentage chance represented by betting odds. Lower decimal odds imply a higher probability, while higher odds imply a lower probability.',
      },
      {
        question: 'Can I convert fractional odds to American odds?',
        answer:
          'Yes. Enter fractional odds in the tool and it instantly converts to American, decimal, and implied probability formats.',
      },
    ],
  },
  es: {
    title: 'Conversor de Cuotas | Calculadora Gratis Americana, Decimal y Fraccional',
    description:
      'Conversor de cuotas gratis para formato americano, decimal, fraccional y probabilidad implícita. Convierte cuotas de apuestas al instante con ejemplos y tabla rápida.',
    faq: [
      {
        question: 'Como convertir cuotas americanas a decimales?',
        answer:
          'Para cuotas americanas positivas, divide entre 100 y suma 1. Para cuotas negativas, divide 100 entre el valor absoluto y suma 1. Esta herramienta lo calcula automáticamente.',
      },
      {
        question: 'Que es la probabilidad implícita en apuestas?',
        answer:
          'La probabilidad implícita es el porcentaje de probabilidad que representan las cuotas. Cuotas decimales bajas implican mayor probabilidad y cuotas altas implican menor probabilidad.',
      },
      {
        question: 'Puedo convertir cuotas fraccionales a americanas?',
        answer:
          'Si. Ingresa cuotas fraccionales y el conversor las transforma al instante a formato americano, decimal y probabilidad implícita.',
      },
    ],
  },
};

export const oddsConverterContent: Record<Locale, OddsConverterCopy> = {
  en: {
    title: 'Odds Converter',
    subtitle:
      'Convert American, decimal, fractional, and implied probability odds in real time with a free betting odds converter.',
    quickStartTitle: 'Quick start',
    quickStartSteps: [
      'Enter odds in one field',
      'Check converted values instantly',
      'Use related tools for payout and EV decisions',
    ],
    converterCardTitle: 'Convert Odds Instantly',
    autoUpdateHint: 'Type in any odds format. All other formats update automatically.',
    howItWorksTitle: 'How the Odds Converter Works',
    howItWorksBody:
      'Enter any odds format. The converter instantly shows all other formats, including implied win probability. Use it to compare lines and evaluate whether a price is worth betting.',
    formatsTitle: 'Supported Betting Odds Formats',
    formatsBody:
      'Supports American (moneyline), decimal, fractional, and implied probability. All formats sync as you type.',
    tableTitle: 'Popular Odds Conversion Table',
    tableColumns: {
      american: 'American',
      decimal: 'Decimal',
      fractional: 'Fractional',
      implied: 'Implied %',
    },
    tableRows: [
      { american: '-200', decimal: '1.50', fractional: '1/2', implied: '66.67%' },
      { american: '-110', decimal: '1.91', fractional: '10/11', implied: '52.38%' },
      { american: '+100', decimal: '2.00', fractional: '1/1', implied: '50.00%' },
      { american: '+150', decimal: '2.50', fractional: '3/2', implied: '40.00%' },
      { american: '+200', decimal: '3.00', fractional: '2/1', implied: '33.33%' },
    ],
    relatedToolsTitle: 'Related Betting Tools',
    relatedSingle: 'Single Bet Calculator',
    relatedParlay: 'Parlay Calculator',
    relatedGuides: 'Betting Guides',
    faqTitle: 'Odds Converter FAQs',
    faq: oddsConverterSeo.en.faq,
  },
  es: {
    title: 'Conversor de Cuotas',
    subtitle:
      'Convierte cuotas americanas, decimales, fraccionales y probabilidad implícita en tiempo real con este conversor de apuestas gratis.',
    quickStartTitle: 'Inicio rapido',
    quickStartSteps: [
      'Ingresa la cuota en un campo',
      'Revisa las conversiones al instante',
      'Usa herramientas relacionadas para payout y EV',
    ],
    converterCardTitle: 'Convierte Cuotas al Instante',
    autoUpdateHint: 'Escribe en cualquier formato de cuota. Los demas formatos se actualizan automaticamente.',
    howItWorksTitle: 'Como Funciona el Conversor de Cuotas',
    howItWorksBody:
      'Ingresa una cuota en cualquier formato. El conversor muestra de inmediato los otros formatos, incluyendo la probabilidad implícita. Úsalo para comparar líneas y evaluar si una cuota tiene valor.',
    formatsTitle: 'Formatos de Cuotas Compatibles',
    formatsBody:
      'Soporta cuotas americanas (moneyline), decimales, fraccionales y probabilidad implícita. Todos los formatos se sincronizan al escribir.',
    tableTitle: 'Tabla Rapida de Conversión de Cuotas',
    tableColumns: {
      american: 'Americana',
      decimal: 'Decimal',
      fractional: 'Fraccional',
      implied: 'Prob. %',
    },
    tableRows: [
      { american: '-200', decimal: '1.50', fractional: '1/2', implied: '66.67%' },
      { american: '-110', decimal: '1.91', fractional: '10/11', implied: '52.38%' },
      { american: '+100', decimal: '2.00', fractional: '1/1', implied: '50.00%' },
      { american: '+150', decimal: '2.50', fractional: '3/2', implied: '40.00%' },
      { american: '+200', decimal: '3.00', fractional: '2/1', implied: '33.33%' },
    ],
    relatedToolsTitle: 'Herramientas Relacionadas',
    relatedSingle: 'Calculadora de Apuesta Simple',
    relatedParlay: 'Calculadora de Parlay',
    relatedGuides: 'Guias de Apuestas',
    faqTitle: 'Preguntas Frecuentes del Conversor',
    faq: oddsConverterSeo.es.faq,
  },
};