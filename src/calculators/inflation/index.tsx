import { useEffect, useMemo, useState } from "react";
import { MoneyInput } from "../../shared/components/MoneyInput";
import { useI18n } from "../../shared/i18n/I18nProvider";
import { useIpcaMonthly } from "../../shared/hooks/useBcbSeries";
import { formatMoney, formatPct } from "../../shared/utils/format";
import {
  calculateInflation,
  defaultStart,
  listMonthOptions,
} from "./finance";

export function InflationCalculator() {
  const { t, locale } = useI18n();
  const ipca = useIpcaMonthly();

  const [amount, setAmount] = useState(1000);
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");

  const latestMonth = ipca.data && ipca.data.length > 0
    ? ipca.data[ipca.data.length - 1].date.slice(0, 7)
    : undefined;

  const monthOptions = useMemo(
    () => listMonthOptions(latestMonth),
    [latestMonth],
  );

  useEffect(() => {
    if (start && end) return;
    if (!latestMonth) return;
    if (!start) setStart(defaultStart(latestMonth));
    if (!end) setEnd(latestMonth);
  }, [latestMonth, start, end]);

  const outcome = useMemo(() => {
    if (!ipca.data) return null;
    return calculateInflation({
      amount,
      startMonth: start,
      endMonth: end,
      series: ipca.data,
    });
  }, [amount, start, end, ipca.data]);

  return (
    <div className="flex flex-col gap-5">
      <section className="card p-4 sm:p-6">
        {ipca.status === "loading" && (
          <p className="text-sm text-text-dim mb-4">{t.common.loading}</p>
        )}
        {ipca.status === "error" && (
          <p className="text-sm text-amber-300 mb-4">
            {t.common.apiError}.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <MoneyInput
            id="inf-amount"
            label={t.common.amount}
            value={amount}
            onChange={setAmount}
            prefix={locale === "pt-BR" ? "R$" : "$"}
          />

          <MonthSelect
            id="inf-start"
            label={t.calc.inflation.startMonth}
            value={start}
            options={monthOptions}
            onChange={setStart}
          />

          <MonthSelect
            id="inf-end"
            label={t.calc.inflation.endMonth}
            value={end}
            options={monthOptions}
            onChange={setEnd}
          />
        </div>

        <p className="mt-4 text-xs text-text-mute">
          {t.calc.inflation.indexLabel}: IPCA · {t.common.fromBcb}
        </p>
      </section>

      {outcome && outcome.ok && (
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <ResultCard
            title={t.calc.inflation.adjustedValue}
            value={formatMoney(outcome.adjustedAmount, locale)}
            subtitle={t.calc.inflation.monthsCovered(outcome.monthsCovered)}
            accent="#8b5cf6"
          />
          <ResultCard
            title={t.calc.inflation.accumulatedInflation}
            value={formatPct(outcome.accumulatedFactor - 1, locale, 2)}
            accent="#f59e0b"
          />
          <ResultCard
            title={t.calc.inflation.purchasingPowerLost}
            value={formatPct(outcome.purchasingPowerLoss, locale, 2)}
            accent="#ef4444"
          />
        </section>
      )}

      {outcome && !outcome.ok && (
        <p className="card p-4 text-sm text-amber-300">
          {outcome.reason === "invalid-range"
            ? t.calc.inflation.rangeError
            : t.calc.inflation.missingData}
        </p>
      )}
    </div>
  );
}

function MonthSelect({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-medium uppercase tracking-wider text-text-dim"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field appearance-none bg-[rgba(11,16,32,0.6)]"
      >
        {options.length === 0 && <option value="">—</option>}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {formatMonth(opt)}
          </option>
        ))}
      </select>
    </div>
  );
}

function formatMonth(yyyymm: string): string {
  if (!yyyymm) return "";
  const [y, m] = yyyymm.split("-");
  return `${m}/${y}`;
}

function ResultCard({
  title,
  value,
  subtitle,
  accent,
}: {
  title: string;
  value: string;
  subtitle?: string;
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
      {subtitle && (
        <p className="text-[11px] text-text-mute mt-1">{subtitle}</p>
      )}
    </div>
  );
}
