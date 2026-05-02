import { useMemo, useState } from "react";
import { MoneyInput } from "../../shared/components/MoneyInput";
import { NumberInput } from "../../shared/components/NumberInput";
import { useI18n } from "../../shared/i18n/I18nProvider";
import { formatMoney } from "../../shared/utils/format";
import { calculateFire } from "./finance";

export function FireCalculator() {
  const { t, locale } = useI18n();

  const [annualExpenses, setAnnualExpenses] = useState(60000);
  const [withdrawalRate, setWithdrawalRate] = useState(4);
  const [currentPortfolio, setCurrentPortfolio] = useState(50000);
  const [monthlySavings, setMonthlySavings] = useState(2000);
  const [realReturn, setRealReturn] = useState(5);

  const result = useMemo(
    () =>
      calculateFire({
        annualExpenses,
        withdrawalRatePct: withdrawalRate,
        currentPortfolio,
        monthlySavings,
        realReturnAnnualPct: realReturn,
      }),
    [
      annualExpenses,
      withdrawalRate,
      currentPortfolio,
      monthlySavings,
      realReturn,
    ],
  );

  const handleReset = () => {
    setAnnualExpenses(60000);
    setWithdrawalRate(4);
    setCurrentPortfolio(50000);
    setMonthlySavings(2000);
    setRealReturn(5);
  };

  const prefix = locale === "pt-BR" ? "R$" : "$";

  return (
    <div className="flex flex-col gap-5">
      <section className="card p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <MoneyInput
            id="fire-expenses"
            label={t.calc.fire.annualExpenses}
            value={annualExpenses}
            onChange={setAnnualExpenses}
            prefix={prefix}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-text-dim">
              {t.calc.fire.withdrawalRate}
            </label>
            <NumberInput
              value={withdrawalRate}
              onChange={setWithdrawalRate}
              suffix="% a.a."
              decimals={2}
            />
            <span className="text-xs text-text-mute">
              {t.calc.fire.withdrawalRateHint}
            </span>
          </div>

          <MoneyInput
            id="fire-portfolio"
            label={t.calc.fire.currentPortfolio}
            value={currentPortfolio}
            onChange={setCurrentPortfolio}
            prefix={prefix}
          />

          <MoneyInput
            id="fire-savings"
            label={t.calc.fire.monthlySavings}
            value={monthlySavings}
            onChange={setMonthlySavings}
            prefix={prefix}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-text-dim">
              {t.calc.fire.realReturn}
            </label>
            <NumberInput
              value={realReturn}
              onChange={setRealReturn}
              suffix="% a.a."
              decimals={2}
            />
            <span className="text-xs text-text-mute">
              {t.calc.fire.realReturnHint}
            </span>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <button type="button" className="btn-ghost" onClick={handleReset}>
            {t.common.reset}
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ResultCard
          title={t.calc.fire.fireNumber}
          value={
            Number.isFinite(result.fireNumber)
              ? formatMoney(result.fireNumber, locale)
              : "—"
          }
          accent="#f97316"
        />
        <ResultCard
          title={t.calc.fire.yearsToFire}
          value={
            result.alreadyFire
              ? "✓"
              : Number.isFinite(result.yearsToFire)
                ? t.calc.fire.yearsToFireValue(result.yearsToFire)
                : t.common.notReached
          }
          accent="#10b981"
        />
        <ResultCard
          title={t.calc.fire.monthlyPassive}
          value={
            Number.isFinite(result.monthlyPassive)
              ? formatMoney(result.monthlyPassive, locale)
              : "—"
          }
          accent="#a78bfa"
        />
      </section>

      {result.alreadyFire && (
        <p className="card p-4 text-sm text-emerald-300">
          {t.calc.fire.alreadyFire}
        </p>
      )}
    </div>
  );
}

function ResultCard({
  title,
  value,
  accent,
}: {
  title: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-2">
        <span
          className="inline-block w-2 h-2 rounded-full"
          style={{ background: accent }}
        />
        <p className="text-[11px] uppercase tracking-wider font-medium text-text-dim">
          {title}
        </p>
      </div>
      <p className="text-xl sm:text-2xl font-semibold text-text leading-tight break-all">
        {value}
      </p>
    </div>
  );
}
