export function compareNationalStrategies(db, args) {
    if (!args.country_codes || args.country_codes.length < 2) {
        throw new Error('Provide at least 2 country codes for comparison');
    }
    const placeholders = args.country_codes.map(() => '?').join(',');
    const strategies = db.prepare(`
    SELECT * FROM national_strategies
    WHERE country_code IN (${placeholders})
    ORDER BY country_name
  `).all(...args.country_codes.map(c => c.toUpperCase()));
    if (strategies.length === 0) {
        throw new Error('No strategies found for the provided country codes');
    }
    // Parse key_objectives
    for (const s of strategies) {
        if (s.key_objectives && typeof s.key_objectives === 'string') {
            try {
                s.key_objectives = JSON.parse(s.key_objectives);
            }
            catch {
                // leave as string
            }
        }
    }
    const missing = args.country_codes
        .map(c => c.toUpperCase())
        .filter(c => !strategies.some((s) => s.country_code === c));
    const metadata = db.prepare("SELECT value FROM db_metadata WHERE key = 'build_date'").get();
    const comparisonWithCitation = strategies.map((s) => ({
        ...s,
        _citation: {
            canonical_ref: `National Cybersecurity Strategy — ${s.country_name} (${s.country_code})`,
            lookup: { tool: 'get_national_cyber_strategy', args: { country_code: s.country_code } },
        },
    }));
    return {
        comparison: comparisonWithCitation,
        countries_found: strategies.length,
        countries_missing: missing,
        _meta: {
            disclaimer: 'Cybersecurity law data is for reference purposes only. Tallinn Manual content is summarized, not verbatim (Cambridge University Press). Treaties may have reservations by individual states. Not legal advice.',
            data_source: 'Ansvar International Cybersecurity Law Database',
            data_age: metadata?.value ?? 'unknown',
        },
    };
}
