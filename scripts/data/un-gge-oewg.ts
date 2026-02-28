// UN Group of Governmental Experts (GGE) and Open-Ended Working Group (OEWG)
// GGE 2015 Consensus Report (A/70/174) — 11 norms
// GGE 2021 Report (A/76/135)
// OEWG Reports (2021, 2023)
import type Database from 'better-sqlite3';

export function seedUnGgeOewg(db: Database.Database): void {
  console.log('  Seeding UN GGE/OEWG norms...');

  const insertSource = db.prepare(
    `INSERT INTO sources (title, short_title, source_type, organization, adoption_date, entry_into_force_date, status, signatories_count, url, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const insertNorm = db.prepare(
    `INSERT INTO cyber_norms (source_id, norm_number, title, description, category, status, supporting_states)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );

  const insertArticle = db.prepare(
    `INSERT INTO articles (source_id, article_number, title, content, chapter, part, keywords)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );

  // GGE 2015
  const gge2015 = insertSource.run(
    'Report of the Group of Governmental Experts on Developments in the Field of Information and Telecommunications in the Context of International Security (A/70/174)',
    'GGE 2015 Report',
    'norm',
    'United Nations General Assembly',
    '2015-07-22',
    null,
    'consensus',
    null,
    'https://documents-dds-ny.un.org/doc/UNDOC/GEN/N15/228/35/PDF/N1522835.pdf',
    'Landmark consensus report establishing 11 voluntary, non-binding norms of responsible State behavior in cyberspace. Endorsed by UNGA resolution 70/237.'
  );

  const gge2015Id = Number(gge2015.lastInsertRowid);

  // 11 norms from paragraphs 13(a)-(k) of A/70/174
  const norms: Array<{
    num: string; title: string; desc: string; cat: string; support: string;
  }> = [
    { num: 'Norm 13(a)', title: 'Consistent with UN purposes', desc: 'States should cooperate in developing and applying measures to increase stability and security in the use of ICTs and to prevent ICT practices that are acknowledged to be harmful or that may pose threats to international peace and security. Consistent with the purposes of the United Nations, including maintaining international peace and security, States should cooperate to prevent conflict arising from the use of ICTs.', cat: 'cooperation', support: 'All UN member states (consensus)' },
    { num: 'Norm 13(b)', title: 'Consider all relevant information before responding', desc: 'In case of ICT incidents, States should consider all relevant information, including the larger context of the event, the challenges of attribution in the ICT environment, and the nature and extent of the consequences. States should not conduct or knowingly support ICT activity that intentionally damages or impairs the use and operation of critical infrastructure.', cat: 'due_diligence', support: 'All UN member states (consensus)' },
    { num: 'Norm 13(c)', title: 'Do not knowingly allow territory for wrongful acts', desc: 'States should not knowingly allow their territory to be used for internationally wrongful acts using ICTs. States should endeavour to ensure that their territories are not used by non-State actors for unlawful use of ICTs.', cat: 'sovereignty', support: 'All UN member states (consensus)' },
    { num: 'Norm 13(d)', title: 'Cooperate to exchange information and assist', desc: 'States should cooperate to exchange information, assist each other, prosecute terrorist and criminal use of ICTs and implement other cooperative measures to address such threats. States may need to consider whether new measures need to be developed in this respect.', cat: 'cooperation', support: 'All UN member states (consensus)' },
    { num: 'Norm 13(e)', title: 'Respect human rights and privacy', desc: 'States, in ensuring the secure use of ICTs, should respect Human Rights Council resolutions 20/8 and 26/13 on the promotion, protection and enjoyment of human rights on the Internet, as well as General Assembly resolutions 68/167 and 69/166 on the right to privacy in the digital age, to guarantee full respect for human rights, including the right to freedom of expression.', cat: 'human_rights', support: 'All UN member states (consensus)' },
    { num: 'Norm 13(f)', title: 'Do not conduct or support ICT activity against critical infrastructure', desc: 'A State should not conduct or knowingly support ICT activity contrary to its obligations under international law that intentionally damages critical infrastructure or otherwise impairs the use and operation of critical infrastructure to provide services to the public.', cat: 'critical_infrastructure', support: 'All UN member states (consensus)' },
    { num: 'Norm 13(g)', title: 'Protect critical infrastructure', desc: 'States should take appropriate measures to protect their critical infrastructure from ICT threats, taking into account General Assembly resolution 58/199 on the creation of a global culture of cybersecurity and the protection of critical information infrastructures, and other relevant resolutions.', cat: 'critical_infrastructure', support: 'All UN member states (consensus)' },
    { num: 'Norm 13(h)', title: 'Respond to requests for assistance', desc: 'States should respond to appropriate requests for assistance by another State whose critical infrastructure is subject to malicious ICT acts. States should also respond to appropriate requests to mitigate malicious ICT activity aimed at the critical infrastructure of another State emanating from their territory, taking into account due regard for sovereignty.', cat: 'cooperation', support: 'All UN member states (consensus)' },
    { num: 'Norm 13(i)', title: 'Ensure supply chain integrity', desc: 'States should take reasonable steps to ensure the integrity of the supply chain so that end users can have confidence in the security of ICT products. States should seek to prevent the proliferation of malicious ICT tools and techniques and the use of harmful hidden functions.', cat: 'due_diligence', support: 'All UN member states (consensus)' },
    { num: 'Norm 13(j)', title: 'Report ICT vulnerabilities', desc: 'States should encourage responsible reporting of ICT vulnerabilities and share associated information on available remedies to such vulnerabilities to limit and possibly eliminate potential threats to ICTs and ICT-dependent infrastructure.', cat: 'confidence_building', support: 'All UN member states (consensus)' },
    { num: 'Norm 13(k)', title: 'Do not harm CERTs', desc: 'States should not conduct or knowingly support activity to harm the information systems of the authorized emergency response teams (sometimes known as computer emergency response teams or cybersecurity incident response teams) of another State. A State should not use authorized emergency response teams to engage in malicious international activity.', cat: 'cooperation', support: 'All UN member states (consensus)' },
  ];

  const insertNormsTransaction = db.transaction(() => {
    for (const norm of norms) {
      insertNorm.run(gge2015Id, norm.num, norm.title, norm.desc, norm.cat, 'consensus', norm.support);
    }
  });
  insertNormsTransaction();

  // GGE 2021
  const gge2021 = insertSource.run(
    'Report of the Group of Governmental Experts on Advancing Responsible State Behaviour in Cyberspace in the Context of International Security (A/76/135)',
    'GGE 2021 Report',
    'norm',
    'United Nations General Assembly',
    '2021-07-14',
    null,
    'consensus',
    null,
    'https://documents-dds-ny.un.org/doc/UNDOC/GEN/N21/075/86/PDF/N2107586.pdf',
    'Reaffirmed and provided guidance on implementing the 2015 norms. Confirmed applicability of international law to cyberspace.'
  );

  const gge2021Id = Number(gge2021.lastInsertRowid);

  // Key articles from GGE 2021
  const gge2021Articles = [
    { num: 'Para 69', title: 'International law applicability', content: 'The Group affirmed that international law, and in particular the Charter of the United Nations, is applicable and essential to maintaining peace and stability and promoting an open, secure, stable, accessible and peaceful ICT environment. The Group reaffirmed the conclusions and recommendations of the 2015 report.', ch: 'International Law', part: null, kw: 'international law,UN Charter,applicability,peace and stability' },
    { num: 'Para 70', title: 'Sovereignty in cyberspace', content: 'The principle of sovereignty and the international norms and rules that flow from it apply to State conduct of ICT-related activities and to State jurisdiction over ICT infrastructure within their territory.', ch: 'International Law', part: null, kw: 'sovereignty,jurisdiction,ICT infrastructure' },
    { num: 'Para 71', title: 'Due diligence obligation', content: 'States should not knowingly allow their territory to be used for internationally wrongful acts using ICTs. When a State becomes aware that a cyber operation originating from its territory targets another State, it should take appropriate and reasonably available steps to address the situation.', ch: 'International Law', part: null, kw: 'due diligence,territory,wrongful acts,state obligation' },
    { num: 'Para 72', title: 'Self-defense applicability', content: 'The inherent right of States to take measures consistent with international law, including the right of self-defense as recognized in Article 51 of the Charter of the United Nations, applies in the ICT environment.', ch: 'International Law', part: null, kw: 'self-defense,Article 51,UN Charter,ICT environment' },
    { num: 'Para 73', title: 'International humanitarian law', content: 'The established international legal principles including, where applicable, the principles of humanity, necessity, proportionality and distinction, apply to the use of ICTs by States.', ch: 'International Law', part: null, kw: 'IHL,humanity,necessity,proportionality,distinction' },
  ];

  const insertGge2021 = db.transaction(() => {
    for (const art of gge2021Articles) {
      insertArticle.run(gge2021Id, art.num, art.title, art.content, art.ch, art.part, art.kw);
    }
  });
  insertGge2021();

  // OEWG 2021 and 2023
  const oewg = insertSource.run(
    'Open-Ended Working Group on ICT Security (2019-2021, 2021-2025)',
    'OEWG Reports',
    'norm',
    'United Nations General Assembly',
    '2021-03-12',
    null,
    'adopted',
    null,
    'https://front.un-arm.org/wp-content/uploads/2021/03/Final-report-A-AC.290-2021-CRP.2.pdf',
    'OEWG established by UNGA resolution 73/27. First mandate (2019-2021) produced consensus report. Second mandate (2021-2025) continues norm elaboration.'
  );

  const oewgId = Number(oewg.lastInsertRowid);

  const oewgArticles = [
    { num: 'OEWG 2021 - Para 16', title: 'Norms as expectations of responsible behavior', content: 'The norms of responsible State behaviour as set out in the 2015 report and further elaborated in the 2021 GGE report reflect the expectations of the international community, set standards for responsible State behaviour and allow the international community to assess the activities and intentions of States.', ch: 'Norms', part: null, kw: 'norms,responsible behavior,expectations,standards' },
    { num: 'OEWG 2021 - Para 25', title: 'International law applicability reaffirmed', content: 'International law, and in particular the Charter of the United Nations, is applicable and essential to maintaining international peace and security in the ICT environment. How international law applies to the use of ICTs by States requires further study.', ch: 'International Law', part: null, kw: 'international law,UN Charter,further study' },
    { num: 'OEWG 2023 - APR', title: 'Annual Progress Report 2023', content: 'The third Annual Progress Report of the OEWG (2023) included discussion of existing and potential threats, norm implementation, international law applicability, confidence-building measures, capacity-building, and establishment of a regular institutional dialogue on ICT security. States expressed divergent views on whether new legally binding norms were needed versus implementing existing voluntary norms.', ch: 'Progress Reports', part: null, kw: 'annual progress,threats,norm implementation,institutional dialogue,binding norms' },
    { num: 'OEWG 2023 - CBMs', title: 'Confidence-building measures', content: 'States discussed the development and implementation of confidence-building measures (CBMs) to reduce the risk of conflict stemming from the use of ICTs, including through voluntary national surveys, points of contact directories, bilateral and regional CBM agreements, and inter-CERT cooperation frameworks.', ch: 'Confidence-Building', part: null, kw: 'confidence-building,CBMs,risk reduction,national surveys,CERT cooperation' },
  ];

  // OEWG norms
  const oewgNorms = [
    { num: 'OEWG-CBM-1', title: 'National contact points', desc: 'States should designate national points of contact for ICT security to facilitate inter-State communication and reduce the risk of misperception and escalation.', cat: 'confidence_building' as const, support: 'Broad consensus' },
    { num: 'OEWG-CBM-2', title: 'Transparency measures', desc: 'States should share information on their national ICT strategies, policies, and organizations relevant to ICT security as a confidence-building measure.', cat: 'confidence_building' as const, support: 'Broad consensus' },
    { num: 'OEWG-CAP-1', title: 'Capacity building for developing states', desc: 'States and relevant stakeholders should strengthen capacity-building efforts to ensure that all States can identify, assess, and address ICT threats and implement the norms of responsible State behaviour.', cat: 'capacity_building' as const, support: 'Broad consensus' },
    { num: 'OEWG-LAW-1', title: 'International law applies to cyberspace', desc: 'International law, and in particular the Charter of the United Nations, is applicable and essential to maintaining international peace and security in the ICT environment. States acknowledged the need for further study on how international law applies to the use of ICTs by States.', cat: 'international_law' as const, support: 'Broad consensus' },
  ];

  const insertOewg = db.transaction(() => {
    for (const art of oewgArticles) {
      insertArticle.run(oewgId, art.num, art.title, art.content, art.ch, art.part, art.kw);
    }
    for (const norm of oewgNorms) {
      insertNorm.run(oewgId, norm.num, norm.title, norm.desc, norm.cat, 'consensus', norm.support);
    }
  });
  insertOewg();

  console.log(`    GGE 2015: ${norms.length} norms`);
  console.log(`    GGE 2021: ${gge2021Articles.length} articles`);
  console.log(`    OEWG: ${oewgArticles.length} articles, ${oewgNorms.length} norms`);
}
