import { useI18n } from "../../shared/i18n/I18nProvider";
import { formatMoney } from "./finance";
import type { CalcResult } from "./finance";

interface ResultCardsProps {
  result: CalcResult;
}

export function ResultCards({ result }: ResultCardsProps) {
  const { t, locale } = useI18n();

  const cards: { title: string; value: number; accent: string; subtitle?: string }[] = [
    { title: t.results.invested, value: result.invested, accent: "#60a5fa" },
    { title: t.results.totalInterest, value: result.interestTotal, accent: "#10b981" },
    { title: t.results.finalNominal, value: result.finalBalance, accent: "#a78bfa" },
  ];

  if (result.hasInflation) {
    cards.push({
      title: t.results.presentValue,
      value: result.finalRealBalance,
      accent: "#f59e0b",
      subtitle: t.results.presentValueSub,
    });
  }

  return (
    <div className={`grid gap-3 ${result.hasInflation ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-3"}`}>
      {cards.map((c) => (
        <div key={c.title} className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: c.accent }}
            />
            <p className="text-[11px] uppercase tracking-wider font-medium text-text-dim">{c.title}</p>
          </div>
          <p className="text-xl sm:text-2xl font-semibold text-text leading-tight break-all">
            {formatMoney(c.value, locale)}
          </p>
          {c.subtitle && (
            <p className="text-[11px] text-text-mute mt-1">{c.subtitle}</p>
          )}
        </div>
      ))}
    </div>
  );
}
