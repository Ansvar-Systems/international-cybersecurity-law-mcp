/**
 * Full ingestion pipeline.
 *
 * Fetches upstream data, checks for changes, rebuilds database.
 * Run: npm run ingest
 */

import { execSync } from 'child_process';

console.log('[ingest] Starting full ingestion pipeline...');

try {
  console.log('[ingest] Step 1: Fetching upstream data...');
  execSync('npm run ingest:fetch', { stdio: 'inherit' });

  console.log('[ingest] Step 2: Checking for changes...');
  execSync('npm run ingest:diff', { stdio: 'inherit' });

  console.log('[ingest] Step 3: Rebuilding database...');
  execSync('npm run build:db', { stdio: 'inherit' });

  console.log('[ingest] Step 4: Updating coverage...');
  execSync('npm run coverage:update', { stdio: 'inherit' });

  console.log('[ingest] Ingestion complete.');
} catch (error) {
  console.error('[ingest] Pipeline failed:', error);
  process.exit(1);
}
