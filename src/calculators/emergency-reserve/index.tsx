import { useMemo, useState } from "react";
import { MoneyInput } from "../../shared/components/MoneyInput";
import { NumberInput } from "../../shared/components/NumberInput";
import { useI18n } from "../../shared/i18n/I18nProvider";
import { formatMoney } from "../../shared/utils/format";
import { calculateReserve } from "./finance";

export function EmergencyReserveCalculator() {
  const { t, locale } = useI18n();

  const [monthlyExpenses, setMonthlyExpenses] = useState(5000);
  const [coverageMonths, setCoverageMonths] = useState(6);
  const [currentReserve, setCurrentReserve] = useState(5000);
  const [monthlySavings, setMonthlySavings] = useState(1000);
  const [expectedAnnualReturn, setExpectedAnnualReturn] = useState(10);

  const result = useMemo(
    () =>
      calculateReserve({
        monthlyExpenses,
        coverageMonths,
        currentReserve,
        monthlySavings,
        expectedAnnualReturn,
      }),
    [
      monthlyExpenses,
      coverageMonths,
      currentReserve,
      monthlySavings,
      expectedAnnualReturn,
    ],
  );

  const handleReset = () => {
    setMonthlyExpenses(5000);
    setCoverageMonths(6);
    setCurrentReserve(5000);
    setMonthlySavings(1000);
    setExpectedAnnualReturn(10);
  };

  const prefix = locale === "pt-BR" ? "R$" : "$";

  return (
    <div className="flex flex-col gap-5">
      <section className="card p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <MoneyInput
            id="er-expenses"
            label={t.calc.emergencyReserve.monthlyExpenses}
            value={monthlyExpenses}
            onChange={setMonthlyExpenses}
            prefix={prefix}
          />

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="er-coverage"
              className="text-xs font-medium uppercase tracking-wider text-text-dim"
            >
              {t.calc.emergencyReserve.coverageMonths}
            </label>
            <div className="flex items-center gap-3">
              <input
                id="er-coverage"
                type="range"
                min={3}
                max={12}
                step={1}
                value={coverageMonths}
                onChange={(e) => setCoverageMonths(Number(e.target.value))}
                className="flex-1 accent-[#8b5cf6]"
              />
              <span className="chip min-w-[64px] justify-center">
                {coverageMonths} {t.common.months}
              </span>
            </div>
          </div>

          <MoneyInput
            id="er-current"
            label={t.calc.emergencyReserve.currentReserve}
            value={currentReserve}
            onChange={setCurrentReserve}
            prefix={prefix}
          />

          <MoneyInput
            id="er-savings"
            label={t.calc.emergencyReserve.monthlySavings}
            value={monthlySavings}
            onChange={setMonthlySavings}
            prefix={prefix}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-text-dim">
              {t.common.expectedRate}
            </label>
            <NumberInput
              value={expectedAnnualReturn}
              onChange={setExpectedAnnualReturn}
              suffix="% a.a."
              decimals={2}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <button type="button" className="btn-ghost" onClick={handleReset}>
            {t.common.reset}
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ResultCard
          title={t.calc.emergencyReserve.targetReserve}
          value={formatMoney(result.target, locale)}
          accent="#fb923c"
        />
        <ResultCard
          title={t.calc.emergencyReserve.timeToReach}
          value={
            result.alreadyCovered
              ? "✓"
              : Number.isFinite(result.monthsToReach)
                ? t.calc.emergencyReserve.timeToReachValue(result.monthsToReach)
                : t.common.notReached
          }
          accent="#10b981"
        />
      </section>

      <section className="card p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-sm font-semibold text-text">
            {t.calc.emergencyReserve.allocationTitle}
          </h3>
        </div>
        <p className="text-xs text-text-mute mb-4">
          {t.calc.emergencyReserve.allocationHint}
        </p>
        <ul className="flex flex-col gap-3">
          <AllocationRow
            label={t.calc.emergencyReserve.allocLiquid}
            hint={t.calc.emergencyReserve.allocLiquidHint}
            amount={result.allocLiquid}
            target={result.target}
            color="#8b5cf6"
            locale={locale}
          />
          <AllocationRow
            label={t.calc.emergencyReserve.allocBuffer}
            hint={t.calc.emergencyReserve.allocBufferHint}
            amount={result.allocBuffer}
            target={result.target}
            color="#22d3ee"
            locale={locale}
          />
        </ul>
      </section>
    </div>
  );
}

function AllocationRow({
  label,
  hint,
  amount,
  target,
  color,
  locale,
}: {
  label: string;
  hint: string;
  amount: number;
  target: number;
  color: string;
  locale: string;
}) {
  const pct = target > 0 ? (amount / target) * 100 : 0;
  return (
    <li className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm text-text">{label}</span>
        <span className="text-sm font-medium text-text">
          {formatMoney(amount, locale)}{" "}
          <span className="text-text-mute text-xs">({pct.toFixed(0)}%)</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-[rgba(11,16,32,0.6)] overflow-hidden border border-[rgba(38,48,99,0.5)]">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-xs text-text-mute">{hint}</span>
    </li>
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
