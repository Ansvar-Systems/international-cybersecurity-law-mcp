// Wassenaar Arrangement on Export Controls for Conventional Arms and Dual-Use Goods and Technologies
// Category 5 Part 2 — Information Security
// 42 Participating States
import type Database from 'better-sqlite3';

export function seedWassenaar(db: Database.Database): void {
  console.log('  Seeding Wassenaar Arrangement...');

  const insertSource = db.prepare(
    `INSERT INTO sources (title, short_title, source_type, organization, adoption_date, entry_into_force_date, status, signatories_count, url, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const insertExportControl = db.prepare(
    `INSERT INTO export_controls (regime, control_type, item_description, control_list_number, dual_use_category, licensing_requirements, participating_states, url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const insertArticle = db.prepare(
    `INSERT INTO articles (source_id, article_number, title, content, chapter, part, keywords)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );

  const result = insertSource.run(
    'Wassenaar Arrangement on Export Controls for Conventional Arms and Dual-Use Goods and Technologies',
    'Wassenaar Arrangement',
    'export_control',
    'Wassenaar Arrangement Secretariat',
    '1996-07-12',
    '1996-11-01',
    'in_force',
    42,
    'https://www.wassenaar.org/',
    '42 Participating States as of 2024. Category 5 Part 2 (Information Security) controls cover encryption, intrusion software, and IP network surveillance. 2013 amendment added controls on intrusion software and IP network surveillance. 2017 amendment narrowed intrusion software definition. Plenary meets annually in Vienna.'
  );

  const srcId = Number(result.lastInsertRowid);

  const participatingStates = 'Argentina, Australia, Austria, Belgium, Bulgaria, Canada, Croatia, Czech Republic, Denmark, Estonia, Finland, France, Germany, Greece, Hungary, India, Ireland, Italy, Japan, Latvia, Lithuania, Luxembourg, Malta, Mexico, Netherlands, New Zealand, Norway, Poland, Portugal, Romania, Slovakia, Slovenia, South Africa, South Korea, Spain, Sweden, Switzerland, Turkey, Ukraine, United Kingdom, United States';

  // Export controls
  const controls = [
    { type: 'Encryption', desc: 'Systems, equipment, and components for information security using cryptography. Includes hardware, software, and technology for encryption of data, voice, video, or any digital information. Items using symmetric algorithms with key lengths exceeding 56 bits, asymmetric algorithms based on factoring integers exceeding 512 bits, or elliptic curve algorithms exceeding 112-bit key length.', listNum: '5A002', dualUse: 'Category 5 Part 2', licensing: 'License required for export to non-participating states. Mass-market and publicly available encryption software exempted under Note 3.' },
    { type: 'Encryption components', desc: 'Specially designed or modified components for cryptographic functionality, including integrated circuits, field-programmable gate arrays (FPGAs), and application-specific integrated circuits (ASICs) implementing cryptographic functions.', listNum: '5A002.a', dualUse: 'Category 5 Part 2', licensing: 'License required. End-use/end-user assessment.' },
    { type: 'Cryptanalytic equipment', desc: 'Systems or equipment designed or modified for cryptanalysis (breaking encryption). Includes quantum computing systems when specifically designed for cryptanalytic functions.', listNum: '5A004', dualUse: 'Category 5 Part 2', licensing: 'License required for all non-participating state destinations.' },
    { type: 'IP network surveillance', desc: 'IP network communications surveillance systems or equipment, and specially designed components therefor. Systems designed for lawful interception of IP communications across entire networks, providing: reconstruction of targets, mapping of relationships between targets, or indexing of extracted content. Includes deep packet inspection (DPI) systems designed for surveillance at network scale.', listNum: '5A001.j', dualUse: 'Category 5 Part 2', licensing: 'License required. Added via 2013 Plenary amendment. Human rights review may be required.' },
    { type: 'Intrusion software (2017 definition)', desc: 'Software specially designed or modified to avoid detection by monitoring tools, or to defeat protective countermeasures, of a computer or network-capable device, and performing any of the following: extraction of data or information from the device; modification of system or user data; or modification of the standard execution path of a program or process in order to allow the execution of externally provided instructions. Does not include software designed for the purpose of network administration, operation, or testing, software designed for vulnerability analysis, or software designed for security research.', listNum: '5D001 (Note to 5A001.j)', dualUse: 'Category 5 Part 2', licensing: 'License required. Amended in 2017 to narrow scope. Security research exemption applies. Vulnerability disclosure cooperation tools exempted.' },
    { type: 'Technology for intrusion software', desc: 'Technology for the development, production, or use of intrusion software as defined above. Includes exploit development techniques, zero-day vulnerability exploitation methodologies, and command-and-control infrastructure design.', listNum: '5E001', dualUse: 'Category 5 Part 2', licensing: 'License required. May overlap with Vulnerability Equities Process in some jurisdictions.' },
    { type: 'Encryption software', desc: 'Software having the characteristics of, or performing or simulating the functions of the equipment controlled by 5A002. Includes both encryption libraries and complete encrypted communication applications when not qualifying for mass-market exclusion.', listNum: '5D002', dualUse: 'Category 5 Part 2', licensing: 'License required unless mass-market exclusion (Note 3) applies. Open-source encryption generally excluded.' },
    { type: 'Information security testing equipment', desc: 'Equipment for testing, inspecting, or evaluating information security systems. Includes penetration testing tools, vulnerability scanners, and protocol analysis equipment when specially designed for evaluating encryption implementations.', listNum: '5B002', dualUse: 'Category 5 Part 2', licensing: 'License may be required depending on capabilities.' },
    { type: 'Wireless interception equipment', desc: 'Equipment specially designed or modified for monitoring the radio-frequency spectrum for intelligence purposes, including GSM/LTE interception equipment (IMSI catchers), satellite communication interception systems, and Wi-Fi surveillance equipment.', listNum: '5A001.b-i', dualUse: 'Category 5 Part 2', licensing: 'License required. End-use scrutiny for human rights considerations.' },
    { type: 'Quantum key distribution (QKD)', desc: 'Systems and equipment for quantum key distribution. Includes quantum random number generators and quantum communication systems when designed for cryptographic key exchange.', listNum: '5A002 (QKD)', dualUse: 'Category 5 Part 2', licensing: 'License may be required. Emerging technology with evolving control status.' },
    { type: 'Side-channel analysis tools', desc: 'Equipment and software designed for side-channel analysis of cryptographic implementations, including power analysis, electromagnetic analysis, timing analysis, and fault injection tools when designed for extracting cryptographic keys.', listNum: '5B002 (side-channel)', dualUse: 'Category 5 Part 2', licensing: 'License may be required depending on capability and end-use.' },
    { type: 'Mobile device forensics', desc: 'Software and equipment designed for extracting data from mobile devices, including tools that bypass device security measures to access encrypted storage, communications logs, or location data.', listNum: '5A001.j (mobile)', dualUse: 'Category 5 Part 2', licensing: 'License may be required. Particularly scrutinized for human rights end-use.' },
    { type: 'Network protocol analysis', desc: 'Equipment for analysis and reconstruction of network protocols and data at scale. Includes systems designed for lawful interception compliance, network forensics, and traffic analysis when operating at ISP-scale or above.', listNum: '5A001.j (protocol)', dualUse: 'Category 5 Part 2', licensing: 'License assessment required based on scale and capability.' },
    { type: 'Submarine cable interception', desc: 'Equipment designed for the interception of communications transiting submarine fiber optic cable systems, including optical splitters, amplifiers, and associated processing equipment designed for intelligence collection.', listNum: '5A001 (submarine)', dualUse: 'Category 5 Part 2', licensing: 'Highly controlled. License required for all exports.' },
    { type: 'Satellite surveillance', desc: 'Equipment designed for the interception of satellite communications, including ground station equipment for intelligence collection from commercial and government satellite systems.', listNum: '5A001 (satellite)', dualUse: 'Category 5 Part 2', licensing: 'Highly controlled. License required for all exports.' },
  ];

  const insertControls = db.transaction(() => {
    for (const ctrl of controls) {
      insertExportControl.run(
        'Wassenaar Arrangement',
        ctrl.type,
        ctrl.desc,
        ctrl.listNum,
        ctrl.dualUse,
        ctrl.licensing,
        participatingStates,
        'https://www.wassenaar.org/control-lists/'
      );
    }
  });
  insertControls();

  // Key articles about the arrangement itself
  const articles = [
    { num: 'Purpose', title: 'Purpose of the Wassenaar Arrangement', content: 'The Wassenaar Arrangement has been established to contribute to regional and international security and stability, by promoting transparency and greater responsibility in transfers of conventional arms and dual-use goods and technologies, thus preventing destabilising accumulations. Participating States seek, through their national policies, to ensure that transfers of these items do not contribute to the development or enhancement of military capabilities which undermine these goals, and are not diverted to support such capabilities.', ch: 'Framework', part: null, kw: 'purpose,dual-use,transparency,responsibility,stability' },
    { num: 'Cat5P2 Overview', title: 'Category 5 Part 2 — Information Security overview', content: 'Category 5 Part 2 of the Wassenaar Arrangement Dual-Use List covers Information Security items, including: cryptographic systems and components (5A002); cryptanalytic items (5A004); IP network surveillance systems (5A001.j); intrusion software (within 5D001); and related test, inspection, and production equipment. The category has been amended multiple times, notably in 2013 (adding IP surveillance and intrusion software controls) and 2017 (narrowing intrusion software definition after criticism from security researchers). Mass-market encryption exclusion (Note 3 to Category 5 Part 2) exempts widely available consumer encryption products.', ch: 'Category 5 Part 2', part: null, kw: 'Category 5,information security,dual-use list,amendments,mass-market' },
    { num: '2013 Amendment', title: '2013 Plenary — intrusion software and IP surveillance', content: 'The 2013 Wassenaar Plenary agreed to add controls on intrusion software and IP network communications surveillance systems. This was driven by concerns about export of surveillance technology to authoritarian regimes. The intrusion software definition initially attracted criticism from the security research community for potentially covering legitimate vulnerability research tools and penetration testing software.', ch: 'Amendments', part: null, kw: '2013 amendment,intrusion software,IP surveillance,authoritarian regimes,security research' },
    { num: '2017 Amendment', title: '2017 Plenary — narrowed intrusion software definition', content: 'The 2017 Wassenaar Plenary agreed to narrow the definition of intrusion software following extensive feedback from the cybersecurity community. The revised controls excluded: software designed for system administration or security testing; software used for vulnerability analysis by the operator of the system; and software used for security research. This addressed concerns that the original controls would hamper legitimate security research and vulnerability disclosure.', ch: 'Amendments', part: null, kw: '2017 amendment,narrowed definition,security research exemption,vulnerability disclosure' },
  ];

  const insertArticlesTransaction = db.transaction(() => {
    for (const art of articles) {
      insertArticle.run(srcId, art.num, art.title, art.content, art.ch, art.part, art.kw);
    }
  });
  insertArticlesTransaction();

  console.log(`    Wassenaar Arrangement: ${controls.length} export controls, ${articles.length} articles`);
}
