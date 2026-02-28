export function getAttributionFramework(db, args) {
    // Get Tallinn Manual rules on attribution, state responsibility, due diligence
    const attributionKeywords = [
        'attribution', 'state responsibility', 'due diligence', 'sovereignty',
        'self-defense', 'countermeasure', 'use of force', 'armed attack',
    ];
    const topic = args.topic?.toLowerCase();
    const keywords = topic
        ? attributionKeywords.filter(k => k.includes(topic) || topic.includes(k))
        : attributionKeywords;
    // If topic provided but no keyword match, use it directly
    const searchTerms = keywords.length > 0 ? keywords : [topic ?? 'attribution'];
    const ftsQuery = searchTerms.map(t => `"${t}"`).join(' OR ');
    const rules = db.prepare(`
    SELECT a.id, a.article_number, a.title, a.content, a.chapter, a.part,
           s.short_title AS source_title, s.source_type, s.id AS source_id
    FROM articles_fts fts
    JOIN articles a ON a.id = fts.rowid
    JOIN sources s ON s.id = a.source_id
    WHERE articles_fts MATCH ?
    ORDER BY rank
    LIMIT 30
  `).all(ftsQuery);
    // Also get relevant norms
    let norms;
    if (topic) {
        norms = db.prepare(`
      SELECT cn.*, s.short_title AS source_title
      FROM cyber_norms cn
      JOIN sources s ON s.id = cn.source_id
      WHERE cn.category IN ('sovereignty', 'due_diligence', 'international_law')
         OR cn.description LIKE ?
    `).all(`%${topic}%`);
    }
    else {
        norms = db.prepare(`
      SELECT cn.*, s.short_title AS source_title
      FROM cyber_norms cn
      JOIN sources s ON s.id = cn.source_id
      WHERE cn.category IN ('sovereignty', 'due_diligence', 'international_law')
    `).all();
    }
    const metadata = db.prepare("SELECT value FROM db_metadata WHERE key = 'build_date'").get();
    return {
        rules,
        norms,
        rules_count: rules.length,
        norms_count: norms.length,
        _meta: {
            disclaimer: 'Cybersecurity law data is for reference purposes only. Tallinn Manual content is summarized, not verbatim (Cambridge University Press). Treaties may have reservations by individual states. Not legal advice.',
            data_source: 'Ansvar International Cybersecurity Law Database',
            freshness: metadata?.value ?? 'unknown',
        },
    };
}
