-- International Cybersecurity Law MCP Database Schema
-- Version 1.0

-- Treaties, conventions, manuals, strategies, executive orders
CREATE TABLE sources (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  short_title TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('treaty', 'manual', 'norm', 'strategy', 'executive_order', 'export_control', 'policy', 'declaration')),
  organization TEXT NOT NULL,
  adoption_date TEXT,
  entry_into_force_date TEXT,
  status TEXT DEFAULT 'in_force',
  signatories_count INTEGER,
  url TEXT,
  notes TEXT
);

-- Individual articles/rules/provisions within sources
CREATE TABLE articles (
  id INTEGER PRIMARY KEY,
  source_id INTEGER NOT NULL REFERENCES sources(id),
  article_number TEXT NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  chapter TEXT,
  part TEXT,
  keywords TEXT
);

-- National cybersecurity strategies
CREATE TABLE national_strategies (
  id INTEGER PRIMARY KEY,
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  strategy_name TEXT NOT NULL,
  publication_date TEXT,
  version TEXT,
  key_objectives TEXT,
  responsible_authority TEXT,
  budget_allocation TEXT,
  url TEXT
);

-- Cyber norms (GGE/OEWG)
CREATE TABLE cyber_norms (
  id INTEGER PRIMARY KEY,
  source_id INTEGER NOT NULL REFERENCES sources(id),
  norm_number TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('sovereignty', 'due_diligence', 'cooperation', 'human_rights', 'critical_infrastructure', 'confidence_building', 'capacity_building', 'international_law')),
  status TEXT DEFAULT 'consensus',
  supporting_states TEXT
);

-- Export control regimes
CREATE TABLE export_controls (
  id INTEGER PRIMARY KEY,
  regime TEXT NOT NULL,
  control_type TEXT NOT NULL,
  item_description TEXT NOT NULL,
  control_list_number TEXT,
  dual_use_category TEXT,
  licensing_requirements TEXT,
  participating_states TEXT,
  url TEXT
);

-- Metadata
CREATE TABLE db_metadata (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- Full-text search on articles
CREATE VIRTUAL TABLE articles_fts USING fts5(
  article_number, title, content,
  content='articles',
  content_rowid='id',
  tokenize='unicode61'
);

-- Full-text search on national strategies
CREATE VIRTUAL TABLE strategies_fts USING fts5(
  country_name, strategy_name, key_objectives,
  content='national_strategies',
  content_rowid='id',
  tokenize='unicode61'
);

-- Indexes
CREATE INDEX idx_sources_type ON sources(source_type);
CREATE INDEX idx_sources_status ON sources(status);
CREATE INDEX idx_articles_source_id ON articles(source_id);
CREATE INDEX idx_articles_chapter ON articles(chapter);
CREATE INDEX idx_articles_part ON articles(part);
CREATE INDEX idx_strategies_country_code ON national_strategies(country_code);
CREATE INDEX idx_strategies_country_name ON national_strategies(country_name);
CREATE INDEX idx_norms_category ON cyber_norms(category);
CREATE INDEX idx_norms_source_id ON cyber_norms(source_id);
CREATE INDEX idx_export_controls_regime ON export_controls(regime);
CREATE INDEX idx_export_controls_type ON export_controls(control_type);
