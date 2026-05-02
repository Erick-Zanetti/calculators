// Compounding-period conversions. Inputs/outputs are decimals (0.01 = 1%).

export const BUSINESS_DAYS_YEAR = 252;
export const CALENDAR_DAYS_YEAR = 365;
export const MONTHS_YEAR = 12;

export function annualToMonthly(annual: number): number {
  return Math.pow(1 + annual, 1 / MONTHS_YEAR) - 1;
}

export function monthlyToAnnual(monthly: number): number {
  return Math.pow(1 + monthly, MONTHS_YEAR) - 1;
}

export function annualToDailyBusiness(annual: number): number {
  return Math.pow(1 + annual, 1 / BUSINESS_DAYS_YEAR) - 1;
}

export function dailyBusinessToAnnual(daily: number): number {
  return Math.pow(1 + daily, BUSINESS_DAYS_YEAR) - 1;
}

export function monthlyToDailyBusiness(monthly: number): number {
  return annualToDailyBusiness(monthlyToAnnual(monthly));
}

export function dailyBusinessToMonthly(daily: number): number {
  return annualToMonthly(dailyBusinessToAnnual(daily));
}

/**
 * Brazilian fixed-income regressive income-tax table (IR retido na fonte).
 * Returns the tax rate as a decimal (0.225 = 22.5%).
 */
export function regressiveIR(holdingDays: number): number {
  if (holdingDays <= 180) return 0.225;
  if (holdingDays <= 360) return 0.20;
  if (holdingDays <= 720) return 0.175;
  return 0.15;
}

/**
 * Future value of a series with an initial amount + constant monthly contributions
 * at end of each month, compounded monthly at rate `i`.
 */
export function futureValue(
  initial: number,
  monthly: number,
  monthlyRate: number,
  months: number,
): number {
  if (months <= 0) return initial;
  const growth = Math.pow(1 + monthlyRate, months);
  if (monthlyRate === 0) return initial + monthly * months;
  return initial * growth + monthly * ((growth - 1) / monthlyRate);
}

/**
 * Required monthly contribution to reach `goal` over `months`, given a starting
 * balance `initial` and monthly rate `i`. Returns 0 when the goal is already met.
 */
export function requiredMonthly(
  initial: number,
  goal: number,
  monthlyRate: number,
  months: number,
): number {
  if (months <= 0) return Math.max(0, goal - initial);
  const growth = Math.pow(1 + monthlyRate, months);
  const projectedFromInitial = initial * growth;
  const remaining = goal - projectedFromInitial;
  if (remaining <= 0) return 0;
  if (monthlyRate === 0) return remaining / months;
  return (remaining * monthlyRate) / (growth - 1);
}

/**
 * Number of months needed for a future-value series to reach `goal`.
 * Returns Infinity if unreachable (negative growth + no contribution).
 */
export function monthsToReach(
  initial: number,
  monthly: number,
  monthlyRate: number,
  goal: number,
): number {
  if (initial >= goal) return 0;
  if (monthlyRate === 0) {
    if (monthly <= 0) return Infinity;
    return (goal - initial) / monthly;
  }
  // Solve initial*(1+i)^n + monthly*((1+i)^n - 1)/i = goal
  // => (1+i)^n = (goal*i + monthly) / (initial*i + monthly)
  const num = goal * monthlyRate + monthly;
  const den = initial * monthlyRate + monthly;
  if (den <= 0 || num / den <= 0) return Infinity;
  return Math.log(num / den) / Math.log(1 + monthlyRate);
}

/**
 * Price-system (French amortization) installment for an outstanding balance.
 */
export function priceInstallment(
  balance: number,
  monthlyRate: number,
  months: number,
): number {
  if (months <= 0) return 0;
  if (monthlyRate === 0) return balance / months;
  const growth = Math.pow(1 + monthlyRate, months);
  return (balance * monthlyRate * growth) / (growth - 1);
}
