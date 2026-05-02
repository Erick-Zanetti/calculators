// Thin client for the Banco Central do Brasil "SGS" public series API.
// Endpoint shape:
//   https://api.bcb.gov.br/dados/serie/bcdata.sgs.{code}/dados?formato=json&dataInicial=DD/MM/YYYY&dataFinal=DD/MM/YYYY

export interface SgsPoint {
  date: string; // ISO yyyy-mm-dd
  value: number; // numeric value as published by BCB
}

export const SGS_CODES = {
  // IPCA monthly variation (% mês)
  ipcaMonthly: 433,
  // Selic meta (% a.a.) — daily series, latest entry is the current meta
  selicMeta: 432,
  // CDI accumulated in the month, annualised (% a.a.)
  cdiMonthlyAnnualised: 4389,
} as const;

interface CacheEntry<T> {
  expiresAt: number;
  data: T;
}

const CACHE_PREFIX = "calculadoras.bcb.";
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

function readCache<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry<T>;
    if (Date.now() > entry.expiresAt) return null;
    return entry.data;
  } catch {
    return null;
  }
}

function writeCache<T>(key: string, data: T, ttlMs = TWENTY_FOUR_HOURS) {
  if (typeof window === "undefined") return;
  try {
    const entry: CacheEntry<T> = { expiresAt: Date.now() + ttlMs, data };
    window.localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch {
    /* localStorage unavailable / quota exceeded */
  }
}

function toBcbDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function parseBcbDate(s: string): string {
  // BCB returns "DD/MM/YYYY"
  const [dd, mm, yyyy] = s.split("/");
  return `${yyyy}-${mm}-${dd}`;
}

interface BcbRow {
  data: string;
  valor: string;
}

async function fetchSgs(
  code: number,
  start?: Date,
  end?: Date,
): Promise<SgsPoint[]> {
  const params = new URLSearchParams({ formato: "json" });
  if (start) params.set("dataInicial", toBcbDate(start));
  if (end) params.set("dataFinal", toBcbDate(end));
  const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${code}/dados?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`BCB SGS ${code} responded ${res.status}`);
  const rows = (await res.json()) as BcbRow[];
  return rows.map((r) => ({
    date: parseBcbDate(r.data),
    value: Number(r.valor.replace(",", ".")),
  }));
}

export async function fetchIpcaMonthly(): Promise<SgsPoint[]> {
  const cacheKey = "ipca.monthly";
  const cached = readCache<SgsPoint[]>(cacheKey);
  if (cached) return cached;
  // Pull a long history; BCB returns ~500 rows/series — IPCA goes back to 1980
  const data = await fetchSgs(SGS_CODES.ipcaMonthly, new Date(1995, 0, 1));
  writeCache(cacheKey, data);
  return data;
}

export async function fetchLatestSelicMeta(): Promise<number | null> {
  const cacheKey = "selic.meta.latest";
  const cached = readCache<number>(cacheKey);
  if (cached != null) return cached;
  // Last 30 days is enough to grab the latest published meta.
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  const points = await fetchSgs(SGS_CODES.selicMeta, start, end);
  const last = points.at(-1);
  if (!last) return null;
  // BCB returns Selic meta as % a.a. (e.g. 11.75 for 11.75%); convert to decimal.
  const decimal = last.value / 100;
  writeCache(cacheKey, decimal);
  return decimal;
}
