// ============================================================================
// pricing-scraper/config.mjs
//
// This is the ONE file you should edit when you want to change WHAT gets
// scraped. Everything here is plain data (no logic), so it's safe to tweak:
//   - add/remove a country          -> edit `regions`
//   - add a competitor service      -> edit `services`
//   - make the agent think harder   -> change `effort` to "high"
//   - change the 5-day window       -> edit `runWindow`
//
// run.mjs imports this file, turns it into the natural-language prompt that
// the Firecrawl agent receives, and passes schema.json alongside it.
// ============================================================================

// The subscription services we are tracking price changes for.
// Spotify is listed FIRST because it is the primary subject: the whole point of
// this scraper is understanding Spotify's price movement. Apple and YouTube
// are the comparison set, so we can see whether they lead, follow, or ignore
// a Spotify hike in each region.
export const services = ["Spotify", "Apple", "YouTube"];

// Reasoning effort passed to `firecrawl agent --effort`, per run mode.
// "low" = cheaper/faster, "high" = more thorough but uses more credits and
// takes longer. The baseline does the heavy lifting (24 months of history,
// filings, analyst notes), so it gets "high"; daily runs only need to spot
// what changed, so "medium" keeps them fast.
export const effort = {
  baseline: "high",
  daily: "medium",
};

// ---------------------------------------------------------------------------
// RESEARCH MANDATE
// This block is pasted into the agent prompt verbatim. It turns the run from a
// price list into an investment-research snapshot. Edit the bullet text if the
// investment question changes; keep the evidence standard section as is unless
// you deliberately want looser data.
// ---------------------------------------------------------------------------
export const analysisFocus = `
THE MAIN GOAL IS UNDERSTANDING SPOTIFY'S PRICE MOVEMENT AS AN INVESTMENT SIGNAL.
This is not a price list. Produce investment-grade research where every number
is sourced and dated, so an analyst could rely on it without re-checking.

SUBJECT: Spotify Premium (Individual, Duo, Family, Student, and any Basic / Lite /
Platinum / audiobook-inclusive tier offered locally). Capture its localized price in
EVERY country listed. A missing Spotify price is the most important gap to report.

COMPARISON SET: Apple (Apple Music, Apple One) and YouTube (Premium, Music Premium).
Their prices matter to show whether they lead, follow, or ignore Spotify in each
region, and by how many days.

WHAT TO COLLECT, in priority order:
1. pricing_baseline: today's localized price per tier, with tax-inclusive flag, any
   trial offer, and the official page URL.
2. spotify_price_history: every Spotify price change per country in the last 24
   months, with old/new price, percent change, announced and effective dates, and
   the source. Use Spotify newsroom posts, investor-relations material, SEC filings
   (20-F, 6-K), earnings transcripts, and reputable press.
3. investment_signals: dated facts an investor would act on. Latest quarterly
   results (Premium subscribers, MAU, ARPU, gross margin, operating income, free
   cash flow), forward guidance, executive commentary on pricing power and churn,
   regulatory actions (DMA, app-store fees, antitrust), analyst notes with price
   targets and their stated pricing assumptions. Quote exact figures.
4. competitor_reactions: what Apple, YouTube, Amazon Music, Deezer, or Tidal did
   after each Spotify move: matched, held, undercut, bundled. Note the lag in days.
5. consumer_reaction: current iOS App Store and Google Play rating and review count
   for Spotify in each country where visible, and what recent reviews or press say
   about price. Report what the source shows; do not editorialize.
6. derived_metrics: Spotify Individual price converted to USD using a dated FX
   rate you cite, the same for Apple Music and YouTube Premium, and the percent
   premium or discount Spotify carries versus each. Only compute when every input
   is present.
7. analyst_summary: key findings ordered by materiality, the hike pattern (which
   regions move first, how often, by how much), bull and bear points, specific
   watch items for the next five daily runs, data gaps, and overall confidence.

EVIDENCE STANDARD (non-negotiable):
- Every fact carries a source_url and a date. Prefer official pages, filings and
  investor-relations material; then reputable financial press (Reuters, Bloomberg,
  FT, WSJ, Variety, Billboard, Music Business Worldwide); then analyst notes.
- Label source_type honestly and set confidence: high only for official/filing.
- Never infer, estimate, average, or carry forward a price. If a value is not on
  the page, omit the row and record the gap in baseline_limitations or data_gaps.
- Do not treat a generic US-dollar page as a localized price for another country.
- Distinguish announced from effective dates. Distinguish trial pricing from the
  recurring price.
- In scope.competitors_prioritized list Spotify first.
`.trim();

// Where the agent should look first. These are passed in the prompt as hints;
// the agent may use others but must cite whatever it actually used.
export const preferredSources = [
  "https://newsroom.spotify.com/",
  "https://investors.spotify.com/",
  "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001639920 (Spotify 20-F / 6-K filings)",
  "https://www.spotify.com/<country>/premium/ (localized pricing pages)",
  "https://www.apple.com/<country>/apple-music/ and /apple-one/",
  "https://www.youtube.com/premium (with country-specific storefront)",
  "iOS App Store and Google Play listings for Spotify per country",
  "Reuters, Bloomberg, Financial Times, Wall Street Journal, Variety, Billboard, Music Business Worldwide",
];

// Countries grouped by region. The `code` is the ISO 3166-1 alpha-2 code the
// agent uses to pick the right localized storefront (e.g. apple.com/de/).
// The `why` text is included in the prompt so the agent knows the business
// context behind each region (which regions are "revenue core", which are
// price sensitive, etc.).
export const regions = [
  {
    name: "North America",
    why: "revenue core, first to be hiked",
    countries: [
      { name: "United States", code: "us" },
      { name: "Canada", code: "ca" },
      { name: "Mexico", code: "mx" },
    ],
  },
  {
    name: "Europe",
    why: "roughly half of revenue, most mature pricing power test",
    countries: [
      { name: "United Kingdom", code: "gb" },
      { name: "Germany", code: "de" },
      { name: "France", code: "fr" },
      { name: "Spain", code: "es" },
      { name: "Italy", code: "it" },
      { name: "Netherlands", code: "nl" },
      { name: "Sweden", code: "se" },
      { name: "Norway", code: "no" },
      { name: "Denmark", code: "dk" },
      { name: "Poland", code: "pl" },
      { name: "Switzerland", code: "ch" },
      { name: "Ireland", code: "ie" },
      { name: "Belgium", code: "be" },
      { name: "Portugal", code: "pt" },
      { name: "Turkey", code: "tr" },
    ],
  },
  {
    name: "Latin America",
    why: "high-growth region, most price-sensitive",
    countries: [
      { name: "Brazil", code: "br" },
      { name: "Argentina", code: "ar" },
      { name: "Colombia", code: "co" },
      { name: "Chile", code: "cl" },
      { name: "Peru", code: "pe" },
    ],
  },
  {
    name: "Rest of World",
    why: "subscriber growth engine, where competitors compete hardest on price",
    countries: [
      { name: "Japan", code: "jp" },
      { name: "South Korea", code: "kr" },
      { name: "Australia", code: "au" },
      { name: "India", code: "in" },
      { name: "Indonesia", code: "id" },
      { name: "Philippines", code: "ph" },
      { name: "Thailand", code: "th" },
      { name: "Vietnam", code: "vn" },
      { name: "Nigeria", code: "ng" },
      { name: "South Africa", code: "za" },
      { name: "Egypt", code: "eg" },
      { name: "Saudi Arabia", code: "sa" },
      { name: "United Arab Emirates", code: "ae" },
    ],
  },
];

// The 5-day monitoring window that follows the one-time baseline.
// The GitHub Actions cron in .github/workflows/pricing-scraper.yml is
// hard-coded to these same dates, so if you change them here, update the
// `cron:` line there too.
export const runWindow = {
  baselineDate: "2026-09-25", // the day the one-time baseline was requested
  startDate: "2026-09-26",    // first daily run
  endDate: "2026-09-30",      // last daily run (5 days inclusive)
  timezone: "UTC",
  runTimeUtc: "13:00",        // 13:00 UTC = 09:00 US Eastern / 06:00 Pacific
};

// Helper used by run.mjs: flat list of every country code, e.g. ["us","ca",...]
export const allCountryCodes = regions.flatMap((r) =>
  r.countries.map((c) => c.code)
);
