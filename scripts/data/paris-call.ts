// Paris Call for Trust and Security in Cyberspace (2018)
// Launched by French President Macron at the Internet Governance Forum, 12 November 2018
// 80+ state supporters, 700+ organizations
import type Database from 'better-sqlite3';

export function seedParisCall(db: Database.Database): void {
  console.log('  Seeding Paris Call...');

  const insertSource = db.prepare(
    `INSERT INTO sources (title, short_title, source_type, organization, adoption_date, entry_into_force_date, status, signatories_count, url, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const insertArticle = db.prepare(
    `INSERT INTO articles (source_id, article_number, title, content, chapter, part, keywords)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );

  const insertNorm = db.prepare(
    `INSERT INTO cyber_norms (source_id, norm_number, title, description, category, status, supporting_states)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );

  const result = insertSource.run(
    'Paris Call for Trust and Security in Cyberspace',
    'Paris Call',
    'declaration',
    'Government of France',
    '2018-11-12',
    null,
    'active',
    80,
    'https://pariscall.international/',
    'Multi-stakeholder declaration. 80+ state supporters (notable absence: US, China, Russia, Israel, North Korea, Iran). Supported by 700+ entities including tech companies, universities, and civil society organizations.'
  );

  const srcId = Number(result.lastInsertRowid);

  const principles = [
    { num: 'Principle 1', title: 'Prevent and recover from malicious cyber activities', desc: 'Prevent and recover from malicious cyber activities that threaten or cause significant, indiscriminate or systemic harm to individuals and critical infrastructure, and promote the use of products and practices to strengthen security.', cat: 'critical_infrastructure' as const },
    { num: 'Principle 2', title: 'Protect elections', desc: 'Prevent activity that intentionally and substantially damages the general availability or integrity of the public core of the Internet, including the integrity of election processes.', cat: 'sovereignty' as const },
    { num: 'Principle 3', title: 'Defend intellectual property', desc: 'Protect individuals and organizations against the theft of intellectual property by cyber means, including trade secrets or other confidential business information, with the intent to provide competitive advantage to companies or the commercial sector.', cat: 'due_diligence' as const },
    { num: 'Principle 4', title: 'Prevent offensive cyber operations against ICT', desc: 'Prevent ICT actors, including the private sector, from conducting offensive cyber operations or hacking back on their own behalf or for the benefit of other non-State actors.', cat: 'sovereignty' as const },
    { num: 'Principle 5', title: 'Digital product and service security', desc: 'Develop ways to prevent non-State actors, including the private sector, from hacking back, for their own purposes or those of other non-State actors. Support security by design for digital products and services, taking into account the evolving state of the art in that regard.', cat: 'due_diligence' as const },
    { num: 'Principle 6', title: 'Cyber hygiene lifecycle', desc: 'Strengthen the security of digital processes, products and services, throughout their lifecycle and supply chain, including by addressing vulnerabilities in products and the unauthorized proliferation and use of malicious tools.', cat: 'due_diligence' as const },
    { num: 'Principle 7', title: 'Cyber hygiene for all', desc: 'Support efforts to strengthen an advanced cyber hygiene for all actors, particularly through the sharing of information and good practices for better collective security.', cat: 'capacity_building' as const },
    { num: 'Principle 8', title: 'Prevent non-State actors from hacking back', desc: 'Take steps to prevent non-State actors, including the private sector, from hacking-back, for their own purposes or those of other non-State actors, and to strengthen advanced cyber hygiene.', cat: 'sovereignty' as const },
    { num: 'Principle 9', title: 'International norms of responsible behavior', desc: 'Promote the widespread acceptance and implementation of international norms of responsible behavior as well as confidence-building measures in cyberspace.', cat: 'cooperation' as const },
  ];

  const insertMany = db.transaction(() => {
    for (const p of principles) {
      insertArticle.run(srcId, p.num, p.title, p.desc, 'Principles', null, `paris call,${p.cat},norm,responsible behavior`);
      insertNorm.run(srcId, p.num, p.title, p.desc, p.cat, 'voluntary', '80+ states, 700+ organizations');
    }
  });
  insertMany();

  console.log(`    Paris Call: ${principles.length} principles`);
}
