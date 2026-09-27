# Country indicators (latest run: 2026-09-27)

Built by `build-dataset.mjs` from 3 dated run(s): 2026-09-25 (baseline-derived.json, baseline.json); 2026-09-26 (2026-09-26-derived.json, 2026-09-26.json); 2026-09-27 (2026-09-27-derived.json, 2026-09-27.json).
Blank cells mean the input is not in the JSON yet; the notes below say which workstream fills it. Nothing is estimated.

| Country | Pricing power index | Basis | Monetization products | Monetization depth | Feature monetization index | Plans | Plans w/ promo | Promotion intensity | Competitor lag (days) |
|---|---|---|---|---|---|---|---|---|---|
| AE |  |  |  |  |  | 3 | 3 | 1 |  |
| AU | 1.067 | Apple Music |  |  |  | 4 | 4 | 1 |  |
| BE |  |  |  |  |  | 4 | 4 | 1 |  |
| BR | 1 | Apple Music |  |  |  | 2 | 2 | 1 |  |
| CA | 1.167 | Apple Music |  |  |  | 4 | 4 | 1 |  |
| CH | 1.07 | Apple Music |  |  |  | 4 | 4 | 1 |  |
| DE | 1.083 | Apple Music |  |  |  | 4 | 4 | 1 |  |
| DK |  |  |  |  |  | 4 | 4 | 1 |  |
| ES | 1 | Apple Music |  |  |  | 1 | 1 | 1 |  |
| FR | 1.013 | Apple Music |  |  |  | 4 | 4 | 1 |  |
| GB | 1.083 | Apple Music |  |  |  | 4 | 4 | 1 |  |
| ID |  |  |  |  |  | 2 | 2 | 1 |  |
| IE |  |  |  |  |  | 4 | 4 | 1 |  |
| IN | 1 | Apple Music |  |  |  | 3 | 3 | 1 |  |
| IT | 1 | Apple Music |  |  |  | 4 | 4 | 1 |  |
| JP |  |  |  |  |  |  |  |  |  |
| KR | 1.347 | Apple Music |  |  |  | 4 | 4 | 1 |  |
| MX | 1 | Apple Music |  |  |  | 2 | 2 | 1 |  |
| NG |  |  |  |  |  | 4 | 4 | 1 |  |
| NL | 1.167 | Apple Music |  |  |  | 4 | 4 | 1 |  |
| NO |  |  |  |  |  | 4 | 4 | 1 |  |
| PH |  |  |  |  |  | 4 | 4 | 1 |  |
| PL |  |  |  |  |  | 4 | 4 | 1 |  |
| PT | 1 | Apple Music |  |  |  | 4 | 4 | 1 |  |
| SE |  |  |  |  |  | 4 | 4 | 1 |  |
| TH |  |  |  |  |  | 4 | 4 | 1 |  |
| TR |  |  |  |  |  | 4 | 4 | 1 |  |
| US | 0.812 | YouTube Premium |  |  |  | 4 | 4 | 1 |  |
| VN |  |  |  |  |  | 2 | 2 | 1 |  |
| ZA |  |  |  |  |  | 4 | 4 | 1 |  |

## Definitions

- **Pricing power index**: Spotify Individual price / mean of Apple Music Individual and YouTube Premium Individual in the same currency (basis column says which competitors were available). >1 means Spotify prices above the competitor average.
- **Monetization depth**: products available / 9 (Premium, Duo, Student, Audiobooks, Spotify Ads, Podcast monetization, Creator marketplace tools, Video, AI features). Needs the `geo` workstream.
- **Feature monetization index**: products available in the country / union of products available in any country that day. Needs the `geo` workstream.
- **Promotion intensity**: Spotify plans carrying a visible promo (trial text on the price page, or a row from the `promotions` workstream) / Spotify plans offered.
- **Competitor lag**: minimum days from a Spotify price change (`spotify_price_history`) to an Apple/YouTube reaction (`competitor_reactions`) in the same country. Needs both arrays populated.

## Coverage on the latest run

- Countries with a Pricing power index: 15 of 30.
- Countries with Monetization depth: 0 of 30.
- Countries with Competitor lag: 0 of 30.
- Master table rows: 187 (all dates: 561).

## Flagged rows (not corrected, verify on the cited page)

_None._
