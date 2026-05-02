import { useMemo, useState } from "react";
import { MoneyInput } from "../../shared/components/MoneyInput";
import { NumberInput } from "../../shared/components/NumberInput";
import { Segmented } from "../../shared/components/Segmented";
import { useI18n } from "../../shared/i18n/I18nProvider";
import { formatMoney, formatPct } from "../../shared/utils/format";
import { calculateGoal } from "./finance";
import type { RatePeriod, TimeUnit } from "./finance";

export function GoalSavingsCalculator() {
  const { t, locale } = useI18n();

  const [goal, setGoal] = useState(100000);
  const [current, setCurrent] = useState(5000);
  const [rate, setRate] = useState(10);
  const [ratePeriod, setRatePeriod] = useState<RatePeriod>("yearly");
  const [period, setPeriod] = useState(5);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>("years");

  const result = useMemo(
    () =>
      calculateGoal({
        goal,
        current,
        rate,
        ratePeriod,
        period,
        timeUnit,
      }),
    [goal, current, rate, ratePeriod, period, timeUnit],
  );

  const handleReset = () => {
    setGoal(100000);
    setCurrent(5000);
    setRate(10);
    setRatePeriod("yearly");
    setPeriod(5);
    setTimeUnit("years");
  };

  const prefix = locale === "pt-BR" ? "R$" : "$";

  return (
    <div className="flex flex-col gap-5">
      <section className="card p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <MoneyInput
            id="goal"
            label={t.calc.goalSavings.goal}
            value={goal}
            onChange={setGoal}
            prefix={prefix}
          />
          <MoneyInput
            id="goal-current"
            label={t.calc.goalSavings.currentAmount}
            value={current}
            onChange={setCurrent}
            prefix={prefix}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-text-dim">
              {t.common.expectedRate}
            </label>
            <div className="flex gap-2">
              <NumberInput value={rate} onChange={setRate} suffix="%" decimals={2} />
              <Segmented
                ariaLabel={t.common.expectedRate}
                value={ratePeriod}
                onChange={setRatePeriod}
                options={[
                  { value: "monthly", label: t.common.perMonth },
                  { value: "yearly", label: t.common.perYear },
                ]}
              />
            </div>
            <span className="text-xs text-text-mute">
              {t.form.equivalentMonthly}: {formatPct(result.monthlyRate, locale)} {t.common.perMonth}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-text-dim">
              {t.common.period}
            </label>
            <div className="flex gap-2">
              <NumberInput
                value={period}
                onChange={setPeriod}
                decimals={0}
                min={0}
              />
              <Segmented
                ariaLabel={t.common.period}
                value={timeUnit}
                onChange={setTimeUnit}
                options={[
                  { value: "months", label: t.common.months },
                  { value: "years", label: t.common.years },
                ]}
              />
            </div>
            <span className="text-xs text-text-mute">
              {t.form.totalMonths(result.months)}
            </span>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <button type="button" className="btn-ghost" onClick={handleReset}>
            {t.common.reset}
          </button>
        </div>
      </section>

      {result.alreadyAtGoal ? (
        <p className="card p-4 text-sm text-emerald-300">
          {t.calc.goalSavings.alreadyAtGoal}
        </p>
      ) : (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <ResultCard
            title={t.calc.goalSavings.monthlyNeeded}
            value={formatMoney(result.monthlyContribution, locale)}
            accent="#10b981"
          />
          <ResultCard
            title={t.calc.goalSavings.totalContributed}
            value={formatMoney(result.totalContributed, locale)}
            accent="#60a5fa"
          />
          <ResultCard
            title={t.calc.goalSavings.totalInterest}
            value={formatMoney(result.totalInterest, locale)}
            accent="#a78bfa"
          />
          <ResultCard
            title={t.calc.goalSavings.goalCovered}
            value={formatPct(result.goalCoveragePct, locale, 1)}
            accent="#f59e0b"
          />
        </section>
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
