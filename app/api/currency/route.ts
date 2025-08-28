import { NextResponse } from 'next/server';

type CurrencyResult = {
  USD: number;
  EUR: number;
  lastUpdate: string;
  source: string;
};

let cachedRates: CurrencyResult | null = null;
let cacheExpiresAt = 0;

const DEFAULT_TTL_MS = 30 * 60 * 1000; // 30 minutes
const TTL_MS = Number(process.env.CURRENCY_CACHE_TTL_MS || DEFAULT_TTL_MS);

async function fetchFromMonobank(): Promise<CurrencyResult | null> {
  try {
    const res = await fetch('https://api.monobank.ua/bank/currency', {
      // 10s timeout via AbortController would be nice; keep simple
      // Next.js RequestInit does not have timeout; rely on platform
      headers: { 'User-Agent': 'ingco-fe/1.0' },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{
      currencyCodeA: number;
      currencyCodeB: number;
      rateSell?: number;
      rateBuy?: number;
      rateCross?: number;
    }>;
    const usd = data.find(
      (d) => d.currencyCodeA === 840 && d.currencyCodeB === 980,
    );
    const eur = data.find(
      (d) => d.currencyCodeA === 978 && d.currencyCodeB === 980,
    );
    if (!usd || !eur) return null;
    const usdRate = usd.rateSell ?? usd.rateBuy ?? usd.rateCross;
    const eurRate = eur.rateSell ?? eur.rateBuy ?? eur.rateCross;
    if (!usdRate || !eurRate) return null;
    return {
      USD: parseFloat(usdRate.toFixed(2)),
      EUR: parseFloat(eurRate.toFixed(2)),
      lastUpdate: new Date().toISOString(),
      source: 'monobank',
    };
  } catch {
    return null;
  }
}

async function fetchFromPrivat(): Promise<CurrencyResult | null> {
  try {
    const res = await fetch(
      'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5',
      { headers: { 'User-Agent': 'ingco-fe/1.0' }, cache: 'no-store' },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{
      ccy: string;
      base_ccy: string;
      buy: string;
      sale: string;
    }>;
    const usd = data.find((d) => d.ccy === 'USD' && d.base_ccy === 'UAH');
    const eur = data.find((d) => d.ccy === 'EUR' && d.base_ccy === 'UAH');
    if (!usd || !eur) return null;
    const usdRate = Number(usd.sale || usd.buy);
    const eurRate = Number(eur.sale || eur.buy);
    if (!usdRate || !eurRate || Number.isNaN(usdRate) || Number.isNaN(eurRate))
      return null;
    return {
      USD: parseFloat(usdRate.toFixed(2)),
      EUR: parseFloat(eurRate.toFixed(2)),
      lastUpdate: new Date().toISOString(),
      source: 'privatbank',
    };
  } catch {
    return null;
  }
}

async function fetchFromNBU(): Promise<CurrencyResult | null> {
  try {
    const res = await fetch(
      'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json',
      { headers: { 'User-Agent': 'ingco-fe/1.0' }, cache: 'no-store' },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{
      cc: string;
      rate: number;
    }>;
    const usd = data.find((d) => d.cc === 'USD');
    const eur = data.find((d) => d.cc === 'EUR');
    if (!usd || !eur) return null;
    const usdRate = usd.rate;
    const eurRate = eur.rate;
    if (!usdRate || !eurRate) return null;
    return {
      USD: parseFloat(usdRate.toFixed(2)),
      EUR: parseFloat(eurRate.toFixed(2)),
      lastUpdate: new Date().toISOString(),
      source: 'nbu',
    };
  } catch {
    return null;
  }
}

// Optional: Fixer.io via API key if provided
async function fetchFromFixer(): Promise<CurrencyResult | null> {
  const apiKey = process.env.FIXER_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch(
      `https://data.fixer.io/api/latest?access_key=${apiKey}&symbols=USD,EUR,UAH`,
      { headers: { 'User-Agent': 'ingco-fe/1.0' }, cache: 'no-store' },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      success: boolean;
      rates?: Record<string, number>;
    };
    if (!data.success || !data.rates) return null;
    const rates = data.rates;
    // Fixer is base EUR by default on free plan; compute UAH per USD/EUR
    const uahPerEur = rates['UAH'];
    const usdPerEur = rates['USD'];
    if (!uahPerEur || !usdPerEur) return null;
    const usdUah = uahPerEur / (1 / usdPerEur);
    const eurUah = uahPerEur;
    return {
      USD: parseFloat(usdUah.toFixed(2)),
      EUR: parseFloat(eurUah.toFixed(2)),
      lastUpdate: new Date().toISOString(),
      source: 'fixer',
    };
  } catch {
    return null;
  }
}

async function getRates(): Promise<CurrencyResult> {
  const now = Date.now();
  if (cachedRates && cacheExpiresAt > now) {
    return cachedRates;
  }

  const providers: Array<() => Promise<CurrencyResult | null>> = [
    fetchFromMonobank,
    fetchFromPrivat,
    fetchFromNBU,
    fetchFromFixer,
  ];

  for (const provider of providers) {
    const result = await provider();
    if (result && result.USD && result.EUR) {
      cachedRates = result;
      cacheExpiresAt = now + TTL_MS;
      return result;
    }
  }

  // Hard fallback if every provider failed
  const fallback: CurrencyResult = {
    USD: 41.0,
    EUR: 44.0,
    lastUpdate: new Date().toISOString(),
    source: 'fallback-static',
  };
  cachedRates = fallback;
  cacheExpiresAt = now + TTL_MS;
  return fallback;
}

export async function GET() {
  try {
    const data = await getRates();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': `public, max-age=60, s-maxage=${Math.floor(TTL_MS / 1000)}`,
      },
    });
  } catch (e) {
    const fallback: CurrencyResult = {
      USD: 41.0,
      EUR: 44.0,
      lastUpdate: new Date().toISOString(),
      source: 'fallback-error',
    };
    return NextResponse.json(fallback, { status: 200 });
  }
}
