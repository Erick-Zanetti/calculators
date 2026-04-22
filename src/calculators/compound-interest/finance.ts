export type RatePeriod = "monthly" | "yearly";
export type TimeUnit = "months" | "years";

export interface CalcInput {
  initial: number;
  monthly: number;
  rate: number;           // percentage, e.g. 1 for 1%
  ratePeriod: RatePeriod;
  period: number;
  timeUnit: TimeUnit;
  inflationAnnual?: number | null; // percentage, e.g. 4 for 4% a.a.
}

export interface MonthRow {
  month: number;
  year: number;
  contribution: number;
  invested: number;          // cumulative invested (initial + contributions so far)
  interestMonth: number;
  interestTotal: number;
  balance: number;           // nominal future value
  realBalance: number;       // balance discounted by accumulated inflation
}

export interface CalcResult {
  months: number;
  monthlyRate: number;
  monthlyInflation: number;
  invested: number;
  interestTotal: number;
  finalBalance: number;
  finalRealBalance: number;
  rows: MonthRow[];
  hasInflation: boolean;
}

export function monthsFromInput(period: number, unit: TimeUnit): number {
  return unit === "years" ? Math.round(period * 12) : Math.round(period);
}

export function monthlyRateFrom(rate: number, period: RatePeriod): number {
  const r = rate / 100;
  if (period === "monthly") return r;
  // Convert annual effective rate to equivalent monthly rate
  return Math.pow(1 + r, 1 / 12) - 1;
}

export function monthlyInflationFromAnnual(annualPct: number): number {
  const f = annualPct / 100;
  return Math.pow(1 + f, 1 / 12) - 1;
}

export function calculate(input: CalcInput): CalcResult {
  const months = monthsFromInput(input.period, input.timeUnit);
  const i = monthlyRateFrom(input.rate, input.ratePeriod);
  const hasInflation = input.inflationAnnual != null && input.inflationAnnual > 0;
  const f = hasInflation ? monthlyInflationFromAnnual(input.inflationAnnual!) : 0;

  const rows: MonthRow[] = [];

  let balance = input.initial;
  let invested = input.initial;
  let interestTotal = 0;

  for (let m = 1; m <= months; m++) {
    const interestMonth = balance * i;
    balance = balance + interestMonth + input.monthly;
    interestTotal += interestMonth;
    invested += input.monthly;

    const realBalance = hasInflation ? balance / Math.pow(1 + f, m) : balance;

    rows.push({
      month: m,
      year: Math.ceil(m / 12),
      contribution: input.monthly,
      invested,
      interestMonth,
      interestTotal,
      balance,
      realBalance,
    });
  }

  const finalBalance = months === 0 ? input.initial : rows[rows.length - 1].balance;
  const finalRealBalance = months === 0
    ? input.initial
    : rows[rows.length - 1].realBalance;

  return {
    months,
    monthlyRate: i,
    monthlyInflation: f,
    invested: months === 0 ? input.initial : rows[rows.length - 1].invested,
    interestTotal,
    finalBalance,
    finalRealBalance,
    rows,
    hasInflation,
  };
}

export function formatMoney(value: number, locale: string = "pt-BR"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPct(value: number, locale: string = "pt-BR", digits = 2): string {
  return `${(value * 100).toLocaleString(locale, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })}%`;
}
