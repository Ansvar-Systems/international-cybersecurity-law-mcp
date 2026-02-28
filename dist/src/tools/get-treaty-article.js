export function getTreatyArticle(db, args) {
    const article = db.prepare(`
    SELECT a.*, s.short_title AS source_title, s.title AS source_full_title, s.source_type
    FROM articles a
    JOIN sources s ON s.id = a.source_id
    WHERE a.source_id = ? AND a.article_number = ?
  `).get(args.source_id, args.article_number);
    if (!article) {
        // Try partial match
        const fuzzy = db.prepare(`
      SELECT a.*, s.short_title AS source_title, s.title AS source_full_title, s.source_type
      FROM articles a
      JOIN sources s ON s.id = a.source_id
      WHERE a.source_id = ? AND a.article_number LIKE ?
    `).get(args.source_id, `%${args.article_number}%`);
        if (!fuzzy) {
            throw new Error(`Article "${args.article_number}" not found in source ${args.source_id}`);
        }
        return formatResult(db, fuzzy);
    }
    return formatResult(db, article);
}
function formatResult(db, article) {
    const metadata = db.prepare("SELECT value FROM db_metadata WHERE key = 'build_date'").get();
    return {
        article,
        _meta: {
            disclaimer: 'Cybersecurity law data is for reference purposes only. Tallinn Manual content is summarized, not verbatim (Cambridge University Press). Treaties may have reservations by individual states. Not legal advice.',
            data_source: 'Ansvar International Cybersecurity Law Database',
            freshness: metadata?.value ?? 'unknown',
        },
    };
}
