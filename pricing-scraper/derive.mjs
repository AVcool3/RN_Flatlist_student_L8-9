#!/usr/bin/env node
// ============================================================================
// pricing-scraper/derive.mjs
//
// Deterministic post-processing that runs AFTER run.mjs. The Firecrawl agent
// is good at reading pages but two things should never be left to an LLM:
//
//   1. SANITY CHECKS. Agents sometimes drop thousands separators, e.g. reading
//      "₩10,900" as 11.99 or "COP 18.500" as 18.5. Every price is checked
//      against a per-currency plausible range for a monthly music subscription
//      and flagged as "suspect" if it falls outside. Suspect rows are kept in
//      the data (nothing is deleted) but excluded from derived metrics and
//      listed in the brief so a human can verify them.
//
//   2. FX CONVERSION. USD-normalized comparisons need a dated, citable rate.
//      We fetch daily USD rates from open.er-api.com (free, no key, ECB-style
//      reference rates) and record the provider, timestamp and URL next to
//      every converted number, so the derivation is reproducible.
//
// USAGE
//   node derive.mjs results/baseline.json        -> results/baseline-derived.json
//   node derive.mjs results/2026-09-26.json      -> results/2026-09-26-derived.json
//   node derive.mjs <file> --no-network          -> skip FX (checks only)
//
// OUTPUT (<name>-derived.json)
//   {
//     source_file, generated_at, fx: {provider, as_of, url, base},
//     suspect_prices: [ {country, service, tier, price, currency, reason} ],
//     derived_metrics: [ per-country Spotify/Apple/YouTube Individual in USD,
//                        Spotify's % premium vs each, last hike date ],
//     summary: { rows, suspect, countries_with_spotify, countries_compared }
//   }
// ============================================================================

import { readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";

// ---------------------------------------------------------------------------
// 1. Plausible MONTHLY price range per currency for a single-user music plan.
//    Ranges are deliberately wide (about 0.3x to 3x of typical). A price outside
//    the range is almost certainly a parsing error, not a real price. Add a
//    currency here if a new country is added to config.mjs.
// ---------------------------------------------------------------------------
const PLAUSIBLE_MONTHLY = {
  USD: [3, 40],     CAD: [4, 50],     MXN: [60, 500],
  GBP: [3, 40],     EUR: [3, 40],     SEK: [40, 400],   NOK: [40, 400],
  DKK: [40, 400],   PLN: [10, 100],   CHF: [4, 50],     TRY: [30, 800],
  BRL: [8, 100],    ARS: [1000, 50000], COP: [8000, 80000], CLP: [2000, 20000],
  PEN: [8, 80],     JPY: [400, 4000], KRW: [4000, 40000], AUD: [5, 50],
  INR: [50, 700],   IDR: [20000, 200000], PHP: [60, 600], THB: [60, 600],
  VND: [20000, 300000], NGN: [500, 20000], ZAR: [30, 300], EGP: [30, 400],
  SAR: [10, 100],   AED: [10, 100],
};

// ---------------------------------------------------------------------------
// 2. Helpers
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const inputPath = args.find((a) => !a.startsWith("--"));
const noNetwork = args.includes("--no-network");
if (!inputPath) {
  console.error("usage: node derive.mjs <results/file.json> [--no-network]");
  process.exit(1);
}

const raw = JSON.parse(readFileSync(inputPath, "utf8"));
// The CLI wraps the agent's answer under "data"; a bare schema object also works.
const data = raw.data ?? raw;
const rows = data.pricing_baseline ?? [];

// Normalise a few things the agent is inconsistent about.
const cc = (s) => String(s || "").trim().toUpperCase();          // country code
const isMonthly = (r) => /month/i.test(r.period || "");
const isIndividual = (r) => /^(individual|standard)\b/i.test(r.tier || "");
const isSpotify = (r) => /spotify/i.test(r.service || "");
const isAppleMusic = (r) => /apple music/i.test(r.service || "");
const isYouTubePremium = (r) => /youtube premium/i.test(r.service || "") && !/lite/i.test(r.tier || "");

// ---------------------------------------------------------------------------
// 3. Sanity-check every row
// ---------------------------------------------------------------------------
const suspect = [];
for (const r of rows) {
  const range = PLAUSIBLE_MONTHLY[cc(r.currency)];
  const price = Number(r.price);
  // Annual prices are allowed up to 12x the monthly ceiling.
  const [lo, hi] = range ? (isMonthly(r) ? range : [range[0], range[1] * 12]) : [null, null];
  let reason = null;
  if (!Number.isFinite(price) || price <= 0) reason = "price is not a positive number";
  else if (!range) reason = `no plausible range configured for currency ${r.currency}`;
  else if (price < lo) reason = `below plausible ${r.currency} range (${lo}-${hi}); likely missing thousands digits`;
  else if (price > hi) reason = `above plausible ${r.currency} range (${lo}-${hi})`;
  if (reason) suspect.push({ country: cc(r.country), service: r.service, tier: r.tier, price: r.price, currency: r.currency, period: r.period, reason, price_citation: r.price_citation });
}
const suspectKey = new Set(suspect.map((s) => `${s.country}|${s.service}|${s.tier}`));
const ok = (r) => !suspectKey.has(`${cc(r.country)}|${r.service}|${r.tier}`);

// ---------------------------------------------------------------------------
// 4. FX rates (USD base). Recorded with provider + timestamp for citation.
// ---------------------------------------------------------------------------
let fx = { provider: null, as_of: null, url: null, base: "USD", rates: {} };
if (!noNetwork) {
  const url = "https://open.er-api.com/v6/latest/USD";
  try {
    const res = await fetch(url);
    const j = await res.json();
    if (j.result !== "success") throw new Error(`FX API result=${j.result}`);
    fx = { provider: j.provider, as_of: j.time_last_update_utc, url, base: "USD", rates: j.rates };
  } catch (e) {
    console.error(`[derive] FX fetch failed (${e.message}); derived_metrics will be empty.`);
  }
}
const toUsd = (price, currency) => {
  const rate = fx.rates[cc(currency)];
  return rate ? Number((price / rate).toFixed(2)) : null;
};

// ---------------------------------------------------------------------------
// 5. Per-country derived metrics (Individual, monthly, non-suspect rows only)
// ---------------------------------------------------------------------------
const pick = (pred) => {
  const m = new Map();
  for (const r of rows) if (pred(r) && isIndividual(r) && isMonthly(r) && ok(r)) m.set(cc(r.country), r);
  return m;
};
const spot = pick(isSpotify), apple = pick(isAppleMusic), yt = pick(isYouTubePremium);

// Last Spotify hike date per country from spotify_price_history (if present).
const lastHike = new Map();
for (const h of data.spotify_price_history ?? []) {
  const c = cc(h.country);
  const d = h.effective_date && h.effective_date !== "unknown" ? h.effective_date : h.announced_date;
  if (c.length === 2 && d && d !== "unknown" && (!lastHike.has(c) || d > lastHike.get(c))) lastHike.set(c, d);
}

const pct = (a, b) => (a != null && b != null && b !== 0 ? Number((((a - b) / b) * 100).toFixed(1)) : null);
const derived = [];
for (const [country, s] of [...spot.entries()].sort()) {
  const sUsd = toUsd(Number(s.price), s.currency);
  const a = apple.get(country), y = yt.get(country);
  const aUsd = a ? toUsd(Number(a.price), a.currency) : null;
  const yUsd = y ? toUsd(Number(y.price), y.currency) : null;
  derived.push({
    country,
    currency: cc(s.currency),
    fx_rate_to_usd: fx.rates[cc(s.currency)] ?? null,
    fx_source: fx.url ? `${fx.url} (${fx.provider}, ${fx.as_of})` : "not fetched",
    spotify_individual_local: Number(s.price),
    spotify_individual_usd: sUsd,
    spotify_citation: s.price_citation,
    apple_music_individual_local: a ? Number(a.price) : null,
    apple_music_individual_usd: aUsd,
    youtube_premium_individual_local: y ? Number(y.price) : null,
    youtube_premium_individual_usd: yUsd,
    spotify_vs_apple_pct: pct(sUsd, aUsd),      // positive = Spotify pricier
    spotify_vs_youtube_pct: pct(sUsd, yUsd),
    last_spotify_hike_date: lastHike.get(country) ?? null,
  });
}

// ---------------------------------------------------------------------------
// 6. Write <name>-derived.json next to the input
// ---------------------------------------------------------------------------
const outPath = join(dirname(inputPath), basename(inputPath, ".json") + "-derived.json");
const out = {
  source_file: basename(inputPath),
  generated_at: new Date().toISOString(),
  fx: { provider: fx.provider, as_of: fx.as_of, url: fx.url, base: fx.base },
  suspect_prices: suspect,
  derived_metrics: derived,
  summary: {
    rows: rows.length,
    suspect: suspect.length,
    countries_with_spotify_individual: spot.size,
    countries_compared_vs_apple: derived.filter((d) => d.spotify_vs_apple_pct != null).length,
    countries_compared_vs_youtube: derived.filter((d) => d.spotify_vs_youtube_pct != null).length,
  },
};
writeFileSync(outPath, JSON.stringify(out, null, 2));

// Console report so the daily session can paste it into the brief.
console.log(`[derive] ${outPath}`);
console.log(`[derive] rows=${rows.length} suspect=${suspect.length} spotify_countries=${spot.size} fx=${fx.as_of ?? "none"}`);
if (suspect.length) {
  console.log("\nSUSPECT PRICES (kept in data, excluded from metrics; verify by hand):");
  for (const s of suspect) console.log(`  ${s.country} ${s.service} ${s.tier}: ${s.price} ${s.currency} -> ${s.reason}`);
}
console.log("\nSPOTIFY INDIVIDUAL, USD-NORMALIZED (positive % = Spotify pricier):");
console.log("  CC   local            USD    vsApple  vsYouTube");
for (const d of derived) {
  console.log(`  ${d.country}  ${String(d.spotify_individual_local).padStart(8)} ${d.currency}  ${String(d.spotify_individual_usd ?? "-").padStart(6)}  ${String(d.spotify_vs_apple_pct ?? "-").padStart(7)}  ${String(d.spotify_vs_youtube_pct ?? "-").padStart(9)}`);
}
