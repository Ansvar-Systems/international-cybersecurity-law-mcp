import type Database from 'better-sqlite3';
import { buildCitation } from '../citation-universal.js';

interface Args {
  query: string;
  source_type?: string;
  limit?: number;
}

export function searchCybersecurityLaw(db: Database.Database, args: Args) {
  const limit = Math.min(args.limit ?? 10, 50);

  let sql: string;
  let params: any[];

  if (args.source_type) {
    sql = `
      SELECT a.id, a.article_number, a.title, a.content, a.chapter, a.part, a.keywords,
             s.short_title AS source_title, s.source_type, s.id AS source_id,
             rank
      FROM articles_fts fts
      JOIN articles a ON a.id = fts.rowid
      JOIN sources s ON s.id = a.source_id
      WHERE articles_fts MATCH ?
        AND s.source_type = ?
      ORDER BY rank
      LIMIT ?
    `;
    params = [args.query, args.source_type, limit];
  } else {
    sql = `
      SELECT a.id, a.article_number, a.title, a.content, a.chapter, a.part, a.keywords,
             s.short_title AS source_title, s.source_type, s.id AS source_id,
             rank
      FROM articles_fts fts
      JOIN articles a ON a.id = fts.rowid
      JOIN sources s ON s.id = a.source_id
      WHERE articles_fts MATCH ?
      ORDER BY rank
      LIMIT ?
    `;
    params = [args.query, limit];
  }

  const results = db.prepare(sql).all(...params);
  const metadata = db.prepare("SELECT value FROM db_metadata WHERE key = 'build_date'").get() as any;

  const _citations = (results as Array<Record<string, unknown>>).map((r) =>
    buildCitation(
      `${r.source_title as string} Article ${r.article_number as string}`,
      `Article ${r.article_number as string}${r.title ? ` — ${r.title as string}` : ''}, ${r.source_title as string}`,
      'get_treaty_article',
      { source_id: String(r.source_id), article_number: r.article_number as string },
    ),
  );

  return {
    results,
    count: results.length,
    query: args.query,
    _citations,
    _meta: {
      disclaimer: 'Cybersecurity law data is for reference purposes only. Tallinn Manual content is summarized, not verbatim (Cambridge University Press). Treaties may have reservations by individual states. Not legal advice.',
      data_source: 'Ansvar International Cybersecurity Law Database',
      freshness: metadata?.value ?? 'unknown',
    },
  };
}
