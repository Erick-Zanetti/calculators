import {
  annualToMonthly,
  monthsToReach,
} from "../../shared/utils/finance-math";

export interface FireInput {
  annualExpenses: number;
  withdrawalRatePct: number; // e.g. 4 for 4%
  currentPortfolio: number;
  monthlySavings: number;
  realReturnAnnualPct: number; // e.g. 5 for 5% a.a. real
}

export interface FireResult {
  fireNumber: number;
  yearsToFire: number;
  monthsToFire: number;
  monthlyPassive: number;
  alreadyFire: boolean;
}

export function calculateFire(input: FireInput): FireResult {
  const swr = input.withdrawalRatePct / 100;
  const fireNumber = swr > 0 ? input.annualExpenses / swr : Infinity;
  const monthlyRealRate = annualToMonthly(input.realReturnAnnualPct / 100);
  const months = monthsToReach(
    input.currentPortfolio,
    input.monthlySavings,
    monthlyRealRate,
    fireNumber,
  );
  const alreadyFire = input.currentPortfolio >= fireNumber;

  return {
    fireNumber,
    monthsToFire: months,
    yearsToFire: months / 12,
    monthlyPassive: (fireNumber * swr) / 12,
    alreadyFire,
  };
}
