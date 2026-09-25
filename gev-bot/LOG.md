# GEV Bot — Hourly Log

Newest entry at the TOP. Each hourly run appends one block in this exact format so
you can skim it on your phone. "Close calls" = things that look like a contract but
aren't confirmed. "Look into" = leads worth a manual check. "Issues" = problems the
bot hit (blocked sites, no new results, ambiguous data).

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
