/**
 * Verify coverage.json consistency against the database (Gate 6).
 *
 * Checks that reported counts match actual database state.
 *
 * Run: npm run coverage:verify
 */

import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '..', 'data', 'database.db');
const coveragePath = join(__dirname, '..', 'data', 'coverage.json');

const db = new Database(dbPath, { readonly: true });
const coverage = JSON.parse(readFileSync(coveragePath, 'utf8'));

let errors = 0;

// Check total sources
const sourcesCount = (db.prepare('SELECT COUNT(*) as c FROM sources').get() as any).c;
if (coverage.summary.total_sources !== sourcesCount) {
  console.error(`FAIL: total_sources mismatch — coverage.json says ${coverage.summary.total_sources}, DB has ${sourcesCount}`);
  errors++;
} else {
  console.log(`PASS: total_sources = ${sourcesCount}`);
}

// Check total items
const articlesCount = (db.prepare('SELECT COUNT(*) as c FROM articles').get() as any).c;
const strategiesCount = (db.prepare('SELECT COUNT(*) as c FROM national_strategies').get() as any).c;
const normsCount = (db.prepare('SELECT COUNT(*) as c FROM cyber_norms').get() as any).c;
const exportsCount = (db.prepare('SELECT COUNT(*) as c FROM export_controls').get() as any).c;
const actualTotal = articlesCount + strategiesCount + normsCount + exportsCount;

if (coverage.summary.total_items !== actualTotal) {
  console.error(`FAIL: total_items mismatch — coverage.json says ${coverage.summary.total_items}, DB has ${actualTotal}`);
  errors++;
} else {
  console.log(`PASS: total_items = ${actualTotal}`);
}

// Check tool count
const toolCount = coverage.tools?.length ?? 0;
if (coverage.summary.total_tools !== toolCount) {
  console.error(`FAIL: total_tools mismatch — summary says ${coverage.summary.total_tools}, tools array has ${toolCount}`);
  errors++;
} else {
  console.log(`PASS: total_tools = ${toolCount}`);
}

db.close();

if (errors > 0) {
  console.error(`\n${errors} verification failure(s).`);
  process.exit(1);
} else {
  console.log('\nAll coverage checks passed.');
}
