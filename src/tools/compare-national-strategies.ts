import type Database from 'better-sqlite3';

interface Args {
  country_codes: string[];
}

export function compareNationalStrategies(db: Database.Database, args: Args) {
  if (!args.country_codes || args.country_codes.length < 2) {
    throw new Error('Provide at least 2 country codes for comparison');
  }

  const placeholders = args.country_codes.map(() => '?').join(',');
  const strategies = db.prepare(`
    SELECT * FROM national_strategies
    WHERE country_code IN (${placeholders})
    ORDER BY country_name
  `).all(...args.country_codes.map(c => c.toUpperCase())) as any[];

  if (strategies.length === 0) {
    throw new Error('No strategies found for the provided country codes');
  }

  // Parse key_objectives
  for (const s of strategies) {
    if (s.key_objectives && typeof s.key_objectives === 'string') {
      try {
        s.key_objectives = JSON.parse(s.key_objectives);
      } catch {
        // leave as string
      }
    }
  }

  const missing = args.country_codes
    .map(c => c.toUpperCase())
    .filter(c => !strategies.some((s: any) => s.country_code === c));

  const metadata = db.prepare("SELECT value FROM db_metadata WHERE key = 'build_date'").get() as any;

  return {
    comparison: strategies,
    countries_found: strategies.length,
    countries_missing: missing,
    _meta: {
      disclaimer: 'Cybersecurity law data is for reference purposes only. Tallinn Manual content is summarized, not verbatim (Cambridge University Press). Treaties may have reservations by individual states. Not legal advice.',
      data_source: 'Ansvar International Cybersecurity Law Database',
      freshness: metadata?.value ?? 'unknown',
    },
  };
}
