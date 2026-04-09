export function getTreaty(db, args) {
    let source;
    if (args.source_id) {
        source = db.prepare('SELECT * FROM sources WHERE id = ?').get(args.source_id);
    }
    else if (args.short_title) {
        source = db.prepare('SELECT * FROM sources WHERE short_title LIKE ?').get(`%${args.short_title}%`);
    }
    else {
        throw new Error('Provide either source_id or short_title');
    }
    if (!source) {
        throw new Error(`Source not found`);
    }
    const articleCount = db.prepare('SELECT COUNT(*) as c FROM articles WHERE source_id = ?').get(source.id).c;
    const chapters = db.prepare(`
    SELECT chapter, COUNT(*) as article_count
    FROM articles
    WHERE source_id = ? AND chapter IS NOT NULL
    GROUP BY chapter
    ORDER BY id
  `).all(source.id);
    const parts = db.prepare(`
    SELECT part, COUNT(*) as article_count
    FROM articles
    WHERE source_id = ? AND part IS NOT NULL
    GROUP BY part
    ORDER BY id
  `).all(source.id);
    const metadata = db.prepare("SELECT value FROM db_metadata WHERE key = 'build_date'").get();
    return {
        source,
        article_count: articleCount,
        chapters,
        parts,
        _citation: {
            canonical_ref: source.short_title,
            lookup: { tool: 'get_treaty', args: { source_id: source.id } },
        },
        _meta: {
            disclaimer: 'Cybersecurity law data is for reference purposes only. Tallinn Manual content is summarized, not verbatim (Cambridge University Press). Treaties may have reservations by individual states. Not legal advice.',
            data_source: 'Ansvar International Cybersecurity Law Database',
            data_age: metadata?.value ?? 'unknown',
        },
    };
}
