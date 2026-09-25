# Spotify vs Apple / YouTube subscription pricing scraper

A Firecrawl-agent scraper that captures **Spotify** subscription prices (the main
subject) plus Apple and YouTube prices (the comparison set) across 36 countries,
as a **one-time baseline** and then **once a day for 5 days** (26–30 Sept 2026).
The goal is understanding Spotify's price movement region by region and whether
Apple and YouTube lead, follow, or ignore it. The focus paragraph the agent
receives lives in `analysisFocus` in `config.mjs`.

## Files

| File | What it is | Edit it when… |
|------|-----------|---------------|
| `config.mjs` | Countries by region, services, effort, run window | you want different countries / services / dates |
| `schema.json` | The JSON schema the agent's answer must match | you want extra fields in the output |
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

- `baseline_date`, `scope` (countries, services, competitors, limitations)
- `pricing_baseline[]`: `{ country, service, tier, price, currency, period, price_citation }`
- `scraper_spec_next_5_days`: the agent's own suggested run schedule, config and notes

To diff two days, compare the `pricing_baseline` arrays of `results/baseline.json`
and `results/2026-09-2X.json` on `(country, service, tier)`.
