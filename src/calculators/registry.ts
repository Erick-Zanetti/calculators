import type { CalculatorMeta } from "./types";
import { CompoundInterestCalculator } from "./compound-interest";

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
];

export function findCalculator(id: string | null): CalculatorMeta {
  return calculators.find((c) => c.id === id) ?? calculators[0];
}
