// ============================================================================
// pricing-scraper/config.mjs
//
// This is the ONE file you should edit when you want to change WHAT gets
// scraped. Everything here is plain data (no logic), so it's safe to tweak:
//   - add/remove a country          -> edit `regions`
//   - add a competitor service      -> edit `services`
//   - make the agent think harder   -> change `effort` to "high"
//   - change the 5-day window       -> edit `runWindow`
//   - add a research area           -> edit `workstreams` (and schema.json)
//   - watch another web page daily  -> edit `watchPages` / `spotifyPremiumPaths`
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

Every variable collected must map into the fundamental chain
  Subscribers x ARPU -> Revenue -> Gross Margin -> EBIT -> Free Cash Flow.
Headline list prices are only one input: promotions lower realized ARPU, new
tiers change mix, audiobooks and creator products change gross margin, and
advertising products change ad-supported revenue.

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

// ===========================================================================
// RESEARCH WORKSTREAMS (alternative-data engine)
//
// Each workstream is a separate, focused Firecrawl agent job:
//   node pricing-scraper/run.mjs --workstream audiobooks
// `schemaKeys` names the top-level arrays in schema.json that the job must
// fill; run.mjs builds a sub-schema with only those keys so each job stays
// small, cheap and accurate. `mandate` is pasted into the prompt verbatim.
// `effort` overrides the per-mode default when set.
//
// To add an area: add an entry here AND the matching array in schema.json.
// ===========================================================================
export const workstreams = {
  pricing: {
    title: "Price changes by country and tier",
    schemaKeys: ["pricing_baseline", "spotify_price_history", "competitor_reactions", "derived_metrics"],
    mandate: `
Today's localized price for every tier of Spotify, Apple Music/Apple One and
YouTube Premium/Music Premium in every country listed. For Spotify also every
dated price change in the last 24 months with the EXACT effective date (not just
the announcement date) and the old/new price. For each Spotify change record what
Apple and YouTube did afterwards and the lag in days, so we can measure who moves
first and test Spotify's pricing power.`,
  },

  promotions: {
    title: "Promotions and free-trial intensity",
    schemaKeys: ["promotions"],
    mandate: `
For every country, every promotional offer currently shown for Spotify Premium
and for Apple Music and YouTube Premium: free-trial length ("1 month free",
"3 months free"), discounted introductory months and price, student offers,
device bundles (phones, speakers, consoles), telco/carrier bundles, win-back
offers for lapsed subscribers, and the eligibility text. Record the offer
verbatim. Headline prices can rise while realized price does not, so
promotional frequency is a proxy for how hard Spotify must work to acquire
subscribers. Do not invent an offer that is not visible on the page.`,
  },

  tiers: {
    title: "Tier availability changes",
    schemaKeys: ["tier_availability"],
    mandate: `
For every country, which Spotify plans exist today: Basic, Lite, Individual,
Duo, Family, Student, audiobook-inclusive plans, music-only plans, and any
high-end / lossless / Platinum / Music Pro tier. For each plan note whether it
is available, newly launched or removed, with the date when an official source
gives one. This measures whether Spotify is getting better at price
discrimination.`,
  },

  audiobooks: {
    title: "Audiobook economics",
    schemaKeys: ["audiobook_economics"],
    mandate: `
From Spotify support and product pages, per country where audiobooks are in
Premium: included listening hours per month, top-up hours and their price,
audiobook-only plan price, which Premium tiers include audiobooks, catalog size
(titles included vs paid separately), and any publicly disclosed publisher or
author payout terms. Record every change in the monthly hour allowance
chronologically with source and date. The investment question: can Spotify
monetize audiobooks without materially increasing content cost?`,
  },

  ads: {
    title: "Advertising inventory and pricing signals",
    schemaKeys: ["advertising_signals"],
    mandate: `
From Spotify Advertising / Ads Manager pages by geography: minimum campaign
spend, any CPM guidance, targeting capabilities, podcast vs music inventory,
video advertising, programmatic availability, new ad formats, and the markets
where self-serve advertising is available. Product expansion is a leading
indicator for ad monetization even where realized CPMs are not public.`,
  },

  podcasts: {
    title: "Podcast monetization coverage",
    schemaKeys: ["podcast_monetization"],
    mandate: `
Spotify Audience Network and creator monetization programs: countries
supported, eligibility requirements (followers, hours, plays), revenue-share
terms, video podcast monetization, Partner Program eligibility and expansion
dates. This measures whether podcasts are becoming a scalable platform rather
than a cost center.`,
  },

  creators: {
    title: "Creator economics",
    schemaKeys: ["creator_economics"],
    mandate: `
From Spotify for Artists, Loud & Clear and support docs: royalty methodology,
stream eligibility and minimum-play thresholds, artificial-streaming rules,
Discovery Mode terms (commission / royalty discount), Marquee and Showcase
pricing and minimum budgets, marketplace availability by country, eligible
artists, and newly added promotional tools. Archive the current terms with
dates so changes can be tracked. This measures how much of the artist
ecosystem Spotify monetizes beyond subscription revenue.`,
  },

  marketplace: {
    title: "Marketplace products",
    schemaKeys: ["marketplace_products"],
    mandate: `
For each of Marquee, Showcase, Discovery Mode, concert tickets, merch and
artist promotion tools: countries supported, artist eligibility, minimum
budget, pricing model (CPC, flat, revenue share), placement, new features and
geographic expansion, each with a source URL and date.`,
  },

  launches: {
    title: "Product-launch velocity",
    schemaKeys: ["product_launches"],
    mandate: `
From Spotify Newsroom and product pages, every product or feature launch in
the last 24 months: date, product, geography, user type (listener, artist,
podcaster, advertiser), monetization type, and a one-line description.
Classify each launch as monetization, engagement, acquisition, retention,
creator_tools, advertising, audiobooks, podcasts or ai. This quantifies how
far product development has shifted from user growth to monetization.`,
  },

  geo: {
    title: "Geographic monetization maturity",
    schemaKeys: ["geographic_availability"],
    mandate: `
For every country listed, which of these are available: Premium, Duo,
Student, Audiobooks in Premium, Spotify Ads self-serve, podcast monetization,
creator marketplace tools (Marquee/Showcase/Discovery Mode), video, AI
features (AI DJ, AI playlists). Cite the page that proves availability or
absence. This produces a monetization-maturity score per market and an
estimate of remaining international monetization runway.`,
  },

  fundamentals: {
    title: "Reported fundamentals",
    schemaKeys: ["fundamentals"],
    mandate: `
From Spotify's quarterly shareholder deck, 6-K filings, annual 20-F and
earnings call remarks, the last 8 quarters of: Premium subscribers, MAUs,
Premium ARPU, Premium revenue, ad-supported revenue, Premium gross margin,
ad-supported gross margin, total gross margin, operating expenses, operating
income and free cash flow. Quote exact figures with units and the filing URL.
The scraped data are the leading indicator; these tell us whether the thesis
flows through the P&L.`,
  },
};

// Products used for the per-country Monetization Depth / Feature Monetization
// scores in build-dataset.mjs. Keep in sync with the `geo` workstream mandate
// and the geographic_availability enum in schema.json.
export const monetizationProducts = [
  "Premium",
  "Duo",
  "Student",
  "Audiobooks",
  "Spotify Ads",
  "Podcast monetization",
  "Creator marketplace tools",
  "Video",
  "AI features",
];

// ---------------------------------------------------------------------------
// DAILY PAGE SNAPSHOTS
// snapshot.mjs saves the text of each page below every day; diff.mjs then
// shows what changed since the previous snapshot. Pages often change BEFORE
// the change is discussed in financial disclosures ("15 audiobook hours" ->
// "20 audiobook hours", $11.99 -> $12.99, a new tier appearing).
// ---------------------------------------------------------------------------

// Localized path segment of https://www.spotify.com/<path>/premium/ for each
// country code. Taken from the URLs the baseline agent actually cited on
// 2026-09-25. Countries missing here (ar, cl, pe, ng) had no working localized
// page in the baseline; add them when you find the right path.
export const spotifyPremiumPaths = {
  us: "us", ca: "ca-en", mx: "mx",
  gb: "uk", de: "de", fr: "fr", es: "es", it: "it", nl: "nl", se: "se", no: "no",
  dk: "dk", pl: "pl", ch: "ch-de", ie: "ie", be: "be-fr", pt: "pt-pt", tr: "tr-tr",
  br: "br-pt", co: "co-es",
  jp: "jp", kr: "kr-ko", au: "au", in: "in-en", id: "id-en", ph: "ph-en",
  th: "th-en", vn: "vn-en", za: "za-en", eg: "eg-en", sa: "sa-en", ae: "ae-en",
};

// Global (non-country) pages to snapshot daily. `category` is used to group
// the diff report. If a URL 404s, the manifest records the status so you can
// fix or remove it here. Add pages freely; each costs one scrape credit/day.
export const globalWatchPages = [
  { slug: "newsroom",             category: "launches",   url: "https://newsroom.spotify.com/" },
  { slug: "newsroom-product",     category: "launches",   url: "https://newsroom.spotify.com/news/product/" },
  { slug: "support-premium-plans",category: "tiers",      url: "https://support.spotify.com/us/article/premium-plans/" },
  { slug: "support-audiobooks-plan",  category: "audiobooks", url: "https://support.spotify.com/us/article/audiobooks-access-plan/" },
  { slug: "support-audiobook-topup",  category: "audiobooks", url: "https://support.spotify.com/us/article/audiobook-listening-time-purchase/" },
  { slug: "audiobooks-us",        category: "audiobooks", url: "https://www.spotify.com/us/audiobooks/" },
  { slug: "ads-home",             category: "ads",        url: "https://ads.spotify.com/en-US/" },
  { slug: "ads-get-started",      category: "ads",        url: "https://ads.spotify.com/en-US/get-started/" },
  { slug: "ads-formats",          category: "ads",        url: "https://ads.spotify.com/en-US/ad-experiences/" },
  { slug: "creators-home",        category: "podcasts",   url: "https://creators.spotify.com/" },
  { slug: "artists-marquee",      category: "marketplace",url: "https://artists.spotify.com/en/marquee" },
  { slug: "artists-showcase",     category: "marketplace",url: "https://artists.spotify.com/en/showcase" },
  { slug: "artists-discovery-mode",category: "marketplace",url: "https://artists.spotify.com/en/discovery-mode" },
  { slug: "loud-and-clear",       category: "creators",   url: "https://loudandclear.byspotify.com/" },
  { slug: "investors",            category: "fundamentals",url: "https://investors.spotify.com/" },
];

// Helper: the full list of pages to snapshot = one Spotify premium page per
// country (category "pricing") + the global pages above.
export const watchPages = [
  ...Object.entries(spotifyPremiumPaths).map(([code, path]) => ({
    slug: `premium-${code}`,
    category: "pricing",
    country: code,
    url: `https://www.spotify.com/${path}/premium/`,
  })),
  ...globalWatchPages,
];
