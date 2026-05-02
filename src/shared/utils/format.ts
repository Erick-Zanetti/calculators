export function formatMoney(value: number, locale: string = "pt-BR"): string {
  const currency = locale === "pt-BR" ? "BRL" : "USD";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPct(
  value: number,
  locale: string = "pt-BR",
  digits = 2,
): string {
  return `${(value * 100).toLocaleString(locale, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })}%`;
}

export function formatNumber(
  value: number,
  locale: string = "pt-BR",
  digits = 2,
): string {
  return value.toLocaleString(locale, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

export function formatInt(value: number, locale: string = "pt-BR"): string {
  return Math.round(value).toLocaleString(locale);
}

export function abbreviateMoney(value: number, locale: string = "pt-BR"): string {
  const symbol = locale === "pt-BR" ? "R$" : "$";
  const fmt = (n: number, digits: number) =>
    n.toLocaleString(locale, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
  if (Math.abs(value) >= 1_000_000) return `${symbol} ${fmt(value / 1_000_000, 1)}M`;
  if (Math.abs(value) >= 1_000) return `${symbol} ${fmt(value / 1_000, 0)}k`;
  return `${symbol} ${fmt(value, 0)}`;
}
