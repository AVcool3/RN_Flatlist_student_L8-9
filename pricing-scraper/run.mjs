#!/usr/bin/env node
// ============================================================================
// pricing-scraper/run.mjs
//
// Runs the Firecrawl agent that scrapes Apple + YouTube subscription pricing
// across the countries listed in config.mjs and saves the structured result
// (shaped by schema.json) into the results/ folder.
//
// This is the exact command you originally wrote, wrapped so it is repeatable:
//
//   firecrawl agent '<prompt>' --effort medium --schema '<json>' \
//     --wait --json -o result.json
//
// USAGE
//   node run.mjs --baseline        one-time baseline -> results/baseline.json
//   node run.mjs                   daily run         -> results/YYYY-MM-DD.json
//   node run.mjs --dry-run         print the command + prompt, don't call API
//
// REQUIREMENTS
//   - Node 18+ (no npm install needed; only built-in modules are used)
//   - FIRECRAWL_API_KEY in the environment. The `agent` endpoint is NOT
//     available on Firecrawl's keyless free tier, so this script refuses to
//     run without a key instead of hanging on an interactive login prompt.
//
// The Firecrawl CLI itself is fetched on demand with `npx firecrawl-cli@<ver>`
// so nothing has to be installed globally. Bump CLI_VERSION below to upgrade.
// ============================================================================

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { services, effort, regions, runWindow, allCountryCodes } from "./config.mjs";

// Pin the CLI version so a future CLI release can't silently change behaviour.
const CLI_VERSION = "1.24.4";

// Resolve paths relative to THIS file, so the script works no matter which
// folder you run it from (e.g. from the repo root or from pricing-scraper/).
const here = dirname(fileURLToPath(import.meta.url));
const schemaPath = join(here, "schema.json");
const resultsDir = join(here, "results");

// ---------------------------------------------------------------------------
// 1. Parse command-line flags
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const isBaseline = args.includes("--baseline");
const isDryRun = args.includes("--dry-run");

// ---------------------------------------------------------------------------
// 2. Build the natural-language prompt from config.mjs
//    This is the same text you passed to `firecrawl agent '...'`, generated
//    from the config so the country list lives in one place.
// ---------------------------------------------------------------------------
function buildPrompt() {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  // Turn each region into a block like:
  //   North America (revenue core, first to be hiked)
  //   United States (us), Canada (ca), Mexico (mx)
  const regionText = regions
    .map((r) => {
      const list = r.countries.map((c) => `${c.name} (${c.code})`).join(", ");
      return `${r.name} (${r.why})\n${list}`;
    })
    .join("\n\n");

  const runKind = isBaseline
    ? `This is the ONE-TIME BASELINE run. Set baseline_date to ${today}.`
    : `This is a DAILY MONITORING run on ${today}, part of a 5-day watch from ` +
      `${runWindow.startDate} to ${runWindow.endDate}. Set baseline_date to ` +
      `${runWindow.baselineDate} (the original baseline) and report today's prices.`;

  return (
    `${services.join(" and ")} subscription pricing. ${runKind}\n\n` +
    `Collect the current consumer subscription price for every tier of every ` +
    `service in every country listed below, using the localized official ` +
    `pricing/storefront page for that country, and cite the page URL in ` +
    `price_citation. Also fill scraper_spec_next_5_days with a spec for ` +
    `running this scraper daily from ${runWindow.startDate} to ${runWindow.endDate} ` +
    `(${runWindow.timezone}).\n\n` +
    `Countries by region:\n\n${regionText}`
  );
}

// ---------------------------------------------------------------------------
// 3. Decide where the output goes
// ---------------------------------------------------------------------------
function outputPath() {
  const today = new Date().toISOString().slice(0, 10);
  return join(resultsDir, isBaseline ? "baseline.json" : `${today}.json`);
}

// ---------------------------------------------------------------------------
// 4. Run the Firecrawl CLI
// ---------------------------------------------------------------------------
function main() {
  const prompt = buildPrompt();
  const outFile = outputPath();

  // The CLI reads the schema from a file, so we don't have to escape a giant
  // JSON string on the command line. Validate it parses before we spend credits.
  JSON.parse(readFileSync(schemaPath, "utf8"));

  // Same flags as your original command, plus --schema-file and --timeout.
  const cliArgs = [
    "-y",                          // npx: auto-confirm the package download
    `firecrawl-cli@${CLI_VERSION}`,
    "agent",
    prompt,
    "--effort", effort,
    "--schema-file", schemaPath,
    "--wait",                      // block until the agent job finishes
    "--timeout", "1800",           // give up after 30 min so CI never hangs
    "--json",
    "-o", outFile,
  ];

  console.log(`[pricing-scraper] mode      : ${isBaseline ? "baseline" : "daily"}`);
  console.log(`[pricing-scraper] services  : ${services.join(", ")}`);
  console.log(`[pricing-scraper] countries : ${allCountryCodes.length} (${allCountryCodes.join(",")})`);
  console.log(`[pricing-scraper] output    : ${outFile}`);

  if (isDryRun) {
    console.log("\n--- PROMPT ---\n" + prompt + "\n--- END PROMPT ---\n");
    console.log("Would run: npx " + cliArgs.map((a) => (a.includes(" ") ? JSON.stringify(a) : a)).join(" "));
    return;
  }

  // Fail fast with a clear message instead of letting the CLI open its
  // interactive "Login with browser / Enter API key" menu.
  if (!process.env.FIRECRAWL_API_KEY) {
    console.error(
      "\n[pricing-scraper] ERROR: FIRECRAWL_API_KEY is not set.\n" +
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
    env: { ...process.env, FIRECRAWL_NO_TELEMETRY: "1" },
  });

  if (result.status !== 0) {
    console.error(`[pricing-scraper] firecrawl exited with code ${result.status}`);
    process.exit(result.status ?? 1);
  }

  console.log(`[pricing-scraper] done -> ${outFile}`);
}

main();
