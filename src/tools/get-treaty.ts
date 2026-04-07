import type Database from 'better-sqlite3';
import { buildCitation } from '../citation-universal.js';

interface Args {
  source_id?: number;
  short_title?: string;
}

export function getTreaty(db: Database.Database, args: Args) {
  let source: any;

  if (args.source_id) {
    source = db.prepare('SELECT * FROM sources WHERE id = ?').get(args.source_id);
  } else if (args.short_title) {
    source = db.prepare('SELECT * FROM sources WHERE short_title LIKE ?').get(`%${args.short_title}%`);
  } else {
    throw new Error('Provide either source_id or short_title');
  }

  if (!source) {
    throw new Error(`Source not found`);
  }

  const articleCount = (db.prepare('SELECT COUNT(*) as c FROM articles WHERE source_id = ?').get(source.id) as any).c;

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

  const metadata = db.prepare("SELECT value FROM db_metadata WHERE key = 'build_date'").get() as any;

  const _citation = buildCitation(
    (source as any).short_title || (source as any).title,
    (source as any).title,
    'get_treaty',
    args.source_id ? { source_id: String(args.source_id) } : { short_title: args.short_title! },
  );

  return {
    source,
    article_count: articleCount,
    chapters,
    parts,
    _citation,
    _meta: {
      disclaimer: 'Cybersecurity law data is for reference purposes only. Tallinn Manual content is summarized, not verbatim (Cambridge University Press). Treaties may have reservations by individual states. Not legal advice.',
      data_source: 'Ansvar International Cybersecurity Law Database',
      freshness: metadata?.value ?? 'unknown',
    },
  };
}
