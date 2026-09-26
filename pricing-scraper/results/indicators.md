# Country indicators (latest run: 2026-09-26)

Built by `build-dataset.mjs` from 2 dated run(s): 2026-09-25 (baseline-derived.json, baseline.json); 2026-09-26 (2026-09-26-derived.json, 2026-09-26.json).
Blank cells mean the input is not in the JSON yet; the notes below say which workstream fills it. Nothing is estimated.

| Country | Pricing power index | Basis | Monetization products | Monetization depth | Feature monetization index | Plans | Plans w/ promo | Promotion intensity | Competitor lag (days) |
|---|---|---|---|---|---|---|---|---|---|
| AE |  |  |  |  |  | 3 | 3 | 1 |  |
| BE |  |  |  |  |  | 4 | 0 | 0 |  |
| BR |  |  |  |  |  | 4 | 4 | 1 |  |
| CA |  |  |  |  |  | 4 | 0 | 0 |  |
| CH |  |  |  |  |  | 4 | 0 | 0 |  |
| CO |  |  |  |  |  | 4 | 4 | 1 |  |
| DE |  |  |  |  |  | 4 | 0 | 0 |  |
| DK |  |  |  |  |  | 4 | 0 | 0 |  |
| EG |  |  |  |  |  | 4 | 4 | 1 |  |
| ES |  |  |  |  |  | 4 | 0 | 0 |  |
| FR |  |  |  |  |  | 4 | 0 | 0 |  |
| GB |  |  |  |  |  | 4 | 0 | 0 |  |
| ID |  |  |  |  |  | 3 | 3 | 1 |  |
| IE |  |  |  |  |  | 4 | 0 | 0 |  |
| IN |  |  |  |  |  | 3 | 3 | 1 |  |
| IT |  |  |  |  |  | 4 | 0 | 0 |  |
| KR |  |  |  |  |  | 4 | 4 | 1 |  |
| MX |  |  |  |  |  | 4 | 0 | 0 |  |
| NL |  |  |  |  |  | 4 | 0 | 0 |  |
| NO |  |  |  |  |  | 4 | 0 | 0 |  |
| PH |  |  |  |  |  | 4 | 4 | 1 |  |
| PL |  |  |  |  |  | 4 | 0 | 0 |  |
| PT |  |  |  |  |  | 4 | 0 | 0 |  |
| SE |  |  |  |  |  | 4 | 0 | 0 |  |
| TH |  |  |  |  |  | 4 | 4 | 1 |  |
| TR |  |  |  |  |  | 4 | 0 | 0 |  |
| US | 0.929 | Apple Music+YouTube Premium |  |  |  | 4 | 4 | 1 |  |
| VN |  |  |  |  |  | 2 | 2 | 1 |  |
| ZA |  |  |  |  |  | 3 | 3 | 1 |  |

## Definitions

- **Pricing power index**: Spotify Individual price / mean of Apple Music Individual and YouTube Premium Individual in the same currency (basis column says which competitors were available). >1 means Spotify prices above the competitor average.
- **Monetization depth**: products available / 9 (Premium, Duo, Student, Audiobooks, Spotify Ads, Podcast monetization, Creator marketplace tools, Video, AI features). Needs the `geo` workstream.
- **Feature monetization index**: products available in the country / union of products available in any country that day. Needs the `geo` workstream.
- **Promotion intensity**: Spotify plans carrying a visible promo (trial text on the price page, or a row from the `promotions` workstream) / Spotify plans offered.
- **Competitor lag**: minimum days from a Spotify price change (`spotify_price_history`) to an Apple/YouTube reaction (`competitor_reactions`) in the same country. Needs both arrays populated.

## Coverage on the latest run

- Countries with a Pricing power index: 1 of 29.
- Countries with Monetization depth: 0 of 29.
- Countries with Competitor lag: 0 of 29.
- Master table rows: 179 (all dates: 374).

## Flagged rows (not corrected, verify on the cited page)

_None._
