import { regressiveIR } from "../../shared/utils/finance-math";

export type TimeUnit = "months" | "years";

export interface TesouroInput {
  amount: number;
  period: number;
  timeUnit: TimeUnit;
  selicAnnualPct: number;
  selicSpreadPct: number; // bond spread vs Selic, e.g. 0
  ipcaAnnualPct: number;
  ipcaSpreadPct: number; // real coupon, e.g. 6 for IPCA+6%
  prefixedAnnualPct: number;
  custodyFeePct: number; // 0.20 means 0.20% a.a.
}

export interface BondResult {
  key: "selic" | "ipca" | "prefixed";
  grossAnnual: number; // decimal a.a. used to compute the bond's gross return
  finalGross: number; // value at maturity before fees and taxes
  custodyFee: number; // total custody fee charged over the period
  ir: number; // tax paid
  taxRate: number; // 0.225 .. 0.15
  netAtMaturity: number;
}

export interface TesouroResult {
  months: number;
  holdingDays: number;
  taxRate: number;
  selic: BondResult;
  ipca: BondResult;
  prefixed: BondResult;
}

function approximateCustody(
  initial: number,
  finalGross: number,
  feeAnnual: number,
  years: number,
): number {
  // BCB charges 0.20% p.y. on the *average* position. We approximate the
  // average between initial and final values — this matches Tesouro's own
  // simulator within a few reais for typical inputs.
  if (feeAnnual <= 0 || years <= 0) return 0;
  const averagePosition = (initial + finalGross) / 2;
  return averagePosition * feeAnnual * years;
}

function computeBond(
  key: BondResult["key"],
  grossAnnual: number,
  amount: number,
  years: number,
  custodyAnnual: number,
  taxRate: number,
): BondResult {
  const finalGross = amount * Math.pow(1 + grossAnnual, years);
  const custodyFee = approximateCustody(
    amount,
    finalGross,
    custodyAnnual,
    years,
  );
  const interestEarned = finalGross - amount - custodyFee;
  const ir = Math.max(0, interestEarned) * taxRate;
  const netAtMaturity = finalGross - custodyFee - ir;
  return {
    key,
    grossAnnual,
    finalGross,
    custodyFee,
    ir,
    taxRate,
    netAtMaturity,
  };
}

export function calculateTesouro(input: TesouroInput): TesouroResult {
  const months =
    input.timeUnit === "years"
      ? Math.round(input.period * 12)
      : Math.round(input.period);
  const years = months / 12;
  // 30-day month convention is enough for IR bracket selection.
  const holdingDays = months * 30;
  const taxRate = regressiveIR(holdingDays);

  const custodyAnnual = input.custodyFeePct / 100;

  const selicGross =
    (input.selicAnnualPct + input.selicSpreadPct) / 100;
  // IPCA+ compounds the inflation expectation with the real coupon.
  const ipcaGross =
    (1 + input.ipcaAnnualPct / 100) * (1 + input.ipcaSpreadPct / 100) - 1;
  const prefixedGross = input.prefixedAnnualPct / 100;

  return {
    months,
    holdingDays,
    taxRate,
    selic: computeBond("selic", selicGross, input.amount, years, custodyAnnual, taxRate),
    ipca: computeBond("ipca", ipcaGross, input.amount, years, custodyAnnual, taxRate),
    prefixed: computeBond("prefixed", prefixedGross, input.amount, years, custodyAnnual, taxRate),
  };
}
