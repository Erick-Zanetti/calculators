import {
  annualToMonthly,
  futureValue,
  requiredMonthly,
} from "../../shared/utils/finance-math";

export type RatePeriod = "monthly" | "yearly";
export type TimeUnit = "months" | "years";

export interface GoalInput {
  goal: number;
  current: number;
  rate: number; // %
  ratePeriod: RatePeriod;
  period: number;
  timeUnit: TimeUnit;
}

export interface GoalResult {
  months: number;
  monthlyRate: number;
  monthlyContribution: number;
  totalContributed: number;
  totalInterest: number;
  finalValue: number;
  alreadyAtGoal: boolean;
  goalCoveragePct: number;
}

export function calculateGoal(input: GoalInput): GoalResult {
  const months =
    input.timeUnit === "years"
      ? Math.round(input.period * 12)
      : Math.round(input.period);
  const monthlyRate =
    input.ratePeriod === "monthly"
      ? input.rate / 100
      : annualToMonthly(input.rate / 100);

  const goalCoveragePct =
    input.goal > 0 ? Math.min(1, input.current / input.goal) : 1;
  const alreadyAtGoal = input.current >= input.goal;

  const monthlyContribution = alreadyAtGoal
    ? 0
    : requiredMonthly(input.current, input.goal, monthlyRate, months);

  const totalContributed = monthlyContribution * months;
  const finalValue = futureValue(
    input.current,
    monthlyContribution,
    monthlyRate,
    months,
  );
  const totalInterest = finalValue - input.current - totalContributed;

  return {
    months,
    monthlyRate,
    monthlyContribution,
    totalContributed,
    totalInterest,
    finalValue,
    alreadyAtGoal,
    goalCoveragePct,
  };
}
