import type Database from 'better-sqlite3';
import { searchCybersecurityLaw } from './search-cybersecurity-law.js';
import { getTreatyArticle } from './get-treaty-article.js';
import { getTreaty } from './get-treaty.js';
import { listSources } from './list-sources.js';
import { about } from './about.js';
import { checkDataFreshness } from './check-data-freshness.js';
import { getNationalCyberStrategy } from './get-national-cyber-strategy.js';
import { compareNationalStrategies } from './compare-national-strategies.js';
import { getIncidentReportingRequirements } from './get-incident-reporting-requirements.js';
import { getAttributionFramework } from './get-attribution-framework.js';
import { mapCyberNorms } from './map-cyber-norms.js';
import { getExportControls } from './get-export-controls.js';
import { buildLegalStance } from './build-legal-stance.js';
import { validateCitation } from './validate-citation.js';

export const TOOL_DEFINITIONS = [
  {
    name: 'search_cybersecurity_law',
    description: 'Full-text search across all cybersecurity law articles, treaty provisions, and Tallinn Manual rules',
    inputSchema: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'Search query (e.g., "illegal access", "state responsibility", "incident reporting")' },
        source_type: { type: 'string', description: 'Filter by source type: treaty, manual, norm, strategy, executive_order, export_control, policy, declaration' },
        limit: { type: 'number', description: 'Max results (default 10)' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_treaty_article',
    description: 'Get a specific article from a treaty or manual by source ID and article number',
    inputSchema: {
      type: 'object' as const,
      properties: {
        source_id: { type: 'number', description: 'Source ID (use list_sources to find IDs)' },
        article_number: { type: 'string', description: 'Article number (e.g., "2", "14", "Rule 71")' },
      },
      required: ['source_id', 'article_number'],
    },
  },
  {
    name: 'get_treaty',
    description: 'Get full treaty/convention metadata with article count and chapter breakdown',
    inputSchema: {
      type: 'object' as const,
      properties: {
        source_id: { type: 'number', description: 'Source ID' },
        short_title: { type: 'string', description: 'Short title (e.g., "Budapest Convention", "Tallinn Manual 2.0")' },
      },
    },
  },
  {
    name: 'list_sources',
    description: 'List all available data sources with record counts per source',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'about',
    description: 'Server metadata, data coverage, and disclaimer',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'check_data_freshness',
    description: 'Check database build date, schema version, and record counts',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'get_national_cyber_strategy',
    description: 'Get a national cybersecurity strategy by country code or country name',
    inputSchema: {
      type: 'object' as const,
      properties: {
        country_code: { type: 'string', description: 'ISO 3166-1 alpha-2 country code (e.g., "US", "DE", "EE")' },
        country_name: { type: 'string', description: 'Country name (e.g., "Estonia", "United States")' },
      },
    },
  },
  {
    name: 'compare_national_strategies',
    description: 'Compare cybersecurity strategies of two or more countries side by side',
    inputSchema: {
      type: 'object' as const,
      properties: {
        country_codes: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of ISO 3166-1 alpha-2 country codes (e.g., ["US", "EE", "SG"])',
        },
      },
      required: ['country_codes'],
    },
  },
  {
    name: 'get_incident_reporting_requirements',
    description: 'Search for incident reporting obligations across treaties and conventions',
    inputSchema: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'Optional narrowing query (e.g., "critical infrastructure", "CSIRT")' },
        limit: { type: 'number', description: 'Max results (default 20)' },
      },
    },
  },
  {
    name: 'get_attribution_framework',
    description: 'Get state attribution rules from the Tallinn Manual and related sources',
    inputSchema: {
      type: 'object' as const,
      properties: {
        topic: { type: 'string', description: 'Optional topic filter (e.g., "state responsibility", "due diligence", "self-defense")' },
      },
    },
  },
  {
    name: 'map_cyber_norms',
    description: 'Get international cyber norms by category (sovereignty, due diligence, cooperation, human rights, critical infrastructure, confidence building, capacity building)',
    inputSchema: {
      type: 'object' as const,
      properties: {
        category: { type: 'string', description: 'Norm category: sovereignty, due_diligence, cooperation, human_rights, critical_infrastructure, confidence_building, capacity_building, international_law' },
        status: { type: 'string', description: 'Filter by status (e.g., "consensus", "voluntary")' },
      },
    },
  },
  {
    name: 'get_export_controls',
    description: 'Search export control regimes by item, category, or regime name',
    inputSchema: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'Search query (e.g., "intrusion software", "encryption", "IP surveillance")' },
        regime: { type: 'string', description: 'Filter by regime (e.g., "Wassenaar Arrangement")' },
      },
    },
  },
  {
    name: 'build_legal_stance',
    description: 'Aggregate provisions across all sources for a cybersecurity law question (e.g., "Is hacking back legal?", "What are state obligations for critical infrastructure protection?")',
    inputSchema: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'Legal question or topic' },
        limit: { type: 'number', description: 'Max results per category (default 5)' },
      },
      required: ['query'],
    },
  },
  {
    name: 'validate_citation',
    description: 'Validate a citation to a specific treaty article (e.g., "Article 2, Budapest Convention")',
    inputSchema: {
      type: 'object' as const,
      properties: {
        citation: { type: 'string', description: 'Citation string (e.g., "Article 2, Budapest Convention", "Rule 71, Tallinn Manual")' },
      },
      required: ['citation'],
    },
  },
];

export function handleToolCall(db: Database.Database, name: string, args: Record<string, unknown>) {
  switch (name) {
    case 'search_cybersecurity_law':
      return searchCybersecurityLaw(db, args as any);
    case 'get_treaty_article':
      return getTreatyArticle(db, args as any);
    case 'get_treaty':
      return getTreaty(db, args as any);
    case 'list_sources':
      return listSources(db);
    case 'about':
      return about(db);
    case 'check_data_freshness':
      return checkDataFreshness(db);
    case 'get_national_cyber_strategy':
      return getNationalCyberStrategy(db, args as any);
    case 'compare_national_strategies':
      return compareNationalStrategies(db, args as any);
    case 'get_incident_reporting_requirements':
      return getIncidentReportingRequirements(db, args as any);
    case 'get_attribution_framework':
      return getAttributionFramework(db, args as any);
    case 'map_cyber_norms':
      return mapCyberNorms(db, args as any);
    case 'get_export_controls':
      return getExportControls(db, args as any);
    case 'build_legal_stance':
      return buildLegalStance(db, args as any);
    case 'validate_citation':
      return validateCitation(db, args as any);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
