import { useEffect, useMemo, useState } from "react";
import { NumberInput } from "../../shared/components/NumberInput";
import { Segmented } from "../../shared/components/Segmented";
import { useI18n } from "../../shared/i18n/I18nProvider";
import { useLatestSelic } from "../../shared/hooks/useBcbSeries";
import { formatPct, formatNumber } from "../../shared/utils/format";
import { convertRate } from "./finance";
import type { RateUnit } from "./finance";

const DEFAULT_CDI_ANNUAL_PCT = 10.75;

export function RateConversionCalculator() {
  const { t, locale } = useI18n();
  const selic = useLatestSelic();

  const [rate, setRate] = useState(100);
  const [unit, setUnit] = useState<RateUnit>("pctCdi");
  const [cdiPct, setCdiPct] = useState(DEFAULT_CDI_ANNUAL_PCT);
  const [cdiTouched, setCdiTouched] = useState(false);

  useEffect(() => {
    if (cdiTouched) return;
    if (selic.status === "success" && selic.data != null) {
      // Selic meta is published as % a.a.; treat ~Selic-0.10pp as the CDI proxy.
      const cdi = selic.data * 100 - 0.1;
      setCdiPct(Number(cdi.toFixed(2)));
    }
  }, [selic.status, selic.data, cdiTouched]);

  const result = useMemo(
    () => convertRate({ rate, unit, cdiAnnual: cdiPct / 100 }),
    [rate, unit, cdiPct],
  );

  const handleReset = () => {
    setRate(100);
    setUnit("pctCdi");
    setCdiTouched(false);
    if (selic.status === "success" && selic.data != null) {
      setCdiPct(Number((selic.data * 100 - 0.1).toFixed(2)));
    } else {
      setCdiPct(DEFAULT_CDI_ANNUAL_PCT);
    }
  };

  const cdiBadge = selic.status === "loading"
    ? t.common.loading
    : selic.status === "error"
      ? t.common.estimated
      : t.common.fromBcb;

  const unitOptions: { value: RateUnit; label: string }[] = [
    { value: "daily", label: t.calc.rateConversion.unitDaily },
    { value: "monthly", label: t.calc.rateConversion.unitMonthly },
    { value: "annual", label: t.calc.rateConversion.unitAnnual },
    { value: "pctCdi", label: t.calc.rateConversion.unitPctCdi },
  ];

  return (
    <div className="flex flex-col gap-5">
      <section className="card p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-text-dim">
              {t.calc.rateConversion.inputRate}
            </label>
            <div className="flex gap-2">
              <NumberInput
                value={rate}
                onChange={setRate}
                suffix="%"
                decimals={2}
              />
            </div>
            <Segmented
              ariaLabel={t.calc.rateConversion.inputUnit}
              value={unit}
              onChange={setUnit}
              options={unitOptions}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-text-dim">
              {t.calc.rateConversion.cdiReference}
            </label>
            <NumberInput
              value={cdiPct}
              onChange={(v) => {
                setCdiPct(v);
                setCdiTouched(true);
              }}
              suffix="% a.a."
              decimals={2}
            />
            <span className="text-xs text-text-mute">
              {t.calc.rateConversion.cdiReferenceHint} ({cdiBadge})
            </span>
            {selic.status === "error" && (
              <span className="text-xs text-amber-300">{t.common.apiError}.</span>
            )}
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <button type="button" className="btn-ghost" onClick={handleReset}>
            {t.common.reset}
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <ResultCard
          title={t.calc.rateConversion.effectiveDaily}
          value={formatPct(result.daily, locale, 4)}
          accent="#22d3ee"
        />
        <ResultCard
          title={t.calc.rateConversion.effectiveMonthly}
          value={formatPct(result.monthly, locale, 4)}
          accent="#60a5fa"
        />
        <ResultCard
          title={t.calc.rateConversion.effectiveAnnual}
          value={formatPct(result.annual, locale, 4)}
          accent="#8b5cf6"
        />
        <ResultCard
          title={t.calc.rateConversion.pctOfCdi}
          value={
            Number.isFinite(result.pctOfCdi)
              ? `${formatNumber(result.pctOfCdi * 100, locale, 2)}%`
              : "—"
          }
          accent="#10b981"
        />
      </section>
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
