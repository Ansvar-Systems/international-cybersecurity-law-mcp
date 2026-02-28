import { seedBudapestConvention } from './data/budapest-convention.js';
import { seedUnCybercrimeConvention } from './data/un-cybercrime-convention.js';
import { seedTallinnManual } from './data/tallinn-manual.js';
import { seedUnGgeOewg } from './data/un-gge-oewg.js';
import { seedParisCall } from './data/paris-call.js';
import { seedNatoCyber } from './data/nato-cyber.js';
import { seedWassenaar } from './data/wassenaar.js';
import { seedNationalStrategies } from './data/national-strategies.js';
import { seedUsExecutiveOrders } from './data/us-executive-orders.js';
import { seedEuCyberDiplomacy } from './data/eu-cyber-diplomacy.js';
export function seedData(db) {
    console.log('\nSeeding data...');
    // 1. Treaties and conventions
    seedBudapestConvention(db); // 48 articles (Budapest Convention on Cybercrime)
    seedUnCybercrimeConvention(db); // 62 articles (UN Convention against Cybercrime 2024)
    // 2. Academic manuals
    seedTallinnManual(db); // ~80 rules (summaries only — Cambridge UP copyright)
    // 3. Norms and declarations
    seedUnGgeOewg(db); // 11 GGE norms + articles + OEWG norms
    seedParisCall(db); // 9 principles
    // 4. Policy documents
    seedNatoCyber(db); // 12 NATO cyber policy articles
    seedEuCyberDiplomacy(db); // 10 EU Cyber Diplomacy Toolbox articles
    // 5. Executive orders and legislation
    seedUsExecutiveOrders(db); // EO 14028, EO 13800, CISA Act
    // 6. Export controls
    seedWassenaar(db); // 15 Wassenaar controls + 4 articles
    // 7. National strategies
    seedNationalStrategies(db); // 54 countries
    console.log('\nSeed data complete.');
}
