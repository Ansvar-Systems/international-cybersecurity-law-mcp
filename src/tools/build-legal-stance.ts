import type Database from 'better-sqlite3';

interface Args {
  query: string;
  limit?: number;
}

export function buildLegalStance(db: Database.Database, args: Args) {
  const limit = Math.min(args.limit ?? 5, 20);

  // Search across articles
  const articles = db.prepare(`
    SELECT a.id, a.article_number, a.title, a.content, a.chapter, a.part,
           s.short_title AS source_title, s.source_type, s.id AS source_id,
           rank
    FROM articles_fts fts
    JOIN articles a ON a.id = fts.rowid
    JOIN sources s ON s.id = a.source_id
    WHERE articles_fts MATCH ?
    ORDER BY rank
    LIMIT ?
  `).all(args.query, limit * 3);

  // Group by source type
  const byType: Record<string, any[]> = {};
  for (const art of articles as any[]) {
    const type = art.source_type;
    if (!byType[type]) byType[type] = [];
    if (byType[type]!.length < limit) {
      byType[type]!.push(art);
    }
  }

  // Search norms
  const norms = db.prepare(`
    SELECT cn.*, s.short_title AS source_title
    FROM cyber_norms cn
    JOIN sources s ON s.id = cn.source_id
    WHERE cn.description LIKE ? OR cn.title LIKE ?
    LIMIT ?
  `).all(`%${args.query}%`, `%${args.query}%`, limit);

  // Search strategies
  const strategies = db.prepare(`
    SELECT ns.id, ns.country_code, ns.country_name, ns.strategy_name, ns.key_objectives
    FROM strategies_fts fts
    JOIN national_strategies ns ON ns.id = fts.rowid
    WHERE strategies_fts MATCH ?
    LIMIT ?
  `).all(args.query, limit);

  const metadata = db.prepare("SELECT value FROM db_metadata WHERE key = 'build_date'").get() as any;

  const addArticleCitation = (arr: any[]) => arr.map(r => ({
    ...r,
    _citation: {
      canonical_ref: `${r.source_title}, ${r.article_number}`,
      lookup: { tool: 'get_treaty_article', args: { source_id: r.source_id, article_number: r.article_number } },
    },
  }));

  const strategiesWithCitation = (strategies as any[]).map(s => ({
    ...s,
    _citation: {
      canonical_ref: `National Cybersecurity Strategy — ${s.country_name} (${s.country_code})`,
      lookup: { tool: 'get_national_cyber_strategy', args: { country_code: s.country_code } },
    },
  }));

  return {
    query: args.query,
    treaty_provisions: addArticleCitation(byType['treaty'] ?? []),
    manual_rules: addArticleCitation(byType['manual'] ?? []),
    policy_provisions: addArticleCitation(byType['policy'] ?? []),
    executive_orders: addArticleCitation(byType['executive_order'] ?? []),
    declarations: addArticleCitation(byType['declaration'] ?? []),
    relevant_norms: norms,
    relevant_strategies: strategiesWithCitation,
    total_results: articles.length + norms.length + strategies.length,
    _meta: {
      disclaimer: 'Cybersecurity law data is for reference purposes only. Tallinn Manual content is summarized, not verbatim (Cambridge University Press). Treaties may have reservations by individual states. Not legal advice.',
      data_source: 'Ansvar International Cybersecurity Law Database',
      data_age: metadata?.value ?? 'unknown',
    },
  };
}
