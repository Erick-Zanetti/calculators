import { priceInstallment } from "../../shared/utils/finance-math";

export type PayoffMode = "reduceTerm" | "reducePayment";

export interface PayoffInput {
  outstandingBalance: number;
  monthlyRatePct: number; // %
  remainingMonths: number;
  extraPayment: number;
  mode: PayoffMode;
}

export interface PayoffScenario {
  installment: number;
  remainingMonths: number;
  totalPayments: number;
  totalInterest: number;
}

export interface PayoffResult {
  monthlyRate: number;
  original: PayoffScenario;
  withExtra: PayoffScenario;
  interestSaved: number;
  monthsSaved: number;
}

function projectInterest(
  balance: number,
  monthlyRate: number,
  months: number,
  installment: number,
): { totalInterest: number; totalPayments: number; effectiveMonths: number } {
  let b = balance;
  let interest = 0;
  let monthsRun = 0;
  let lastPayment = installment;
  for (let m = 0; m < months; m++) {
    const i = b * monthlyRate;
    let pay = installment;
    if (b + i < pay) {
      pay = b + i;
    }
    const amortization = pay - i;
    b -= amortization;
    interest += i;
    monthsRun = m + 1;
    lastPayment = pay;
    if (b <= 1e-6) {
      b = 0;
      break;
    }
  }
  const totalPayments = installment * Math.max(0, monthsRun - 1) + lastPayment;
  return {
    totalInterest: interest,
    totalPayments,
    effectiveMonths: monthsRun,
  };
}

export function calculatePayoff(input: PayoffInput): PayoffResult {
  const monthlyRate = input.monthlyRatePct / 100;
  const originalInstallment = priceInstallment(
    input.outstandingBalance,
    monthlyRate,
    input.remainingMonths,
  );
  const original = projectInterest(
    input.outstandingBalance,
    monthlyRate,
    input.remainingMonths,
    originalInstallment,
  );

  const balanceAfterExtra = Math.max(
    0,
    input.outstandingBalance - input.extraPayment,
  );

  let scenarioInstallment: number;
  let scenarioMonthsCap: number;

  if (input.mode === "reduceTerm") {
    scenarioInstallment = originalInstallment;
    scenarioMonthsCap = input.remainingMonths;
  } else {
    scenarioMonthsCap = input.remainingMonths;
    scenarioInstallment = priceInstallment(
      balanceAfterExtra,
      monthlyRate,
      input.remainingMonths,
    );
  }

  const projected = projectInterest(
    balanceAfterExtra,
    monthlyRate,
    scenarioMonthsCap,
    scenarioInstallment,
  );

  const withExtra: PayoffScenario = {
    installment: scenarioInstallment,
    remainingMonths: projected.effectiveMonths,
    totalPayments: projected.totalPayments + input.extraPayment,
    totalInterest: projected.totalInterest,
  };

  return {
    monthlyRate,
    original: {
      installment: originalInstallment,
      remainingMonths: original.effectiveMonths,
      totalPayments: original.totalPayments,
      totalInterest: original.totalInterest,
    },
    withExtra,
    interestSaved: original.totalInterest - withExtra.totalInterest,
    monthsSaved: original.effectiveMonths - withExtra.remainingMonths,
  };
}
