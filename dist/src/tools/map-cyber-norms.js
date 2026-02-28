export function mapCyberNorms(db, args) {
    let sql = `
    SELECT cn.*, s.short_title AS source_title, s.source_type
    FROM cyber_norms cn
    JOIN sources s ON s.id = cn.source_id
    WHERE 1=1
  `;
    const params = [];
    if (args.category) {
        sql += ' AND cn.category = ?';
        params.push(args.category);
    }
    if (args.status) {
        sql += ' AND cn.status = ?';
        params.push(args.status);
    }
    sql += ' ORDER BY cn.source_id, cn.norm_number';
    const norms = db.prepare(sql).all(...params);
    const metadata = db.prepare("SELECT value FROM db_metadata WHERE key = 'build_date'").get();
    return {
        norms,
        count: norms.length,
        categories_available: ['sovereignty', 'due_diligence', 'cooperation', 'human_rights', 'critical_infrastructure', 'confidence_building', 'capacity_building', 'international_law'],
        _meta: {
            disclaimer: 'Cybersecurity law data is for reference purposes only. Tallinn Manual content is summarized, not verbatim (Cambridge University Press). Treaties may have reservations by individual states. Not legal advice.',
            data_source: 'Ansvar International Cybersecurity Law Database',
            freshness: metadata?.value ?? 'unknown',
        },
    };
}
