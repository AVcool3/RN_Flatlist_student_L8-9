# GEV Bot — Hourly Log

Newest entry at the TOP. Each hourly run appends one block in this exact format so
you can skim it on your phone. "Close calls" = things that look like a contract but
aren't confirmed. "Look into" = leads worth a manual check. "Issues" = problems the
bot hit (blocked sites, no new results, ambiguous data).

---

## 2026-09-25 03:20 UTC — hourly run (manual "go one right now")

**Alerts sent:** 1 — "GEV: Sept 16 Laguna conf: H2'26 20 GW new gas commitments 'likely conservative'; 5 GW/qtr output now, 6 GW/qtr 2H27; $200B backlog very early 2027. Venezuela firmed Sept 2 w/ PDVSA+Corpoelec, payment still unknown."

**New contracts found:** 2 new rows, 2 updates.
- NEW: EVN Quang Trach II LNG plant, Vietnam — 2x 9HA.02 + 2x H78 generators, firm order, announced 2026-06-23 (missed in baseline).
- NEW (backfill): Crusoe AI data centers — 29x LM2500XPRESS (~1 GW), firm; 10 units Dec 2024 + 19 units June 2025. Search engines surfaced it as "September 2026" but the release is dated 2025-07-22. Added so it stops tripping future runs.
- UPDATE: Venezuela — counterparties now known: Corpoelec + PDVSA; cooperation agreement 2026-06-15, firmer agreement 2026-09-02 with US Energy Secretary Wright present. Scope includes rehabilitating GEV's ~11 GW installed base. Still no dollar value, no payment mechanism (Reuters: suppliers "still do not know how they would be paid").
- UPDATE: ESB Chleansaid, Scotland — 16x 6.1MW-158m, 96 MW, announced 2026-09-03.

**Close calls:**
- Morgan Stanley Laguna conference (2026-09-16) is not a contract but is the most important datapoint of the week for the Jan 2027 pitch: 40 GW of new gas commitments in H1 2026; H2 guided "directionally 20 GW" but "likely to prove conservative"; all 12 GW of incremental 2030-31 supply "in some form of contracting"; 400 HA machines running or on contract by end 2027 (130 running + 195 contracted today); Power Services $12B (2025) -> $22B (2035); every GW of HA = ~$0.5B services over 20 yrs.
- India HVDC ~$1.5B (Electrification) expected to convert to a firm order in Q4 2026 — international, large, watch for the press release.
- Data centers were ~40% of Electrification orders in H1 2026, guided to ~20% in Q3/Q4 — a deceleration in mix, not in dollars. Bears will use this.

**Look into:**
- Lincoln Electric System (Nebraska) 2x LM6000VELOX ~100 MW — date not confirmed; verify before adding a row.
- Chevron / Engine No. 1 turbines for Microsoft-focused AI data centers — 2025 deal, confirm GW and whether any of it converted from SRA to order in 2026.
- Siemens Energy guiding 90-100 GW of orders + reservations by end FY2026 (vs GEV >=125 GW) — share read-through is still GEV-favorable; Siemens said ~60% of its 2025 YTD orders were data-center vs GEV's ~20%.
- No September 2026 8-K found on sec.gov via web search; last 8-K is the July 22 Q2 release. The Venezuela deal has NOT been filed as material — supports treating it as non-backlog.

**Issues:**
- Search engines mis-date evergreen press releases (Crusoe). Always WebFetch and read the dateline before calling something new.
- The first fresh-session Routine run (03:10 UTC) completed without pushing; the Routine was recreated to run inside the setup session where git push and phone alerts are verified. Next run 04:17 UTC.

---

## 2026-09-25 ~03:30 UTC — Setup run (manual, by Claude in the setup session)

**Alerts sent:** none (baseline only)

**New contracts found:** see CONTRACTS.md — 13 rows seeded (Egypt services, Japan wind, Venezuela framework, Saudi Taiba/Qassim, Homer City, Q1/Q2 disclosures, EU/UK/Taiwan wind).

**Close calls:**
- Venezuela 1 GW + 5 GW "agreement" — big headline, but no counterparty, value, or firmness disclosed. Not backlog yet.
- Pennsylvania $100M switchgear expansion — investment, not a customer contract.

**Look into:**
- Q2 10-Q Note on segment revenue by geography (WebFetch only returned the first part of the filing). Manual read of the 10-Q PDF would give US vs international revenue split.
- Q2 earnings call transcript for exact 2027 shipment commentary (only "GW under contract continues to grow in 2027" surfaced).
- Whether any of the 18 GW of Q2 slot reservations have been publicly attributed to named hyperscalers.

**Issues:**
- GEV reports GW, not units-by-country. Regional shipment picture must be built bottom-up.
- SEC EDGAR full-text search is not reachable via plain web search; the bot uses `site:sec.gov` queries instead.
