/**
 * Check data freshness for all sources.
 *
 * Compares build date against expected refresh windows.
 * Writes `.freshness-stale` (true/false) and `.freshness-report` for CI.
 *
 * Run: npm run freshness:check
 */

import Database from 'better-sqlite3';
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '..', 'data', 'database.db');
const db = new Database(dbPath, { readonly: true });

const metadata: Record<string, string> = {};
const rows = db.prepare('SELECT key, value FROM db_metadata').all() as Array<{ key: string; value: string }>;
for (const row of rows) {
  metadata[row.key] = row.value;
}

const buildDate = metadata['build_date'] ?? 'unknown';
const now = new Date();
const build = buildDate !== 'unknown' ? new Date(buildDate) : null;

const daysSinceBuild = build
  ? Math.floor((now.getTime() - build.getTime()) / (1000 * 60 * 60 * 24))
  : Infinity;

const STALE_THRESHOLD_DAYS = 90;
const isStale = daysSinceBuild > STALE_THRESHOLD_DAYS;

const sources = db.prepare(`
  SELECT source_type, COUNT(*) as count
  FROM sources
  GROUP BY source_type
  ORDER BY source_type
`).all() as Array<{ source_type: string; count: number }>;

const report = [
  `# Freshness Report`,
  ``,
  `Build date: ${buildDate}`,
  `Days since build: ${daysSinceBuild}`,
  `Stale threshold: ${STALE_THRESHOLD_DAYS} days`,
  `Status: ${isStale ? 'STALE' : 'FRESH'}`,
  ``,
  `## Sources`,
  ...sources.map(s => `- ${s.source_type}: ${s.count} sources`),
].join('\n');

console.log(report);

writeFileSync('.freshness-stale', isStale ? 'true' : 'false');
writeFileSync('.freshness-report', report);

db.close();

if (isStale) {
  console.log(`\nWARNING: Data is ${daysSinceBuild} days old (threshold: ${STALE_THRESHOLD_DAYS}).`);
} else {
  console.log(`\nData is fresh (${daysSinceBuild} days old).`);
}
