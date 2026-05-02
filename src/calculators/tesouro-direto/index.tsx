import { useEffect, useMemo, useState } from "react";
import { MoneyInput } from "../../shared/components/MoneyInput";
import { NumberInput } from "../../shared/components/NumberInput";
import { Segmented } from "../../shared/components/Segmented";
import { useI18n } from "../../shared/i18n/I18nProvider";
import { useLatestSelic } from "../../shared/hooks/useBcbSeries";
import { formatMoney, formatPct } from "../../shared/utils/format";
import { calculateTesouro } from "./finance";
import type { BondResult, TimeUnit } from "./finance";

const DEFAULT_SELIC_PCT = 10.75;
const DEFAULT_IPCA_PCT = 4.0;
const DEFAULT_IPCA_SPREAD_PCT = 6.0;
const DEFAULT_PREFIXED_PCT = 11.0;

export function TesouroDiretoCalculator() {
  const { t, locale } = useI18n();
  const selic = useLatestSelic();

  const [amount, setAmount] = useState(10000);
  const [period, setPeriod] = useState(5);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>("years");

  const [selicPct, setSelicPct] = useState(DEFAULT_SELIC_PCT);
  const [selicTouched, setSelicTouched] = useState(false);
  const [selicSpread, setSelicSpread] = useState(0);

  const [ipcaPct, setIpcaPct] = useState(DEFAULT_IPCA_PCT);
  const [ipcaSpread, setIpcaSpread] = useState(DEFAULT_IPCA_SPREAD_PCT);

  const [prefixedPct, setPrefixedPct] = useState(DEFAULT_PREFIXED_PCT);
  const [custodyFee, setCustodyFee] = useState(0.2);

  useEffect(() => {
    if (selicTouched) return;
    if (selic.status === "success" && selic.data != null) {
      setSelicPct(Number((selic.data * 100).toFixed(2)));
    }
  }, [selic.status, selic.data, selicTouched]);

  const result = useMemo(
    () =>
      calculateTesouro({
        amount,
        period,
        timeUnit,
        selicAnnualPct: selicPct,
        selicSpreadPct: selicSpread,
        ipcaAnnualPct: ipcaPct,
        ipcaSpreadPct: ipcaSpread,
        prefixedAnnualPct: prefixedPct,
        custodyFeePct: custodyFee,
      }),
    [
      amount,
      period,
      timeUnit,
      selicPct,
      selicSpread,
      ipcaPct,
      ipcaSpread,
      prefixedPct,
      custodyFee,
    ],
  );

  const handleReset = () => {
    setAmount(10000);
    setPeriod(5);
    setTimeUnit("years");
    setSelicTouched(false);
    setSelicPct(
      selic.status === "success" && selic.data != null
        ? Number((selic.data * 100).toFixed(2))
        : DEFAULT_SELIC_PCT,
    );
    setSelicSpread(0);
    setIpcaPct(DEFAULT_IPCA_PCT);
    setIpcaSpread(DEFAULT_IPCA_SPREAD_PCT);
    setPrefixedPct(DEFAULT_PREFIXED_PCT);
    setCustodyFee(0.2);
  };

  const prefix = locale === "pt-BR" ? "R$" : "$";
  const selicBadge =
    selic.status === "loading"
      ? t.common.loading
      : selic.status === "error"
        ? t.common.estimated
        : t.common.fromBcb;

  return (
    <div className="flex flex-col gap-5">
      <section className="card p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <MoneyInput
            id="td-amount"
            label={t.calc.tesouroDireto.amount}
            value={amount}
            onChange={setAmount}
            prefix={prefix}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-text-dim">
              {t.calc.tesouroDireto.term}
            </label>
            <div className="flex gap-2">
              <NumberInput
                value={period}
                onChange={setPeriod}
                decimals={0}
                min={1}
              />
              <Segmented
                ariaLabel={t.calc.tesouroDireto.term}
                value={timeUnit}
                onChange={setTimeUnit}
                options={[
                  { value: "months", label: t.common.months },
                  { value: "years", label: t.common.years },
                ]}
              />
            </div>
            <span className="text-xs text-text-mute">
              {t.calc.tesouroDireto.taxRateLabel(
                formatPct(result.taxRate, locale, 1),
              )}
            </span>
          </div>
        </div>

        <div className="mt-5 border-t border-[rgba(38,48,99,0.5)] pt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-text-dim">
              {t.calc.tesouroDireto.selicAnnual}
            </label>
            <NumberInput
              value={selicPct}
              onChange={(v) => {
                setSelicPct(v);
                setSelicTouched(true);
              }}
              suffix="% a.a."
              decimals={2}
            />
            <span className="text-xs text-text-mute">{selicBadge}</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-text-dim">
              {t.calc.tesouroDireto.selicSpread}
            </label>
            <NumberInput
              value={selicSpread}
              onChange={setSelicSpread}
              suffix="% a.a."
              decimals={2}
            />
            <span className="text-xs text-text-mute">
              {t.calc.tesouroDireto.selicSpreadHint}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-text-dim">
              {t.calc.tesouroDireto.ipcaAnnual}
            </label>
            <NumberInput
              value={ipcaPct}
              onChange={setIpcaPct}
              suffix="% a.a."
              decimals={2}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-text-dim">
              {t.calc.tesouroDireto.ipcaSpread}
            </label>
            <NumberInput
              value={ipcaSpread}
              onChange={setIpcaSpread}
              suffix="% a.a."
              decimals={2}
            />
            <span className="text-xs text-text-mute">
              {t.calc.tesouroDireto.ipcaSpreadHint}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-text-dim">
              {t.calc.tesouroDireto.prefixedAnnual}
            </label>
            <NumberInput
              value={prefixedPct}
              onChange={setPrefixedPct}
              suffix="% a.a."
              decimals={2}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-text-dim">
              {t.calc.tesouroDireto.custodyFee}
            </label>
            <NumberInput
              value={custodyFee}
              onChange={setCustodyFee}
              suffix="% a.a."
              decimals={2}
            />
            <span className="text-xs text-text-mute">
              {t.calc.tesouroDireto.custodyFeeHint}
            </span>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <button type="button" className="btn-ghost" onClick={handleReset}>
            {t.common.reset}
          </button>
        </div>
      </section>

      <section className="card overflow-hidden">
        <h3 className="px-4 py-3 text-sm font-semibold text-text border-b border-[rgba(38,48,99,0.5)]">
          {t.calc.tesouroDireto.tableTitle}
        </h3>
        <div className="table-wrap">
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-[rgba(11,16,32,0.7)] text-text-dim">
              <tr>
                <th className="text-left px-3 py-2 font-medium">
                  {t.calc.tesouroDireto.colTitle}
                </th>
                <th className="text-right px-3 py-2 font-medium">
                  {t.calc.tesouroDireto.colGross}
                </th>
                <th className="text-right px-3 py-2 font-medium">
                  {t.calc.tesouroDireto.colTax}
                </th>
                <th className="text-right px-3 py-2 font-medium">
                  {t.calc.tesouroDireto.colCustody}
                </th>
                <th className="text-right px-3 py-2 font-medium">
                  {t.calc.tesouroDireto.colNet}
                </th>
              </tr>
            </thead>
            <tbody>
              <BondRow
                title={t.calc.tesouroDireto.titleSelic}
                bond={result.selic}
                accent="#22d3ee"
                locale={locale}
              />
              <BondRow
                title={t.calc.tesouroDireto.titleIpca}
                bond={result.ipca}
                accent="#f59e0b"
                locale={locale}
              />
              <BondRow
                title={t.calc.tesouroDireto.titlePrefixed}
                bond={result.prefixed}
                accent="#a78bfa"
                locale={locale}
              />
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function BondRow({
  title,
  bond,
  accent,
  locale,
}: {
  title: string;
  bond: BondResult;
  accent: string;
  locale: string;
}) {
  return (
    <tr className="odd:bg-white/[0.015] hover:bg-white/[0.04] transition-colors">
      <td className="px-3 py-2">
        <span className="inline-flex items-center gap-2">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ background: accent }}
          />
          <span className="font-medium text-text">{title}</span>
        </span>
      </td>
      <td className="px-3 py-2 text-right">{formatMoney(bond.finalGross, locale)}</td>
      <td className="px-3 py-2 text-right text-amber-300">
        −{formatMoney(bond.ir, locale)}
      </td>
      <td className="px-3 py-2 text-right text-amber-300">
        −{formatMoney(bond.custodyFee, locale)}
      </td>
      <td className="px-3 py-2 text-right font-semibold text-emerald-300">
        {formatMoney(bond.netAtMaturity, locale)}
      </td>
    </tr>
  );
}
