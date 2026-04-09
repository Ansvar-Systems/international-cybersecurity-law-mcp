import type Database from 'better-sqlite3';

export function listSources(db: Database.Database) {
  const sources = db.prepare(`
    SELECT s.*,
           (SELECT COUNT(*) FROM articles WHERE source_id = s.id) AS article_count
    FROM sources s
    ORDER BY s.source_type, s.short_title
  `).all();

  const articlesTotal = (db.prepare('SELECT COUNT(*) as c FROM articles').get() as any).c;
  const strategiesTotal = (db.prepare('SELECT COUNT(*) as c FROM national_strategies').get() as any).c;
  const normsTotal = (db.prepare('SELECT COUNT(*) as c FROM cyber_norms').get() as any).c;
  const exportControlsTotal = (db.prepare('SELECT COUNT(*) as c FROM export_controls').get() as any).c;

  const metadata = db.prepare('SELECT * FROM db_metadata').all();
  const buildDate = (metadata as any[]).find((m: any) => m.key === 'build_date')?.value ?? 'unknown';

  return {
    sources,
    totals: {
      sources: sources.length,
      articles: articlesTotal,
      national_strategies: strategiesTotal,
      cyber_norms: normsTotal,
      export_controls: exportControlsTotal,
    },
    metadata,
    _meta: {
      disclaimer: 'Cybersecurity law data is for reference purposes only. Tallinn Manual content is summarized, not verbatim (Cambridge University Press). Treaties may have reservations by individual states. Not legal advice.',
      data_source: 'Ansvar International Cybersecurity Law Database',
      data_age: buildDate,
    },
  };
}
