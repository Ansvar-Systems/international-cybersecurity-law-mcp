export function checkDataFreshness(db) {
    const metadata = {};
    const rows = db.prepare('SELECT key, value FROM db_metadata').all();
    for (const row of rows) {
        metadata[row.key] = row.value;
    }
    const sourcesByType = db.prepare(`
    SELECT source_type, COUNT(*) as count
    FROM sources
    GROUP BY source_type
    ORDER BY source_type
  `).all();
    const latestSource = db.prepare(`
    SELECT short_title, adoption_date
    FROM sources
    WHERE adoption_date IS NOT NULL
    ORDER BY adoption_date DESC
    LIMIT 1
  `).get();
    return {
        build_date: metadata['build_date'] ?? 'unknown',
        schema_version: metadata['schema_version'] ?? 'unknown',
        tier: metadata['tier'] ?? 'free',
        total_records: metadata['record_count'] ?? 'unknown',
        sources_by_type: sourcesByType,
        latest_source: latestSource,
        _meta: {
            disclaimer: 'Cybersecurity law data is for reference purposes only. Tallinn Manual content is summarized, not verbatim (Cambridge University Press). Treaties may have reservations by individual states. Not legal advice.',
            data_source: 'Ansvar International Cybersecurity Law Database',
            freshness: metadata['build_date'] ?? 'unknown',
        },
    };
}
