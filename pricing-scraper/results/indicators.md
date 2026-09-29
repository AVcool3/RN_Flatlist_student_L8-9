# Country indicators (latest run: 2026-09-29)

Built by `build-dataset.mjs` from 5 dated run(s): 2026-09-25 (baseline-derived.json, baseline.json); 2026-09-26 (2026-09-26-derived.json, 2026-09-26.json); 2026-09-27 (2026-09-27-derived.json, 2026-09-27.json); 2026-09-28 (2026-09-28-derived.json, 2026-09-28.json); 2026-09-29 (2026-09-29-derived.json, 2026-09-29.json).
Blank cells mean the input is not in the JSON yet; the notes below say which workstream fills it. Nothing is estimated.

| Country | Pricing power index | Basis | Monetization products | Monetization depth | Feature monetization index | Plans | Plans w/ promo | Promotion intensity | Competitor lag (days) |
|---|---|---|---|---|---|---|---|---|---|
| AE |  |  |  |  |  | 3 | 0 | 0 |  |
| AU | 1.067 | Apple Music |  |  |  | 4 | 1 | 0.25 |  |
| BR | 1 | Apple Music |  |  |  | 7 | 0 | 0 |  |
| CA | 1.167 | Apple Music |  |  |  | 4 | 1 | 0.25 |  |
| CH |  |  |  |  |  | 4 | 0 | 0 |  |
| DE | 1.083 | Apple Music |  |  |  | 4 | 0 | 0 |  |
| ES | 1 | Apple Music |  |  |  | 4 | 0 | 0 |  |
| FR | 1.013 | Apple Music |  |  |  | 4 | 0 | 0 |  |
| GB | 1.083 | Apple Music |  |  |  | 4 | 1 | 0.25 |  |
| IN | 1 | Apple Music |  |  |  | 4 | 1 | 0.25 |  |
| IT | 1 | Apple Music |  |  |  | 4 | 0 | 0 |  |
| JP | 0.915 | Apple Music |  |  |  | 2 | 0 | 0 |  |
| MX | 1 | Apple Music |  |  |  | 7 | 0 | 0 |  |
| NL |  |  |  |  |  | 2 | 0 | 0 |  |
| PL |  |  |  |  |  | 4 | 0 | 0 |  |
| US | 0.929 | Apple Music+YouTube Premium |  |  |  | 4 | 2 | 0.5 |  |
| ZA |  |  |  |  |  | 3 | 0 | 0 |  |

## Definitions

- **Pricing power index**: Spotify Individual price / mean of Apple Music Individual and YouTube Premium Individual in the same currency (basis column says which competitors were available). >1 means Spotify prices above the competitor average.
- **Monetization depth**: products available / 9 (Premium, Duo, Student, Audiobooks, Spotify Ads, Podcast monetization, Creator marketplace tools, Video, AI features). Needs the `geo` workstream.
- **Feature monetization index**: products available in the country / union of products available in any country that day. Needs the `geo` workstream.
- **Promotion intensity**: Spotify plans carrying a visible promo (trial text on the price page, or a row from the `promotions` workstream) / Spotify plans offered.
- **Competitor lag**: minimum days from a Spotify price change (`spotify_price_history`) to an Apple/YouTube reaction (`competitor_reactions`) in the same country. Needs both arrays populated.

## Coverage on the latest run

- Countries with a Pricing power index: 12 of 17.
- Countries with Monetization depth: 0 of 17.
- Countries with Competitor lag: 0 of 17.
- Master table rows: 106 (all dates: 899).

## Flagged rows (not corrected, verify on the cited page)

_None._
