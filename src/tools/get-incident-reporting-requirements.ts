import type Database from 'better-sqlite3';

interface Args {
  query?: string;
  limit?: number;
}

export function getIncidentReportingRequirements(db: Database.Database, args: Args) {
  const limit = Math.min(args.limit ?? 20, 50);

  // Search articles related to incident reporting
  const baseQuery = 'incident OR reporting OR notification OR breach OR CSIRT OR CERT';
  const searchQuery = args.query ? `(${baseQuery}) AND (${args.query})` : baseQuery;

  const results = db.prepare(`
    SELECT a.id, a.article_number, a.title, a.content, a.chapter, a.part,
           s.short_title AS source_title, s.source_type, s.id AS source_id
    FROM articles_fts fts
    JOIN articles a ON a.id = fts.rowid
    JOIN sources s ON s.id = a.source_id
    WHERE articles_fts MATCH ?
    ORDER BY rank
    LIMIT ?
  `).all(searchQuery, limit);

  const metadata = db.prepare("SELECT value FROM db_metadata WHERE key = 'build_date'").get() as any;

  const resultsWithCitation = (results as any[]).map(r => ({
    ...r,
    _citation: {
      canonical_ref: `${r.source_title}, ${r.article_number}`,
      lookup: { tool: 'get_treaty_article', args: { source_id: r.source_id, article_number: r.article_number } },
    },
  }));

  return {
    results: resultsWithCitation,
    count: results.length,
    search_scope: 'All treaties, conventions, and manuals',
    _meta: {
      disclaimer: 'Cybersecurity law data is for reference purposes only. Tallinn Manual content is summarized, not verbatim (Cambridge University Press). Treaties may have reservations by individual states. Not legal advice.',
      data_source: 'Ansvar International Cybersecurity Law Database',
      data_age: metadata?.value ?? 'unknown',
    },
  };
}
