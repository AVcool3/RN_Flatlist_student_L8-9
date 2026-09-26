# GEV Contract Watch Bot

An always-on research bot that watches the web for **GE Vernova (GEV)** turbine
contracts, slot reservations, and shipment/segment information, and reports back
hourly for one week (until **2026-10-02 15:00 UTC**). Purpose: build conviction for a
GEV stock pitch ahead of the late-January-2027 Q4/FY2026 print.

## How it actually runs (there is no server to keep alive)

```
claude.ai Routine (cron: every hour)
   └─> fresh Claude session in this environment
         ├─ reads  gev-bot/PROMPT.md   (instructions — edit to change behavior)
         ├─ reads  gev-bot/config.js   (queries + alert rules — edit to change what it searches)
         ├─ reads  gev-bot/CONTRACTS.md (memory — what it already knows)
         ├─ runs ~25 web searches, fetches promising pages
         ├─ writes gev-bot/LOG.md      (your hourly update, newest on top)
         ├─ commits + pushes to branch claude/optimistic-curie-me0l1o
         └─ pushes a notification to your phone when an alert rule matches
```

Because each run reads the files fresh from git, **editing + pushing any file here
changes the next run**. No restart, no redeploy.

## Files

| File | What it is | Edit it? |
|---|---|---|
| `config.js` | Search queries, alert rules, synonyms (SRO/SRA/RPO), stop date | **Yes — this is the main knob** |
| `PROMPT.md` | Step-by-step instructions the hourly run follows | Yes, carefully |
| `CONTRACTS.md` | Tracker table of every contract found (bot dedupes against it) | Yes (add/correct rows) |
| `BASELINE.md` | The starting picture: segmentation, geography, key GW numbers, risks | Yes, after each earnings print |
| `LOG.md` | Hourly log: alerts, new contracts, close calls, look-intos, issues | Read only (bot writes it) |

## Reading the hourly update on your phone

Two things reach your phone:
1. The Routine's own completion notification (the run's closing summary).
2. A separate `PushNotification` the bot sends only when an alert rule in `config.js` matched.

For the full detail, open `gev-bot/LOG.md` on this branch in GitHub.

## Stopping / extending

- **Stop early:** claude.ai → Routines → "GEV contract watch (hourly)" → disable. Or ask Claude to disable it.
- **Extend:** bump `stopAfterUtc` in `config.js`, push, and ask Claude to re-enable the Routine if it already turned itself off.

## A note on terms
GEV's official term is **slot reservation agreement (SRA)**: the customer pays a deposit
to hold a factory slot; it is not yet a firm order. The bot treats "SRO" as SRA.
**RPO** is read as *Remaining Performance Obligations*, the SEC-defined backlog figure
in the 10-Q ($176.3B at Q2 2026). If you meant something else by SRO/RPO, change
`synonyms` in `config.js`.
