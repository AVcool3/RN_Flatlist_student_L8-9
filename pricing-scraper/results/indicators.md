# Country indicators (latest run: 2026-09-30)

Built by `build-dataset.mjs` from 6 dated run(s): 2026-09-25 (baseline-derived.json, baseline.json); 2026-09-26 (2026-09-26-derived.json, 2026-09-26.json); 2026-09-27 (2026-09-27-derived.json, 2026-09-27.json); 2026-09-28 (2026-09-28-derived.json, 2026-09-28.json); 2026-09-29 (2026-09-29-derived.json, 2026-09-29.json); 2026-09-30 (2026-09-30-derived.json, 2026-09-30.json).
Blank cells mean the input is not in the JSON yet; the notes below say which workstream fills it. Nothing is estimated.

| Country | Pricing power index | Basis | Monetization products | Monetization depth | Feature monetization index | Plans | Plans w/ promo | Promotion intensity | Competitor lag (days) |
|---|---|---|---|---|---|---|---|---|---|
| AE |  |  |  |  |  | 3 | 2 | 0.667 |  |
| AR |  |  |  |  |  | 4 | 2 | 0.5 |  |
| AU | 1.067 | Apple Music |  |  |  | 4 | 2 | 0.5 |  |
| BE |  |  |  |  |  | 1 | 1 | 1 |  |
| BR |  |  |  |  |  | 4 | 2 | 0.5 |  |
| CA | 1.167 | Apple Music |  |  |  | 4 | 2 | 0.5 |  |
| CL |  |  |  |  |  | 4 | 2 | 0.5 |  |
| CO |  |  |  |  |  | 4 | 2 | 0.5 |  |
| DE |  |  |  |  |  | 1 | 1 | 1 |  |
| DK |  |  |  |  |  | 1 | 1 | 1 |  |
| EG |  |  |  |  |  | 1 | 1 | 1 |  |
| ES |  |  |  |  |  | 1 | 1 | 1 |  |
| FR |  |  |  |  |  | 1 | 1 | 1 |  |
| GB |  |  |  |  |  | 1 | 1 | 1 |  |
| ID |  |  |  |  |  | 3 | 2 | 0.667 |  |
| IE |  |  |  |  |  | 1 | 1 | 1 |  |
| IN | 1 | Apple Music |  |  |  | 2 | 2 | 1 |  |
| IT |  |  |  |  |  | 1 | 1 | 1 |  |
| JP |  |  |  |  |  | 4 | 2 | 0.5 |  |
| KR |  |  |  |  |  | 4 | 1 | 0.25 |  |
| MX |  |  |  |  |  | 1 | 1 | 1 |  |
| NG |  |  |  |  |  | 4 | 1 | 0.25 |  |
| NL |  |  |  |  |  | 1 | 1 | 1 |  |
| NO |  |  |  |  |  | 1 | 1 | 1 |  |
| PE |  |  |  |  |  | 4 | 2 | 0.5 |  |
| PH |  |  |  |  |  | 4 | 1 | 0.25 |  |
| PL |  |  |  |  |  | 1 | 1 | 1 |  |
| PT |  |  |  |  |  | 1 | 1 | 1 |  |
| SA |  |  |  |  |  | 1 | 1 | 1 |  |
| SE |  |  |  |  |  | 1 | 1 | 1 |  |
| TH |  |  |  |  |  | 4 | 4 | 1 |  |
| TR |  |  |  |  |  | 4 | 2 | 0.5 |  |
| US | 0.812 | YouTube Premium |  |  |  | 4 | 2 | 0.5 |  |
| VN |  |  |  |  |  | 1 | 1 | 1 |  |
| ZA |  |  |  |  |  | 3 | 2 | 0.667 |  |

## Definitions

- **Pricing power index**: Spotify Individual price / mean of Apple Music Individual and YouTube Premium Individual in the same currency (basis column says which competitors were available). >1 means Spotify prices above the competitor average.
- **Monetization depth**: products available / 9 (Premium, Duo, Student, Audiobooks, Spotify Ads, Podcast monetization, Creator marketplace tools, Video, AI features). Needs the `geo` workstream.
- **Feature monetization index**: products available in the country / union of products available in any country that day. Needs the `geo` workstream.
- **Promotion intensity**: Spotify plans carrying a visible promo (trial text on the price page, or a row from the `promotions` workstream) / Spotify plans offered.
- **Competitor lag**: minimum days from a Spotify price change (`spotify_price_history`) to an Apple/YouTube reaction (`competitor_reactions`) in the same country. Needs both arrays populated.

## Coverage on the latest run

- Countries with a Pricing power index: 4 of 35.
- Countries with Monetization depth: 0 of 35.
- Countries with Competitor lag: 0 of 35.
- Master table rows: 188 (all dates: 1053).

## Flagged rows (not corrected, verify on the cited page)

_None._
