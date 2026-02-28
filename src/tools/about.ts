import type Database from 'better-sqlite3';

export function about(db: Database.Database) {
  const metadata: Record<string, string> = {};
  const rows = db.prepare('SELECT key, value FROM db_metadata').all() as Array<{ key: string; value: string }>;
  for (const row of rows) {
    metadata[row.key] = row.value;
  }

  const sourcesCount = (db.prepare('SELECT COUNT(*) as c FROM sources').get() as any).c;
  const articlesCount = (db.prepare('SELECT COUNT(*) as c FROM articles').get() as any).c;
  const strategiesCount = (db.prepare('SELECT COUNT(*) as c FROM national_strategies').get() as any).c;
  const normsCount = (db.prepare('SELECT COUNT(*) as c FROM cyber_norms').get() as any).c;
  const exportControlsCount = (db.prepare('SELECT COUNT(*) as c FROM export_controls').get() as any).c;

  return {
    server: 'international-cybersecurity-law-mcp',
    version: '0.1.0',
    description: 'International cybersecurity law intelligence: treaties, conventions, norms, national strategies, export controls, and attribution frameworks',
    coverage: {
      treaties: ['Budapest Convention on Cybercrime (2001)', 'UN Convention against Cybercrime (2024)'],
      manuals: ['Tallinn Manual 2.0 (summaries only — Cambridge UP copyright)'],
      norms: ['UN GGE 2015/2021 consensus norms', 'OEWG reports', 'Paris Call principles'],
      policy: ['NATO cyber defense policy', 'EU Cyber Diplomacy Toolbox'],
      executive_orders: ['US EO 14028', 'US EO 13800', 'CISA Act 2018'],
      export_controls: ['Wassenaar Arrangement Category 5 Part 2'],
      national_strategies: '50+ countries',
    },
    record_counts: {
      sources: sourcesCount,
      articles_and_rules: articlesCount,
      national_strategies: strategiesCount,
      cyber_norms: normsCount,
      export_controls: exportControlsCount,
    },
    tools: 14,
    _meta: {
      disclaimer: 'Cybersecurity law data is for reference purposes only. Tallinn Manual content is summarized, not verbatim (Cambridge University Press). Treaties may have reservations by individual states. Not legal advice.',
      data_source: 'Ansvar International Cybersecurity Law Database',
      freshness: metadata['build_date'] ?? 'unknown',
    },
  };
}
