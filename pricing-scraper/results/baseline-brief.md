# Spotify pricing: investment brief (baseline 2026-09-25)

Built only from `pricing-scraper/results/baseline.json` (run_type: baseline). Every figure cites the source URL recorded in the JSON. Overall confidence reported by the agent: **medium**.

Baseline limitations recorded by the agent:
- AR: Spotify Premium Individual, Duo, Family, Student and any local Basic/Lite/Platinum tiers could not be captured from an official localized price page in this run.
- CL: Spotify Premium Individual, Duo, Family, Student and any local Basic/Lite/Platinum tiers could not be captured from an official localized price page in this run.
- PE: Spotify Premium Individual, Duo, Family, Student and any local Basic/Lite/Platinum tiers could not be captured from an official localized price page in this run.
- NG: Spotify Premium Individual, Duo, Family, Student and any local Basic/Lite/Platinum tiers could not be captured from an official localized price page in this run.
- All requested countries: no localized official YouTube Premium/Music Premium recurring price was verified except US; do not substitute the generic USD page.
- AR, CL, PE: Apple Music Individual was captured, but Spotify was not; Apple Duo/Family/Student and YouTube localized prices were not visible.
- NG: the requested Spotify URL redirected to a US/404 page; no localized Apple or YouTube prices were verified.
- JP, KR, AU, IN, ID, PH, TH, VN, ZA, EG, SA, AE: localized Spotify tiers were captured, but localized Apple Music/Apple One and YouTube recurring prices were not visible.
- BE: localized Spotify tiers were captured; the fetched Apple Belgium pages did not expose plan prices.
- Tax-inclusive status is not stated on most localized pages; KR Spotify explicitly states VAT included.
- No official page in this run provided complete old/new price pairs and exact effective dates for every country/tier over the last 24 months.

## (a) Spotify Premium Individual price per country

Local price and USD conversion come from `derived_metrics`; the FX rate and its source are the agent's, cited per row.

| Country | Region | Local price | Currency | USD | FX rate | FX source | vs Apple | vs YouTube | Last Spotify hike | Months since |
|---|---|---|---|---|---|---|---|---|---|---|
| _no derived_metrics rows in the JSON_ | | | | | | | | | | |

Spotify Individual rows captured in `pricing_baseline` but with no USD conversion in `derived_metrics` (local currency only, as recorded):

| Country | Region | Tier | Price | Currency | Period | Tax inclusive | Trial offer | As of | Source |
|---|---|---|---|---|---|---|---|---|---|
| AE | Rest of World | Standard | 23.99 | AED | month | not stated | n/a | 2026-09-25 | [source](https://www.spotify.com/ae-en/premium/) |
| AU | Rest of World | Individual | 15.99 | AUD | month | not stated | n/a | 2026-09-25 | [source](https://www.spotify.com/au/premium/) |
| BE | Europe | Individual | 13.99 | EUR | month | not stated | 1 month free | 2026-09-25 | [source](https://www.spotify.com/be-fr/premium/) |
| BR | Latin America | Individual | 23.9 | BRL | month | not stated | 1 month for 0 | 2026-09-25 | [source](https://www.spotify.com/br-pt/premium/) |
| CA | North America | Individual | 13.99 | CAD | month | not stated | 1 month for $0; then $13.99/month; users who have not tried Premium before | 2026-09-25 | [source](https://www.spotify.com/ca-en/premium/) |
| CH | Europe | Individual | 15.95 | CHF | month | not stated | 1 month free | 2026-09-25 | [source](https://www.spotify.com/ch-de/premium/) |
| CO | Latin America | Individual | 18.5 | COP | month | not stated | 1 month for 0 | 2026-09-25 | [source](https://www.spotify.com/co-es/premium/) |
| DE | Europe | Individual | 12.99 | EUR | month | not stated | n/a | 2026-09-25 | [source](https://www.spotify.com/de/premium/) |
| DK | Europe | Individual | 119 | DKK | month | not stated | n/a | 2026-09-25 | [source](https://www.spotify.com/dk/premium/) |
| EG | Rest of World | Individual | 79 | EGP | month | not stated | n/a | 2026-09-25 | [source](https://www.spotify.com/eg-en/premium/) |
| ES | Europe | Individual | 11.99 | EUR | month | not stated | n/a | 2026-09-25 | [source](https://www.spotify.com/es/premium/) |
| FR | Europe | Individual | 12.14 | EUR | month | not stated | n/a | 2026-09-25 | [source](https://www.spotify.com/fr/premium/) |
| GB | Europe | Individual | 12.99 | GBP | month | not stated | n/a | 2026-09-25 | [source](https://www.spotify.com/uk/premium/) |
| ID | Rest of World | Standard | 59900 | IDR | month | not stated | n/a | 2026-09-25 | [source](https://www.spotify.com/id-en/premium/) |
| IE | Europe | Individual | 12.99 | EUR | month | not stated | 1 month free | 2026-09-25 | [source](https://www.spotify.com/ie/premium/) |
| IN | Rest of World | Standard | 139 | INR | month | not stated | n/a | 2026-09-25 | [source](https://www.spotify.com/in-en/premium/) |
| IT | Europe | Individual | 11.99 | EUR | month | not stated | n/a | 2026-09-25 | [source](https://www.spotify.com/it/premium/) |
| JP | Rest of World | Standard | 1.08 | JPY | month | not stated | n/a | 2026-09-25 | [source](https://www.spotify.com/jp/premium/) |
| KR | Rest of World | Individual | 11.99 | KRW | month | yes | n/a | 2026-09-25 | [source](https://www.spotify.com/kr-ko/premium/) |
| MX | North America | Individual | 139 | MXN | month | not stated | 1 month for $0; then $139/month; new/eligible users only | 2026-09-25 | [source](https://www.spotify.com/mx/premium/) |
| NL | Europe | Individual | 13.99 | EUR | month | not stated | n/a | 2026-09-25 | [source](https://www.spotify.com/nl/premium/) |
| NO | Europe | Individual | 139 | NOK | month | not stated | n/a | 2026-09-25 | [source](https://www.spotify.com/no/premium/) |
| PH | Rest of World | Individual | 169 | PHP | month | not stated | n/a | 2026-09-25 | [source](https://www.spotify.com/ph-en/premium/) |
| PL | Europe | Individual | 26.99 | PLN | month | not stated | 1 month free | 2026-09-25 | [source](https://www.spotify.com/pl/premium/) |
| PT | Europe | Individual | 8.99 | EUR | month | not stated | 1 month free | 2026-09-25 | [source](https://www.spotify.com/pt-pt/premium/) |
| SA | Rest of World | Standard | 23.99 | SAR | month | not stated | n/a | 2026-09-25 | [source](https://www.spotify.com/sa-en/premium/) |
| SE | Europe | Individual | 129 | SEK | month | not stated | n/a | 2026-09-25 | [source](https://www.spotify.com/se/premium/) |
| TH | Rest of World | Individual | 149 | THB | month | not stated | n/a | 2026-09-25 | [source](https://www.spotify.com/th-en/premium/) |
| TR | Europe | Individual | 99 | TRY | month | not stated | 1 month free | 2026-09-25 | [source](https://www.spotify.com/tr-tr/premium/) |
| US | North America | Individual | 12.99 | USD | month | not stated | 1 month for $0; then $12.99/month; new/eligible users only | 2026-09-25 | [source](https://www.spotify.com/us/premium/) |
| VN | Rest of World | Individual | 65000 | VND | month | not stated | n/a | 2026-09-25 | [source](https://www.spotify.com/vn-en/premium/) |
| ZA | Rest of World | Standard | 69.99 | ZAR | month | not stated | n/a | 2026-09-25 | [source](https://www.spotify.com/za-en/premium/) |

**Countries in scope with no Spotify price captured (4 of 36):** Argentina (AR), Chile (CL), Peru (PE), Nigeria (NG)

## (b) Spotify hike pattern (from `spotify_price_history`)

Agent's stated hike pattern (verbatim):

> The sourced history shows a multi-region Individual increase announced 2025-08-04 and a US/Estonia/Latvia update announced 2026-01-15. The 2025 report describes a move from €10.99 to €11.99 (+9.1%) in selected markets; the 2026 US move was $11.99 to $12.99 (+8.3%). Exact country-level effective dates were not published in the captured sources, so cadence beyond these two announcements is not asserted (https://www.reuters.com/business/spotify-raise-premium-subscription-price-select-markets-september-2025-08-04/; https://www.reuters.com/business/spotify-raise-premium-subscription-price-1299-month-select-markets-2026-01-15/).

Order in which regions first moved (earliest effective date in the history rows, or announced date when effective is not recorded; countries not in config.mjs are labelled Unlisted):

| Region | First move | Country | Price changes recorded in region |
|---|---|---|---|
| Unlisted | 2025-08-04 | selected markets (South Asia, Middle East, Africa, Europe, Latin America and Asia-Pacific) | 1 |
| North America | 2026-01-15 | US | 1 |

How often: number of recorded changes per country (24-month window as captured by the agent):

selected markets (South Asia, Middle East, Africa, Europe, Latin America and Asia-Pacific) (1), US (1)

Every recorded change, by how much, with dates and sources:

| Country | Region | Tier | Old | New | Currency | Change | Announced | Effective | Source type | Source |
|---|---|---|---|---|---|---|---|---|---|---|
| selected markets (South Asia, Middle East, Africa, Europe, Latin America and Asia-Pacific) | Unlisted | Individual | 10.99 | 11.99 | EUR | +9.1% | 2025-08-04 | unknown | press | [source](https://www.reuters.com/business/spotify-raise-premium-subscription-price-select-markets-september-2025-08-04/) |
| US | North America | Individual | 11.99 | 12.99 | USD | +8.3% | 2026-01-15 | unknown | press | [source](https://www.reuters.com/business/spotify-raise-premium-subscription-price-1299-month-select-markets-2026-01-15/) |

## (c) Top investment signals

The JSON carries no materiality score. Ordering below: confidence (high > medium > low), then category (earnings, guidance, pricing_announcement, subscriber_metrics, arpu_or_margin, churn_or_retention, regulatory, executive_commentary, analyst_note, competitor_move, product_change, other), then most recent date.

1. **Spotify crossed 300 million Premium subscribers in Q2 2026 while Premium ARPU expanded.** (2026-08-04; Spotify; earnings; confidence high; filing)  
   Figure: Premium subscribers / Premium ARPU = 300M; €4.89; +7% Y/Y. [source](https://s29.q4cdn.com/175625835/files/doc_financials/2026/q2/Q2-26-Earnings-Call-Prepared-Remarks.pdf)  
   The Q2 prepared remarks report 300 million Premium subscribers, 7 million sequential net additions and 9% year-over-year growth. Premium revenue was €4.331 billion, up 15% year over year, and Premium ARPU was €4.89, up 7%, with price increases contributing +€0.49, mix -€0.14 and FX -€0.02.  
   Countries: global  
2. **Spotify reported record Q2 2026 gross margin and strong cash generation.** (2026-08-04; Spotify; earnings; confidence high; filing)  
   Figure: Gross margin / operating income / free cash flow = 33.4%; €655M; €797M. [source](https://s29.q4cdn.com/175625835/files/doc_financials/2026/q2/Q2-26-Earnings-Call-Prepared-Remarks.pdf)  
   Q2 gross margin was 33.4%, up 193 basis points year over year. Operating income was €655 million and free cash flow was €797 million; the prepared remarks also report €3.3 billion of trailing-twelve-month free cash flow.  
   Countries: global  
3. **Spotify reported 293 million Premium subscribers in Q1 2026.** (2026-04-28; Spotify; earnings; confidence high; official)  
   Figure: Premium subscribers / MAUs / gross margin = 293M; 761M; 33.0%. [source](https://newsroom.spotify.com/2026-04-28/spotify-q1-2026-earnings/)  
   The Q1 filing reported 293 million Premium subscribers, 761 million MAUs, 33.0% gross margin, €715 million operating income and €824 million free cash flow. The company described churn as low and said it remained confident in sustained growth and margin progress.  
   Countries: global  
4. **Spotify guided to 305 million Premium subscribers and 788 million MAUs for Q3 2026.** (2026-08-04; Spotify; guidance; confidence high; filing)  
   Figure: Q3 2026 Premium subscribers / MAUs = 305M / 788M. [source](https://s29.q4cdn.com/175625835/files/doc_financials/2026/q2/Q2-26-Earnings-Call-Prepared-Remarks.pdf)  
   Q3 guidance was 788 million MAUs and 305 million Premium subscribers, or 5 million net additions. Spotify also guided to approximately €5.0 billion revenue, 32.9% gross margin and €670 million operating income.  
   Countries: global  
5. **Spotify announced a US Premium Individual increase to $12.99.** (2026-01-15; Spotify; pricing_announcement; confidence high; official)  
   Figure: Premium Individual price = $12.99/month; +$1. [source](https://newsroom.spotify.com/2026-01-15/premium-pricing-update/)  
   Spotify announced a price update for the United States, Estonia and Latvia. Reuters reported the US monthly price would rise by $1 to $12.99 and take effect on consumers’ billing dates starting in February; the official post said subscribers would receive an email over the following month.  
   Countries: US, EE, LV  
6. **Spotify announced a Premium price update across multiple non-US regions.** (2025-08-04; Spotify; pricing_announcement; confidence high; official)  
   Figure: Individual price change = €10.99 to €11.99; +9.1%. [source](https://newsroom.spotify.com/2025-08-04/upcoming-changes-to-spotify-premium-subscriptions/)  
   Spotify said subscribers in South Asia, the Middle East, Africa, Europe, Latin America and Asia-Pacific would receive price-change emails over the following month. Reuters reported the Individual price would rise to €11.99 from €10.99 in included markets, with the company citing margin improvement as the rationale.  
   Countries: global  
7. **Spotify ended 2025 with 290 million Premium subscribers and 751 million MAUs.** (2025-12-31; Spotify; subscriber_metrics; confidence high; filing)  
   Figure: Premium subscribers / MAUs = 290M; 751M. [source](https://www.sec.gov/Archives/edgar/data/1639920/000162828026006874/ck0001639920-20251231.htm)  
   Spotify’s 2025 annual filing reported 290 million Premium subscribers, up from 263 million at year-end 2024, and 751 million MAUs across 184 countries and territories. The filing defines Premium subscribers as accounts with an activated payment method and includes Family/Duo subaccounts and up to 30 days of grace.  
   Countries: global  
8. **Spotify reported 281 million Premium subscribers in Q3 2025.** (2025-09-30; Spotify; subscriber_metrics; confidence high; filing)  
   Figure: Premium subscribers / Premium gross margin = 281M; 33%. [source](https://www.sec.gov/Archives/edgar/data/1639920/000162828025048927/spot-20250930x6xk.htm)  
   The Q3 2025 6-K reported 281 million Premium subscribers, up 12% year over year to 281 million. It also reported nine-month Premium gross margin of 33%, up from 32% in the prior-year period.  
   Countries: global  
9. **The European Commission fined Apple over €1.8 billion in a music-streaming antitrust case.** (2024-03-04; Apple; regulatory; confidence high; official)  
   Figure: European Commission fine = over €1.8B. [source](https://newsroom.spotify.com/2024-03-04/the-european-commission-confirms-apples-anti-competitive-behavior-is-illegal-and-harms-consumers/)  
   Spotify said the Commission found Apple’s App Store rules for music-streaming services abusive and that the decision could let EU users see Spotify pricing and be told they could purchase on Spotify’s website. Spotify also said Apple’s charges still limited in-app purchase links at that time.  
   Countries: AT, BE, BG, HR, CY, CZ, DK, EE, FI, FR, DE, GR, HU, IE, IT, LV, LT, LU, MT, NL, PL, PT, RO, SK, SI, ES, SE  
10. **Apple updated EEA options for music-streaming apps to communicate and promote digital-goods offers.** (2025-06-26; Apple; product_change; confidence high; official)  
   Figure: n/a = n/a. [source](https://developer.apple.com/news/?id=awedznci)  
   Apple’s developer notice said EEA music-streaming apps using the Music Streaming Services Entitlement could use updated options for communicating and promoting offers. Apple also described planned changes to the EU fee model.  
   Countries: global  

## (d) Competitor reactions, with lag in days

Lag is computed here as days from the closest earlier Spotify effective date, or announced date when no effective date is recorded (same country when one matches, otherwise any country) in `spotify_price_history` to the reaction date. It is blank when no earlier Spotify change is recorded. The agent's own `relative_to_spotify` text is shown verbatim.

| Competitor | Date | Action | Countries | Lag (days) | Relative to Spotify (agent) | Detail | Source |
|---|---|---|---|---|---|---|---|
| _no competitor_reactions rows in the JSON_ | | | | | | | |

## (e) Consumer reaction highlights

| Country | Service | Store | Rating | Rating count | Price sentiment (as recorded) | As of | Source |
|---|---|---|---|---|---|---|---|
| US | Spotify Premium | ios_app_store | 4.8 | 42M Ratings | A visible review said the reviewer was close to subscribing to Apple Music and that Spotify feature changes were pushing them toward Apple Music or SoundCloud; the excerpt did not explicitly attribute this to price. | 2026-09-25 | [source](https://apps.apple.com/us/app/spotify-music-and-podcasts/id324684580) |
| GB | Spotify Premium | ios_app_store | 4.7 | 7m Ratings | A visible review called Premium expensive, said £11 per month was unaffordable for the reviewer, and described the service as disappointing. | 2026-09-25 | [source](https://apps.apple.com/gb/app/spotify-music-and-podcasts/id324684580) |
| CA | Spotify Premium | ios_app_store | 4.7 | 5.1M Ratings | The fetched storefront showed the current average rating and review count; no price-specific review excerpt was visible in the fetched content. | 2026-09-25 | [source](https://apps.apple.com/ca/app/spotify-music-and-podcasts/id324684580) |
| IN | Spotify Premium | ios_app_store | 4.6 | 5.2m Ratings | The fetched storefront showed the current average rating and review count; no price-specific review excerpt was visible in the fetched content. | 2026-09-25 | [source](https://apps.apple.com/in/app/spotify-music-and-podcasts/id324684580) |

## (f) Agent's analyst summary (verbatim)

### Key findings
- Spotify’s Q2 2026 Premium ARPU was €4.89, up 7% year over year; the filing attributes +€0.49 of the change to price increases, partially offset by mix and FX (https://s29.q4cdn.com/175625835/files/doc_financials/2026/q2/Q2-26-Earnings-Call-Prepared-Remarks.pdf).
- Spotify crossed 300M Premium subscribers in Q2 2026 with 7M sequential net adds, while gross margin reached 33.4% and free cash flow €797M (https://s29.q4cdn.com/175625835/files/doc_financials/2026/q2/Q2-26-Earnings-Call-Prepared-Remarks.pdf).
- The most recent multi-region hike announced 2025-08-04 was reported at €10.99 to €11.99 for Individual in selected markets, a 9.1% increase; the announcement did not publish a country-by-country table (https://www.reuters.com/business/spotify-raise-premium-subscription-price-select-markets-september-2025-08-04/).
- The US Individual price was raised from $11.99 to $12.99 in January 2026, with billing-date implementation starting in February (https://www.reuters.com/business/spotify-raise-premium-subscription-price-1299-month-select-markets-2026-01-15/).
- Spotify ended 2025 with 290M Premium subscribers and 751M MAUs, up from 263M and 675M respectively at year-end 2024 (https://www.sec.gov/Archives/edgar/data/1639920/000162828026006874/ck0001639920-20251231.htm).
- In the captured US comparison, Spotify Individual is $12.99/month versus Apple Music $11.99 and YouTube Premium $15.99; Apple One Individual is $21.95 (official pages: https://www.spotify.com/us/premium/, https://www.apple.com/apple-music/, https://www.youtube.com/premium, https://www.apple.com/apple-one/).
- In the captured UK comparison, Spotify Individual is £12.99 versus Apple Music £11.99, while Apple One Individual is £18.95 (https://www.spotify.com/uk/premium/, https://www.apple.com/uk/apple-music/, https://www.apple.com/uk/apple-one/).
- The consumer evidence is mixed in form: US Spotify iOS shows 4.8/42M ratings, UK 4.7/7m, Canada 4.7/5.1M and India 4.6/5.2m; only the UK excerpt explicitly described Premium as expensive (https://apps.apple.com/gb/app/spotify-music-and-podcasts/id324684580).

### Bull points
- Price increases contributed +€0.49 to Q2 Premium ARPU and Spotify still crossed 300M subscribers (https://s29.q4cdn.com/175625835/files/doc_financials/2026/q2/Q2-26-Earnings-Call-Prepared-Remarks.pdf).
- Q2 gross margin was 33.4% and FCF €797M, supporting reinvestment and capital returns (https://s29.q4cdn.com/175625835/files/doc_financials/2026/q2/Q2-26-Earnings-Call-Prepared-Remarks.pdf).
- Q3 guidance called for 305M Premium subscribers and 32.9% gross margin (https://s29.q4cdn.com/175625835/files/doc_financials/2026/q2/Q2-26-Earnings-Call-Prepared-Remarks.pdf).

### Bear points
- The official 2025 and 2026 pricing announcements do not provide a complete country-by-country old/new table, limiting direct regional elasticity analysis (https://newsroom.spotify.com/2025-08-04/upcoming-changes-to-spotify-premium-subscriptions/).
- The subscriber definition includes Family/Duo subaccounts and up to 30 days of payment grace, so reported Premium subscribers are not equivalent to paid households (https://s29.q4cdn.com/175625835/files/doc_financials/2026/q2/Q2-2026-6K-Filing.pdf).
- The fetched consumer evidence includes a UK review describing Premium as expensive, but no country-level churn rate was disclosed (https://apps.apple.com/gb/app/spotify-music-and-podcasts/id324684580).

### Watch items, next 5 days
- Recheck the Spotify newsroom pricing-update page and all 36 localized /premium pages for new prices, trial text, tax wording and effective-date disclosures.
- Recheck Spotify investor relations for Q3 2026 earnings/guidance updates and any ARPU, churn, margin or subscriber revision.
- Recheck Apple Music/Apple One and YouTube Premium localized storefronts for price matches, bundles or new tiers in the four regions where Spotify moved.
- Monitor SEC 6-K filings and Spotify/Apple newsroom pages for DMA/App Store fee developments affecting external pricing.
- Revisit iOS and Google Play Spotify listings for ratings, review counts and new price/cancellation language in every reachable country page.

### Data gaps
- AR: Spotify Premium Individual, Duo, Family, Student and any local Basic/Lite/Platinum tiers could not be captured from an official localized price page in this run.
- CL: Spotify Premium Individual, Duo, Family, Student and any local Basic/Lite/Platinum tiers could not be captured from an official localized price page in this run.
- PE: Spotify Premium Individual, Duo, Family, Student and any local Basic/Lite/Platinum tiers could not be captured from an official localized price page in this run.
- NG: Spotify Premium Individual, Duo, Family, Student and any local Basic/Lite/Platinum tiers could not be captured from an official localized price page in this run.
- All requested countries: no localized official YouTube Premium/Music Premium recurring price was verified except US; do not substitute the generic USD page.
- AR, CL, PE: Apple Music Individual was captured, but Spotify was not; Apple Duo/Family/Student and YouTube localized prices were not visible.
- NG: the requested Spotify URL redirected to a US/404 page; no localized Apple or YouTube prices were verified.
- JP, KR, AU, IN, ID, PH, TH, VN, ZA, EG, SA, AE: localized Spotify tiers were captured, but localized Apple Music/Apple One and YouTube recurring prices were not visible.
- BE: localized Spotify tiers were captured; the fetched Apple Belgium pages did not expose plan prices.
- Tax-inclusive status is not stated on most localized pages; KR Spotify explicitly states VAT included.
- No official page in this run provided complete old/new price pairs and exact effective dates for every country/tier over the last 24 months.
- No FX rate series was used, so derived_metrics is empty rather than estimating USD conversions.
- No explicit competitor price response to either sourced Spotify hike was found; competitor_reactions is empty.
- Google Play ratings/review counts were not captured in the fetched sources.
- No analyst note with a sourced price target and explicit Spotify pricing assumption was found in the fetched pages.

Overall confidence: **medium**
