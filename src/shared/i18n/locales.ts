export const SUPPORTED_LOCALES = ["en", "pt-BR"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  "pt-BR": "Português",
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  en: "🇺🇸",
  "pt-BR": "🇧🇷",
};

export type Translations = {
  appTitle: string;
  appTagline: string;
  moreComing: string;
  moreComingHint: string;
  menu: string;
  close: string;
  language: string;

  calc: {
    compoundInterest: {
      title: string;
      subtitle: string;
      description: string;
    };
  };

  form: {
    initialValue: string;
    monthlyContribution: string;
    interestRate: string;
    period: string;
    perMonth: string;
    perYear: string;
    months: string;
    years: string;
    equivalentMonthly: string;
    totalMonths: (n: number) => string;
    applyInflation: string;
    optional: string;
    annualInflation: string;
    inflationHint: string;
    inflationHintBold: string;
    reset: string;
    inflationActive: string;
    nominalOnly: string;
  };

  results: {
    invested: string;
    totalInterest: string;
    finalNominal: string;
    presentValue: string;
    presentValueSub: string;
  };

  chart: {
    title: string;
    totalBalance: string;
    invested: string;
    realValue: string;
    zeroPeriod: string;
    month: string;
    balance: string;
    investedShort: string;
    real: string;
  };

  table: {
    title: string;
    monthsCount: (n: number) => string;
    month: string;
    contribution: string;
    interestMonth: string;
    interestCum: string;
    invested: string;
    balance: string;
    realValue: string;
  };
};

const en: Translations = {
  appTitle: "Calculators",
  appTagline: "Financial tools hub",
  moreComing: "More calculators coming soon.",
  moreComingHint: "Register new ones in src/calculators/registry.ts.",
  menu: "Menu",
  close: "Close",
  language: "Language",

  calc: {
    compoundInterest: {
      title: "Compound Interest",
      subtitle: "With optional inflation adjustment",
      description:
        "Simulate the growth of an investment with monthly contributions and compound interest. Optionally apply inflation to see the present value.",
    },
  },

  form: {
    initialValue: "Initial value",
    monthlyContribution: "Monthly contribution",
    interestRate: "Interest rate",
    period: "Period",
    perMonth: "p.m.",
    perYear: "p.y.",
    months: "months",
    years: "years",
    equivalentMonthly: "Equivalent",
    totalMonths: (n) => `${n} months in total`,
    applyInflation: "Adjust for inflation",
    optional: "(optional)",
    annualInflation: "Annual inflation",
    inflationHint:
      "When inflation is enabled, we show the ",
    inflationHintBold:
      "present value — i.e. how much your final balance is worth today, after subtracting the purchasing power lost over time.",
    reset: "Reset",
    inflationActive: "Inflation active",
    nominalOnly: "Nominal calculation",
  },

  results: {
    invested: "Invested",
    totalInterest: "Total interest",
    finalNominal: "Final value (nominal)",
    presentValue: "Present value (real)",
    presentValueSub: "inflation-adjusted",
  },

  chart: {
    title: "Growth over time",
    totalBalance: "Total balance",
    invested: "Invested",
    realValue: "Real value",
    zeroPeriod: "Set a period greater than zero to see the chart.",
    month: "Month",
    balance: "Balance",
    investedShort: "Invested",
    real: "Real value",
  },

  table: {
    title: "Monthly breakdown",
    monthsCount: (n) => `${n} months`,
    month: "Month",
    contribution: "Contribution",
    interestMonth: "Monthly interest",
    interestCum: "Cum. interest",
    invested: "Invested",
    balance: "Balance",
    realValue: "Real value",
  },
};

const ptBR: Translations = {
  appTitle: "Calculadoras",
  appTagline: "Hub de ferramentas financeiras",
  moreComing: "Mais calculadoras em breve.",
  moreComingHint: "Registre novas em src/calculators/registry.ts.",
  menu: "Menu",
  close: "Fechar",
  language: "Idioma",

  calc: {
    compoundInterest: {
      title: "Juros Compostos",
      subtitle: "Com correção opcional pela inflação",
      description:
        "Simule o crescimento de um investimento com aportes mensais e juros compostos. Opcionalmente, aplique a inflação para ver o valor presente.",
    },
  },

  form: {
    initialValue: "Valor inicial",
    monthlyContribution: "Aporte mensal",
    interestRate: "Taxa de juros",
    period: "Período",
    perMonth: "a.m.",
    perYear: "a.a.",
    months: "meses",
    years: "anos",
    equivalentMonthly: "Equivalente",
    totalMonths: (n) => `Total de ${n} meses`,
    applyInflation: "Aplicar correção pela inflação",
    optional: "(opcional)",
    annualInflation: "Inflação anual",
    inflationHint: "Com a inflação ativada, mostramos o ",
    inflationHintBold:
      "valor presente — ou seja, quanto o seu saldo final vale hoje, descontando o poder de compra perdido ao longo do tempo.",
    reset: "Limpar",
    inflationActive: "Inflação ativa",
    nominalOnly: "Cálculo nominal",
  },

  results: {
    invested: "Valor investido",
    totalInterest: "Total em juros",
    finalNominal: "Valor final (nominal)",
    presentValue: "Valor presente (real)",
    presentValueSub: "descontando a inflação",
  },

  chart: {
    title: "Crescimento ao longo do tempo",
    totalBalance: "Saldo total",
    invested: "Investido",
    realValue: "Valor real",
    zeroPeriod: "Defina um período maior que zero para ver o gráfico.",
    month: "Mês",
    balance: "Saldo",
    investedShort: "Investido",
    real: "Valor real",
  },

  table: {
    title: "Detalhamento mês a mês",
    monthsCount: (n) => `${n} meses`,
    month: "Mês",
    contribution: "Aporte",
    interestMonth: "Juros do mês",
    interestCum: "Juros acum.",
    invested: "Investido",
    balance: "Saldo",
    realValue: "Valor real",
  },
};

export const translations: Record<Locale, Translations> = {
  en,
  "pt-BR": ptBR,
};
