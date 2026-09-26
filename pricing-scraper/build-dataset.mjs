#!/usr/bin/env node
// ============================================================================
// pricing-scraper/build-dataset.mjs
//
// Turns every result file in results/ into the two things a stock pitch needs:
//
//   results/master-table.csv   one long table:
//       date | country | metric | spotify | currency | apple | youtube | previous | change_pct | source_url | flag
//     e.g.   2026-09-25 | US | Individual price | 12.99 | USD | 11.99 | 15.99 | 11.99 | 8.3 | ...
//
//   results/indicators.csv  +  results/indicators.md   per (date, country):
//       pricing_power_index        Spotify Individual / average of Apple + YouTube Individual
//       monetization_depth         monetization products available / 9 (list in config.mjs)
//       promotion_intensity        Spotify plans with a promo / Spotify plans offered
//       feature_monetization_index products available / union of products seen anywhere that day
//       competitor_response_lag    days from a Spotify price change to the next Apple/YouTube move
//
// Everything is computed ONLY from the JSON files; nothing is estimated. When
// an input is missing the cell is left blank, and the indicators.md notes say
// which workstream would fill it.
//
// USAGE
//   node pricing-scraper/build-dataset.mjs
//
// Input files recognised (all under results/):
//   baseline.json, baseline-<workstream>.json, YYYY-MM-DD.json, YYYY-MM-DD-<workstream>.json
//   baseline-derived.json, YYYY-MM-DD-derived.json   (from derive.mjs: USD metrics)
// Files with "-only" in the name (old-schema archives) are skipped.
// ============================================================================

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { monetizationProducts, runWindow } from "./config.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const resultsDir = join(here, "results");

// ---------------------------------------------------------------------------
// 1. Load and group result files by date
// ---------------------------------------------------------------------------
const FILE_RE = /^(baseline|\d{4}-\d{2}-\d{2})(?:-([a-z]+))?\.json$/;

const byDate = new Map(); // date -> { pricing_baseline: [...], promotions: [...], ... , files: [...] }
for (const name of readdirSync(resultsDir).sort()) {
  const m = name.match(FILE_RE);
  if (!m || name.includes("-only")) continue;
  let doc;
  try { doc = JSON.parse(readFileSync(join(resultsDir, name), "utf8")); } catch { console.warn(`[dataset] skip ${name}: not JSON`); continue; }
  const d = doc.data ?? doc;
  if (!d || typeof d !== "object") continue;
  // Baseline files carry their own date; daily files are dated by filename.
  // Baseline files carry their own date; derive.mjs output has none, so a
  // baseline-derived.json is dated like baseline.json (runWindow.baselineDate).
  const date = m[1] === "baseline" ? (d.baseline_date || runWindow.baselineDate) : m[1];
  const bucket = byDate.get(date) ?? { files: [] };
  bucket.files.push(name);
  for (const [k, v] of Object.entries(d)) if (Array.isArray(v)) bucket[k] = [...(bucket[k] ?? []), ...v];
  byDate.set(date, bucket);
}
const dates = [...byDate.keys()].sort();
if (!dates.length) { console.error("[dataset] no result files found"); process.exit(1); }

// ---------------------------------------------------------------------------
// 2. Small helpers
// ---------------------------------------------------------------------------
const up = (s) => String(s ?? "").toUpperCase();
const isSpotify = (r) => /spotify/i.test(r.service ?? "");
const isApple = (r) => /^apple music/i.test(r.service ?? "");     // Apple One is a bundle, not comparable
const isYouTube = (r) => /^youtube premium/i.test(r.service ?? ""); // YouTube Music Premium is cheaper, not comparable
const num = (v) => (typeof v === "number" && Number.isFinite(v) ? v : null);

// Tier names differ across services and countries; fold them to one label so
// "Spotify Standard" lines up with "Apple Music Individual".
const TIER_MAP = { standard: "Individual", premium: "Individual", "family 4": "Family", "family 6": "Family" };
const tierOf = (r) => { const t = String(r.tier ?? "").trim(); return TIER_MAP[t.toLowerCase()] ?? t; };

// "1 month free", "3 months for $0", "Try 2 months free" -> months as a number.
const trialMonths = (text) => { const m = String(text ?? "").match(/(\d+)\s*(?:-|\s)?(?:month|months|mo)\b/i); return m ? Number(m[1]) : null; };
const hasPromo = (text) => { const t = String(text ?? "").trim().toLowerCase(); return t && t !== "none" && t !== "n/a" && t !== "not stated"; };

// Currencies where a monthly music price is normally >= 100 units. A price
// below 20 in these is almost certainly a thousands-separator parsing error
// by the agent (e.g. ¥1,080 read as 1.08). Flagged, never corrected.
const BIG_UNIT_CCY = new Set(["JPY", "KRW", "COP", "IDR", "VND", "INR", "PHP", "THB", "NGN", "EGP", "CLP", "ARS", "HUF", "TWD", "PKR", "KES", "RUB", "CZK", "ISK"]);
const suspect = (price, ccy) => num(price) !== null && BIG_UNIT_CCY.has(up(ccy)) && price < 20;

const daysBetween = (a, b) => { const ta = Date.parse(a), tb = Date.parse(b); return Number.isFinite(ta) && Number.isFinite(tb) ? Math.round((tb - ta) / 86400000) : null; };
const pct = (prev, cur) => (num(prev) && num(cur) !== null ? Math.round(((cur - prev) / prev) * 1000) / 10 : null);
const csvCell = (v) => { if (v === null || v === undefined) return ""; const s = String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };

// ---------------------------------------------------------------------------
// 3. Master table rows for one date
// ---------------------------------------------------------------------------
function rowsForDate(date, b) {
  const rows = []; // { date, country, metric, spotify, currency, apple, youtube, source_url, flag }
  const pb = b.pricing_baseline ?? [];
  const countries = [...new Set(pb.map((r) => up(r.country)))].sort();

  for (const c of countries) {
    const inC = pb.filter((r) => up(r.country) === c);
    const sp = inC.filter(isSpotify), ap = inC.filter(isApple), yt = inC.filter(isYouTube);

    // a) "<Tier> price": one row per Spotify tier, competitors matched by folded tier name.
    for (const r of sp) {
      const tier = tierOf(r);
      const a = ap.find((x) => tierOf(x) === tier), y = yt.find((x) => tierOf(x) === tier);
      const flags = [];
      if (suspect(r.price, r.currency)) flags.push("suspect Spotify price (unit/parsing?)");
      if (a && suspect(a.price, a.currency)) flags.push("suspect Apple price");
      if (y && suspect(y.price, y.currency)) flags.push("suspect YouTube price");
      if ((a && up(a.currency) !== up(r.currency)) || (y && up(y.currency) !== up(r.currency))) flags.push("competitor currency differs");
      rows.push({ date, country: c, metric: `${tier} price`, spotify: num(r.price), currency: up(r.currency), apple: a ? num(a.price) : null, youtube: y ? num(y.price) : null, source_url: r.price_citation ?? "", flag: flags.join("; ") });
    }

    // b) "Trial months": from the promotions workstream when present, else the trial text on the price page.
    const promos = (b.promotions ?? []).filter((p) => up(p.country) === c);
    const trialFor = (rowsOf, promoFilter) => {
      const fromPromo = promos.filter(promoFilter).map((p) => num(p.free_months)).filter((v) => v !== null);
      if (fromPromo.length) return Math.max(...fromPromo);
      const fromText = rowsOf.map((r) => trialMonths(r.trial_offer)).filter((v) => v !== null);
      return fromText.length ? Math.max(...fromText) : null;
    };
    const tSp = trialFor(sp, isSpotify), tAp = trialFor(ap, isApple), tYt = trialFor(yt, isYouTube);
    if (tSp !== null || tAp !== null || tYt !== null)
      rows.push({ date, country: c, metric: "Trial months", spotify: tSp, currency: "", apple: tAp, youtube: tYt, source_url: sp[0]?.price_citation ?? promos[0]?.source_url ?? "", flag: "" });

    // c) "Promo offers": count of visible promotional offers per service (promotions workstream + trial text).
    const promoCount = (rowsOf, promoFilter) => promos.filter(promoFilter).length + (promos.length ? 0 : rowsOf.filter((r) => hasPromo(r.trial_offer)).length);
    if (sp.length) rows.push({ date, country: c, metric: "Promo offers", spotify: promoCount(sp, isSpotify), currency: "", apple: ap.length ? promoCount(ap, isApple) : null, youtube: yt.length ? promoCount(yt, isYouTube) : null, source_url: promos[0]?.source_url ?? sp[0]?.price_citation ?? "", flag: "" });
  }

  // c2) "Individual price USD": from derive.mjs (or the agent's derived_metrics), with the cited FX source.
  for (const m of b.derived_metrics ?? []) {
    if (num(m.spotify_individual_usd) === null) continue;
    rows.push({ date, country: up(m.country), metric: "Individual price USD", spotify: Math.round(m.spotify_individual_usd * 100) / 100, currency: "USD",
      apple: num(m.apple_music_individual_usd) !== null ? Math.round(m.apple_music_individual_usd * 100) / 100 : null,
      youtube: num(m.youtube_premium_individual_usd) !== null ? Math.round(m.youtube_premium_individual_usd * 100) / 100 : null,
      source_url: m.fx_source ?? "", flag: "" });
  }

  // d) "Audiobook hrs": Spotify only, from the audiobooks workstream.
  for (const a of b.audiobook_economics ?? []) {
    if (num(a.included_hours_per_month) === null) continue;
    rows.push({ date, country: up(a.country), metric: `Audiobook hrs (${a.plan})`, spotify: a.included_hours_per_month, currency: "", apple: null, youtube: null, source_url: a.source_url ?? "", flag: "" });
  }

  // e) "Monetization products": Spotify only, from the geo workstream.
  for (const g of b.geographic_availability ?? [])
    rows.push({ date, country: up(g.country), metric: "Monetization products", spotify: (g.products_available ?? []).length, currency: "", apple: null, youtube: null, source_url: (g.source_urls ?? [])[0] ?? "", flag: "" });

  // f) "Creator ad products": marketplace + advertising rows marked supported/self-serve, per country.
  const cap = new Map();
  for (const m of b.marketplace_products ?? []) if (/^yes/i.test(m.supported ?? "")) cap.set(up(m.country), (cap.get(up(m.country)) ?? 0) + 1);
  for (const a of b.advertising_signals ?? []) if (/^yes/i.test(a.self_serve_available ?? "")) cap.set(up(a.country), (cap.get(up(a.country)) ?? 0) + 1);
  for (const [c, n] of cap) rows.push({ date, country: c, metric: "Creator ad products", spotify: n, currency: "", apple: null, youtube: null, source_url: "", flag: "" });

  return rows;
}

// ---------------------------------------------------------------------------
// 4. Indicators for one date
// ---------------------------------------------------------------------------
function indicatorsForDate(date, b, rows) {
  const out = [];
  const pb = b.pricing_baseline ?? [];
  const geo = b.geographic_availability ?? [];
  const globalFeatureSet = new Set(geo.flatMap((g) => g.products_available ?? []));
  const countries = [...new Set([...pb.map((r) => up(r.country)), ...geo.map((g) => up(g.country))])].sort();

  for (const c of countries) {
    const ind = { date, country: c };

    // Pricing Power Index: Spotify Individual / mean of the competitor Individual prices we have.
    const indiv = rows.find((r) => r.date === date && r.country === c && r.metric === "Individual price");
    if (indiv && num(indiv.spotify) !== null && !indiv.flag.includes("currency differs")) {
      const comps = [indiv.apple, indiv.youtube].filter((v) => num(v) !== null);
      if (comps.length) {
        ind.pricing_power_index = Math.round((indiv.spotify / (comps.reduce((s, v) => s + v, 0) / comps.length)) * 1000) / 1000;
        ind.ppi_basis = [indiv.apple !== null ? "Apple Music" : null, indiv.youtube !== null ? "YouTube Premium" : null].filter(Boolean).join("+");
      }
    }

    // Monetization Depth: products available / the fixed 9-product list.
    const g = geo.find((x) => up(x.country) === c);
    if (g) {
      ind.monetization_products = (g.products_available ?? []).length;
      ind.monetization_depth = Math.round(((g.products_available ?? []).length / monetizationProducts.length) * 1000) / 1000;
      // Feature Monetization Index: same numerator over the union of products seen anywhere that day.
      if (globalFeatureSet.size) ind.feature_monetization_index = Math.round(((g.products_available ?? []).length / globalFeatureSet.size) * 1000) / 1000;
    }

    // Promotion Intensity: Spotify plans carrying a promo / Spotify plans offered.
    const sp = pb.filter((r) => up(r.country) === c && isSpotify(r));
    if (sp.length) {
      const tiers = new Set(sp.map(tierOf));
      const promoTiers = new Set([
        ...sp.filter((r) => hasPromo(r.trial_offer)).map(tierOf),
        ...(b.promotions ?? []).filter((p) => up(p.country) === c && isSpotify(p)).map(tierOf),
      ]);
      ind.plans_offered = tiers.size;
      ind.plans_with_promo = [...promoTiers].filter((t) => tiers.has(t)).length;
      ind.promotion_intensity = Math.round((ind.plans_with_promo / tiers.size) * 1000) / 1000;
    }

    // Competitor Response Lag: days from a Spotify change (history) to the next Apple/YouTube reaction in this country.
    const hikes = (b.spotify_price_history ?? []).filter((h) => up(h.country) === c).map((h) => h.effective_date || h.announced_date).filter((d) => Number.isFinite(Date.parse(d)));
    const reactions = (b.competitor_reactions ?? []).filter((r) => (r.countries ?? []).map(up).includes(c) && /apple|youtube/i.test(r.competitor ?? "") && Number.isFinite(Date.parse(r.date)));
    const lags = [];
    for (const hd of hikes) for (const r of reactions) { const d = daysBetween(hd, r.date); if (d !== null && d >= 0) lags.push(d); }
    if (lags.length) ind.competitor_response_lag_days = Math.min(...lags);

    out.push(ind);
  }
  return out;
}

// ---------------------------------------------------------------------------
// 5. Build everything, add previous/change, write files
// ---------------------------------------------------------------------------
const allRows = dates.flatMap((d) => rowsForDate(d, byDate.get(d)));

// previous / change_pct: the latest earlier date with the same (country, metric).
const seen = new Map(); // key -> last spotify value
for (const r of allRows) { // allRows is date-ascending because `dates` is sorted
  const key = `${r.country}|${r.metric}`;
  r.previous = seen.has(key) ? seen.get(key) : null;
  r.change_pct = pct(r.previous, r.spotify);
  if (num(r.spotify) !== null) seen.set(key, r.spotify);
}

const allInd = dates.flatMap((d) => indicatorsForDate(d, byDate.get(d), allRows));

// --- master-table.csv ---
const MT_COLS = ["date", "country", "metric", "spotify", "currency", "apple", "youtube", "previous", "change_pct", "source_url", "flag"];
writeFileSync(join(resultsDir, "master-table.csv"), [MT_COLS.join(","), ...allRows.map((r) => MT_COLS.map((k) => csvCell(r[k])).join(","))].join("\n") + "\n");

// --- indicators.csv ---
const IND_COLS = ["date", "country", "pricing_power_index", "ppi_basis", "monetization_products", "monetization_depth", "feature_monetization_index", "plans_offered", "plans_with_promo", "promotion_intensity", "competitor_response_lag_days"];
writeFileSync(join(resultsDir, "indicators.csv"), [IND_COLS.join(","), ...allInd.map((r) => IND_COLS.map((k) => csvCell(r[k])).join(","))].join("\n") + "\n");

// --- indicators.md: latest date as a readable table + coverage notes ---
const latest = dates[dates.length - 1];
const latestInd = allInd.filter((r) => r.date === latest);
const latestRows = allRows.filter((r) => r.date === latest);
const fmt = (v) => (v === null || v === undefined ? "" : String(v));
const md = [
  `# Country indicators (latest run: ${latest})`,
  "",
  `Built by \`build-dataset.mjs\` from ${dates.length} dated run(s): ${dates.map((d) => `${d} (${byDate.get(d).files.join(", ")})`).join("; ")}.`,
  "Blank cells mean the input is not in the JSON yet; the notes below say which workstream fills it. Nothing is estimated.",
  "",
  "| Country | Pricing power index | Basis | Monetization products | Monetization depth | Feature monetization index | Plans | Plans w/ promo | Promotion intensity | Competitor lag (days) |",
  "|---|---|---|---|---|---|---|---|---|---|",
  ...latestInd.map((r) => `| ${r.country} | ${fmt(r.pricing_power_index)} | ${fmt(r.ppi_basis)} | ${fmt(r.monetization_products)} | ${fmt(r.monetization_depth)} | ${fmt(r.feature_monetization_index)} | ${fmt(r.plans_offered)} | ${fmt(r.plans_with_promo)} | ${fmt(r.promotion_intensity)} | ${fmt(r.competitor_response_lag_days)} |`),
  "",
  "## Definitions",
  "",
  "- **Pricing power index**: Spotify Individual price / mean of Apple Music Individual and YouTube Premium Individual in the same currency (basis column says which competitors were available). >1 means Spotify prices above the competitor average.",
  `- **Monetization depth**: products available / ${monetizationProducts.length} (${monetizationProducts.join(", ")}). Needs the \`geo\` workstream.`,
  "- **Feature monetization index**: products available in the country / union of products available in any country that day. Needs the `geo` workstream.",
  "- **Promotion intensity**: Spotify plans carrying a visible promo (trial text on the price page, or a row from the `promotions` workstream) / Spotify plans offered.",
  "- **Competitor lag**: minimum days from a Spotify price change (`spotify_price_history`) to an Apple/YouTube reaction (`competitor_reactions`) in the same country. Needs both arrays populated.",
  "",
  "## Coverage on the latest run",
  "",
  `- Countries with a Pricing power index: ${latestInd.filter((r) => r.pricing_power_index !== undefined).length} of ${latestInd.length}.`,
  `- Countries with Monetization depth: ${latestInd.filter((r) => r.monetization_depth !== undefined).length} of ${latestInd.length}.`,
  `- Countries with Competitor lag: ${latestInd.filter((r) => r.competitor_response_lag_days !== undefined).length} of ${latestInd.length}.`,
  `- Master table rows: ${latestRows.length} (all dates: ${allRows.length}).`,
  "",
  "## Flagged rows (not corrected, verify on the cited page)",
  "",
  ...(latestRows.filter((r) => r.flag).length
    ? latestRows.filter((r) => r.flag).map((r) => `- ${r.country} ${r.metric}: Spotify ${fmt(r.spotify)} ${r.currency}, Apple ${fmt(r.apple)}, YouTube ${fmt(r.youtube)}. ${r.flag}. ${r.source_url}`)
    : ["_None._"]),
  "",
];
writeFileSync(join(resultsDir, "indicators.md"), md.join("\n"));

console.log(`[dataset] dates: ${dates.join(", ")}`);
console.log(`[dataset] master-table.csv: ${allRows.length} rows; indicators.csv: ${allInd.length} rows; indicators.md written`);
console.log(`[dataset] latest ${latest}: PPI for ${latestInd.filter((r) => r.pricing_power_index !== undefined).length} countries, ${latestRows.filter((r) => r.flag).length} flagged rows`);
