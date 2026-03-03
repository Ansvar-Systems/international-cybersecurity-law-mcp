import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';
import path from 'path';
import { handleToolCall } from '../../src/tools/registry.js';

/**
 * Golden contract tests for international-cybersecurity-law-mcp.
 *
 * These tests run against the production database to verify that
 * all tools return correct results. They serve as a regression
 * safety net after data ingestion or schema changes.
 */
describe('Golden Contract Tests — Production Database', () => {
  let db: Database.Database;

  beforeAll(() => {
    const dbPath = path.resolve(__dirname, '../../data/database.db');
    db = new Database(dbPath, { readonly: true });
    db.pragma('foreign_keys = ON');
  });

  afterAll(() => {
    db.close();
  });

  // ── search (2) ──────────────────────────────────────────────────────

  it('search_cybersecurity_law returns results for "cybersecurity"', () => {
    const result = handleToolCall(db, 'search_cybersecurity_law', { query: 'cybersecurity' }) as any;
    expect(result.results).toBeDefined();
    expect(result.results.length).toBeGreaterThan(0);
    expect(result.count).toBeGreaterThan(0);
    expect(result._meta).toBeDefined();
    expect(result._meta.disclaimer).toBeTruthy();
  });

  it('search_cybersecurity_law returns results for "Budapest Convention"', () => {
    const result = handleToolCall(db, 'search_cybersecurity_law', {
      query: 'illegal access',
      source_type: 'treaty',
    }) as any;
    expect(result.results.length).toBeGreaterThan(0);
    // Should find Budapest Convention articles about illegal access
    const hasTreaty = result.results.some((r: any) => r.source_type === 'treaty');
    expect(hasTreaty).toBe(true);
  });

  // ── data_retrieval (3) ──────────────────────────────────────────────

  it('list_sources returns all 13 sources', () => {
    const result = handleToolCall(db, 'list_sources', {}) as any;
    expect(result.sources).toBeDefined();
    expect(result.sources.length).toBe(13);
    expect(result.totals.articles).toBe(287);
    expect(result.totals.national_strategies).toBe(54);
    expect(result.totals.cyber_norms).toBe(24);
    expect(result.totals.export_controls).toBe(15);
  });

  it('about returns valid format with name, version, stats', () => {
    const result = handleToolCall(db, 'about', {}) as any;
    expect(result.server).toBe('international-cybersecurity-law-mcp');
    expect(result.version).toBe('0.1.0');
    expect(result.record_counts).toBeDefined();
    expect(result.record_counts.sources).toBe(13);
    expect(result.record_counts.articles_and_rules).toBe(287);
    expect(result.record_counts.national_strategies).toBe(54);
    expect(result._meta).toBeDefined();
    expect(result._meta.disclaimer).toBeTruthy();
  });

  it('check_data_freshness returns build date and source breakdown', () => {
    const result = handleToolCall(db, 'check_data_freshness', {}) as any;
    expect(result.build_date).toBeTruthy();
    expect(result.build_date).not.toBe('unknown');
    expect(result.schema_version).toBe('1.0');
    expect(result.sources_by_type).toBeDefined();
    expect(result.sources_by_type.length).toBeGreaterThan(0);
    expect(result._meta).toBeDefined();
  });

  // ── treaty lookup (2) ─────────────────────────────────────────────

  it('get_treaty_article retrieves Budapest Convention Article 2', () => {
    const result = handleToolCall(db, 'get_treaty_article', {
      source_id: 1,
      article_number: 'Article 2',
    }) as any;
    expect(result.article).toBeDefined();
    expect(result.article.title).toBe('Illegal access');
    expect(result.article.content).toBeTruthy();
    expect(result._meta).toBeDefined();
  });

  it('get_treaty retrieves Budapest Convention metadata', () => {
    const result = handleToolCall(db, 'get_treaty', {
      short_title: 'Budapest Convention',
    }) as any;
    expect(result.source).toBeDefined();
    expect(result.source.short_title).toBe('Budapest Convention');
    expect(result.article_count).toBe(36);
    expect(result._meta).toBeDefined();
  });

  // ── national strategy (1) ────────────────────────────────────────

  it('get_national_cyber_strategy finds US strategy', () => {
    const result = handleToolCall(db, 'get_national_cyber_strategy', {
      country_code: 'US',
    }) as any;
    expect(result.strategy).toBeDefined();
    expect(result.strategy.country_code).toBe('US');
    expect(result.strategy.country_name).toBe('United States');
    expect(result.strategy.strategy_name).toBeTruthy();
    expect(result._meta).toBeDefined();
  });

  // ── cross_reference (1) ──────────────────────────────────────────

  it('build_legal_stance aggregates provisions for a question', () => {
    const result = handleToolCall(db, 'build_legal_stance', {
      query: 'critical infrastructure',
    }) as any;
    expect(result.total_results).toBeGreaterThan(0);
    expect(result.query).toBe('critical infrastructure');
    // Should find results in at least one category
    const hasAnyResults = (
      result.treaty_provisions.length > 0 ||
      result.manual_rules.length > 0 ||
      result.policy_provisions.length > 0 ||
      result.relevant_norms.length > 0 ||
      result.relevant_strategies.length > 0
    );
    expect(hasAnyResults).toBe(true);
    expect(result._meta).toBeDefined();
  });

  // ── negative tests (2) ──────────────────────────────────────────

  it('returns empty results for nonsensical search', () => {
    const result = handleToolCall(db, 'search_cybersecurity_law', {
      query: 'xyzzy9999qqq',
    }) as any;
    expect(result.results.length).toBe(0);
    expect(result.count).toBe(0);
  });

  it('throws for non-existent treaty article', () => {
    expect(() => {
      handleToolCall(db, 'get_treaty_article', {
        source_id: 1,
        article_number: 'Article 999',
      });
    }).toThrow();
  });

  // ── domain-specific tools (2) ───────────────────────────────────

  it('map_cyber_norms returns norms for sovereignty category', () => {
    const result = handleToolCall(db, 'map_cyber_norms', {
      category: 'sovereignty',
    }) as any;
    expect(result.norms).toBeDefined();
    expect(result.norms.length).toBeGreaterThan(0);
    expect(result.norms.every((n: any) => n.category === 'sovereignty')).toBe(true);
    expect(result._meta).toBeDefined();
  });

  it('get_export_controls returns Wassenaar encryption controls', () => {
    const result = handleToolCall(db, 'get_export_controls', {
      query: 'encryption',
    }) as any;
    expect(result.results).toBeDefined();
    expect(result.results.length).toBeGreaterThan(0);
    expect(result.results[0].regime).toBe('Wassenaar Arrangement');
    expect(result._meta).toBeDefined();
  });

  // ── validate_citation (1) ───────────────────────────────────────

  it('validate_citation confirms Article 2, Budapest Convention', () => {
    const result = handleToolCall(db, 'validate_citation', {
      citation: 'Article 2, Budapest Convention',
    }) as any;
    expect(result.valid).toBe(true);
    expect(result.parsed).toBeDefined();
    expect(result.article).toBeDefined();
    expect(result._meta).toBeDefined();
  });
});
