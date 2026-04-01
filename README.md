# International Cybersecurity Law MCP

International Cybersecurity Law MCP -- treaties, norms, national strategies, export controls via Model Context Protocol.

## Public Endpoint (Streamable HTTP)

Connect from any MCP client (Claude Desktop, ChatGPT, Cursor, VS Code, GitHub Copilot):

```
https://mcp.ansvar.eu/intl-cybersecurity-law/mcp
```

**Claude Code:**
```bash
claude mcp add intl-cybersecurity-law --transport http https://mcp.ansvar.eu/intl-cybersecurity-law/mcp
```

**Claude Desktop / Cursor** (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "intl-cybersecurity-law": {
      "type": "url",
      "url": "https://mcp.ansvar.eu/intl-cybersecurity-law/mcp"
    }
  }
}
```

No authentication required.

## What's Included

| Source | Items | Status |
|--------|-------|--------|
| Budapest Convention on Cybercrime (ETS 185, 2001) | 48 articles | Full text |
| UN Convention against Cybercrime (2024) | 62 articles | Full text |
| Tallinn Manual 2.0 (2017) | 154 rules | Summaries only (copyright) |
| UN GGE 2015 Consensus Norms | 11 norms | Full descriptions |
| OEWG 2021/2023 Reports | 4 entries | Key outcomes |
| Paris Call for Trust and Security (2018) | 9 principles | Full text |
| NATO Cyber Defence Policy (2014-2023) | 12 provisions | Summarized |
| EU Cyber Diplomacy Toolbox (2017-2023) | 10 provisions | Framework + sanctions regime |
| US EO 14028 (2021) | 11 sections | Key sections |
| US EO 13800 (2017) | 8 sections | Key sections |
| CISA Act 2018 | 5 provisions | Key provisions |
| Wassenaar Arrangement -- Category 5 Part 2 | 15 items | Control descriptions + participating states |
| National Cybersecurity Strategies | 50+ countries | Strategy name, date, objectives, authority |

## What's NOT Included

| Gap | Reason |
|-----|--------|
| Full Tallinn Manual 2.0 text | Cambridge University Press copyright -- summaries only |
| Classified national cyber doctrines | Not publicly available |
| Bilateral cyber agreements | Not systematically published |
| IMO circulars on maritime cyber | Covered by maritime-law MCP |
| EU NIS2 / Cyber Resilience Act | Covered by EU Regulations MCP |

## Available Tools

See [TOOLS.md](TOOLS.md) for full documentation.

| Tool | Description |
|------|-------------|
| `search_legislation` | Full-text search across all cybersecurity treaties, norms, and strategies |
| `get_provision` | Retrieve full text of a specific provision |
| `list_sources` | List all data sources with provenance metadata |
| `validate_citation` | Validate a citation against the database (zero-hallucination check) |
| `build_legal_stance` | Build a set of citations for a legal question |
| `format_citation` | Format a citation per standard conventions |
| `check_currency` | Check whether a provision is currently in force |
| `about` | Server metadata, dataset statistics, data freshness |

## Data Sources and Freshness

All data is sourced from authoritative publications (Council of Europe Treaty Series, UN General Assembly resolutions, Wassenaar Arrangement public documents, national government publications, US Federal Register, NATO communiques, EU Council decisions). Use the `check_currency` tool to verify whether provisions are current. See [COVERAGE.md](COVERAGE.md) for detailed coverage information.

## Disclaimer

This MCP provides reference data only -- not professional legal advice. Always verify critical findings against authoritative sources. See [DISCLAIMER.md](DISCLAIMER.md).

## Ansvar MCP Network

Part of the [Ansvar MCP Network](https://ansvar.eu/open-law) -- 276+ specialist MCP servers covering 119 countries, 61 EU regulations, 262 security frameworks, 116 sector regulators, and 50+ domain-specific databases.

All endpoints: [mcp-remote-access.md](https://github.com/Ansvar-Systems/Ansvar-Architecture-Documentation/blob/main/docs/mcp-remote-access.md)

## License

Apache-2.0. See [LICENSE](LICENSE).
