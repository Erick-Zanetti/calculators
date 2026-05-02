import type { SgsPoint } from "../../shared/api/bcb";

export interface InflationInput {
  amount: number;
  startMonth: string; // "YYYY-MM"
  endMonth: string;
  series: SgsPoint[]; // monthly IPCA in % (e.g. 0.45 means 0.45%)
}

export interface InflationResult {
  adjustedAmount: number;
  accumulatedFactor: number; // e.g. 1.0823 = 8.23% over the period
  monthsCovered: number;
  purchasingPowerLoss: number; // 1 - 1/factor
}

export interface InflationFailure {
  ok: false;
  reason: "invalid-range" | "missing-data";
}

export type InflationOutcome =
  | ({ ok: true } & InflationResult)
  | InflationFailure;

function pointMonth(p: SgsPoint): string {
  return p.date.slice(0, 7); // yyyy-mm
}

export function calculateInflation(input: InflationInput): InflationOutcome {
  if (!input.startMonth || !input.endMonth) {
    return { ok: false, reason: "invalid-range" };
  }
  if (input.startMonth >= input.endMonth) {
    return { ok: false, reason: "invalid-range" };
  }

  // IPCA series uses the first day of the reference month. We accumulate every
  // monthly variation strictly AFTER the start month and up to (and including)
  // the end month — that's the standard "correção entre data X e data Y" rule.
  const relevant = input.series.filter((p) => {
    const m = pointMonth(p);
    return m > input.startMonth && m <= input.endMonth;
  });

  if (relevant.length === 0) {
    return { ok: false, reason: "missing-data" };
  }

  let factor = 1;
  for (const p of relevant) {
    factor *= 1 + p.value / 100;
  }

  const adjusted = input.amount * factor;

  return {
    ok: true,
    adjustedAmount: adjusted,
    accumulatedFactor: factor,
    monthsCovered: relevant.length,
    purchasingPowerLoss: factor > 0 ? 1 - 1 / factor : 0,
  };
}

/**
 * Build a list of "yyyy-mm" values from January 1995 to today, used to
 * populate the month picker.
 */
export function listMonthOptions(latest?: string): string[] {
  const startYear = 1995;
  const now = new Date();
  const lastYear = latest ? Number(latest.slice(0, 4)) : now.getFullYear();
  const lastMonth = latest ? Number(latest.slice(5, 7)) : now.getMonth() + 1;
  const out: string[] = [];
  for (let y = startYear; y <= lastYear; y++) {
    const finalMonth = y === lastYear ? lastMonth : 12;
    for (let m = 1; m <= finalMonth; m++) {
      out.push(`${y}-${String(m).padStart(2, "0")}`);
    }
  }
  return out;
}

export function defaultStart(latest?: string): string {
  if (!latest) return "2020-01";
  const year = Number(latest.slice(0, 4)) - 5;
  return `${year}-01`;
}
