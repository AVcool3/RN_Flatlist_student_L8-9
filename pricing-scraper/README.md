# Spotify alternative-data engine (pricing-scraper)

A Firecrawl pipeline that turns Spotify's public web footprint into **leading
indicators for a stock pitch**. Spotify is the subject; Apple Music and YouTube
Premium are the comparison set. Everything collected maps into

```
Subscribers × ARPU → Revenue → Gross Margin → EBIT → Free Cash Flow
```

The scraped data are the leading indicator; the reported quarterly numbers
(also collected, workstream `fundamentals`) tell you whether the thesis flows
through the P&L.

Every fact carries a source URL and a date. Nothing is inferred, estimated or
carried forward: a missing value is left blank and recorded in `data_gaps`.

## What it produces

| Output | Built by | What it is |
|---|---|---|
| `results/baseline.json`, `results/YYYY-MM-DD.json` | `run.mjs` | Pricing agent run: today's prices per country/tier, 24 months of Spotify price history, investment signals, competitor reactions, consumer reaction, analyst summary |
| `results/baseline-<ws>.json`, `results/YYYY-MM-DD-<ws>.json` | `run.mjs --workstream <ws>` | One focused agent run per research area (see workstreams below) |
| `results/baseline-derived.json`, `results/YYYY-MM-DD-derived.json` | `derive.mjs` | Per pricing run: `suspect_prices` (rows outside a plausible per-currency range, kept but excluded from USD metrics) and `derived_metrics` (Spotify/Apple/YouTube Individual in USD with the FX provider, timestamp and URL beside every number) |
| `results/master-table.csv` | `build-dataset.mjs` | The one long table for charts: `date, country, metric, spotify, currency, apple, youtube, previous, change_pct, source_url, flag` |
| `results/indicators.csv` + `indicators.md` | `build-dataset.mjs` | Per-country indices: Pricing Power Index, Monetization Depth, Feature Monetization Index, Promotion Intensity, Competitor Response Lag |
| `results/baseline-brief.md` | hand-built from `baseline.json` | The investment brief for the 2026-09-25 baseline |
| `snapshots/YYYY-MM-DD/*.md` + `manifest.json` | `snapshot.mjs` | Daily text copy of every watched web page (pricing, plans, audiobooks, ads, creator pages, newsroom) |
| `snapshots/YYYY-MM-DD-diff.md` | `diff.mjs` | What changed since the previous snapshot, with "signal lines" (prices, hours, months, %, free/trial/new) pulled out |

## Files

| File | What it is | Edit it when… |
|---|---|---|
| `config.mjs` | All the knobs: countries by region, services, effort, research mandate, **workstreams**, **watch pages** | you want different countries, a new research area, another page to watch |
| `schema.json` | The JSON schema every agent answer must match; each field's `description` is the evidence rule | you add a workstream or want an extra field |
| `run.mjs` | Builds the prompt + sub-schema for a job and runs the `firecrawl agent` CLI | you want to change how the CLI is called |
| `snapshot.mjs` | Saves watched pages as markdown via the Firecrawl scrape API | you want a different normalisation or concurrency |
| `diff.mjs` | Diffs today's snapshot folder against the previous one | you want different "signal" patterns |
| `derive.mjs` | Post-processing for one pricing result: flags implausible prices (mis-parsed thousands), fetches a dated USD FX rate, computes Spotify vs Apple/YouTube in USD | you add a currency, or want a different FX source |
| `build-dataset.mjs` | Builds the master table and indicators from all result files (including `*-derived.json` for USD) | you want a new metric or index |
| `results/`, `snapshots/` | Output. Committed to git so history is the archive | never by hand |
| `../.github/workflows/pricing-scraper.yml` | GitHub Actions cron for the 5-day window + manual button | you change the dates or the default jobs |

## One-time setup: the API key

`firecrawl agent` is **not** available on Firecrawl's keyless free tier. Get a key
at <https://www.firecrawl.dev/> and put it in **one** of these places:

- **Locally:** `export FIRECRAWL_API_KEY=fc-...` in your shell.
- **GitHub Actions:** repo → Settings → Secrets and variables → Actions →
  New repository secret → name `FIRECRAWL_API_KEY`.
- **Claude Code cloud environment:** environment → Edit → add an environment
  variable named `FIRECRAWL_API_KEY` **or** `FireAPI` (both names are accepted).

Every script refuses to run without it (exit code 2) instead of hanging on the
CLI's interactive login menu.

## Running

```bash
# --- agent runs (expensive: hundreds of credits each) ---
node pricing-scraper/run.mjs --baseline                 # one-time pricing baseline -> results/baseline.json
node pricing-scraper/run.mjs                            # daily pricing run        -> results/<today>.json
node pricing-scraper/run.mjs --workstream audiobooks    # one research area        -> results/<today>-audiobooks.json
node pricing-scraper/run.mjs --workstream promotions,tiers --baseline   # several, as baseline files
node pricing-scraper/run.mjs --workstream all           # every workstream in sequence
node pricing-scraper/run.mjs --dry-run --workstream ads # see the prompt + command, spend nothing
node pricing-scraper/run.mjs --effort high --workstream fundamentals    # override effort

# --- page snapshots (cheap: 1 credit per page, ~47 pages) ---
node pricing-scraper/snapshot.mjs                       # -> snapshots/<today>/
node pricing-scraper/snapshot.mjs --only pricing,ads    # a subset of categories
node pricing-scraper/diff.mjs                           # -> snapshots/<today>-diff.md

# --- post-processing (free, local; derive.mjs makes one FX request) ---
node pricing-scraper/derive.mjs pricing-scraper/results/baseline.json   # ALWAYS after a pricing run -> results/baseline-derived.json
node pricing-scraper/derive.mjs pricing-scraper/results/2026-09-26.json --no-network   # checks only, skip FX
node pricing-scraper/build-dataset.mjs                  # -> results/master-table.csv, indicators.csv, indicators.md
```

## The research workstreams

Each is a separate, focused agent job with its own sub-schema (only the arrays
it must fill), so jobs stay small and accurate. Defined in `workstreams` in
`config.mjs`; output arrays defined in `schema.json`.

| id | Fills | Investment question |
|---|---|---|
| `pricing` | `pricing_baseline`, `spotify_price_history`, `competitor_reactions`, `derived_metrics` | Who moves first, how often, by how much; competitor lag in days |
| `promotions` | `promotions` | Does realized price rise as much as list price? Promotional frequency as acquisition-intensity proxy |
| `tiers` | `tier_availability` | Is Spotify getting better at price discrimination (Basic/Lite/Duo/Family/lossless…)? |
| `audiobooks` | `audiobook_economics` | Can Spotify monetize audiobooks without materially raising content cost? |
| `ads` | `advertising_signals` | Ad product expansion as a leading indicator for ad-supported revenue |
| `podcasts` | `podcast_monetization` | Are podcasts becoming a scalable platform (SPAN, Partner Program, video)? |
| `creators` | `creator_economics` | How much of the artist ecosystem does Spotify monetize beyond subscriptions? |
| `marketplace` | `marketplace_products` | Marquee / Showcase / Discovery Mode / tickets / merch: a two-sided marketplace? |
| `launches` | `product_launches` | Has product development shifted from user growth to monetization? |
| `geo` | `geographic_availability` | Monetization maturity per market = remaining international runway |
| `fundamentals` | `fundamentals` | Premium subs, MAU, ARPU, gross margins, opex, FCF by quarter, from filings |

The classic `node run.mjs` (no `--workstream`) is the pricing run with the
original core schema, so daily price checks stay fast.

## The indices (results/indicators.md)

| Index | Formula | Needs |
|---|---|---|
| Pricing Power Index | Spotify Individual ÷ mean(Apple Music Individual, YouTube Premium Individual), same currency | pricing run |
| Monetization Depth | products available ÷ 9 (`monetizationProducts` in config.mjs) | `geo` workstream |
| Feature Monetization Index | products available ÷ union of products seen in any country that day | `geo` workstream |
| Promotion Intensity | Spotify plans with a visible promo ÷ Spotify plans offered | pricing run (+ `promotions`) |
| Competitor Response Lag | min days from a Spotify price change to an Apple/YouTube reaction, same country | `spotify_price_history` + `competitor_reactions` |

`derive.mjs` never deletes data. Rows outside a per-currency plausible range are
listed under `suspect_prices` and excluded from the USD metrics, because the
agent occasionally drops thousands digits (e.g. reads ₩10,900 as 11.99). The FX
provider, timestamp and URL are stored beside every converted number.
`build-dataset.mjs` applies a simpler flag of its own (a price under 20 in a
currency where monthly prices run in the hundreds) and reads the USD figures
from `*-derived.json` into the `Individual price USD` metric.

## Daily page snapshots: seeing changes before they are disclosed

`snapshot.mjs` saves every page in `watchPages` (config.mjs): the localized
Spotify Premium page for each country plus global pages for plans, audiobooks,
advertising, creator tools and the newsroom. `diff.mjs` then shows, per page,
what changed since the previous snapshot and lists the changed lines that carry
a price, an hour/month count, a percentage or the words free/trial/new. That
is how you catch "15 audiobook hours" → "20 audiobook hours" or $11.99 → $12.99
before it is discussed in a filing. The snapshot folders are committed, so
`git log -p pricing-scraper/snapshots/` is the long-run archive.

If a watched URL 404s, `manifest.json` records it; fix or remove the entry in
`globalWatchPages` / `spotifyPremiumPaths` in `config.mjs`.

Firecrawl's entry plan allows about 10 scrape requests per minute, so
`snapshot.mjs` paces itself to ~9/min (47 pages ≈ 5–6 minutes) and waits out
any 429. Re-running on the same day only fetches pages that failed, so a
retry never re-spends credits.

## The 5-day schedule

The workflow cron is `0 13 26-30 9 *`: 13:00 UTC every day from 26 to 30 Sept 2026.
Each run: snapshot + diff → pricing agent run → derive (sanity + FX) → optional
workstreams → rebuild dataset → commit. GitHub only runs cron on the default branch, so until this
branch is merged use the **Run workflow** button in the Actions tab (pick this
branch); the inputs let you tick baseline, choose workstreams, or skip the
expensive agent run.

## Output shape

Each agent result file follows `schema.json`. The Firecrawl CLI wraps the
agent's answer under a top-level `data` key. Inside:

- `baseline_date`, `run_type`, `scope` (countries, services, competitors, limitations)
- `pricing_baseline[]`, `spotify_price_history[]`, `investment_signals[]`,
  `competitor_reactions[]`, `consumer_reaction[]`, `derived_metrics[]` (pricing run)
- one array per workstream: `promotions[]`, `tier_availability[]`,
  `audiobook_economics[]`, `advertising_signals[]`, `podcast_monetization[]`,
  `creator_economics[]`, `marketplace_products[]`, `product_launches[]`,
  `geographic_availability[]`, `fundamentals[]`
- `analyst_summary`: key findings, hike pattern, bull/bear, watch items, data gaps, confidence
- `scraper_spec_next_5_days` (pricing run only)

To diff two days by hand, compare the `pricing_baseline` arrays on
`(country, service, tier)`; or just read `results/master-table.csv`, whose
`previous` and `change_pct` columns do that for you.
