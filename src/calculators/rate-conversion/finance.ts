import {
  annualToDailyBusiness,
  annualToMonthly,
  dailyBusinessToAnnual,
  monthlyToAnnual,
} from "../../shared/utils/finance-math";

export type RateUnit = "daily" | "monthly" | "annual" | "pctCdi";

export interface RateConversionInput {
  rate: number; // user-entered value, percentage (or % of CDI when unit = pctCdi)
  unit: RateUnit;
  cdiAnnual: number; // CDI as a yearly decimal (0.1075 = 10.75% a.a.)
}

export interface RateConversionResult {
  daily: number; // decimals (e.g. 0.0004)
  monthly: number;
  annual: number;
  pctOfCdi: number; // e.g. 1.0 = 100% of CDI; only finite when cdiAnnual > 0
}

export function convertRate(input: RateConversionInput): RateConversionResult {
  const { rate, unit, cdiAnnual } = input;
  const value = rate / 100;

  let annual: number;
  switch (unit) {
    case "daily":
      annual = dailyBusinessToAnnual(value);
      break;
    case "monthly":
      annual = monthlyToAnnual(value);
      break;
    case "annual":
      annual = value;
      break;
    case "pctCdi":
      // user enters e.g. 110 meaning 110% of CDI; treat the value as the
      // user-entered percentage already.
      annual = cdiAnnual * (rate / 100);
      break;
  }

  const monthly = annualToMonthly(annual);
  const daily = annualToDailyBusiness(annual);
  const pctOfCdi = cdiAnnual > 0 ? annual / cdiAnnual : Number.NaN;

  return { daily, monthly, annual, pctOfCdi };
}
