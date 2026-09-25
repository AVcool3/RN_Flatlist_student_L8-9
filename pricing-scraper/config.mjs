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

// The two subscription services we are tracking price changes for.
export const services = ["Apple", "YouTube"];

// Reasoning effort passed to `firecrawl agent --effort`.
// "low" = cheaper/faster, "high" = more thorough but uses more credits.
export const effort = "medium";

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
