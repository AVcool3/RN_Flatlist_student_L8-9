# Country indicators (latest run: 2026-09-25)

Built by `build-dataset.mjs` from 1 dated run(s): 2026-09-25 (baseline-derived.json, baseline.json).
Blank cells mean the input is not in the JSON yet; the notes below say which workstream fills it. Nothing is estimated.

| Country | Pricing power index | Basis | Monetization products | Monetization depth | Feature monetization index | Plans | Plans w/ promo | Promotion intensity | Competitor lag (days) |
|---|---|---|---|---|---|---|---|---|---|
| AE |  |  |  |  |  | 3 | 0 | 0 |  |
| AR |  |  |  |  |  |  |  |  |  |
| AU |  |  |  |  |  | 4 | 0 | 0 |  |
| BE |  |  |  |  |  | 4 | 2 | 0.5 |  |
| BR | 1 | Apple Music |  |  |  | 4 | 2 | 0.5 |  |
| CA | 1.167 | Apple Music |  |  |  | 4 | 2 | 0.5 |  |
| CH | 1.07 | Apple Music |  |  |  | 4 | 2 | 0.5 |  |
| CL |  |  |  |  |  |  |  |  |  |
| CO | 1 | Apple Music |  |  |  | 4 | 2 | 0.5 |  |
| DE | 1.083 | Apple Music |  |  |  | 4 | 0 | 0 |  |
| DK | 1 | Apple Music |  |  |  | 4 | 0 | 0 |  |
| EG |  |  |  |  |  | 2 | 0 | 0 |  |
| ES | 1 | Apple Music |  |  |  | 4 | 0 | 0 |  |
| FR | 1.013 | Apple Music |  |  |  | 4 | 0 | 0 |  |
| GB | 1.083 | Apple Music |  |  |  | 4 | 0 | 0 |  |
| ID |  |  |  |  |  | 3 | 0 | 0 |  |
| IE | 1.083 | Apple Music |  |  |  | 4 | 2 | 0.5 |  |
| IN |  |  |  |  |  | 3 | 0 | 0 |  |
| IT | 1 | Apple Music |  |  |  | 4 | 0 | 0 |  |
| JP |  |  |  |  |  | 4 | 0 | 0 |  |
| KR |  |  |  |  |  | 4 | 0 | 0 |  |
| MX | 1 | Apple Music |  |  |  | 4 | 2 | 0.5 |  |
| NL | 1.167 | Apple Music |  |  |  | 4 | 0 | 0 |  |
| NO | 1 | Apple Music |  |  |  | 4 | 0 | 0 |  |
| PE |  |  |  |  |  |  |  |  |  |
| PH |  |  |  |  |  | 4 | 0 | 0 |  |
| PL | 1 | Apple Music |  |  |  | 4 | 2 | 0.5 |  |
| PT | 1 | Apple Music |  |  |  | 4 | 2 | 0.5 |  |
| SA |  |  |  |  |  | 3 | 0 | 0 |  |
| SE | 1.084 | Apple Music |  |  |  | 4 | 0 | 0 |  |
| TH |  |  |  |  |  | 4 | 0 | 0 |  |
| TR | 1.1 | Apple Music |  |  |  | 4 | 2 | 0.5 |  |
| US | 0.929 | Apple Music+YouTube Premium |  |  |  | 4 | 2 | 0.5 |  |
| VN |  |  |  |  |  | 2 | 0 | 0 |  |
| ZA |  |  |  |  |  | 3 | 0 | 0 |  |

## Definitions

- **Pricing power index**: Spotify Individual price / mean of Apple Music Individual and YouTube Premium Individual in the same currency (basis column says which competitors were available). >1 means Spotify prices above the competitor average.
- **Monetization depth**: products available / 9 (Premium, Duo, Student, Audiobooks, Spotify Ads, Podcast monetization, Creator marketplace tools, Video, AI features). Needs the `geo` workstream.
- **Feature monetization index**: products available in the country / union of products available in any country that day. Needs the `geo` workstream.
- **Promotion intensity**: Spotify plans carrying a visible promo (trial text on the price page, or a row from the `promotions` workstream) / Spotify plans offered.
- **Competitor lag**: minimum days from a Spotify price change (`spotify_price_history`) to an Apple/YouTube reaction (`competitor_reactions`) in the same country. Needs both arrays populated.

## Coverage on the latest run

- Countries with a Pricing power index: 19 of 35.
- Countries with Monetization depth: 0 of 35.
- Countries with Competitor lag: 0 of 35.
- Master table rows: 192 (all dates: 192).

## Flagged rows (not corrected, verify on the cited page)

- CO Individual price: Spotify 18.5 COP, Apple 18.5, YouTube . suspect Spotify price (unit/parsing?); suspect Apple price. https://www.spotify.com/co-es/premium/
- CO Student price: Spotify 10.1 COP, Apple , YouTube . suspect Spotify price (unit/parsing?). https://www.spotify.com/co-es/premium/
- JP Duo price: Spotify 1.48 JPY, Apple , YouTube . suspect Spotify price (unit/parsing?). https://www.spotify.com/jp/premium/
- JP Family price: Spotify 1.88 JPY, Apple , YouTube . suspect Spotify price (unit/parsing?). https://www.spotify.com/jp/premium/
- JP Individual price: Spotify 1.08 JPY, Apple , YouTube . suspect Spotify price (unit/parsing?). https://www.spotify.com/jp/premium/
- KR Basic price: Spotify 8.69 KRW, Apple , YouTube . suspect Spotify price (unit/parsing?). https://www.spotify.com/kr-ko/premium/
- KR Duo price: Spotify 17.985 KRW, Apple , YouTube . suspect Spotify price (unit/parsing?). https://www.spotify.com/kr-ko/premium/
- KR Individual price: Spotify 11.99 KRW, Apple , YouTube . suspect Spotify price (unit/parsing?). https://www.spotify.com/kr-ko/premium/
- KR Student price: Spotify 6.6 KRW, Apple , YouTube . suspect Spotify price (unit/parsing?). https://www.spotify.com/kr-ko/premium/
