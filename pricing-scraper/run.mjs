#!/usr/bin/env node
// ============================================================================
// pricing-scraper/run.mjs
//
// Runs a Firecrawl *agent* job and saves the structured JSON answer (shaped by
// schema.json) into results/. There are two kinds of job:
//
//   1. The PRICING run (default, what the original scraper did):
//        node run.mjs --baseline      -> results/baseline.json
//        node run.mjs                 -> results/YYYY-MM-DD.json
//
//   2. A WORKSTREAM run (one research area from `workstreams` in config.mjs,
//      e.g. promotions, audiobooks, ads, creators, fundamentals ...):
//        node run.mjs --workstream audiobooks            -> results/YYYY-MM-DD-audiobooks.json
//        node run.mjs --workstream audiobooks --baseline -> results/baseline-audiobooks.json
//        node run.mjs --workstream all                   -> one job per workstream, in sequence
//
//   Add --dry-run to any of the above to print the prompt + command without
//   spending credits. Add --effort low|medium|high to override the effort.
//
// Each workstream job gets a SUB-SCHEMA: only the top-level arrays it is
// responsible for (plus baseline_date / run_type / scope / analyst_summary).
// Smaller schema = cheaper, faster, more accurate job. The pricing run uses the
// original core keys so the daily price check does not balloon.
//
// REQUIREMENTS
//   - Node 18+ (no npm install needed; only built-in modules are used)
//   - FIRECRAWL_API_KEY (or FireAPI) in the environment. The `agent` endpoint is
//     NOT available on Firecrawl's keyless free tier, so this script refuses to
//     run without a key instead of hanging on an interactive login prompt.
//
// The Firecrawl CLI itself is fetched on demand with `npx firecrawl-cli@<ver>`
// so nothing has to be installed globally. Bump CLI_VERSION below to upgrade.
// ============================================================================

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  services,
  effort,
  regions,
  runWindow,
  allCountryCodes,
  analysisFocus,
  preferredSources,
  workstreams,
} from "./config.mjs";

// Pin the CLI version so a future CLI release can't silently change behaviour.
const CLI_VERSION = "1.24.4";

// Resolve paths relative to THIS file, so the script works no matter which
// folder you run it from (e.g. from the repo root or from pricing-scraper/).
const here = dirname(fileURLToPath(import.meta.url));
const schemaPath = join(here, "schema.json");
const resultsDir = join(here, "results");

// The top-level keys the ORIGINAL pricing run fills. Everything else in
// schema.json belongs to a workstream (see `workstreams` in config.mjs).
const CORE_KEYS = [
  "baseline_date", "run_type", "scope",
  "pricing_baseline", "spotify_price_history", "investment_signals",
  "competitor_reactions", "consumer_reaction", "derived_metrics",
  "analyst_summary", "scraper_spec_next_5_days",
];

// ---------------------------------------------------------------------------
// 1. Parse command-line flags
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const isBaseline = args.includes("--baseline");
const isDryRun = args.includes("--dry-run");

// `--flag value` helper: returns the word after the flag, or undefined.
const flagValue = (name) => {
  const i = args.indexOf(name);
  return i !== -1 ? args[i + 1] : undefined;
};

const effortOverride = flagValue("--effort");
const workstreamArg = flagValue("--workstream");

// Which jobs to run. `null` = the classic pricing run; otherwise a list of
// workstream ids. "all" expands to every workstream in config order.
let jobs = null;
if (workstreamArg) {
  const ids = workstreamArg === "all" ? Object.keys(workstreams) : workstreamArg.split(",");
  for (const id of ids) {
    if (!workstreams[id]) {
      console.error(`[pricing-scraper] unknown workstream "${id}". Known: ${Object.keys(workstreams).join(", ")}, all`);
      process.exit(2);
    }
  }
  jobs = ids;
}

const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

// ---------------------------------------------------------------------------
// 2. Prompt building blocks
// ---------------------------------------------------------------------------

// Country list, grouped by region with the "why" so the agent has context:
//   North America (revenue core, first to be hiked)
//   United States (us), Canada (ca), Mexico (mx)
const regionText = regions
  .map((r) => {
    const list = r.countries.map((c) => `${c.name} (${c.code})`).join(", ");
    return `${r.name} (${r.why})\n${list}`;
  })
  .join("\n\n");

// Source hints, one per line, so the agent starts from official material.
const sourceText = preferredSources.map((u) => `- ${u}`).join("\n");

// analysisFocus in config.mjs has three parts. Workstream prompts reuse the
// first (goal + funnel) and the last (evidence standard) around their own
// mandate, so the evidence rules are stated once, in config.mjs.
const focusIntro = analysisFocus.split("SUBJECT:")[0].trim();
const evidenceStandard = analysisFocus.slice(analysisFocus.indexOf("EVIDENCE STANDARD")).trim();

// Baseline vs daily wording, shared by both job kinds.
function runKindText(what) {
  return isBaseline
    ? `This is the ONE-TIME BASELINE run for ${what}. Set baseline_date to ${today} and run_type to "baseline". ` +
      `Do the full historical backfill (24 months where the mandate asks for history).`
    : `This is a DAILY MONITORING run on ${today} for ${what}, part of a watch from ` +
      `${runWindow.startDate} to ${runWindow.endDate}. Set baseline_date to ${runWindow.baselineDate} ` +
      `(the original baseline) and run_type to "daily". Report today's state, and flag anything NEW ` +
      `since ${runWindow.baselineDate}.`;
}

// The original pricing prompt (unchanged behaviour).
function buildPricingPrompt() {
  return (
    `${services.join(", ")} subscription pricing: investment research snapshot. ${runKindText("pricing")}\n\n` +
    `${analysisFocus}\n\n` +
    `Collect the current consumer subscription price for every tier of every ` +
    `service in every country listed below, using the localized official ` +
    `pricing/storefront page for that country, and cite the page URL in ` +
    `price_citation. Also fill scraper_spec_next_5_days with a spec for ` +
    `running this scraper daily from ${runWindow.startDate} to ${runWindow.endDate} ` +
    `(${runWindow.timezone}).\n\n` +
    `Preferred sources (cite whatever you actually use):\n${sourceText}\n\n` +
    `Countries by region:\n\n${regionText}`
  );
}

// A focused prompt for ONE workstream.
function buildWorkstreamPrompt(id) {
  const ws = workstreams[id];
  return (
    `Spotify alternative-data research, workstream "${id}": ${ws.title}. ${runKindText(ws.title)}\n\n` +
    `${focusIntro}\n\n` +
    `THIS JOB'S MANDATE:\n${ws.mandate.trim()}\n\n` +
    `Fill ONLY these output arrays: ${ws.schemaKeys.join(", ")}. In analyst_summary give key ` +
    `findings ordered by materiality, watch items, data gaps and overall confidence for this ` +
    `workstream only.\n\n` +
    `${evidenceStandard}\n\n` +
    `Preferred sources (cite whatever you actually use):\n${sourceText}\n\n` +
    `Countries by region:\n\n${regionText}`
  );
}

// ---------------------------------------------------------------------------
// 3. Sub-schema: schema.json filtered to the keys a job must fill.
//    Written to a temp file because the CLI reads the schema from disk.
// ---------------------------------------------------------------------------
function writeSubSchema(name, keys) {
  const full = JSON.parse(readFileSync(schemaPath, "utf8")); // validate it parses before spending credits
  const sub = {
    type: "object",
    description: full.description,
    properties: {},
    required: keys.filter((k) => k in full.properties),
  };
  for (const k of sub.required) sub.properties[k] = full.properties[k];
  const dir = join(tmpdir(), "pricing-scraper-schemas");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const file = join(dir, `${name}.json`);
  writeFileSync(file, JSON.stringify(sub, null, 2));
  return file;
}

// ---------------------------------------------------------------------------
// 4. Run one Firecrawl CLI job. Returns the CLI exit code (0 = success).
// ---------------------------------------------------------------------------
function runJob({ label, prompt, subSchemaFile, outFile, effortLevel, timeoutSec }) {
  // Same flags as the original command, plus --schema-file and --timeout.
  const cliArgs = [
    "-y",                          // npx: auto-confirm the package download
    `firecrawl-cli@${CLI_VERSION}`,
    "agent",
    prompt,
    "--effort", effortLevel,
    "--schema-file", subSchemaFile,
    "--wait",                      // block until the agent job finishes
    "--timeout", String(timeoutSec),
    "--json",
    "-o", outFile,
  ];

  console.log(`[pricing-scraper] job       : ${label}`);
  console.log(`[pricing-scraper] mode      : ${isBaseline ? "baseline" : "daily"}`);
  console.log(`[pricing-scraper] effort    : ${effortLevel}`);
  console.log(`[pricing-scraper] countries : ${allCountryCodes.length} (${allCountryCodes.join(",")})`);
  console.log(`[pricing-scraper] schema    : ${subSchemaFile}`);
  console.log(`[pricing-scraper] output    : ${outFile}`);

  if (isDryRun) {
    console.log("\n--- PROMPT ---\n" + prompt + "\n--- END PROMPT ---\n");
    console.log("Would run: npx " + cliArgs.map((a) => (a.includes(" ") ? JSON.stringify(a) : a)).join(" ") + "\n");
    return 0;
  }

  // The Firecrawl CLI only looks at FIRECRAWL_API_KEY, but the key may be
  // stored under a friendlier name (the cloud environment uses `FireAPI`).
  // Copy it across so either name works. Add more fallbacks here if needed.
  const apiKey = process.env.FIRECRAWL_API_KEY || process.env.FireAPI;

  // Fail fast with a clear message instead of letting the CLI open its
  // interactive "Login with browser / Enter API key" menu.
  if (!apiKey) {
    console.error(
      "\n[pricing-scraper] ERROR: neither FIRECRAWL_API_KEY nor FireAPI is set.\n" +
        "The `firecrawl agent` endpoint requires an API key (keyless tier is not supported).\n" +
        "Get one at https://www.firecrawl.dev/ and export FIRECRAWL_API_KEY, or add it as a\n" +
        "GitHub Actions secret / cloud-environment secret for scheduled runs.\n"
    );
    process.exit(2);
  }

  if (!existsSync(resultsDir)) mkdirSync(resultsDir, { recursive: true });

  // On Windows npx is `npx.cmd`; everywhere else it's `npx`.
  const npx = process.platform === "win32" ? "npx.cmd" : "npx";
  const result = spawnSync(npx, cliArgs, {
    stdio: ["ignore", "inherit", "inherit"], // stdin closed -> no login prompt
    env: { ...process.env, FIRECRAWL_API_KEY: apiKey, FIRECRAWL_NO_TELEMETRY: "1" },
  });

  if (result.status !== 0) {
    console.error(`[pricing-scraper] firecrawl exited with code ${result.status} for job ${label}`);
    return result.status ?? 1;
  }
  console.log(`[pricing-scraper] done -> ${outFile}\n`);
  return 0;
}

// ---------------------------------------------------------------------------
// 5. Main: build the job list and run it
// ---------------------------------------------------------------------------
function main() {
  const defaultEffort = isBaseline ? effort.baseline : effort.daily;
  const exitCodes = {};

  if (!jobs) {
    // Classic pricing run. Baseline gets 60 min, daily 30 min.
    exitCodes.pricing = runJob({
      label: "pricing (core schema)",
      prompt: buildPricingPrompt(),
      subSchemaFile: writeSubSchema("core", CORE_KEYS),
      outFile: join(resultsDir, isBaseline ? "baseline.json" : `${today}.json`),
      effortLevel: effortOverride || defaultEffort,
      timeoutSec: isBaseline ? 3600 : 1800,
    });
  } else {
    for (const id of jobs) {
      const ws = workstreams[id];
      exitCodes[id] = runJob({
        label: `${id} (${ws.title})`,
        prompt: buildWorkstreamPrompt(id),
        subSchemaFile: writeSubSchema(id, ["baseline_date", "run_type", "scope", ...ws.schemaKeys, "analyst_summary"]),
        outFile: join(resultsDir, isBaseline ? `baseline-${id}.json` : `${today}-${id}.json`),
        effortLevel: effortOverride || ws.effort || defaultEffort,
        timeoutSec: isBaseline ? 3600 : 1800,
      });
    }
  }

  // Summary + exit code: non-zero if any job failed, so CI notices.
  const failed = Object.entries(exitCodes).filter(([, code]) => code !== 0);
  if (Object.keys(exitCodes).length > 1) {
    console.log("[pricing-scraper] summary   : " +
      Object.entries(exitCodes).map(([k, c]) => `${k}=${c === 0 ? "ok" : "exit " + c}`).join(", "));
  }
  if (failed.length) process.exit(1);
}

main();
