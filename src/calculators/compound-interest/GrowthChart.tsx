import { useMemo, useState } from "react";
import { useI18n } from "../../shared/i18n/I18nProvider";
import type { CalcResult, MonthRow } from "./finance";
import { formatMoney } from "./finance";

interface GrowthChartProps {
  result: CalcResult;
}

interface SampledPoint {
  label: string;
  monthIndex: number;
  invested: number;
  balance: number;
  realBalance: number;
}

function sampleRows(rows: MonthRow[], suffix: { year: string; month: string }, maxPoints = 48): SampledPoint[] {
  if (rows.length === 0) return [];
  const step = Math.max(1, Math.ceil(rows.length / maxPoints));
  const labelFor = (month: number) =>
    month % 12 === 0 ? `${month / 12}${suffix.year}` : `${month}${suffix.month}`;
  const pts: SampledPoint[] = [];
  for (let idx = step - 1; idx < rows.length; idx += step) {
    const r = rows[idx];
    pts.push({
      label: labelFor(r.month),
      monthIndex: r.month,
      invested: r.invested,
      balance: r.balance,
      realBalance: r.realBalance,
    });
  }
  const last = rows[rows.length - 1];
  if (pts.length === 0 || pts[pts.length - 1].monthIndex !== last.month) {
    pts.push({
      label: labelFor(last.month),
      monthIndex: last.month,
      invested: last.invested,
      balance: last.balance,
      realBalance: last.realBalance,
    });
  }
  return pts;
}

export function GrowthChart({ result }: GrowthChartProps) {
  const { t, locale } = useI18n();
  const axisSuffix = locale === "pt-BR" ? { year: "a", month: "m" } : { year: "y", month: "m" };
  const pts = useMemo(
    () => sampleRows(result.rows, axisSuffix),
    [result.rows, axisSuffix.year, axisSuffix.month],
  );
  const [hover, setHover] = useState<number | null>(null);

  if (pts.length === 0) {
    return (
      <div className="card p-6 text-center text-text-dim">
        {t.chart.zeroPeriod}
      </div>
    );
  }

  const W = 800;
  const H = 320;
  const padding = { top: 16, right: 18, bottom: 32, left: 64 };
  const innerW = W - padding.left - padding.right;
  const innerH = H - padding.top - padding.bottom;

  const maxY = Math.max(...pts.map((p) => p.balance));
  const minY = 0;

  const xFor = (i: number) =>
    padding.left + (pts.length === 1 ? innerW / 2 : (i * innerW) / (pts.length - 1));
  const yFor = (v: number) =>
    padding.top + innerH - ((v - minY) / (maxY - minY || 1)) * innerH;

  const buildPath = (valueOf: (p: SampledPoint) => number, closeBottom = false) => {
    let d = `M ${xFor(0)} ${yFor(valueOf(pts[0]))}`;
    for (let i = 1; i < pts.length; i++) d += ` L ${xFor(i)} ${yFor(valueOf(pts[i]))}`;
    if (closeBottom) d += ` L ${xFor(pts.length - 1)} ${yFor(0)} L ${xFor(0)} ${yFor(0)} Z`;
    return d;
  };

  const balancePath = buildPath((p) => p.balance);
  const balanceArea = buildPath((p) => p.balance, true);
  const investedPath = buildPath((p) => p.invested);
  const investedArea = buildPath((p) => p.invested, true);
  const realPath = result.hasInflation ? buildPath((p) => p.realBalance) : "";

  const gridLines = 4;
  const gridValues = Array.from({ length: gridLines + 1 }, (_, k) => (maxY * k) / gridLines);

  // Rough x-axis ticks (~6 labels)
  const tickEvery = Math.max(1, Math.floor(pts.length / 6));
  const xTicks = pts
    .map((p, i) => ({ p, i }))
    .filter(({ i }) => i % tickEvery === 0 || i === pts.length - 1);

  const hovered = hover != null ? pts[hover] : null;

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const xInSvg = ((e.clientX - rect.left) / rect.width) * W;
    if (xInSvg < padding.left - 4 || xInSvg > padding.left + innerW + 4) {
      setHover(null);
      return;
    }
    const ratio = (xInSvg - padding.left) / innerW;
    const idx = Math.min(pts.length - 1, Math.max(0, Math.round(ratio * (pts.length - 1))));
    setHover(idx);
  };

  return (
    <div className="card p-4">
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <h3 className="text-sm font-semibold text-text">{t.chart.title}</h3>
        <div className="flex items-center gap-3 text-xs text-text-dim flex-wrap">
          <LegendDot color="#8b5cf6" label={t.chart.totalBalance} />
          <LegendDot color="#60a5fa" label={t.chart.invested} />
          {result.hasInflation && <LegendDot color="#f59e0b" label={t.chart.realValue} dashed />}
        </div>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        onMouseMove={handleMove}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="gBalance" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="gInvested" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {gridValues.map((v, i) => (
          <g key={i}>
            <line
              x1={padding.left}
              x2={padding.left + innerW}
              y1={yFor(v)}
              y2={yFor(v)}
              stroke="rgba(255,255,255,0.06)"
              strokeDasharray="3 4"
            />
            <text
              x={padding.left - 8}
              y={yFor(v)}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize="10"
              fill="#a0a7c4"
            >
              {abbreviate(v, locale)}
            </text>
          </g>
        ))}

        {xTicks.map(({ p, i }) => (
          <text
            key={i}
            x={xFor(i)}
            y={padding.top + innerH + 18}
            textAnchor="middle"
            fontSize="10"
            fill="#a0a7c4"
          >
            {p.label}
          </text>
        ))}

        <path d={balanceArea} fill="url(#gBalance)" />
        <path d={balancePath} fill="none" stroke="#8b5cf6" strokeWidth="2.2" />

        <path d={investedArea} fill="url(#gInvested)" />
        <path d={investedPath} fill="none" stroke="#60a5fa" strokeWidth="1.8" />

        {result.hasInflation && (
          <path
            d={realPath}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="5 5"
          />
        )}

        {hovered && (
          <g>
            <line
              x1={xFor(hover!)}
              x2={xFor(hover!)}
              y1={padding.top}
              y2={padding.top + innerH}
              stroke="rgba(255,255,255,0.35)"
              strokeDasharray="3 3"
            />
            <circle cx={xFor(hover!)} cy={yFor(hovered.balance)} r="4" fill="#8b5cf6" />
            <circle cx={xFor(hover!)} cy={yFor(hovered.invested)} r="4" fill="#60a5fa" />
            {result.hasInflation && (
              <circle cx={xFor(hover!)} cy={yFor(hovered.realBalance)} r="4" fill="#f59e0b" />
            )}
          </g>
        )}
      </svg>

      <div
        className={`mt-3 px-3 py-2 rounded-lg bg-[rgba(11,16,32,0.6)] border border-[rgba(38,48,99,0.65)] text-xs text-text-dim flex flex-wrap gap-x-5 gap-y-1 transition-opacity ${hovered ? "opacity-100" : "opacity-0"}`}
        aria-hidden={!hovered}
      >
        <span>
          {t.chart.month}{" "}
          <span className="text-text font-medium">{hovered ? hovered.monthIndex : "—"}</span>
        </span>
        <span>
          {t.chart.balance}{" "}
          <span className="text-text font-medium">
            {hovered ? formatMoney(hovered.balance, locale) : "—"}
          </span>
        </span>
        <span>
          {t.chart.investedShort}{" "}
          <span className="text-text font-medium">
            {hovered ? formatMoney(hovered.invested, locale) : "—"}
          </span>
        </span>
        {result.hasInflation && (
          <span>
            {t.chart.real}{" "}
            <span className="text-text font-medium">
              {hovered ? formatMoney(hovered.realBalance, locale) : "—"}
            </span>
          </span>
        )}
      </div>
    </div>
  );
}

function LegendDot({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block w-5 h-[3px] rounded"
        style={{
          background: dashed
            ? `repeating-linear-gradient(90deg, ${color} 0 4px, transparent 4px 8px)`
            : color,
        }}
      />
      <span>{label}</span>
    </span>
  );
}

function abbreviate(v: number, locale: string): string {
  const fmt = (n: number, digits: number) =>
    n.toLocaleString(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits });
  if (v >= 1_000_000) return `R$ ${fmt(v / 1_000_000, 1)}M`;
  if (v >= 1_000) return `R$ ${fmt(v / 1_000, 0)}k`;
  return `R$ ${fmt(v, 0)}`;
}
