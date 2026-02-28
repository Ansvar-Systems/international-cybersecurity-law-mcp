import type Database from 'better-sqlite3';

interface Args {
  country_code?: string;
  country_name?: string;
}

export function getNationalCyberStrategy(db: Database.Database, args: Args) {
  let strategy: any;

  if (args.country_code) {
    strategy = db.prepare('SELECT * FROM national_strategies WHERE country_code = ?').get(args.country_code.toUpperCase());
  } else if (args.country_name) {
    strategy = db.prepare('SELECT * FROM national_strategies WHERE country_name LIKE ?').get(`%${args.country_name}%`);
  } else {
    throw new Error('Provide either country_code or country_name');
  }

  if (!strategy) {
    // List available countries
    const available = db.prepare('SELECT country_code, country_name FROM national_strategies ORDER BY country_name').all();
    throw new Error(`Strategy not found. Available countries: ${available.map((a: any) => `${a.country_name} (${a.country_code})`).join(', ')}`);
  }

  // Parse key_objectives if stored as JSON string
  if (strategy.key_objectives && typeof strategy.key_objectives === 'string') {
    try {
      strategy.key_objectives = JSON.parse(strategy.key_objectives);
    } catch {
      // leave as string
    }
  }

  const metadata = db.prepare("SELECT value FROM db_metadata WHERE key = 'build_date'").get() as any;

  return {
    strategy,
    _meta: {
      disclaimer: 'Cybersecurity law data is for reference purposes only. Tallinn Manual content is summarized, not verbatim (Cambridge University Press). Treaties may have reservations by individual states. Not legal advice.',
      data_source: 'Ansvar International Cybersecurity Law Database',
      freshness: metadata?.value ?? 'unknown',
    },
  };
}
