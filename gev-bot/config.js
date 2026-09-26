// =====================================================================
// GEV CONTRACT WATCH BOT — CONFIG
// =====================================================================
// This is the ONE file you should edit to change what the bot looks for.
// It is plain JavaScript (same syntax you use in React), so you can add
// comments, reorder things, and delete lines you don't want.
//
// HOW IT IS USED:
//   Every hour a fresh Claude session wakes up (a "Routine" on claude.ai),
//   reads this file from the repo branch below, runs every query in
//   `searchQueries`, compares what it finds against CONTRACTS.md, and
//   then:
//     1. appends an entry to LOG.md (the hourly update you asked for)
//     2. adds any NEW contract rows to CONTRACTS.md
//     3. commits + pushes those two files
//     4. sends a push notification to your phone if `alertRules` match
//
// If you change this file, commit + push it to the branch below and the
// NEXT hourly run will pick it up automatically. No restart needed.
// =====================================================================

module.exports = {
  // ---- Company / ticker we are tracking -----------------------------
  company: "GE Vernova",
  ticker: "GEV",

  // ---- Where the bot reads/writes ------------------------------------
  // The branch the hourly runs commit to. Change only if you move the bot.
  repo: "AVcool3/RN_Flatlist_student_L8-9",
  branch: "claude/optimistic-curie-me0l1o",

  // ---- When the bot stops ---------------------------------------------
  // The Routine turns ITSELF off after this UTC timestamp (one week from
  // setup on 2026-09-25). To extend, bump this date AND ask Claude to
  // re-enable the Routine (or do it in claude.ai > Routines).
  stopAfterUtc: "2026-10-02T15:00:00Z",

  // ---- Terminology the bot should understand ---------------------------
  // GEV's official term is "slot reservation agreement" (SRA). You wrote
  // "SRO" — the bot treats SRO / SRA / "slot reservation" as the same
  // thing. "RPO" is read as "Remaining Performance Obligations" (the SEC
  // backlog number in the 10-Q). Edit these if you meant something else.
  synonyms: {
    slotReservation: ["slot reservation agreement", "SRA", "SRO", "slot reservation", "reservation agreement", "capacity reservation"],
    rpo: ["remaining performance obligations", "RPO", "backlog"],
    turbineModels: ["7HA", "7HA.02", "7HA.03", "9HA", "9HA.02", "7F", "9F", "LM6000", "LM2500", "LMS100", "aeroderivative", "HA-class", "H-class"],
  },

  // ---- Web searches run EVERY hour --------------------------------------
  // Add / remove lines freely. Keep them specific; vague queries return
  // old articles. The bot prefers results dated in the last 7 days.
  searchQueries: [
    // --- Firm orders & slot reservations (the core ask) ---
    "GE Vernova gas turbine order announced",
    "GE Vernova slot reservation agreement",
    "GE Vernova signs agreement turbines",
    "GE Vernova secures order",
    "GE Vernova 7HA order",
    "GE Vernova 9HA order",
    "GE Vernova aeroderivative LM6000 order",

    // --- Customer segments ---
    "GE Vernova data center gas turbines hyperscaler agreement",
    "GE Vernova utility gas turbine contract",
    "GE Vernova independent power producer turbines contract",
    "GE Vernova industrial cogeneration gas turbine order",

    // --- International / where shipments are going ---
    "GE Vernova Saudi Arabia OR UAE OR Qatar gas turbine",
    "GE Vernova Japan OR Korea OR Taiwan OR Vietnam turbine order",
    "GE Vernova India gas turbine order",
    "GE Vernova Europe OR Germany OR UK OR Italy turbine contract",
    "GE Vernova Brazil OR Mexico OR Canada turbine order",
    "GE Vernova Venezuela power agreement",
    "GE Vernova Africa OR Egypt OR Nigeria gas turbine",

    // --- Wind & Electrification (secondary, but part of segmentation) ---
    "GE Vernova onshore wind turbine order",
    "GE Vernova offshore wind Vineyard Wind OR Dogger Bank update",
    "GE Vernova electrification order transformers switchgear data center",

    // --- Filings & IR (the highest-conviction sources) ---
    "site:sec.gov GE Vernova 8-K",
    "site:gevernova.com/news press release",
    "GE Vernova investor conference presentation",

    // --- Competitor / read-through (helps with 'close calls') ---
    "Siemens Energy gas turbine order data center",
    "Mitsubishi Power gas turbine order 2026",
    // Added 2026-09-25: the SGE/Samsung BWRX-300 MoU (press release 09-22) was
    // only caught two days late via a secondary article. These two catch
    // nuclear/SMR announcements directly. Nuclear is not a turbine contract and
    // will NOT trigger a phone alert, but it belongs in CONTRACTS.md.
    "GE Vernova Hitachi BWRX-300 agreement",
    "GE Vernova nuclear SMR order OR memorandum",
  ],

  // ---- What counts as a phone-alert-worthy hit ------------------------
  // The bot sends a push notification when ANY of these is true.
  // Everything else still goes into LOG.md as a "close call" or "look into".
  alertRules: {
    // A NEW firm order or slot reservation for GEV turbines (any size)
    newTurbineContract: true,
    // A NEW international contract (outside the U.S.)
    newInternationalContract: true,
    // Any SEC filing (8-K, 10-Q, 10-K) from GEV
    newSecFiling: true,
    // Guidance / outlook change (GW targets, backlog, 2027 shipments)
    guidanceChange: true,
    // A contract cancellation, delay, dispute, or payment issue
    negativeContractNews: true,
    // Minimum GW for a single order to trigger an alert (0 = alert on all)
    minGwForAlert: 0,
  },

  // ---- Things the bot should ALWAYS mention if it finds them -----------
  // (these feed the stock-pitch conviction on the Jan 2027 print)
  watchlistTopics: [
    "Q3 2026 earnings Oct 28 2026 — gas GW under contract vs 125 GW YE target",
    "2027 gas turbine shipment guidance (currently 20 GW/yr run-rate exiting Q3 2026)",
    "Conversion of slot reservations into firm orders (GW per quarter)",
    "Data-center share of GW under contract (was ~20% at 100 GW)",
    "2031 capacity contracting (>50% of 2031 by YE 2026 target)",
    "Pricing per kW commentary (HA, F-class, aero)",
    "Venezuela 1 GW / 5 GW agreement — is it firm? payment terms?",
    "Homer City 7x 7HA.02 deliveries in 2026",
    "Wind: offshore losses, onshore repowering orders",
  ],
};
