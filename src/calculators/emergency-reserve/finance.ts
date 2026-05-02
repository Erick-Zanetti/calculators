import {
  annualToMonthly,
  monthsToReach,
} from "../../shared/utils/finance-math";

export interface EmergencyReserveInput {
  monthlyExpenses: number;
  coverageMonths: number;
  currentReserve: number;
  monthlySavings: number;
  expectedAnnualReturn: number; // %
}

export interface EmergencyReserveResult {
  target: number;
  monthsToReach: number;
  alreadyCovered: boolean;
  allocLiquid: number;
  allocBuffer: number;
}

export function calculateReserve(
  input: EmergencyReserveInput,
): EmergencyReserveResult {
  const target = input.monthlyExpenses * input.coverageMonths;
  const monthlyRate = annualToMonthly(input.expectedAnnualReturn / 100);
  const time = monthsToReach(
    input.currentReserve,
    input.monthlySavings,
    monthlyRate,
    target,
  );
  const alreadyCovered = input.currentReserve >= target;

  // Suggested allocation: ~1 month of expenses kept liquid for instant access,
  // the rest in daily-liquidity instruments (Tesouro Selic / CDB ≥100% CDI).
  const buffer = Math.min(input.monthlyExpenses, target);
  const liquid = Math.max(0, target - buffer);

  return {
    target,
    monthsToReach: time,
    alreadyCovered,
    allocLiquid: liquid,
    allocBuffer: buffer,
  };
}
