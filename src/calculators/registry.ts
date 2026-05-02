import type { CalculatorMeta } from "./types";
import { CompoundInterestCalculator } from "./compound-interest";
import { RateConversionCalculator } from "./rate-conversion";
import { InflationCalculator } from "./inflation";
import { GoalSavingsCalculator } from "./goal-savings";
import { EmergencyReserveCalculator } from "./emergency-reserve";
import { FireCalculator } from "./fire";
import { EarlyPayoffCalculator } from "./early-payoff";
import { TesouroDiretoCalculator } from "./tesouro-direto";

export const calculators: CalculatorMeta[] = [
  {
    id: "compound-interest",
    emoji: "📈",
    accent: "#8b5cf6",
    labels: (t) => ({
      title: t.calc.compoundInterest.title,
      subtitle: t.calc.compoundInterest.subtitle,
      description: t.calc.compoundInterest.description,
    }),
    Component: CompoundInterestCalculator,
  },
  {
    id: "rate-conversion",
    emoji: "🔁",
    accent: "#22d3ee",
    labels: (t) => ({
      title: t.calc.rateConversion.title,
      subtitle: t.calc.rateConversion.subtitle,
      description: t.calc.rateConversion.description,
    }),
    Component: RateConversionCalculator,
  },
  {
    id: "inflation",
    emoji: "📉",
    accent: "#f59e0b",
    labels: (t) => ({
      title: t.calc.inflation.title,
      subtitle: t.calc.inflation.subtitle,
      description: t.calc.inflation.description,
    }),
    Component: InflationCalculator,
  },
  {
    id: "goal-savings",
    emoji: "🎯",
    accent: "#10b981",
    labels: (t) => ({
      title: t.calc.goalSavings.title,
      subtitle: t.calc.goalSavings.subtitle,
      description: t.calc.goalSavings.description,
    }),
    Component: GoalSavingsCalculator,
  },
  {
    id: "emergency-reserve",
    emoji: "🛟",
    accent: "#fb923c",
    labels: (t) => ({
      title: t.calc.emergencyReserve.title,
      subtitle: t.calc.emergencyReserve.subtitle,
      description: t.calc.emergencyReserve.description,
    }),
    Component: EmergencyReserveCalculator,
  },
  {
    id: "fire",
    emoji: "🔥",
    accent: "#f97316",
    labels: (t) => ({
      title: t.calc.fire.title,
      subtitle: t.calc.fire.subtitle,
      description: t.calc.fire.description,
    }),
    Component: FireCalculator,
  },
  {
    id: "early-payoff",
    emoji: "💳",
    accent: "#a78bfa",
    labels: (t) => ({
      title: t.calc.earlyPayoff.title,
      subtitle: t.calc.earlyPayoff.subtitle,
      description: t.calc.earlyPayoff.description,
    }),
    Component: EarlyPayoffCalculator,
  },
  {
    id: "tesouro-direto",
    emoji: "🏦",
    accent: "#60a5fa",
    labels: (t) => ({
      title: t.calc.tesouroDireto.title,
      subtitle: t.calc.tesouroDireto.subtitle,
      description: t.calc.tesouroDireto.description,
    }),
    Component: TesouroDiretoCalculator,
  },
];

export function findCalculator(id: string | null): CalculatorMeta {
  return calculators.find((c) => c.id === id) ?? calculators[0];
}
