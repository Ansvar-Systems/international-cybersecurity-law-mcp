// EU Cyber Diplomacy Toolbox
// Joint Framework for a joint EU diplomatic response to malicious cyber activities (2017)
// EU Cyber Sanctions Regime (Council Decision 2019/797)
import type Database from 'better-sqlite3';

export function seedEuCyberDiplomacy(db: Database.Database): void {
  console.log('  Seeding EU Cyber Diplomacy Toolbox...');

  const insertSource = db.prepare(
    `INSERT INTO sources (title, short_title, source_type, organization, adoption_date, entry_into_force_date, status, signatories_count, url, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const insertArticle = db.prepare(
    `INSERT INTO articles (source_id, article_number, title, content, chapter, part, keywords)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );

  const result = insertSource.run(
    'EU Framework for a Joint Diplomatic Response to Malicious Cyber Activities (Cyber Diplomacy Toolbox)',
    'EU Cyber Diplomacy Toolbox',
    'policy',
    'Council of the European Union',
    '2017-06-19',
    '2017-06-19',
    'in_force',
    27,
    'https://data.consilium.europa.eu/doc/document/ST-10474-2017-INIT/en/pdf',
    'Framework for coordinated EU response to malicious cyber activities. Revised in 2023. Includes political, economic, and legal measures. Underpins EU cyber sanctions regime (Council Decision 2019/797).'
  );

  const srcId = Number(result.lastInsertRowid);

  const articles = [
    // Framework
    { num: 'Framework - Purpose', title: 'Purpose and scope', content: 'The joint EU diplomatic response framework (Cyber Diplomacy Toolbox) establishes a framework for a joint EU diplomatic response to malicious cyber activities. It aims to influence the behavior of potential aggressors and to contribute to the prevention and resolution of conflicts. The Toolbox complements and should be considered alongside the EU\'s efforts to promote an open, free, stable, and secure cyberspace, including through international negotiations on cyber norms.', ch: 'Framework', part: null, kw: 'diplomatic response,toolbox,prevention,conflict resolution,norms' },
    { num: 'Framework - Measures', title: 'Types of measures', content: 'The Toolbox includes the full range of CFSP measures available, including: (1) preventive measures such as cooperative, diplomatic and political engagement; (2) restrictive measures (sanctions) such as asset freezes and travel bans; (3) other measures under the Common Security and Defence Policy. The response should be proportionate to the scope, scale, duration, intensity, complexity, sophistication and impact of the cyber activity. Attribution is a sovereign national prerogative.', ch: 'Framework', part: null, kw: 'CFSP,sanctions,asset freeze,travel ban,proportionate,attribution' },
    { num: 'Framework - Attribution', title: 'Attribution framework', content: 'The EU does not have a binding, common EU attribution policy. Attribution is a sovereign national prerogative. However, the Council may make political attributions of malicious cyber activities at the EU level. When considering a joint EU response, the Council should take account of the best available information and intelligence, the assessment of the European External Action Service (EEAS), and relevant information shared by Member States.', ch: 'Framework', part: null, kw: 'attribution,sovereign prerogative,Council,EEAS,intelligence' },
    { num: 'Framework - Thresholds', title: 'Threshold for response', content: 'The decision to employ the Cyber Diplomacy Toolbox measures should take into account: the scope and gravity of the malicious cyber activity; its impact on international peace and security; the impact on the EU and its Member States, including on critical infrastructure, essential services, state functions, democratic processes, and commercial interests; the scale, duration, intensity, and complexity of the activity; the degree of responsibility and intent.', ch: 'Framework', part: null, kw: 'threshold,gravity,impact,critical infrastructure,democratic processes' },

    // Sanctions Regime
    { num: 'Decision 2019/797 - Art 1', title: 'Restrictive measures framework', content: 'Council Decision (CFSP) 2019/797 of 17 May 2019 concerning restrictive measures against cyber-attacks threatening the Union or its Member States. The Council may impose restrictive measures against persons, entities or bodies responsible for cyber-attacks or attempted cyber-attacks, or that provide financial, technical or material support for or are otherwise involved in cyber-attacks. Measures include asset freezes and travel restrictions.', ch: 'Sanctions Regime', part: null, kw: 'sanctions,restrictive measures,asset freeze,travel restrictions,Council Decision' },
    { num: 'Decision 2019/797 - Art 2', title: 'Definition of cyber-attacks', content: 'For the purposes of this Decision, "cyber-attacks" means actions involving access to information systems, information system interference, data interference, or data interception, where such actions are not duly authorized by the owner or other right holder of the system or data, or of part of it, or are not permitted under the law of the Member State or third state where the owner or right holder is established, or the system or data is located.', ch: 'Sanctions Regime', part: null, kw: 'cyber-attack definition,unauthorized access,information systems,data interference' },
    { num: 'Decision 2019/797 - Art 4', title: 'Criteria for designation', content: 'Restrictive measures may be imposed on persons or entities responsible for cyber-attacks with a significant effect, including: cyber-attacks against critical infrastructure (energy, transport, health, finance, digital infrastructure); cyber-attacks against state functions and institutions of the EU or its Member States; cyber-attacks aimed at undermining the integrity, security, and economic stability of a third state.', ch: 'Sanctions Regime', part: null, kw: 'designation criteria,critical infrastructure,state functions,economic stability' },

    // Attribution examples
    { num: 'Attribution - WannaCry', title: 'WannaCry attribution (2017)', content: 'In December 2017, the US, UK, Australia, Canada, Japan, and New Zealand publicly attributed the WannaCry ransomware attack to North Korea (specifically the Lazarus Group / Reconnaissance General Bureau). The attack in May 2017 affected over 200,000 computers across 150 countries, including the UK National Health Service. The EU did not make a formal attribution but endorsed the findings.', ch: 'Attribution Examples', part: null, kw: 'WannaCry,North Korea,Lazarus Group,ransomware,NHS,attribution' },
    { num: 'Attribution - NotPetya', title: 'NotPetya attribution (2018)', content: 'In February 2018, the US, UK, Australia, Canada, and Denmark attributed the NotPetya destructive malware attack to the Russian military (GRU Main Intelligence Directorate, specifically Unit 74455 "Sandworm"). The June 2017 attack caused over $10 billion in damages worldwide, primarily targeting Ukraine. The EU Council made its first cyber sanctions designation against GRU officers in July 2020.', ch: 'Attribution Examples', part: null, kw: 'NotPetya,Russia,GRU,Sandworm,destructive malware,Ukraine,sanctions' },
    { num: 'Attribution - Cloud Hopper', title: 'Cloud Hopper (APT10) designations (2020)', content: 'In July 2020, the EU Council imposed its first cyber sanctions against individuals and entities responsible for the "Cloud Hopper" (APT10) campaign. The campaign, attributed to Chinese state actors, targeted managed IT service providers to access intellectual property and confidential data of their clients globally. Two Chinese nationals and one Chinese entity (Huaying Haitai) were designated under Council Decision 2019/797.', ch: 'Attribution Examples', part: null, kw: 'Cloud Hopper,APT10,China,managed service providers,intellectual property,first EU sanctions' },
    { num: 'Attribution - GRU designations', title: 'GRU cyber sanctions (2020)', content: 'On 30 July 2020, the EU Council designated six individuals and three entities under the cyber sanctions regime. The designated individuals included four GRU officers (Unit 26165 and Unit 74455) responsible for the attempted cyber-attack against the Organisation for the Prohibition of Chemical Weapons (OPCW) in The Hague in 2018, and GRU officers responsible for the NotPetya attack. This was the first use of the EU\'s cyber sanctions regime.', ch: 'Attribution Examples', part: null, kw: 'GRU,OPCW,sanctions,Unit 26165,Unit 74455,first designations' },
  ];

  const insertMany = db.transaction(() => {
    for (const art of articles) {
      insertArticle.run(srcId, art.num, art.title, art.content, art.ch, art.part, art.kw);
    }
  });
  insertMany();

  console.log(`    EU Cyber Diplomacy Toolbox: ${articles.length} articles`);
}
