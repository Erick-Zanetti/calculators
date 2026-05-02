import { useMemo, useState } from "react";
import { MoneyInput } from "../../shared/components/MoneyInput";
import { NumberInput } from "../../shared/components/NumberInput";
import { Segmented } from "../../shared/components/Segmented";
import { useI18n } from "../../shared/i18n/I18nProvider";
import { formatMoney } from "../../shared/utils/format";
import { calculatePayoff } from "./finance";
import type { PayoffMode } from "./finance";

export function EarlyPayoffCalculator() {
  const { t, locale } = useI18n();

  const [balance, setBalance] = useState(150000);
  const [monthlyRate, setMonthlyRate] = useState(0.95);
  const [months, setMonths] = useState(240);
  const [extra, setExtra] = useState(20000);
  const [mode, setMode] = useState<PayoffMode>("reduceTerm");

  const result = useMemo(
    () =>
      calculatePayoff({
        outstandingBalance: balance,
        monthlyRatePct: monthlyRate,
        remainingMonths: months,
        extraPayment: extra,
        mode,
      }),
    [balance, monthlyRate, months, extra, mode],
  );

  const handleReset = () => {
    setBalance(150000);
    setMonthlyRate(0.95);
    setMonths(240);
    setExtra(20000);
    setMode("reduceTerm");
  };

  const prefix = locale === "pt-BR" ? "R$" : "$";
  const noBenefit =
    result.interestSaved <= 1e-6 && result.monthsSaved <= 0;

  return (
    <div className="flex flex-col gap-5">
      <section className="card p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <MoneyInput
            id="ep-balance"
            label={t.calc.earlyPayoff.outstandingBalance}
            value={balance}
            onChange={setBalance}
            prefix={prefix}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-text-dim">
              {t.calc.earlyPayoff.monthlyRate}
            </label>
            <NumberInput
              value={monthlyRate}
              onChange={setMonthlyRate}
              suffix="% a.m."
              decimals={2}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-text-dim">
              {t.calc.earlyPayoff.remainingMonths}
            </label>
            <NumberInput
              value={months}
              onChange={setMonths}
              decimals={0}
              min={1}
            />
          </div>

          <MoneyInput
            id="ep-extra"
            label={t.calc.earlyPayoff.extraPayment}
            value={extra}
            onChange={setExtra}
            prefix={prefix}
          />

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs font-medium uppercase tracking-wider text-text-dim">
              {t.calc.earlyPayoff.modeLabel}
            </label>
            <Segmented
              ariaLabel={t.calc.earlyPayoff.modeLabel}
              value={mode}
              onChange={setMode}
              options={[
                {
                  value: "reduceTerm",
                  label: t.calc.earlyPayoff.modeReduceTerm,
                },
                {
                  value: "reducePayment",
                  label: t.calc.earlyPayoff.modeReducePayment,
                },
              ]}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <button type="button" className="btn-ghost" onClick={handleReset}>
            {t.common.reset}
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ScenarioCard
          title={t.calc.earlyPayoff.original}
          installment={result.original.installment}
          remainingMonths={result.original.remainingMonths}
          totalInterest={result.original.totalInterest}
          accent="#a0a7c4"
          locale={locale}
          t={t}
        />
        <ScenarioCard
          title={t.calc.earlyPayoff.withExtra}
          installment={result.withExtra.installment}
          remainingMonths={result.withExtra.remainingMonths}
          totalInterest={result.withExtra.totalInterest}
          accent="#10b981"
          locale={locale}
          t={t}
          highlight
        />
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ResultCard
          title={t.calc.earlyPayoff.interestSaved}
          value={formatMoney(Math.max(0, result.interestSaved), locale)}
          accent="#22d3ee"
        />
        <ResultCard
          title={t.calc.earlyPayoff.monthsSaved}
          value={`${Math.max(0, result.monthsSaved)} ${t.common.months}`}
          accent="#8b5cf6"
        />
      </section>

      {noBenefit && (
        <p className="card p-4 text-sm text-text-dim">
          {t.calc.earlyPayoff.noBenefit}
        </p>
      )}
    </div>
  );
}

function ScenarioCard({
  title,
  installment,
  remainingMonths,
  totalInterest,
  accent,
  highlight = false,
  locale,
  t,
}: {
  title: string;
  installment: number;
  remainingMonths: number;
  totalInterest: number;
  accent: string;
  highlight?: boolean;
  locale: string;
  t: ReturnType<typeof useI18n>["t"];
}) {
  return (
    <div
      className="card p-4"
      style={
        highlight
          ? { borderColor: "rgba(16,185,129,0.45)" }
          : undefined
      }
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className="inline-block w-2 h-2 rounded-full"
          style={{ background: accent }}
        />
        <p className="text-sm font-semibold text-text">{title}</p>
      </div>
      <dl className="grid grid-cols-1 gap-2 text-sm">
        <Row label={t.calc.earlyPayoff.installment} value={formatMoney(installment, locale)} />
        <Row
          label={t.calc.earlyPayoff.remainingTerm}
          value={`${remainingMonths} ${t.common.months}`}
        />
        <Row
          label={t.calc.earlyPayoff.totalInterest}
          value={formatMoney(totalInterest, locale)}
        />
      </dl>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt className="text-text-dim">{label}</dt>
      <dd className="font-medium text-text break-all text-right">{value}</dd>
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
