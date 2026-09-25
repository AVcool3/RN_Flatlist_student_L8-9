#!/usr/bin/env node
// ============================================================================
// pricing-scraper/diff.mjs
//
// Compares today's page snapshots (snapshots/<date>/) with the previous
// snapshot folder and writes snapshots/<date>-diff.md:
//
//   1. a summary table (which pages changed, by how many lines)
//   2. "signal lines": changed lines that contain a price, a number of hours or
//      months, a percentage, or the words free / trial / new. These are the
//      lines most likely to be a pricing, promotion or allowance change.
//   3. the full line diff per changed page (capped so the report stays readable)
//
// USAGE
//   node pricing-scraper/diff.mjs                       today vs the previous snapshot
//   node pricing-scraper/diff.mjs --date 2026-09-27     that date vs its previous snapshot
//   node pricing-scraper/diff.mjs --date 2026-09-30 --against 2026-09-26   any two dates
//
// No dependencies: a small LCS line diff is implemented below.
// ============================================================================

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const snapshotsDir = join(here, "snapshots");

// Lines matching this are reported as "signal lines". Edit to taste.
const SIGNAL = /[$€£¥₹₩]|\d+[.,]\d{2}\b|\b\d+\s*(hours?|hrs|months?|days?)\b|\d+\s?%|\b(free|trial|new|now available|launch)/i;

// Max diff lines printed per page in the report (the full files are on disk).
const MAX_LINES_PER_PAGE = 200;

// ---------------------------------------------------------------------------
// 1. Flags and folder discovery
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const flagValue = (name) => { const i = args.indexOf(name); return i !== -1 ? args[i + 1] : undefined; };
const date = flagValue("--date") || new Date().toISOString().slice(0, 10);

// All snapshot folders look like YYYY-MM-DD; pick the latest one before `date`.
const allDates = existsSync(snapshotsDir)
  ? readdirSync(snapshotsDir).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort()
  : [];
const against = flagValue("--against") || allDates.filter((d) => d < date).pop();

// ---------------------------------------------------------------------------
// 2. Minimal line diff (longest common subsequence). Common prefix/suffix are
//    stripped first so the O(n*m) table only covers the changed middle.
//    Returns [{type: " " | "+" | "-", line}].
// ---------------------------------------------------------------------------
function lineDiff(aText, bText) {
  const a = aText.split("\n"), b = bText.split("\n");
  let start = 0;
  while (start < a.length && start < b.length && a[start] === b[start]) start++;
  let endA = a.length, endB = b.length;
  while (endA > start && endB > start && a[endA - 1] === b[endB - 1]) { endA--; endB--; }

  const midA = a.slice(start, endA), midB = b.slice(start, endB);
  const n = midA.length, m = midB.length;
  // LCS length table (n+1)*(m+1). Files here are a few hundred lines, fine.
  const L = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      L[i][j] = midA[i] === midB[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);

  const out = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (midA[i] === midB[j]) { out.push({ type: " ", line: midA[i] }); i++; j++; }
    else if (L[i + 1][j] >= L[i][j + 1]) { out.push({ type: "-", line: midA[i] }); i++; }
    else { out.push({ type: "+", line: midB[j] }); j++; }
  }
  while (i < n) out.push({ type: "-", line: midA[i++] });
  while (j < m) out.push({ type: "+", line: midB[j++] });
  return out; // only the changed middle; context lines around it are added by the caller
}

// ---------------------------------------------------------------------------
// 3. Build the report
// ---------------------------------------------------------------------------
function main() {
  const curDir = join(snapshotsDir, date);
  if (!existsSync(join(curDir, "manifest.json"))) {
    console.error(`[diff] no snapshot for ${date} (run snapshot.mjs first)`);
    process.exit(2);
  }
  const cur = JSON.parse(readFileSync(join(curDir, "manifest.json"), "utf8"));
  const out = [`# Page snapshot diff: ${date}` + (against ? ` vs ${against}` : ""), ""];

  if (!against) {
    out.push(`First snapshot on record (${cur.pages.length} pages). Nothing to compare yet; run again after the next snapshot.`);
    writeFileSync(join(snapshotsDir, `${date}-diff.md`), out.join("\n") + "\n");
    console.log(out.join("\n"));
    return;
  }

  const prevDir = join(snapshotsDir, against);
  const prev = existsSync(join(prevDir, "manifest.json"))
    ? JSON.parse(readFileSync(join(prevDir, "manifest.json"), "utf8"))
    : { pages: [] };
  const prevBySlug = new Map(prev.pages.map((p) => [p.slug, p]));

  const rows = [];      // summary table rows
  const signals = [];   // { slug, category, type, line }
  const details = [];   // full diff blocks

  for (const page of cur.pages) {
    const before = prevBySlug.get(page.slug);
    const row = { slug: page.slug, category: page.category, status: page.ok ? "ok" : "fetch failed", added: 0, removed: 0, note: "" };

    if (!page.ok) { row.note = String(page.error || "").slice(0, 80); rows.push(row); continue; }
    if (!before) { row.note = "new page (no previous snapshot)"; rows.push(row); continue; }
    if (!before.ok) { row.note = "previous fetch failed"; rows.push(row); continue; }
    if (before.sha256 === page.sha256) { row.note = "unchanged"; rows.push(row); continue; }

    const aText = readFileSync(join(prevDir, `${page.slug}.md`), "utf8");
    const bText = readFileSync(join(curDir, `${page.slug}.md`), "utf8");
    const diff = lineDiff(aText, bText);
    row.added = diff.filter((d) => d.type === "+").length;
    row.removed = diff.filter((d) => d.type === "-").length;
    row.note = "CHANGED";
    rows.push(row);

    for (const d of diff) if (d.type !== " " && SIGNAL.test(d.line)) signals.push({ ...d, slug: page.slug, category: page.category });

    const shown = diff.filter((d) => d.type !== " ").slice(0, MAX_LINES_PER_PAGE);
    details.push(
      `### ${page.slug} (${page.category})\n${page.url}\n\n\`\`\`diff\n` +
      shown.map((d) => `${d.type} ${d.line}`).join("\n") +
      (diff.length > shown.length ? `\n... (${diff.length - shown.length} more lines)` : "") +
      "\n```\n"
    );
  }

  // Pages that disappeared from the watch list since the previous snapshot.
  const curSlugs = new Set(cur.pages.map((p) => p.slug));
  for (const p of prev.pages) if (!curSlugs.has(p.slug)) rows.push({ slug: p.slug, category: p.category, status: "removed from watch list", added: 0, removed: 0, note: "" });

  const changed = rows.filter((r) => r.note === "CHANGED");
  out.push(`**${changed.length} of ${cur.pages.length} pages changed.** ${signals.length} signal line(s).`, "");

  out.push("## Summary", "", "| Page | Category | Fetch | +lines | -lines | Note |", "|---|---|---|---|---|---|");
  for (const r of rows) out.push(`| ${r.slug} | ${r.category} | ${r.status} | ${r.added} | ${r.removed} | ${r.note} |`);
  out.push("");

  out.push("## Signal lines (prices, hours, months, %, free/trial/new)", "");
  if (!signals.length) out.push("_None._", "");
  else {
    out.push("| Page | Category | +/- | Line |", "|---|---|---|---|");
    for (const s of signals) out.push(`| ${s.slug} | ${s.category} | ${s.type} | ${s.line.replace(/\|/g, "\\|").slice(0, 200)} |`);
    out.push("");
  }

  if (details.length) out.push("## Full diffs", "", ...details);

  const file = join(snapshotsDir, `${date}-diff.md`);
  writeFileSync(file, out.join("\n") + "\n");
  console.log(`[diff] ${changed.length}/${cur.pages.length} pages changed, ${signals.length} signal lines -> ${file}`);
  for (const s of signals.slice(0, 20)) console.log(`  ${s.type} [${s.slug}] ${s.line.slice(0, 120)}`);
}

main();
