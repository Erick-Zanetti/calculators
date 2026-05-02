import { useMemo, useState } from "react";
import { MoneyInput } from "../../shared/components/MoneyInput";
import { NumberInput } from "../../shared/components/NumberInput";
import { Segmented } from "../../shared/components/Segmented";
import { useI18n } from "../../shared/i18n/I18nProvider";
import { ResultCards } from "./ResultCards";
import { GrowthChart } from "./GrowthChart";
import {
  calculate,
  formatMoney,
  formatPct,
  monthsFromInput,
} from "./finance";
import type { RatePeriod, TimeUnit } from "./finance";

export function CompoundInterestCalculator() {
  const { t, locale } = useI18n();

  const [initial, setInitial] = useState(1000);
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(1);
  const [ratePeriod, setRatePeriod] = useState<RatePeriod>("monthly");
  const [period, setPeriod] = useState(10);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>("years");
  const [useInflation, setUseInflation] = useState(false);
  const [inflation, setInflation] = useState(4);
  const [inflateContributions, setInflateContributions] = useState(false);

  const result = useMemo(
    () =>
      calculate({
        initial,
        monthly,
        rate,
        ratePeriod,
        period,
        timeUnit,
        inflationAnnual: useInflation ? inflation : null,
        inflateContributions: useInflation && inflateContributions,
      }),
    [
      initial,
      monthly,
      rate,
      ratePeriod,
      period,
      timeUnit,
      useInflation,
      inflation,
      inflateContributions,
    ],
  );

  const months = monthsFromInput(period, timeUnit);

  const handleReset = () => {
    setInitial(1000);
    setMonthly(500);
    setRate(1);
    setRatePeriod("monthly");
    setPeriod(10);
    setTimeUnit("years");
    setUseInflation(false);
    setInflation(4);
    setInflateContributions(false);
  };

  return (
    <div className="flex flex-col gap-5">
      <section className="card p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <MoneyInput
            id="initial"
            label={t.form.initialValue}
            value={initial}
            onChange={setInitial}
            prefix="R$"
          />
          <MoneyInput
            id="monthly"
            label={t.form.monthlyContribution}
            value={monthly}
            onChange={setMonthly}
            prefix="R$"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-text-dim">
              {t.form.interestRate}
            </label>
            <div className="flex gap-2">
              <NumberInput
                value={rate}
                onChange={setRate}
                suffix="%"
                decimals={2}
              />
              <Segmented
                ariaLabel={t.form.interestRate}
                value={ratePeriod}
                onChange={setRatePeriod}
                options={[
                  { value: "monthly", label: t.form.perMonth },
                  { value: "yearly", label: t.form.perYear },
                ]}
              />
            </div>
            <span className="text-xs text-text-mute">
              {t.form.equivalentMonthly}: {formatPct(result.monthlyRate, locale)} {t.form.perMonth}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-text-dim">
              {t.form.period}
            </label>
            <div className="flex gap-2">
              <NumberInput
                value={period}
                onChange={setPeriod}
                decimals={0}
                min={0}
              />
              <Segmented
                ariaLabel={t.form.period}
                value={timeUnit}
                onChange={setTimeUnit}
                options={[
                  { value: "months", label: t.form.months },
                  { value: "years", label: t.form.years },
                ]}
              />
            </div>
            <span className="text-xs text-text-mute">{t.form.totalMonths(months)}</span>
          </div>
        </div>

        <div className="mt-5 border-t border-[rgba(38,48,99,0.5)] pt-4">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <span className="relative inline-block w-10 h-6">
              <input
                type="checkbox"
                checked={useInflation}
                onChange={(e) => setUseInflation(e.target.checked)}
                className="sr-only peer"
              />
              <span className="absolute inset-0 rounded-full bg-[rgba(38,48,99,0.7)] peer-checked:bg-[rgba(139,92,246,0.65)] transition-colors" />
              <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow peer-checked:translate-x-4 transition-transform" />
            </span>
            <span className="text-sm text-text">
              {t.form.applyInflation} <span className="text-text-mute font-normal">{t.form.optional}</span>
            </span>
          </label>

          {useInflation && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium uppercase tracking-wider text-text-dim">
                  {t.form.annualInflation}
                </label>
                <NumberInput
                  value={inflation}
                  onChange={setInflation}
                  suffix="%"
                  decimals={2}
                />
                <span className="text-xs text-text-mute">
                  {t.form.equivalentMonthly}: {formatPct(result.monthlyInflation, locale)} {t.form.perMonth}
                </span>
              </div>
              <div className="flex items-end">
                <p className="text-xs text-text-dim leading-relaxed">
                  {t.form.inflationHint}
                  <b className="text-text">{t.form.inflationHintBold}</b>
                </p>
              </div>

              <div className="md:col-span-2 mt-1">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <span className="relative inline-block w-10 h-6 mt-0.5 flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={inflateContributions}
                      onChange={(e) => setInflateContributions(e.target.checked)}
                      className="sr-only peer"
                    />
                    <span className="absolute inset-0 rounded-full bg-[rgba(38,48,99,0.7)] peer-checked:bg-[rgba(245,158,11,0.65)] transition-colors" />
                    <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow peer-checked:translate-x-4 transition-transform" />
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span className="text-sm text-text">
                      {t.form.inflateContributions}
                    </span>
                    <span className="text-xs text-text-mute leading-relaxed">
                      {t.form.inflateContributionsHint}
                    </span>
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 flex items-center gap-2">
          <button type="button" className="btn-ghost" onClick={handleReset}>
            {t.form.reset}
          </button>
          <span className="chip ml-auto">
            {result.hasInflation ? t.form.inflationActive : t.form.nominalOnly}
          </span>
        </div>
      </section>

      <ResultCards result={result} />

      <GrowthChart result={result} />

      <MonthlyTable rows={result.rows} hasInflation={result.hasInflation} />
    </div>
  );
}

function MonthlyTable({
  rows,
  hasInflation,
}: {
  rows: ReturnType<typeof calculate>["rows"];
  hasInflation: boolean;
}) {
  const { t, locale } = useI18n();
  const [open, setOpen] = useState(false);
  if (rows.length === 0) return null;

  return (
    <section className="card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.03] transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-text">{t.table.title}</span>
          <span className="chip">{t.table.monthsCount(rows.length)}</span>
        </div>
        <span className={`text-text-dim transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && (
        <div className="table-wrap border-t border-[rgba(38,48,99,0.5)]">
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-[rgba(11,16,32,0.7)] text-text-dim sticky top-0">
              <tr>
                <th className="text-left px-3 py-2 font-medium">{t.table.month}</th>
                <th className="text-right px-3 py-2 font-medium">{t.table.contribution}</th>
                <th className="text-right px-3 py-2 font-medium">{t.table.interestMonth}</th>
                <th className="text-right px-3 py-2 font-medium">{t.table.interestCum}</th>
                <th className="text-right px-3 py-2 font-medium">{t.table.invested}</th>
                <th className="text-right px-3 py-2 font-medium">{t.table.balance}</th>
                {hasInflation && (
                  <th className="text-right px-3 py-2 font-medium">{t.table.realValue}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.month}
                  className="odd:bg-white/[0.015] hover:bg-white/[0.04] transition-colors"
                >
                  <td className="px-3 py-1.5">{r.month}</td>
                  <td className="px-3 py-1.5 text-right">{formatMoney(r.contribution, locale)}</td>
                  <td className="px-3 py-1.5 text-right text-emerald-300">
                    {formatMoney(r.interestMonth, locale)}
                  </td>
                  <td className="px-3 py-1.5 text-right">{formatMoney(r.interestTotal, locale)}</td>
                  <td className="px-3 py-1.5 text-right">{formatMoney(r.invested, locale)}</td>
                  <td className="px-3 py-1.5 text-right font-medium">{formatMoney(r.balance, locale)}</td>
                  {hasInflation && (
                    <td className="px-3 py-1.5 text-right text-amber-300">
                      {formatMoney(r.realBalance, locale)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
