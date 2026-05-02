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

interface CalcLabels {
  title: string;
  subtitle: string;
  description: string;
}

export type Translations = {
  appTitle: string;
  appTagline: string;
  moreComing: string;
  moreComingHint: string;
  menu: string;
  close: string;
  language: string;

  common: {
    amount: string;
    period: string;
    months: string;
    years: string;
    perMonth: string;
    perYear: string;
    perDay: string;
    annualRate: string;
    monthlyRate: string;
    expectedRate: string;
    reset: string;
    loading: string;
    apiError: string;
    apiErrorHint: string;
    fromBcb: string;
    estimated: string;
    notReached: string;
    today: string;
  };

  calc: {
    compoundInterest: CalcLabels;
    rateConversion: CalcLabels & {
      inputRate: string;
      inputUnit: string;
      cdiReference: string;
      cdiReferenceHint: string;
      results: string;
      effectiveDaily: string;
      effectiveMonthly: string;
      effectiveAnnual: string;
      pctOfCdi: string;
      unitDaily: string;
      unitMonthly: string;
      unitAnnual: string;
      unitPctCdi: string;
    };
    inflation: CalcLabels & {
      startMonth: string;
      endMonth: string;
      indexLabel: string;
      adjustedValue: string;
      accumulatedInflation: string;
      purchasingPowerLost: string;
      monthsCovered: (n: number) => string;
      rangeError: string;
      missingData: string;
    };
    goalSavings: CalcLabels & {
      goal: string;
      currentAmount: string;
      monthlyNeeded: string;
      totalContributed: string;
      totalInterest: string;
      goalCovered: string;
      alreadyAtGoal: string;
    };
    emergencyReserve: CalcLabels & {
      monthlyExpenses: string;
      coverageMonths: string;
      monthlySavings: string;
      currentReserve: string;
      targetReserve: string;
      timeToReach: string;
      timeToReachValue: (m: number) => string;
      allocationTitle: string;
      allocationHint: string;
      allocLiquid: string;
      allocLiquidHint: string;
      allocBuffer: string;
      allocBufferHint: string;
    };
    fire: CalcLabels & {
      annualExpenses: string;
      withdrawalRate: string;
      withdrawalRateHint: string;
      currentPortfolio: string;
      monthlySavings: string;
      realReturn: string;
      realReturnHint: string;
      fireNumber: string;
      yearsToFire: string;
      yearsToFireValue: (y: number) => string;
      monthlyPassive: string;
      alreadyFire: string;
    };
    earlyPayoff: CalcLabels & {
      outstandingBalance: string;
      remainingMonths: string;
      monthlyRate: string;
      extraPayment: string;
      modeLabel: string;
      modeReduceTerm: string;
      modeReducePayment: string;
      original: string;
      withExtra: string;
      installment: string;
      remainingTerm: string;
      totalInterest: string;
      interestSaved: string;
      monthsSaved: string;
      noBenefit: string;
    };
    tesouroDireto: CalcLabels & {
      amount: string;
      term: string;
      selicAnnual: string;
      selicSpread: string;
      selicSpreadHint: string;
      ipcaAnnual: string;
      ipcaSpread: string;
      ipcaSpreadHint: string;
      prefixedAnnual: string;
      custodyFee: string;
      custodyFeeHint: string;
      tableTitle: string;
      colTitle: string;
      colGross: string;
      colTax: string;
      colCustody: string;
      colNet: string;
      titleSelic: string;
      titleIpca: string;
      titlePrefixed: string;
      taxRateLabel: (pct: string) => string;
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
    inflateContributions: string;
    inflateContributionsHint: string;
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

  common: {
    amount: "Amount",
    period: "Period",
    months: "months",
    years: "years",
    perMonth: "p.m.",
    perYear: "p.y.",
    perDay: "p.d.",
    annualRate: "Annual rate",
    monthlyRate: "Monthly rate",
    expectedRate: "Expected rate",
    reset: "Reset",
    loading: "Loading…",
    apiError: "Could not reach the BCB API",
    apiErrorHint: "Using the editable default below — feel free to override.",
    fromBcb: "from BCB",
    estimated: "estimated",
    notReached: "Goal not reached",
    today: "today",
  },

  calc: {
    compoundInterest: {
      title: "Compound Interest",
      subtitle: "With optional inflation adjustment",
      description:
        "Simulate the growth of an investment with monthly contributions and compound interest. Optionally apply inflation to see the present value.",
    },
    rateConversion: {
      title: "Rate Conversion",
      subtitle: "CDI ↔ % CDI ↔ p.m. ↔ p.y.",
      description:
        "Convert between business-day, monthly and annual rates, and translate any rate into a percentage of the CDI benchmark.",
      inputRate: "Input rate",
      inputUnit: "Unit",
      cdiReference: "CDI reference",
      cdiReferenceHint:
        "Used to compute the equivalent in % of CDI. Defaults to the latest BCB Selic meta.",
      results: "Equivalents",
      effectiveDaily: "Effective daily (252 b.d.)",
      effectiveMonthly: "Effective monthly",
      effectiveAnnual: "Effective annual",
      pctOfCdi: "% of CDI",
      unitDaily: "p.d. (252)",
      unitMonthly: "p.m.",
      unitAnnual: "p.y.",
      unitPctCdi: "% CDI",
    },
    inflation: {
      title: "Inflation / Purchasing Power",
      subtitle: "Adjust an amount by IPCA between two dates",
      description:
        "Pulls the IPCA monthly series from the Brazilian Central Bank and tells you how much purchasing power was lost between two months.",
      startMonth: "Start month",
      endMonth: "End month",
      indexLabel: "Index",
      adjustedValue: "Adjusted value",
      accumulatedInflation: "Accumulated inflation",
      purchasingPowerLost: "Purchasing power lost",
      monthsCovered: (n) => `${n} months covered`,
      rangeError: "End month must be after start month.",
      missingData: "No IPCA data available for that range yet.",
    },
    goalSavings: {
      title: "Savings Goal",
      subtitle: "Monthly contribution to reach a target",
      description:
        "Tells you how much you need to save every month to reach a target amount over a given horizon, given an expected return.",
      goal: "Goal amount",
      currentAmount: "Current amount",
      monthlyNeeded: "Monthly contribution",
      totalContributed: "Total to be contributed",
      totalInterest: "Interest earned",
      goalCovered: "Goal covered by current amount",
      alreadyAtGoal: "Your current amount already meets or exceeds the goal.",
    },
    emergencyReserve: {
      title: "Emergency Reserve",
      subtitle: "How much to set aside, and where",
      description:
        "Suggests a target reserve based on your monthly expenses and coverage horizon, and shows how long it would take to build it.",
      monthlyExpenses: "Monthly expenses",
      coverageMonths: "Months of coverage",
      monthlySavings: "Monthly savings",
      currentReserve: "Current reserve",
      targetReserve: "Target reserve",
      timeToReach: "Time to reach the target",
      timeToReachValue: (m) =>
        m < 1 ? "less than 1 month" : `${Math.ceil(m)} months`,
      allocationTitle: "Suggested allocation",
      allocationHint:
        "Liquidity and capital preservation matter more than yield for this money.",
      allocLiquid: "Daily-liquidity (Tesouro Selic / CDB ≥100% CDI)",
      allocLiquidHint: "Most of the reserve, redeemable on the same day.",
      allocBuffer: "Buffer in checking / savings",
      allocBufferHint: "Around 1 month of expenses for instant access.",
    },
    fire: {
      title: "Financial Independence (FIRE)",
      subtitle: "Target portfolio by the 4% rule",
      description:
        "Computes your FIRE number using the safe-withdrawal rule and projects how long it takes to reach it given current savings.",
      annualExpenses: "Annual expenses",
      withdrawalRate: "Safe withdrawal rate",
      withdrawalRateHint: "The classic Trinity-study figure is 4% per year.",
      currentPortfolio: "Current portfolio",
      monthlySavings: "Monthly savings",
      realReturn: "Expected real return",
      realReturnHint: "Net of inflation, e.g. 4% to 6% p.y.",
      fireNumber: "FIRE number",
      yearsToFire: "Time to reach FIRE",
      yearsToFireValue: (y) => `${y.toFixed(1)} years`,
      monthlyPassive: "Monthly passive income at FIRE",
      alreadyFire: "Your portfolio already covers the FIRE target.",
    },
    earlyPayoff: {
      title: "Early Loan Payoff",
      subtitle: "Is it worth amortising extra?",
      description:
        "Compares your current loan with the same loan after a one-time extra payment. Choose between cutting the term or cutting the installment.",
      outstandingBalance: "Outstanding balance",
      remainingMonths: "Remaining months",
      monthlyRate: "Monthly interest rate",
      extraPayment: "Extra payment",
      modeLabel: "Mode",
      modeReduceTerm: "Cut term",
      modeReducePayment: "Cut installment",
      original: "Without extra payment",
      withExtra: "With extra payment",
      installment: "Installment",
      remainingTerm: "Remaining term",
      totalInterest: "Total interest",
      interestSaved: "Interest saved",
      monthsSaved: "Months saved",
      noBenefit: "Extra payment does not change the schedule.",
    },
    tesouroDireto: {
      title: "Tesouro Direto",
      subtitle: "Selic vs IPCA+ vs Prefixado at maturity",
      description:
        "Compares the net value at maturity of the three Tesouro Direto bond families, applying regressive income tax and the 0.20% p.y. custody fee.",
      amount: "Investment amount",
      term: "Term",
      selicAnnual: "Selic rate",
      selicSpread: "Tesouro Selic spread",
      selicSpreadHint: "Usually around 0% (auctions sometimes price ±).",
      ipcaAnnual: "Expected IPCA",
      ipcaSpread: "IPCA+ real spread",
      ipcaSpreadHint: "The 'real' coupon offered above IPCA.",
      prefixedAnnual: "Prefixado rate",
      custodyFee: "Custody fee (B3)",
      custodyFeeHint: "Charged on the average position, 0.20% p.y. by default.",
      tableTitle: "Comparison at maturity",
      colTitle: "Bond",
      colGross: "Gross",
      colTax: "Income tax",
      colCustody: "Custody",
      colNet: "Net",
      titleSelic: "Tesouro Selic",
      titleIpca: "Tesouro IPCA+",
      titlePrefixed: "Tesouro Prefixado",
      taxRateLabel: (pct) => `Tax bracket: ${pct}`,
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
    inflateContributions: "Grow contribution with inflation",
    inflateContributionsHint:
      "Each monthly contribution keeps the same real purchasing power. With this on, 12% nominal + 5% inflation behaves like a flat 6.67% real rate.",
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

  common: {
    amount: "Valor",
    period: "Período",
    months: "meses",
    years: "anos",
    perMonth: "a.m.",
    perYear: "a.a.",
    perDay: "a.d.",
    annualRate: "Taxa anual",
    monthlyRate: "Taxa mensal",
    expectedRate: "Taxa esperada",
    reset: "Limpar",
    loading: "Carregando…",
    apiError: "Não foi possível acessar a API do BCB",
    apiErrorHint: "Usando o valor padrão abaixo — você pode editar.",
    fromBcb: "via BCB",
    estimated: "estimado",
    notReached: "Meta não alcançada",
    today: "hoje",
  },

  calc: {
    compoundInterest: {
      title: "Juros Compostos",
      subtitle: "Com correção opcional pela inflação",
      description:
        "Simule o crescimento de um investimento com aportes mensais e juros compostos. Opcionalmente, aplique a inflação para ver o valor presente.",
    },
    rateConversion: {
      title: "Conversão de Taxas",
      subtitle: "CDI ↔ % CDI ↔ a.m. ↔ a.a.",
      description:
        "Converta entre taxas diárias, mensais e anuais, e descubra a equivalência em % do CDI.",
      inputRate: "Taxa de entrada",
      inputUnit: "Unidade",
      cdiReference: "CDI de referência",
      cdiReferenceHint:
        "Usado para calcular o equivalente em % do CDI. Padrão: última Selic meta do BCB.",
      results: "Equivalentes",
      effectiveDaily: "Efetiva diária (252 d.u.)",
      effectiveMonthly: "Efetiva mensal",
      effectiveAnnual: "Efetiva anual",
      pctOfCdi: "% do CDI",
      unitDaily: "a.d. (252)",
      unitMonthly: "a.m.",
      unitAnnual: "a.a.",
      unitPctCdi: "% CDI",
    },
    inflation: {
      title: "Inflação / Poder de Compra",
      subtitle: "Corrige um valor pelo IPCA entre duas datas",
      description:
        "Busca a série mensal do IPCA no Banco Central e mostra quanto o seu dinheiro perdeu de poder de compra entre dois meses.",
      startMonth: "Mês inicial",
      endMonth: "Mês final",
      indexLabel: "Índice",
      adjustedValue: "Valor corrigido",
      accumulatedInflation: "Inflação acumulada",
      purchasingPowerLost: "Poder de compra perdido",
      monthsCovered: (n) => `${n} meses considerados`,
      rangeError: "O mês final precisa ser posterior ao inicial.",
      missingData: "Ainda não há dados de IPCA para esse intervalo.",
    },
    goalSavings: {
      title: "Aporte para Meta",
      subtitle: "Quanto poupar por mês para atingir um valor",
      description:
        "Calcula o aporte mensal necessário para alcançar uma meta financeira em um prazo definido, considerando o rendimento esperado.",
      goal: "Meta",
      currentAmount: "Valor atual",
      monthlyNeeded: "Aporte mensal necessário",
      totalContributed: "Total a aportar",
      totalInterest: "Juros acumulados",
      goalCovered: "Meta coberta pelo valor atual",
      alreadyAtGoal: "Seu valor atual já alcança ou supera a meta.",
    },
    emergencyReserve: {
      title: "Reserva de Emergência",
      subtitle: "Quanto guardar e onde alocar",
      description:
        "Sugere o tamanho ideal da sua reserva com base nas despesas mensais e mostra em quanto tempo você consegue formá-la.",
      monthlyExpenses: "Despesas mensais",
      coverageMonths: "Meses de cobertura",
      monthlySavings: "Aporte mensal",
      currentReserve: "Reserva atual",
      targetReserve: "Reserva alvo",
      timeToReach: "Tempo para alcançar a reserva",
      timeToReachValue: (m) =>
        m < 1 ? "menos de 1 mês" : `${Math.ceil(m)} meses`,
      allocationTitle: "Alocação sugerida",
      allocationHint:
        "Para esse dinheiro, liquidez e segurança importam mais do que rentabilidade.",
      allocLiquid: "Liquidez diária (Tesouro Selic / CDB ≥100% do CDI)",
      allocLiquidHint: "Maior parte da reserva, com resgate no mesmo dia.",
      allocBuffer: "Folga em conta / poupança",
      allocBufferHint: "Cerca de 1 mês de despesas para acesso imediato.",
    },
    fire: {
      title: "Independência Financeira (FIRE)",
      subtitle: "Patrimônio-alvo pela regra dos 4%",
      description:
        "Calcula o seu número FIRE pela regra dos 4% e projeta em quanto tempo você o atinge com seus aportes atuais.",
      annualExpenses: "Despesas anuais",
      withdrawalRate: "Taxa segura de retirada",
      withdrawalRateHint: "O número clássico do estudo Trinity é 4% ao ano.",
      currentPortfolio: "Patrimônio atual",
      monthlySavings: "Aporte mensal",
      realReturn: "Retorno real esperado",
      realReturnHint: "Já descontada a inflação, ex.: 4% a 6% a.a.",
      fireNumber: "Número FIRE",
      yearsToFire: "Tempo para alcançar o FIRE",
      yearsToFireValue: (y) => `${y.toFixed(1)} anos`,
      monthlyPassive: "Renda passiva mensal no FIRE",
      alreadyFire: "Seu patrimônio já cobre o alvo FIRE.",
    },
    earlyPayoff: {
      title: "Antecipação de Parcelas",
      subtitle: "Vale a pena amortizar?",
      description:
        "Compara o seu financiamento original com o cenário após uma amortização extra. Escolha entre reduzir o prazo ou a parcela.",
      outstandingBalance: "Saldo devedor",
      remainingMonths: "Parcelas restantes",
      monthlyRate: "Taxa mensal",
      extraPayment: "Valor da amortização",
      modeLabel: "Modo",
      modeReduceTerm: "Reduzir prazo",
      modeReducePayment: "Reduzir parcela",
      original: "Sem amortizar",
      withExtra: "Com amortização",
      installment: "Parcela",
      remainingTerm: "Prazo restante",
      totalInterest: "Total de juros",
      interestSaved: "Juros economizados",
      monthsSaved: "Parcelas a menos",
      noBenefit: "A amortização não muda o cronograma atual.",
    },
    tesouroDireto: {
      title: "Tesouro Direto",
      subtitle: "Selic vs IPCA+ vs Prefixado no vencimento",
      description:
        "Compara o valor líquido no vencimento dos três tipos de Tesouro Direto, considerando a tabela regressiva de IR e a taxa de custódia de 0,20% a.a.",
      amount: "Valor aplicado",
      term: "Prazo",
      selicAnnual: "Selic",
      selicSpread: "Spread Tesouro Selic",
      selicSpreadHint: "Geralmente próximo de 0% (leilões variam ±).",
      ipcaAnnual: "IPCA esperado",
      ipcaSpread: "Cupom real do IPCA+",
      ipcaSpreadHint: "É o juro 'real' que vem somado ao IPCA.",
      prefixedAnnual: "Taxa do Prefixado",
      custodyFee: "Taxa de custódia (B3)",
      custodyFeeHint: "Cobrada sobre a posição média, padrão 0,20% a.a.",
      tableTitle: "Comparação no vencimento",
      colTitle: "Título",
      colGross: "Bruto",
      colTax: "IR",
      colCustody: "Custódia",
      colNet: "Líquido",
      titleSelic: "Tesouro Selic",
      titleIpca: "Tesouro IPCA+",
      titlePrefixed: "Tesouro Prefixado",
      taxRateLabel: (pct) => `Alíquota IR: ${pct}`,
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
    inflateContributions: "Corrigir aporte pela inflação",
    inflateContributionsHint:
      "Cada aporte mensal mantém o mesmo poder de compra de hoje. Com isso, 12% nominal + 5% de inflação equivale a uma taxa real de 6,67%.",
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
