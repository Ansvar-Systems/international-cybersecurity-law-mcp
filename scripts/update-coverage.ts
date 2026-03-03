/**
 * Update coverage.json from current database state.
 *
 * Run: npm run coverage:update
 */

import Database from 'better-sqlite3';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '..', 'data', 'database.db');
const coveragePath = join(__dirname, '..', 'data', 'coverage.json');

const db = new Database(dbPath, { readonly: true });
const coverage = JSON.parse(readFileSync(coveragePath, 'utf8'));

// Update date
coverage.coverage_date = new Date().toISOString().split('T')[0];

// Update summary counts
const articlesCount = (db.prepare('SELECT COUNT(*) as c FROM articles').get() as any).c;
const strategiesCount = (db.prepare('SELECT COUNT(*) as c FROM national_strategies').get() as any).c;
const normsCount = (db.prepare('SELECT COUNT(*) as c FROM cyber_norms').get() as any).c;
const exportsCount = (db.prepare('SELECT COUNT(*) as c FROM export_controls').get() as any).c;
const sourcesCount = (db.prepare('SELECT COUNT(*) as c FROM sources').get() as any).c;

coverage.summary.total_sources = sourcesCount;
coverage.summary.total_items = articlesCount + strategiesCount + normsCount + exportsCount;

writeFileSync(coveragePath, JSON.stringify(coverage, null, 2) + '\n');
console.log(`[coverage:update] Updated coverage.json — ${coverage.summary.total_items} total items from ${sourcesCount} sources.`);

db.close();
