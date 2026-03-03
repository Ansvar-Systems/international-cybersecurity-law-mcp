/**
 * Check for changes between fetched data and current database.
 *
 * Writes `.ingest-changed` (true/false) and `.ingest-summary` for CI.
 *
 * Stub: currently reports no changes. Implement when ingest-fetch
 * produces real output files.
 *
 * Run: npm run ingest:diff
 */

import { writeFileSync } from 'fs';

console.log('[ingest:diff] Comparing fetched data with current database...');
console.log('[ingest:diff] No changes detected (stub).');

writeFileSync('.ingest-changed', 'false');
writeFileSync('.ingest-summary', 'No changes detected (stub pipeline).');
