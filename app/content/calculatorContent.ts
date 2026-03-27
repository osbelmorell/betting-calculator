import type { Locale } from '../i18n';

type TextPair = readonly [string, string];

type SeoFaqItem = {
  question: string;
  answer: string;
};

type SingleCalculatorUiCopy = {
  title: string;
  subtitle: string;
  cardTitle: string;
  betAmount: string;
  betAmountAria: string;
  results: string;
  winnings: string;
  payout: string;
  winPct: string;
  reset: string;
  resetAria: string;
  howToTitle: string;
  oddsFormatsTitle: string;
  faqTitle: string;
  shareLabel: string;
  howToIntro: string;
  howToSteps: readonly TextPair[];
  howToOutro: string;
  oddsIntro: string;
  oddsSections: readonly TextPair[];
  faqItems: readonly TextPair[];
};

type ParlayCalculatorUiCopy = {
  title: string;
  subtitle: string;
  cardTitle: string;
  betAmount: string;
  betAmountAria: string;
  legs: string;
  addLeg: string;
  addLegAria: string;
  remove: string;
  removeAria: string;
  label: string;
  projectedResults: string;
  combined: string;
  winnings: string;
  payout: string;
  winPct: string;
  reset: string;
  resetAria: string;
  leg: string;
  legListAria: string;
  howItWorks: string;
  buildParlay: string;
  faq: string;
  howItWorksIntro: string;
  howItWorksExample: string;
  howItWorksOutro: string;
  buildIntro: string;
  buildSteps: readonly TextPair[];
  faqItems: readonly TextPair[];
};

type SeoCopy = {
  title: string;
  description: string;
  faq: readonly SeoFaqItem[];
};

type SingleCalculatorContent = {
  ui: SingleCalculatorUiCopy;
  seo: SeoCopy;
};

type ParlayCalculatorContent = {
  ui: ParlayCalculatorUiCopy;
  seo: SeoCopy;
};

type ShareLinkButtonCopy = {
  copied: string;
  error: string;
  idle: string;
  button: string;
  buttonAria: string;
  copiedLive: string;
  failedLive: string;
};

type OddsFieldsFormatOptionCopy = {
  label: string;
  shortLabel: string;
  placeholder: string;
  suffix?: string;
};

type OddsFieldsCopy = {
  selector: string;
  enter: string;
  converted: string;
  switchInput: string;
  inputFields: string;
  oddsLabel: string;
  formats: {
    american: OddsFieldsFormatOptionCopy;
    decimal: OddsFieldsFormatOptionCopy;
    fractional: OddsFieldsFormatOptionCopy;
    implied: OddsFieldsFormatOptionCopy;
  };
};

type BetAmountSliderCopy = {
  quickPresets: string;
  setBetAmount: string;
  dollars: string;
  range: string;
  slider: string;
};

type GlobalCalcToggleCopy = {
  single: string;
  parlay: string;
  odds: string;
  guides: string;
  nav: string;
  calcType: string;
  language: string;
  localeNames: Record<Locale, string>;
};

export const singleCalculatorContent: Record<Locale, SingleCalculatorContent> = {
  en: {
    ui: {
      title: 'Single Bet Calculator',
      subtitle: 'Pick one odds format, enter once, and see every other format convert instantly.',
      cardTitle: 'Odds & Amount',
      betAmount: 'Bet Amount',
      betAmountAria: 'Single bet amount in dollars',
      results: 'Projected Results',
      winnings: 'Winnings',
      payout: 'Payout',
      winPct: 'Win %',
      reset: 'Reset',
      resetAria: 'Reset single bet calculator values',
      howToTitle: 'How to Use the Single Bet Calculator',
      oddsFormatsTitle: 'Understanding Betting Odds Formats',
      faqTitle: 'Frequently Asked Questions',
      shareLabel: 'single bet',
      howToIntro: 'Our single bet calculator makes it easy to calculate your potential winnings and payout instantly. Whether you are betting on moneyline, spread, or totals, follow these simple steps:',
      howToSteps: [
        ['Enter your bet amount', 'Type the amount you plan to wager in dollars'],
        ['Choose an odds format', 'Select from American, Decimal, Fractional, or Implied Probability'],
        ['Enter the odds', 'Input your odds in your chosen format'],
        ['View results instantly', 'See your potential winnings, total payout, and winning probability automatically'],
      ],
      howToOutro: 'The calculator automatically converts your odds to all other formats, so you can see the full picture no matter which format your sportsbook uses.',
      oddsIntro: 'Different sportsbooks and betting markets use different odds formats. Here is what each one means:',
      oddsSections: [
        ['American Odds (Moneyline)', 'Shows how much you need to bet to win $100 (negative odds) or how much $100 wins (positive odds). Example: -150 means bet $150 to win $100; +150 means $100 wins $150.'],
        ['Decimal Odds', 'Your total return for every $1 wagered, including your original stake. Example: 2.50 means a $100 bet returns $250 total ($150 profit).'],
        ['Fractional Odds', 'Common in UK and European betting. Shows profit relative to stake. Example: 5/2 means a $2 bet wins $5 profit, returning $7 total.'],
        ['Implied Probability', 'Expresses odds as a percentage likelihood of winning. Example: 52% implies you will win about half of comparable 52% probability bets over time.'],
      ],
      faqItems: [
        ['What is the difference between payout and winnings?', 'Winnings = profit only (original bet removed). Payout = total return including your original bet. If you bet $100 at 2.0 decimal odds: winnings = $100, payout = $200.'],
        ['What does +150 mean in American odds?', '+150 means if you bet $100, you win $150 profit (total payout $250). Positive American odds show how much profit $100 will make. The higher the number, the more likely the bookmaker thinks you will lose.'],
        ['How do I convert American odds to decimal?', 'For positive odds: (American ÷ 100) + 1. For negative odds: (100 ÷ |American|) + 1. Or just use this calculator, it converts instantly across all formats.'],
        ['What is implied probability?', 'Implied probability converts odds into the percentage chance the bookmaker thinks you have to win. A -110 American odds implies about 52.38% probability. It is what you should win if you bet the same odds repeatedly over time.'],
      ],
    },
    seo: {
      title: 'Single Bet Calculator | Free Odds Conversion Tool',
      description: 'Fast, free single bet calculator. Calculate payouts, winnings, and implied probability instantly. Convert between American, fractional, decimal, and percentage odds formats.',
      faq: [
        {
          question: 'How do I use the single bet calculator?',
          answer: 'Enter your bet amount and odds in any format (American, decimal, fractional, or implied probability). The calculator instantly converts all formats and shows your potential winnings and payout.',
        },
        {
          question: 'What is implied probability?',
          answer: 'Implied probability is the conversión of betting odds into a percentage representing the likelihood of an outcome. For example, -110 American odds implies approximately 52.38% probability.',
        },
        {
          question: 'How do I convert American odds to decimal?',
          answer: 'Positive American odds: (American odds / 100) + 1. Negative American odds: (100 / |American odds|) + 1. Or use this calculator to convert instantly.',
        },
      ],
    },
  },
  es: {
    ui: {
      title: 'Calculadora de Apuesta Simple',
      subtitle: 'Elige un formato de apuestas, introduce un valor y mira como se convierten las demás al instante.',
      cardTitle: 'Apuesta y Líneas',
      betAmount: 'Apuesta',
      betAmountAria: 'Monto de apuesta simple en dólares',
      results: 'Resultados Proyectados',
      winnings: 'Ganancias',
      payout: 'Pago Total',
      winPct: 'Prob. de acierto %',
      reset: 'Reiniciar',
      resetAria: 'Restablecer valores de la calculadora de apuesta simple',
      howToTitle: 'Cómo usar la calculadora de apuesta simple',
      oddsFormatsTitle: 'Entender los diferentes formatos de apuestas',
      faqTitle: 'Preguntas frecuentes',
      shareLabel: 'apuesta simple',
      howToIntro: 'Nuestra calculadora de apuesta simple te ayuda a calcular al instante tus ganancias potenciales y el pago total. Ya sea que apuestes moneyline, spread o totales, sigue estos pasos:',
      howToSteps: [
        ['Ingresa tu monto de apuesta', 'Escribe la cantidad que planeas apostar en dólares'],
        ['Elige un formato de apuestas', 'Selecciona entre línea americana, decimal, fraccional o probabilidad implícita'],
        ['Ingresa la línea', 'Escribe la línea en el formato que prefieras'],
        ['Mira los resultados al instante', 'Consulta automáticamente tus ganancias potenciales, pago total y probabilidad de acierto'],
      ],
      howToOutro: 'La calculadora convierte automáticamente tus líneas a los demás formatos para que veas el panorama completo sin importar el formato que use tu casa de apuestas.',
      oddsIntro: 'Guía sobre los precios de las apuestas: esto es lo que significa cada formato.',
      oddsSections: [
        ['Línea Americana (Moneyline)', 'Muestra cuanto debes apostar para ganar $100 cuando es negativa, o cuanto ganas con $100 cuando es positiva. Ejemplo: -150 significa apostar $150 para ganar $100; +150 significa que $100 ganan $150.'],
        ['Línea Decimal', 'Muestra el retorno total por cada $1 apostado, incluyendo tu apuesta original. Ejemplo: 2.50 significa que una apuesta de $100 devuelve $250 en total ($150 de ganancia).'],
        ['Línea Fraccional', 'Es común en Reino Unido y Europa. Muestra la ganancia en relación con el monto apostado. Ejemplo: 5/2 significa que una apuesta de $2 gana $5 y devuelve $7 en total.'],
        ['Probabilidad Implicita', 'Expresa la línea como una probabilidad de ganar en porcentaje. Ejemplo: 52% implica que ganarías aproximadamente la mitad de apuestas comparables a largo plazo.'],
      ],
      faqItems: [
        ['Cual es la diferencia entre pago total y ganancias?', 'Ganancias = solo beneficio neto (sin contar la apuesta original). Pago total = retorno completo incluyendo tu apuesta original. Si apuestas $100 a línea decimal 2.0: ganancias = $100 y pago total = $200.'],
        ['Que significa +150 en línea americana?', '+150 significa que si apuestas $100, ganas $150 de beneficio para un pago total de $250. Las líneas americanas positivas muestran cuanto beneficio genera una apuesta de $100. Mientras más alto el numero, menos probable considera la casa que ocurra el resultado.'],
        ['Cómo convierto línea americana a decimal?', 'Para líneas positivas: (Americana ÷ 100) + 1. Para líneas negativas: (100 ÷ |Americana|) + 1. O simplemente usa esta calculadora para convertir al instante entre todos los formatos.'],
        ['Que es la probabilidad implícita?', 'La probabilidad implícita convierte las líneas en el porcentaje de posibilidad de ganar que estima la casa de apuestas. Una línea americana -110 implica aproximadamente 52.38% de probabilidad. Es la frecuencia con la que deberías ganar si hicieras la misma apuesta muchas veces.'],
      ],
    },
    seo: {
      title: 'Calculadora de Apuesta Simple | Conversor de Líneas Gratis',
      description: 'Calculadora de apuesta simple rápida y gratis. Calcula pagos, ganancias y probabilidad implícita al instante. Convierte entre líneas americanas, fraccionales, decimales y probabilidad.',
      faq: [
        {
          question: 'Cómo uso la calculadora de apuesta simple?',
          answer: 'Ingresa el monto de tu apuesta y la línea en cualquier formato (americana, decimal, fraccional o probabilidad implícita). La calculadora convierte al instante todos los formatos y muestra tus ganancias y pago potencial.',
        },
        {
          question: 'Que es la probabilidad implícita?',
          answer: 'La probabilidad implícita es la conversión de las líneas a un porcentaje que representa la probabilidad de un resultado. Por ejemplo, líneas americanas -110 implican aproximadamente 52.38% de probabilidad.',
        },
        {
          question: 'Cómo convierto línea americana a decimal?',
          answer: 'Línea americana positiva: (línea americana / 100) + 1. Línea americana negativa: (100 / |línea americana|) + 1. O usa esta calculadora para convertir al instante.',
        },
      ],
    },
  },
};

export const parlayCalculatorContent: Record<Locale, ParlayCalculatorContent> = {
  en: {
    ui: {
      title: 'Parlay Calculator',
      subtitle: 'Build parlays fast: choose a format per leg, enter once, and get live combined payouts.',
      cardTitle: 'Bet & Legs',
      betAmount: 'Bet Amount',
      betAmountAria: 'Parlay bet amount in dollars',
      legs: 'Parlay Legs',
      addLeg: '+ Add Leg',
      addLegAria: 'Add a parlay leg',
      remove: 'Remove',
      removeAria: 'Remove',
      label: 'Label',
      projectedResults: 'Projected Results',
      combined: 'Combined',
      winnings: 'Winnings',
      payout: 'Payout',
      winPct: 'Win %',
      reset: 'Reset',
      resetAria: 'Reset parlay calculator values and legs',
      leg: 'Leg',
      legListAria: 'Parlay leg list',
      howItWorks: 'How Parlay Odds Work',
      buildParlay: 'How to Build a Parlay with This Calculator',
      faq: 'Parlay Betting FAQs',
      howItWorksIntro: 'A parlay combines multiple bets into one. All legs must win for the parlay to cash. The odds multiply together, meaning your potential payout grows exponentially, but so does the risk.',
      howItWorksExample: 'If you combine three legs with decimal odds of 2.0, 1.5, and 2.0, your combined decimal odds = 2.0 × 1.5 × 2.0 = 6.0. A $100 parlay wins $600 total ($500 profit).',
      howItWorksOutro: 'The key advantage of parlays is that one $100 bet can have the winning power of $600 (6x return). The key risk is that if any single leg loses, the entire parlay loses with no partial payouts.',
      buildIntro: 'Building a parlay is simple:',
      buildSteps: [
        ['Enter your parlay bet amount', 'Your total stake across all legs'],
        ['Add your first leg', 'Enter odds in any format and the calculator converts them automatically'],
        ['Click "+ Add Leg"', 'Keep adding as many legs as you want'],
        ['Watch the combined odds multiply', 'Each leg multiplies the last, growing your potential payout'],
        ['Remove any leg', 'If you change your mind, remove that leg as long as at least one remains'],
        ['View your combined payout', 'See what you could win if all legs hit'],
      ],
      faqItems: [
        ['What happens if one leg of my parlay loses?', 'The entire parlay loses. There are no partial payouts in traditional parlays. If you hit 5 out of 6 legs, you get nothing. This is why parlays are high-risk, high-reward bets.'],
        ['How many legs can I add to a parlay?', 'This calculator supports unlimited legs. Most sportsbooks limit parlays to 10 to 15 legs. The more legs you add, the lower your probability of cashing, but the higher your potential payout. A 10-leg parlay at 2.0 decimal odds would return 1024x your bet.'],
        ['What is the difference between a parlay and a round-robin?', 'A parlay combines all legs into one bet where everything depends on every leg winning. A round-robin automatically creates multiple smaller parlays from your legs, so you can cash even if some legs lose. This calculator focuses on single parlays.'],
        ['How do I calculate implied probability for a parlay?', 'Convert your combined decimal odds to implied probability using: (1 ÷ combined decimal) × 100. If your combined odds are 6.0, your implied winning probability is (1 ÷ 6.0) × 100 = 16.67%. This calculator shows this automatically.'],
        ['Can I share or save my parlay?', 'Yes. Click the share button to copy a shareable link with all your legs and odds encoded in the URL. You can send it to friends or save it for later. The calculator also saves your last parlay locally.'],
      ],
    },
    seo: {
      title: 'Parlay Calculator | Free Multi-Leg Betting Tool',
      description: 'Build and calculate parlays with unlimited legs. Convert each leg odds format, calculate combined odds, payouts, and winning probability. Free parlay betting calculator.',
      faq: [
        {
          question: 'How do parlay odds work?',
          answer: "Parlay odds multiply together. Each leg's decimal odds are multiplied by the next leg's odds to create the combined decimal odds. Your potential winnings multiply with each added leg.",
        },
        {
          question: 'What happens if one leg of my parlay loses?',
          answer: 'If any single leg loses, the entire parlay is lost and you forfeit your stake. This is why parlays carry higher risk but offer higher potential rewards.',
        },
        {
          question: 'How many legs can I add to a parlay?',
          answer: 'This calculator supports unlimited parlay legs. However, most sportsbooks limit parlays to 10-15 legs. The more legs you add, the harder it becomes to win, but the higher the potential payout.',
        },
      ],
    },
  },
  es: {
    ui: {
      title: 'Calculadora de Parlay',
      subtitle: 'Construye parlays rapido: elige un formato por pierna, ingresa una vez y obtienes pagos combinados al instante.',
      cardTitle: 'Apuesta y Piernas',
      betAmount: 'Monto de la Apuesta',
      betAmountAria: 'Monto de apuesta parlay en dólares',
      legs: 'Piernas del Parlay',
      addLeg: '+ Agregar pierna',
      addLegAria: 'Agregar una pierna al parlay',
      remove: 'Eliminar',
      removeAria: 'Eliminar',
      label: 'Etiqueta',
      projectedResults: 'Resultados Proyectados',
      combined: 'Combinada',
      winnings: 'Ganancias',
      payout: 'Pago Total',
      winPct: 'Prob. de acierto %',
      reset: 'Reiniciar',
      resetAria: 'Restablecer valores y piernas de la calculadora de parlay',
      leg: 'Pierna',
      legListAria: 'Lista de piernas del parlay',
      howItWorks: 'Cómo funcionan las líneas en un parlay',
      buildParlay: 'Cómo construir un parlay con esta calculadora',
      faq: 'Preguntas frecuentes sobre parlays',
      howItWorksIntro: 'Un parlay combina multiples apuestas en una sola. Todas las piernas deben acertarse para cobrar el parlay. Las líneas se multiplican entre si, por lo que el pago potencial crece mucho, pero tambien el riesgo.',
      howItWorksExample: 'Si combinas tres piernas con líneas decimales de 2.0, 1.5 y 2.0, la línea decimal combinada es 2.0 × 1.5 × 2.0 = 6.0. Un parlay de $100 devuelve $600 en total ($500 de ganancia).',
      howItWorksOutro: 'La principal ventaja del parlay es que una sola apuesta de $100 puede convertirse en $600 (retorno 6x). El principal riesgo es que, si una sola pierna pierde, se pierde todo el parlay sin pagos parciales.',
      buildIntro: 'Construir un parlay es sencillo:',
      buildSteps: [
        ['Ingresa el monto de tu parlay', 'Es tu monto total apostado para todas las piernas'],
        ['Agrega tu primera pierna', 'Ingresa la línea en cualquier formato y la calculadora la convierte automáticamente'],
        ['Haz clic en "+ Agregar pierna"', 'Sigue agregando todas las piernas que quieras'],
        ['Observa como se multiplican las líneas combinadas', 'Cada pierna multiplica la anterior y aumenta el pago potencial'],
        ['Elimina cualquier pierna', 'Si cambias de idea, puedes quitar esa pierna mientras quede al menos una'],
        ['Consulta tu pago combinado', 'Ve cuanto podrias ganar si todas las piernas aciertan'],
      ],
      faqItems: [
        ['Que pasa si una pierna de mi parlay pierde?', 'Se pierde todo el parlay. En los parlays tradicionales no hay pagos parciales. Si aciertas 5 de 6 piernas, no cobras nada. Por eso los parlays son apuestas de alto riesgo y alta recompensa.'],
        ['Cuantas piernas puedo agregar a un parlay?', 'Esta calculadora soporta piernas ilimitadas. La mayoria de las casas de apuestas limita los parlays entre 10 y 15 piernas. Cuantas más piernas agregues, menor sera tu probabilidad de cobrar, pero mayor sera el pago potencial. Un parlay de 10 piernas con línea decimal 2.0 devolveria 1024 veces tu apuesta.'],
        ['Cual es la diferencia entre un parlay y un round-robin?', 'Un parlay combina todas las piernas en una sola apuesta, donde todo o nada depende del resultado. Un round-robin crea automáticamente varios parlays más pequenos con tus piernas, por lo que puedes cobrar incluso si algunas fallan. Esta calculadora se enfoca en parlays simples.'],
        ['Cómo calculo la probabilidad implícita de un parlay?', 'Convierte la línea decimal combinada a probabilidad implícita con la formula: (1 ÷ línea decimal combinada) × 100. Si tu línea combinada es 6.0, la probabilidad implícita es (1 ÷ 6.0) × 100 = 16.67%. Esta calculadora lo muestra automáticamente.'],
        ['Puedo compartir o guardar mi parlay?', 'Si. Haz clic en el botón de compartir para copiar un enlace con todas tus piernas y líneas guardadas en la URL. Puedes enviarlo a otras personas o guardarlo para después. La calculadora tambien guarda tu ultimo parlay localmente.'],
      ],
    },
    seo: {
      title: 'Calculadora de Parlay | Herramienta Gratis de Apuestas Multiples',
      description: 'Crea y calcula parlays con piernas ilimitadas. Convierte el formato de apuesta de cada pierna, calcula líneas combinadas, pagos y probabilidad de acierto. Calculadora de parlay gratis.',
      faq: [
        {
          question: 'Cómo funcionan las líneas de un parlay?',
          answer: 'Las líneas del parlay se multiplican entre si. Las líneas decimales de cada pierna se multiplican para crear la línea decimal combinada. Tus ganancias potenciales crecen con cada pierna agregada.',
        },
        {
          question: 'Que pasa si una pierna de mi parlay pierde?',
          answer: 'Si una sola pierna pierde, se pierde todo el parlay y tu apuesta. Por eso los parlays tienen mayor riesgo, pero tambien mayor recompensa potencial.',
        },
        {
          question: 'Cuantas piernas puedo agregar a un parlay?',
          answer: 'Esta calculadora soporta piernas ilimitadas. Sin embargo, la mayoria de las casas de apuestas limita los parlays entre 10 y 15 piernas. Cuantas más piernas agregues, más difícil es acertar, pero mayor el pago potencial.',
        },
      ],
    },
  },
};

export const shareLinkButtonContent: Record<Locale, ShareLinkButtonCopy> = {
  en: {
    copied: 'Shareable link copied to your clipboard.',
    error: 'Could not copy the link. Copy the page URL from your browser instead.',
    idle: 'Copy a link that opens this calculator with your current values.',
    button: 'Copy Shareable Link',
    buttonAria: 'Copy a shareable link with the current calculator values',
    copiedLive: 'Share link copied.',
    failedLive: 'Share link copy failed.',
  },
  es: {
    copied: 'Enlace para compartir copiado al portapapeles.',
    error: 'No se pudo copiar el enlace. Copia la URL de la pagina desde tu navegador.',
    idle: 'Copia un enlace que abre esta calculadora con tus valores actuales.',
    button: 'Copiar enlace para compartir',
    buttonAria: 'Copiar un enlace para compartir con los valores actuales de la calculadora',
    copiedLive: 'Enlace para compartir copiado.',
    failedLive: 'Fallo al copiar el enlace para compartir.',
  },
};

export const oddsFieldsContent: Record<Locale, OddsFieldsCopy> = {
  en: {
    selector: 'odds format selector',
    enter: 'Enter',
    converted: 'Converted',
    switchInput: 'Switch active odds input to',
    inputFields: 'input fields',
    oddsLabel: 'odds',
    formats: {
      american: { label: 'American', shortLabel: 'US', placeholder: '-110' },
      decimal: { label: 'Decimal', shortLabel: 'Dec', placeholder: '1.909' },
      fractional: { label: 'Fractional', shortLabel: 'Frac', placeholder: '10/11' },
      implied: { label: 'Probability', shortLabel: 'Prob', placeholder: '52.38', suffix: '%' },
    },
  },
  es: {
    selector: 'selector de formato de apuestas',
    enter: 'Ingresa',
    converted: 'Líneas convertidas',
    switchInput: 'Cambiar campo de línea a',
    inputFields: 'campos de entrada',
    oddsLabel: 'líneas',
    formats: {
      american: { label: 'línea americana', shortLabel: 'US', placeholder: '-110' },
      decimal: { label: 'línea decimal', shortLabel: 'Dec', placeholder: '1.909' },
      fractional: { label: 'línea fraccional', shortLabel: 'Frac', placeholder: '10/11' },
      implied: { label: 'probabilidad', shortLabel: 'Prob', placeholder: '52.38', suffix: '%' },
    },
  },
};

export const betAmountSliderContent: Record<Locale, BetAmountSliderCopy> = {
  en: {
    quickPresets: 'Quick bet amount presets',
    setBetAmount: 'Set bet amount to',
    dollars: 'dollars',
    range: 'Range',
    slider: 'Bet amount slider',
  },
  es: {
    quickPresets: 'Montos rapidos de apuesta',
    setBetAmount: 'Fijar monto de apuesta en',
    dollars: 'dólares',
    range: 'Rango',
    slider: 'Control deslizante del monto de apuesta',
  },
};

export const globalCalcToggleContent: Record<Locale, GlobalCalcToggleCopy> = {
  en: {
    single: 'Single',
    parlay: 'Parlay',
    odds: 'Odds',
    guides: 'Guides',
    nav: 'Calculator navigation',
    calcType: 'Site section',
    language: 'Language',
    localeNames: {
      en: 'English',
      es: 'Spanish',
    },
  },
  es: {
    single: 'Simple',
    parlay: 'Parlay',
    odds: 'Líneas',
    guides: 'Guías',
    nav: 'Navegación de calculadora',
    calcType: 'Sección del sitio',
    language: 'Idioma',
    localeNames: {
      en: 'Inglés',
      es: 'Español',
    },
  },
};
