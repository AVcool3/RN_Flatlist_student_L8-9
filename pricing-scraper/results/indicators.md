# Country indicators (latest run: 2026-09-28)

Built by `build-dataset.mjs` from 4 dated run(s): 2026-09-25 (baseline-derived.json, baseline.json); 2026-09-26 (2026-09-26-derived.json, 2026-09-26.json); 2026-09-27 (2026-09-27-derived.json, 2026-09-27.json); 2026-09-28 (2026-09-28-derived.json, 2026-09-28.json).
Blank cells mean the input is not in the JSON yet; the notes below say which workstream fills it. Nothing is estimated.

| Country | Pricing power index | Basis | Monetization products | Monetization depth | Feature monetization index | Plans | Plans w/ promo | Promotion intensity | Competitor lag (days) |
|---|---|---|---|---|---|---|---|---|---|
| AE |  |  |  |  |  | 3 | 2 | 0.667 |  |
| AR |  |  |  |  |  | 4 | 2 | 0.5 |  |
| AU | 1.067 | Apple Music |  |  |  | 4 | 2 | 0.5 |  |
| BE |  |  |  |  |  | 4 | 2 | 0.5 |  |
| BR |  |  |  |  |  | 4 | 2 | 0.5 |  |
| CA | 1.167 | Apple Music |  |  |  | 4 | 2 | 0.5 |  |
| CH |  |  |  |  |  | 4 | 2 | 0.5 |  |
| CL |  |  |  |  |  | 4 | 2 | 0.5 |  |
| CO |  |  |  |  |  | 4 | 2 | 0.5 |  |
| DE |  |  |  |  |  | 4 | 2 | 0.5 |  |
| DK |  |  |  |  |  | 4 | 2 | 0.5 |  |
| ES |  |  |  |  |  | 4 | 2 | 0.5 |  |
| FR |  |  |  |  |  | 4 | 2 | 0.5 |  |
| GB | 1.04 | Apple Music+YouTube Premium |  |  |  | 4 | 2 | 0.5 |  |
| ID |  |  |  |  |  | 3 | 2 | 0.667 |  |
| IE |  |  |  |  |  | 4 | 2 | 0.5 |  |
| IN | 1 | Apple Music |  |  |  | 3 | 2 | 0.667 |  |
| IT |  |  |  |  |  | 4 | 2 | 0.5 |  |
| JP |  |  |  |  |  | 4 | 2 | 0.5 |  |
| MX |  |  |  |  |  | 4 | 2 | 0.5 |  |
| NG |  |  |  |  |  | 4 | 2 | 0.5 |  |
| NL |  |  |  |  |  | 4 | 2 | 0.5 |  |
| NO |  |  |  |  |  | 4 | 2 | 0.5 |  |
| PE |  |  |  |  |  | 4 | 2 | 0.5 |  |
| PH |  |  |  |  |  | 4 | 4 | 1 |  |
| PL |  |  |  |  |  | 4 | 2 | 0.5 |  |
| PT |  |  |  |  |  | 4 | 2 | 0.5 |  |
| SA |  |  |  |  |  | 2 | 1 | 0.5 |  |
| SE |  |  |  |  |  | 4 | 2 | 0.5 |  |
| TH |  |  |  |  |  | 4 | 4 | 1 |  |
| TR |  |  |  |  |  | 4 | 2 | 0.5 |  |
| US | 0.929 | Apple Music+YouTube Premium |  |  |  | 4 | 2 | 0.5 |  |
| VN |  |  |  |  |  | 2 | 2 | 1 |  |
| ZA |  |  |  |  |  | 3 | 2 | 0.667 |  |

## Definitions

- **Pricing power index**: Spotify Individual price / mean of Apple Music Individual and YouTube Premium Individual in the same currency (basis column says which competitors were available). >1 means Spotify prices above the competitor average.
- **Monetization depth**: products available / 9 (Premium, Duo, Student, Audiobooks, Spotify Ads, Podcast monetization, Creator marketplace tools, Video, AI features). Needs the `geo` workstream.
- **Feature monetization index**: products available in the country / union of products available in any country that day. Needs the `geo` workstream.
- **Promotion intensity**: Spotify plans carrying a visible promo (trial text on the price page, or a row from the `promotions` workstream) / Spotify plans offered.
- **Competitor lag**: minimum days from a Spotify price change (`spotify_price_history`) to an Apple/YouTube reaction (`competitor_reactions`) in the same country. Needs both arrays populated.

## Coverage on the latest run

- Countries with a Pricing power index: 5 of 34.
- Countries with Monetization depth: 0 of 34.
- Countries with Competitor lag: 0 of 34.
- Master table rows: 232 (all dates: 793).

## Flagged rows (not corrected, verify on the cited page)

_None._
