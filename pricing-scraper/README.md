# Spotify pricing: investment research scraper

A Firecrawl-agent pipeline that produces an **investment-grade snapshot** of
Spotify's subscription pricing across 36 countries, with Apple and YouTube as
the comparison set. It runs as a **one-time baseline** and then **once a day for
5 days** (26–30 Sept 2026).

Each run returns, in this order of priority: today's localized prices, 24 months
of dated Spotify price changes, sourced investment signals (earnings, guidance,
subscriber/ARPU metrics, regulatory, analyst notes), competitor reactions with
lag in days, consumer reaction (app store ratings, review sentiment), USD-normalized
derived metrics, and an analyst summary with bull/bear points and data gaps.
Every fact carries a source URL and a date; nothing is inferred.

The research mandate and evidence standard the agent receives live in
`analysisFocus` in `config.mjs`; the output shape is `schema.json`, where every
field has a description explaining what counts as evidence for it.

## Files

| File | What it is | Edit it when… |
|------|-----------|---------------|
| `config.mjs` | Countries by region, services, research mandate, preferred sources, per-mode effort, run window | you want different countries / services / dates, or a different investment question |
| `schema.json` | The JSON schema the agent's answer must match; each field's `description` is the evidence rule | you want extra signals in the output |
| `run.mjs` | Builds the prompt from `config.mjs` and runs the `firecrawl agent` CLI | you want to change how the CLI is called |
| `results/` | Output. `baseline.json` plus one `YYYY-MM-DD.json` per daily run | never by hand |
| `../.github/workflows/pricing-scraper.yml` | GitHub Actions cron for the 5-day window + manual button | you change the dates in `config.mjs` |

## One-time setup: the API key

`firecrawl agent` is **not** available on Firecrawl's keyless free tier. Get a key
at <https://www.firecrawl.dev/> and put it in **one** of these places:

- **Locally:** `export FIRECRAWL_API_KEY=fc-...` in your shell.
- **GitHub Actions:** repo → Settings → Secrets and variables → Actions →
  New repository secret → name `FIRECRAWL_API_KEY`.
- **Claude Code cloud environment:** environment → Edit → add an environment
  variable named `FIRECRAWL_API_KEY` **or** `FireAPI` (both names are accepted).

`run.mjs` refuses to run without it (exit code 2) instead of hanging on the
CLI's interactive login menu.

## Running

```bash
# One-time baseline (requested 2026-09-25) -> results/baseline.json
node pricing-scraper/run.mjs --baseline

# A daily run -> results/<today>.json
node pricing-scraper/run.mjs

# See the exact prompt + CLI command without spending credits
node pricing-scraper/run.mjs --dry-run --baseline
```

Under the hood each run is the original command:

```bash
firecrawl agent '<prompt built from config.mjs>' \
  --effort medium --schema-file schema.json --wait --json -o results/<file>.json
```

## The 5-day schedule

The workflow cron is `0 13 26-30 9 *`: 13:00 UTC every day from 26 to 30 Sept 2026.
GitHub only runs cron on the default branch, so until this branch is merged use
the **Run workflow** button in the Actions tab (pick this branch) or run locally.

## Output shape

Each result file follows `schema.json`:

The Firecrawl CLI wraps the agent's answer under a top-level `data` key. Inside:

- `baseline_date`, `run_type`, `scope` (countries, services, competitors, limitations)
- `pricing_baseline[]`: today's prices with tax flag, trial offer, as-of date, citation
- `spotify_price_history[]`: dated Spotify price changes, last 24 months
- `investment_signals[]`: earnings, guidance, metrics, regulatory, analyst notes, each with source type and confidence
- `competitor_reactions[]`: Apple / YouTube / others' responses and lag versus Spotify
- `consumer_reaction[]`: app store ratings and price sentiment per country
- `derived_metrics[]`: USD-normalized prices and Spotify's premium/discount versus Apple and YouTube
- `analyst_summary`: key findings, hike pattern, bull/bear, watch items, data gaps, confidence
- `scraper_spec_next_5_days`: the agent's own suggested run schedule and notes

To diff two days, compare the `pricing_baseline` arrays of `results/baseline.json`
and `results/2026-09-2X.json` on `(country, service, tier)`.
