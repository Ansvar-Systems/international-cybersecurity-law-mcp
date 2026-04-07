import type Database from 'better-sqlite3';
import { buildCitation } from '../citation-universal.js';

interface Args {
  query?: string;
  regime?: string;
}

export function getExportControls(db: Database.Database, args: Args) {
  let sql = 'SELECT * FROM export_controls WHERE 1=1';
  const params: any[] = [];

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

  const metadata = db.prepare("SELECT value FROM db_metadata WHERE key = 'build_date'").get() as any;

  const _citations = (results as Array<Record<string, unknown>>).map((r) =>
    buildCitation(
      `${r.regime as string} ${r.control_list_number as string}`,
      (r.item_description as string) || `${r.regime as string} ${r.control_list_number as string}`,
      'get_export_controls',
      { regime: r.regime as string },
    ),
  );

  return {
    results,
    count: results.length,
    _citations,
    _meta: {
      disclaimer: 'Cybersecurity law data is for reference purposes only. Tallinn Manual content is summarized, not verbatim (Cambridge University Press). Treaties may have reservations by individual states. Not legal advice.',
      data_source: 'Ansvar International Cybersecurity Law Database',
      freshness: metadata?.value ?? 'unknown',
    },
  };
}
