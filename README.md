# International Cybersecurity Law MCP

> Structured access to international cybersecurity treaties, norms, national strategies, and export controls — 380 records from 13 authoritative sources.

[![npm](https://img.shields.io/npm/v/@ansvar/international-cybersecurity-law-mcp)](https://www.npmjs.com/package/@ansvar/international-cybersecurity-law-mcp)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![CI](https://github.com/Ansvar-Systems/international-cybersecurity-law-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/Ansvar-Systems/international-cybersecurity-law-mcp/actions/workflows/ci.yml)

## Quick Start

### Remote (Vercel)

Use the hosted endpoint — no installation needed:

**Claude Desktop** (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "international-cybersecurity-law": {
      "url": "https://international-cybersecurity-law-mcp.vercel.app/mcp"
    }
  }
}
```

**Cursor / VS Code** (`.cursor/mcp.json` or `.vscode/mcp.json`):
```json
{
  "servers": {
    "international-cybersecurity-law": {
      "url": "https://international-cybersecurity-law-mcp.vercel.app/mcp"
    }
  }
}
```

### Local (npm)

Run entirely on your machine:

```bash
npx @ansvar/international-cybersecurity-law-mcp
```

**Claude Desktop** (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "international-cybersecurity-law": {
      "command": "npx",
      "args": ["-y", "@ansvar/international-cybersecurity-law-mcp"]
    }
  }
}
```

## What's Included

| Source | Authority | Items | Completeness |
|--------|-----------|------:|-------------|
| Budapest Convention (2001) | Council of Europe | 48 | Full |
| UN Cybercrime Convention (2024) | UNODC | 62 | Full |
| Tallinn Manual 2.0 (2017) | NATO CCDCOE | 154 | Summaries only |
| UN GGE/OEWG Norms | UN General Assembly | 24 | Full |
| NATO Cyber Defence Policy | NATO | 12 | Partial |
| EU Cyber Diplomacy Toolbox | Council of the EU | 10 | Partial |
| US Executive Orders | US Government | 24 | Partial |
| Wassenaar Arrangement Cat. 5.2 | Wassenaar Secretariat | 15 | Partial |
| National Cyber Strategies | Multiple governments | 54 | Metadata only |

**Total:** 380 records across 13 sources, 432KB database

## What's NOT Included

- Tallinn Manual 2.0 full text (copyrighted by Cambridge University Press — summaries only)
- National strategy full documents (metadata and key objectives only)
- Budapest Convention Additional Protocols as separate entries
- EU NIS2 Directive (covered by `comprehensive-eu-law-mcp`)

See [COVERAGE.md](COVERAGE.md) for full gap analysis and limitations.

## Available Tools

| Tool | Category | Description |
|------|----------|-------------|
| `search_cybersecurity_law` | Search | FTS5 search across all articles and provisions |
| `get_treaty_article` | Lookup | Get a specific article by source ID and number |
| `get_treaty` | Lookup | Get treaty metadata with chapter breakdown |
| `get_national_cyber_strategy` | Lookup | Get strategy by country code or name |
| `compare_national_strategies` | Analysis | Compare strategies across countries |
| `get_incident_reporting_requirements` | Search | Find incident reporting obligations |
| `get_attribution_framework` | Analysis | State attribution rules from Tallinn Manual |
| `map_cyber_norms` | Lookup | International cyber norms by category |
| `get_export_controls` | Lookup | Search Wassenaar export controls |
| `build_legal_stance` | Analysis | Aggregate provisions for a legal question |
| `validate_citation` | Meta | Validate a citation against the database |
| `list_sources` | Meta | List all sources with metadata |
| `about` | Meta | Server identity and stats |
| `check_data_freshness` | Meta | Database build date and record counts |

See [TOOLS.md](TOOLS.md) for full documentation with parameters and examples.

## Data Sources & Freshness

All data is sourced from authoritative international bodies:

| Source | Refresh Schedule | Last Refresh |
|--------|-----------------|-------------|
| Budapest Convention | Monthly | 2026-02-28 |
| UN Cybercrime Convention | Monthly | 2026-02-28 |
| Tallinn Manual 2.0 | On change | 2026-02-28 |
| UN GGE/OEWG | On change | 2026-02-28 |
| NATO/EU Policy | On change | 2026-02-28 |
| US Executive Orders | On change | 2026-02-28 |
| Wassenaar Arrangement | Annual | 2026-02-28 |
| National Strategies | Quarterly | 2026-02-28 |

Check freshness programmatically with the `check_data_freshness` tool.

## Security

| Layer | Tool | Trigger |
|-------|------|---------|
| Static Analysis | CodeQL | Weekly + PR |
| Pattern Detection | Semgrep | PR |
| Dependency Scan | Trivy | Weekly |
| Secret Detection | Gitleaks | PR |
| Supply Chain | OSSF Scorecard | Weekly |
| Dependencies | Dependabot | Weekly |

## Disclaimer

**This is NOT legal advice.** This tool provides structured access to international cybersecurity law data for informational and research purposes only. Tallinn Manual content is summarized, not reproduced verbatim (Cambridge University Press copyright). Treaties may have reservations by individual states. Always verify critical data against authoritative sources. See [DISCLAIMER.md](DISCLAIMER.md).

## Ansvar MCP Network

This server is part of the **Ansvar MCP Network** — 150+ MCP servers providing structured access to global legislation, compliance frameworks, and cybersecurity standards.

| Category | Servers | Examples |
|----------|---------|---------|
| EU Regulations | 1 | 49 regulations, 2,693 articles |
| US Regulations | 1 | 15 federal + state laws |
| National Law | 108+ | All EU/EEA + 30 global jurisdictions |
| Security Frameworks | 1 | 261 frameworks, 1,451 controls |
| Domain Intelligence | 6+ | Financial regulation, cybersecurity law, health law |

Explore the full network at [ansvar.ai/mcp](https://ansvar.ai/mcp)

## Development

### Branch Strategy

```
feature-branch -> PR to dev -> verify on dev -> PR to main -> deploy
```

Never push directly to `main`. All changes land on `dev` first.

### Setup

```bash
git clone https://github.com/Ansvar-Systems/international-cybersecurity-law-mcp.git
cd international-cybersecurity-law-mcp
npm install
npm run build:db
npm run build
npm test
```

### Data Pipeline

```bash
npm run ingest          # Full live ingestion
npm run build:db        # Rebuild database from seed files
npm run freshness:check # Check source freshness
npm run coverage:verify # Verify coverage consistency
npm run test:contract   # Run golden contract tests
```

## License

[Apache License 2.0](LICENSE) — Code and tooling.

**Data licenses:** Regulatory data is sourced from official publications by international bodies (Council of Europe, UN, NATO, Wassenaar Arrangement). Tallinn Manual summaries are provided under fair use; full text requires purchase from Cambridge University Press. Verify redistribution terms with each authority before bulk replication. See [sources.yml](sources.yml) for details.
