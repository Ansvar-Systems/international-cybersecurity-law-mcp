import Database from 'better-sqlite3';
import { readFileSync, statSync, mkdirSync, existsSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { seedData } from './seed-data.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'data', 'database.db');
const SCHEMA_PATH = join(__dirname, 'schema.sql');
// Ensure data directory exists
const dataDir = dirname(DB_PATH);
if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
}
// Remove existing database
if (existsSync(DB_PATH)) {
    unlinkSync(DB_PATH);
}
console.log('Building International Cybersecurity Law MCP database...\n');
const db = new Database(DB_PATH);
// Execute schema
const schema = readFileSync(SCHEMA_PATH, 'utf-8');
db.exec(schema);
console.log('Schema created.');
// Seed data
seedData(db);
// Rebuild FTS indexes
console.log('\nRebuilding FTS indexes...');
db.exec("INSERT INTO articles_fts(articles_fts) VALUES('rebuild')");
db.exec("INSERT INTO strategies_fts(strategies_fts) VALUES('rebuild')");
console.log('FTS indexes rebuilt.');
// Insert metadata
const sourcesCount = db.prepare('SELECT COUNT(*) as c FROM sources').get().c;
const articlesCount = db.prepare('SELECT COUNT(*) as c FROM articles').get().c;
const strategiesCount = db.prepare('SELECT COUNT(*) as c FROM national_strategies').get().c;
const normsCount = db.prepare('SELECT COUNT(*) as c FROM cyber_norms').get().c;
const exportControlsCount = db.prepare('SELECT COUNT(*) as c FROM export_controls').get().c;
const totalRecords = sourcesCount + articlesCount + strategiesCount + normsCount + exportControlsCount;
const insertMeta = db.prepare('INSERT OR REPLACE INTO db_metadata (key, value) VALUES (?, ?)');
insertMeta.run('tier', 'free');
insertMeta.run('schema_version', '1.0');
insertMeta.run('domain', 'cybersecurity_law');
insertMeta.run('record_count', String(totalRecords));
insertMeta.run('build_date', new Date().toISOString().split('T')[0]);
// Set journal mode to DELETE (for WASM compatibility)
db.pragma('journal_mode = DELETE');
db.exec('VACUUM');
db.close();
// Report
const dbSize = statSync(DB_PATH).size;
const dbSizeMB = (dbSize / 1024 / 1024).toFixed(1);
console.log('\n=== Build Complete ===');
console.log(`Sources:         ${sourcesCount}`);
console.log(`Articles/Rules:  ${articlesCount}`);
console.log(`Strategies:      ${strategiesCount}`);
console.log(`Cyber Norms:     ${normsCount}`);
console.log(`Export Controls: ${exportControlsCount}`);
console.log(`Total Records:   ${totalRecords}`);
console.log(`Database Size:   ${dbSizeMB} MB`);
console.log(`Strategy:        ${Number(dbSizeMB) < 200 ? 'A (Vercel Bundled)' : 'B (Runtime Download)'}`);
