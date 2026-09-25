#!/usr/bin/env node
// ============================================================================
// pricing-scraper/snapshot.mjs
//
// Saves a plain-text (markdown) copy of every page in `watchPages` (config.mjs)
// into snapshots/<date>/<slug>.md, plus a manifest.json with the HTTP status,
// size and hash of each page. Run it once a day, then run diff.mjs to see what
// changed. Pages often change BEFORE the change shows up in a filing.
//
// USAGE
//   node pricing-scraper/snapshot.mjs                 all pages, today's date
//   node pricing-scraper/snapshot.mjs --only pricing  one category (comma list ok)
//   node pricing-scraper/snapshot.mjs --limit 3       first N pages (for testing)
//   node pricing-scraper/snapshot.mjs --dry-run       list pages, fetch nothing
//   node pricing-scraper/snapshot.mjs --date 2026-09-26   write under another date
//   node pricing-scraper/snapshot.mjs --force         re-fetch pages already saved today
//
// Re-running on the same date only fetches pages that are missing or failed in
// that day's manifest.json (unless --force), so a retry never re-spends credits.
//
// COST: one Firecrawl scrape credit per page per day (47 pages ≈ 47 credits).
//
// Uses the Firecrawl REST API directly (POST /v2/scrape) with the built-in
// fetch, so no npm install is needed. Needs FIRECRAWL_API_KEY or FireAPI.
// ============================================================================

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { watchPages } from "./config.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const snapshotsDir = join(here, "snapshots");

// Firecrawl API base. Override with FIRECRAWL_API_URL if you self-host.
const API = process.env.FIRECRAWL_API_URL || "https://api.firecrawl.dev";
const apiKey = process.env.FIRECRAWL_API_KEY || process.env.FireAPI;

// Rate limiting. Firecrawl's scrape endpoint allows only ~10 requests/minute on
// the entry plan, so requests are paced: at most CONCURRENCY in flight and at
// least MIN_INTERVAL_MS between request starts. A 429 answer is retried after
// the "retry after N s" the API reports, up to MAX_ATTEMPTS times.
const CONCURRENCY = 2;
const MIN_INTERVAL_MS = 6500;   // ~9 requests/minute
const MAX_ATTEMPTS = 6;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------
// 1. Flags
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const flagValue = (name) => { const i = args.indexOf(name); return i !== -1 ? args[i + 1] : undefined; };
const isDryRun = args.includes("--dry-run");
const force = args.includes("--force");
const date = flagValue("--date") || new Date().toISOString().slice(0, 10);
const only = flagValue("--only")?.split(",");
const limit = Number(flagValue("--limit")) || Infinity;

let pages = watchPages;
if (only) pages = pages.filter((p) => only.includes(p.category));
pages = pages.slice(0, limit);

// ---------------------------------------------------------------------------
// 2. Fetch one page as markdown through Firecrawl
// ---------------------------------------------------------------------------
async function scrape(url) {
  const res = await fetch(`${API}/v2/scrape`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      url,
      formats: ["markdown"],
      onlyMainContent: true, // drop nav/footer boilerplate so diffs show real changes
      timeout: 60000,
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.success === false) {
    const err = new Error(`HTTP ${res.status}: ${body.error || body.message || "scrape failed"}`);
    err.status = res.status;
    // "please retry after 25s" -> 25. Fall back to 30s when the text is missing.
    const m = String(body.error || "").match(/retry after (\d+)\s*s/i);
    err.retryAfterMs = (m ? Number(m[1]) : 30) * 1000 + 1000;
    throw err;
  }
  return body.data; // { markdown, metadata: { statusCode, title, sourceURL, ... } }
}

// Light normalisation so cosmetic differences (trailing spaces, extra blank
// lines) don't show up as changes tomorrow.
function normalise(md) {
  return (md || "")
    .replace(/\r\n/g, "\n")
    .split("\n").map((l) => l.replace(/\s+$/, "")).join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim() + "\n";
}

// ---------------------------------------------------------------------------
// 3. Fetch all pages with a small worker pool, one retry on network error
// ---------------------------------------------------------------------------
async function fetchAll() {
  const outDir = join(snapshotsDir, date);
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  // Resume: keep today's already-successful pages unless --force.
  const manifestPath = join(outDir, "manifest.json");
  const previous = !force && existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : null;
  const keep = new Map((previous?.pages ?? []).filter((p) => p.ok && existsSync(join(outDir, `${p.slug}.md`))).map((p) => [p.slug, p]));
  const manifest = { date, fetched_at: new Date().toISOString(), pages: [] };
  const queue = pages.filter((p) => !keep.has(p.slug));
  if (keep.size) console.log(`[snapshot] resuming: ${keep.size} page(s) already saved today, ${queue.length} to fetch`);

  // Pacing: every request start waits until MIN_INTERVAL_MS after the previous start.
  let nextSlot = 0;
  async function paced(fn) {
    const wait = Math.max(0, nextSlot - Date.now());
    nextSlot = Date.now() + wait + MIN_INTERVAL_MS;
    if (wait) await sleep(wait);
    return fn();
  }

  async function worker() {
    while (queue.length) {
      const page = queue.shift();
      const entry = { slug: page.slug, category: page.category, country: page.country ?? null, url: page.url };
      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
          const data = await paced(() => scrape(page.url));
          const text = normalise(data.markdown);
          writeFileSync(join(outDir, `${page.slug}.md`), text);
          Object.assign(entry, {
            ok: true,
            status: data.metadata?.statusCode ?? null,
            title: data.metadata?.title ?? null,
            final_url: data.metadata?.sourceURL ?? data.metadata?.url ?? null,
            chars: text.length,
            sha256: createHash("sha256").update(text).digest("hex"),
          });
          console.log(`[snapshot] ok   ${page.slug} (${text.length} chars, status ${entry.status})`);
          break;
        } catch (err) {
          entry.ok = false;
          entry.error = String(err.message || err);
          if (attempt === MAX_ATTEMPTS) { console.log(`[snapshot] FAIL ${page.slug}: ${entry.error}`); break; }
          // 429: wait what the API asked for, and push every worker's next slot back too.
          const backoff = err.status === 429 ? err.retryAfterMs : 3000 * attempt;
          if (err.status === 429) nextSlot = Math.max(nextSlot, Date.now() + backoff);
          console.log(`[snapshot] retry ${page.slug} in ${Math.round(backoff / 1000)}s (${err.status || "network"})`);
          await sleep(backoff);
        }
      }
      manifest.pages.push(entry);
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  // Merge the pages kept from an earlier run today, then keep config order so
  // diffs between manifests are readable.
  for (const p of keep.values()) manifest.pages.push(p);
  manifest.pages.sort((a, b) => pages.findIndex((p) => p.slug === a.slug) - pages.findIndex((p) => p.slug === b.slug));
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

  const failed = manifest.pages.filter((p) => !p.ok).length;
  console.log(`[snapshot] wrote ${manifest.pages.length - failed}/${manifest.pages.length} pages -> ${outDir}`);
  return failed;
}

// ---------------------------------------------------------------------------
// 4. Main
// ---------------------------------------------------------------------------
async function main() {
  console.log(`[snapshot] date      : ${date}`);
  console.log(`[snapshot] pages     : ${pages.length}${only ? ` (categories: ${only.join(",")})` : ""}`);

  if (isDryRun) {
    for (const p of pages) console.log(`  ${p.category.padEnd(12)} ${p.slug.padEnd(24)} ${p.url}`);
    return;
  }
  if (!apiKey) {
    console.error("[snapshot] ERROR: set FIRECRAWL_API_KEY or FireAPI (see README).");
    process.exit(2);
  }
  const failed = await fetchAll();
  // Exit 0 even with some failures: a partial snapshot is still useful, and
  // the manifest records which pages failed. Exit 1 only if nothing worked.
  if (failed === pages.length) process.exit(1);
}

main().catch((err) => { console.error("[snapshot] fatal:", err); process.exit(1); });
