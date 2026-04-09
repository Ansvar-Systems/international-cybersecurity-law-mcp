export function getExportControls(db, args) {
    let sql = 'SELECT * FROM export_controls WHERE 1=1';
    const params = [];
    if (args.regime) {
        sql += ' AND regime LIKE ?';
        params.push(`%${args.regime}%`);
    }
    if (args.query) {
        sql += ' AND (item_description LIKE ? OR control_type LIKE ? OR dual_use_category LIKE ?)';
        params.push(`%${args.query}%`, `%${args.query}%`, `%${args.query}%`);
    }
    sql += ' ORDER BY regime, control_list_number';
    const results = db.prepare(sql).all(...params);
    const metadata = db.prepare("SELECT value FROM db_metadata WHERE key = 'build_date'").get();
    const resultsWithCitation = results.map(r => ({
        ...r,
        _citation: {
            canonical_ref: `${r.regime}, ${r.control_list_number}`,
            lookup: { tool: 'get_export_controls', args: { regime: r.regime, query: r.control_list_number } },
        },
    }));
    return {
        results: resultsWithCitation,
        count: results.length,
        _meta: {
            disclaimer: 'Cybersecurity law data is for reference purposes only. Tallinn Manual content is summarized, not verbatim (Cambridge University Press). Treaties may have reservations by individual states. Not legal advice.',
            data_source: 'Ansvar International Cybersecurity Law Database',
            data_age: metadata?.value ?? 'unknown',
        },
    };
}
