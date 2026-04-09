#!/usr/bin/env node
import { createServer as createHttpServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import Database from 'better-sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { TOOL_DEFINITIONS, handleToolCall } from './tools/registry.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.PORT || '3000', 10);
const SERVER_NAME = 'international-cybersecurity-law-mcp';
const VERSION = '0.1.0';
function createMCPServer() {
    const resolvedPath = join(__dirname, '..', '..', 'data', 'database.db');
    const db = new Database(resolvedPath, { readonly: true });
    const server = new Server({ name: SERVER_NAME, version: VERSION }, { capabilities: { tools: {} } });
    server.setRequestHandler(ListToolsRequestSchema, async () => ({
        tools: TOOL_DEFINITIONS,
    }));
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;
        try {
            const result = handleToolCall(db, name, args ?? {});
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            let data_age = 'unknown';
            try {
                const meta = db.prepare("SELECT value FROM db_metadata WHERE key = 'build_date'").get();
                data_age = meta?.value ?? 'unknown';
            }
            catch { /* ignore */ }
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            error: message,
                            _error_type: 'tool_error',
                            _meta: {
                                disclaimer: 'Cybersecurity law data is for reference purposes only. Tallinn Manual content is summarized, not verbatim (Cambridge University Press). Treaties may have reservations by individual states. Not legal advice.',
                                data_source: 'Ansvar International Cybersecurity Law Database',
                                data_age,
                            },
                        }, null, 2),
                    },
                ],
                isError: true,
            };
        }
    });
    return server;
}
async function main() {
    const sessions = new Map();
    const httpServer = createHttpServer(async (req, res) => {
        const url = new URL(req.url || '/', `http://localhost:${PORT}`);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, mcp-session-id');
        res.setHeader('Access-Control-Expose-Headers', 'mcp-session-id');
        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }
        if (url.pathname === '/health' && req.method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'ok', server: SERVER_NAME }));
            return;
        }
        if (url.pathname === '/mcp') {
            const sessionId = req.headers['mcp-session-id'];
            if (sessionId && sessions.has(sessionId)) {
                await sessions.get(sessionId).handleRequest(req, res);
                return;
            }
            if (req.method === 'POST') {
                const transport = new StreamableHTTPServerTransport({
                    sessionIdGenerator: () => randomUUID(),
                });
                const server = createMCPServer();
                await server.connect(transport);
                transport.onclose = () => {
                    if (transport.sessionId)
                        sessions.delete(transport.sessionId);
                };
                await transport.handleRequest(req, res);
                if (transport.sessionId)
                    sessions.set(transport.sessionId, transport);
                return;
            }
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Bad request' }));
            return;
        }
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
    });
    httpServer.listen(PORT, () => {
        console.log(`[${SERVER_NAME}] HTTP server listening on port ${PORT}`);
    });
    const shutdown = () => {
        for (const [, t] of sessions)
            t.close().catch(() => { });
        sessions.clear();
        httpServer.close(() => process.exit(0));
        setTimeout(() => process.exit(1), 5000);
    };
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
}
main().catch((err) => {
    console.error('Fatal:', err);
    process.exit(1);
});
