# International Cybersecurity Law MCP

A [Model Context Protocol](https://modelcontextprotocol.io) server providing structured access to international cybersecurity law: treaties, conventions, cyber norms, national strategies, export controls, and attribution frameworks.

## Purpose

This MCP server enables AI assistants and legal research tools to query a curated database of international cybersecurity law instruments. It supports citation validation, cross-source search, national strategy comparison, and legal stance synthesis.

## Tools

| Tool | Description |
|------|-------------|
| `about` | Server info, coverage summary, and record counts |
| `search_cybersecurity_law` | Full-text search across all sources |
| `get_treaty` | Retrieve treaty/convention metadata and structure |
| `get_treaty_article` | Retrieve a specific article or rule by source and number |
| `get_national_cyber_strategy` | Retrieve a country's national cybersecurity strategy |
| `compare_national_strategies` | Side-by-side comparison of multiple countries' strategies |
| `map_cyber_norms` | Browse UN GGE / OEWG / Paris Call norms by category |
| `get_attribution_framework` | Tallinn Manual rules and norms on attribution and state responsibility |
| `get_export_controls` | Wassenaar Arrangement dual-use cybersecurity export controls |
| `get_incident_reporting_requirements` | Articles on incident reporting, breach notification, CSIRT obligations |
| `build_legal_stance` | Synthesise treaty provisions, norms, and strategies around a legal question |
| `validate_citation` | Parse and validate a legal citation against the database |
| `check_data_freshness` | Database build date and schema version |
| `list_sources` | Full list of all indexed sources with article counts |

See [TOOLS.md](TOOLS.md) for full parameter documentation.

## Data Coverage

- **Treaties**: Budapest Convention (48 articles), UN Convention against Cybercrime (62 articles)
- **Manuals**: Tallinn Manual 2.0 — 154 rules (summaries only, Cambridge UP copyright)
- **Norms**: UN GGE 2015 (11 norms), OEWG 2021/2023 (4 entries), Paris Call (9 principles)
- **Policy**: NATO Cyber Defence Policy, EU Cyber Diplomacy Toolbox
- **Executive Orders**: US EO 14028, EO 13800, CISA Act 2018
- **Export Controls**: Wassenaar Arrangement Category 5 Part 2 (15 items)
- **National Strategies**: 50+ countries

See [COVERAGE.md](COVERAGE.md) for the full source list and [data/coverage.json](data/coverage.json) for machine-readable coverage metadata.

## Installation

### npm / Node.js

```bash
npm install -g @ansvar/international-cybersecurity-law-mcp
```

Run the stdio MCP server:

```bash
international-cybersecurity-law-mcp
```

Run the HTTP server:

```bash
node dist/http-server.js
# Listens on port 3000 by default (set PORT env var to override)
```

### Docker

```bash
docker build -t intl-cybersecurity-law-mcp .
docker run -p 3000:3000 intl-cybersecurity-law-mcp
```

## Connecting

### Claude Desktop (stdio)

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "international-cybersecurity-law": {
      "command": "international-cybersecurity-law-mcp"
    }
  }
}
```

### HTTP / Streamable Transport

Connect to `http://localhost:3000/mcp` using any MCP client that supports the Streamable HTTP transport.

### Azure Container Apps / Cloud Deployment

See [deploy-azure.yml](.github/workflows/deploy-azure.yml) for a reference deployment workflow.

## Disclaimer

> Cybersecurity law data is for **reference purposes only**. Tallinn Manual content is summarized, not reproduced verbatim (Cambridge University Press). Treaties may have reservations by individual states. **Not legal advice.**

See [DISCLAIMER.md](DISCLAIMER.md) and [PRIVACY.md](PRIVACY.md) for full terms.

## License

Apache-2.0 — see [LICENSE](LICENSE).
