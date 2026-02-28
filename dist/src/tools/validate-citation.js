export function validateCitation(db, args) {
    const citation = args.citation.trim();
    // Parse citation patterns:
    // "Article 2, Budapest Convention" / "Art. 2, Budapest Convention"
    // "Rule 71, Tallinn Manual" / "Rule 71 Tallinn Manual"
    // "Principle 1, Paris Call"
    const patterns = [
        /^(?:Article|Art\.?)\s+(\d+)\s*[,.]?\s*(.+)$/i,
        /^(?:Rule)\s+(\d+)\s*[,.]?\s*(.+)$/i,
        /^(?:Principle)\s+(\d+)\s*[,.]?\s*(.+)$/i,
        /^(?:Section|Sec\.?)\s+(\d+)\s*[,.]?\s*(.+)$/i,
        /^(.+?)\s+(?:Article|Art\.?)\s+(\d+)$/i,
    ];
    let articleNum = null;
    let sourceRef = null;
    for (const pattern of patterns) {
        const match = citation.match(pattern);
        if (match) {
            if (pattern === patterns[patterns.length - 1]) {
                // Last pattern has reversed groups
                sourceRef = match[1].trim();
                articleNum = match[2].trim();
            }
            else {
                articleNum = match[1].trim();
                sourceRef = match[2].trim();
            }
            break;
        }
    }
    if (!articleNum || !sourceRef) {
        return {
            valid: false,
            parsed: null,
            error: `Could not parse citation: "${citation}". Expected format: "Article N, Source Name" or "Rule N, Source Name"`,
            _meta: {
                disclaimer: 'Cybersecurity law data is for reference purposes only. Tallinn Manual content is summarized, not verbatim (Cambridge University Press). Treaties may have reservations by individual states. Not legal advice.',
                data_source: 'Ansvar International Cybersecurity Law Database',
                freshness: 'unknown',
            },
        };
    }
    // Find source
    const source = db.prepare(`
    SELECT * FROM sources
    WHERE short_title LIKE ? OR title LIKE ?
  `).get(`%${sourceRef}%`, `%${sourceRef}%`);
    if (!source) {
        return {
            valid: false,
            parsed: { article_number: articleNum, source_reference: sourceRef },
            error: `Source not found: "${sourceRef}"`,
            available_sources: db.prepare('SELECT short_title FROM sources ORDER BY short_title').all(),
            _meta: {
                disclaimer: 'Cybersecurity law data is for reference purposes only. Tallinn Manual content is summarized, not verbatim (Cambridge University Press). Treaties may have reservations by individual states. Not legal advice.',
                data_source: 'Ansvar International Cybersecurity Law Database',
                freshness: 'unknown',
            },
        };
    }
    // Find article — try exact match first, then with prefix
    let article = db.prepare(`
    SELECT * FROM articles WHERE source_id = ? AND article_number = ?
  `).get(source.id, articleNum);
    if (!article) {
        // Try with "Article " prefix or "Rule " prefix
        const prefixes = ['Article ', 'Rule ', 'Principle ', 'Section '];
        for (const prefix of prefixes) {
            article = db.prepare(`
        SELECT * FROM articles WHERE source_id = ? AND article_number = ?
      `).get(source.id, `${prefix}${articleNum}`);
            if (article)
                break;
        }
    }
    if (!article) {
        // Try LIKE match
        article = db.prepare(`
      SELECT * FROM articles WHERE source_id = ? AND article_number LIKE ?
    `).get(source.id, `%${articleNum}%`);
    }
    const metadata = db.prepare("SELECT value FROM db_metadata WHERE key = 'build_date'").get();
    if (!article) {
        const availableArticles = db.prepare(`
      SELECT article_number FROM articles WHERE source_id = ? ORDER BY id LIMIT 20
    `).all(source.id);
        return {
            valid: false,
            parsed: { article_number: articleNum, source_reference: sourceRef, source_id: source.id },
            error: `Article "${articleNum}" not found in "${source.short_title}"`,
            available_articles: availableArticles,
            source_status: source.status,
            _meta: {
                disclaimer: 'Cybersecurity law data is for reference purposes only. Tallinn Manual content is summarized, not verbatim (Cambridge University Press). Treaties may have reservations by individual states. Not legal advice.',
                data_source: 'Ansvar International Cybersecurity Law Database',
                freshness: metadata?.value ?? 'unknown',
            },
        };
    }
    return {
        valid: true,
        parsed: {
            article_number: article.article_number,
            source_title: source.short_title,
            source_id: source.id,
        },
        article: {
            id: article.id,
            article_number: article.article_number,
            title: article.title,
            chapter: article.chapter,
            part: article.part,
        },
        source_status: source.status,
        formatted_citation: `${article.article_number}, ${source.short_title}`,
        _meta: {
            disclaimer: 'Cybersecurity law data is for reference purposes only. Tallinn Manual content is summarized, not verbatim (Cambridge University Press). Treaties may have reservations by individual states. Not legal advice.',
            data_source: 'Ansvar International Cybersecurity Law Database',
            freshness: metadata?.value ?? 'unknown',
        },
    };
}
