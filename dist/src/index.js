#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import Database from 'better-sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { TOOL_DEFINITIONS, handleToolCall } from './tools/registry.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
export function createServer(dbPath) {
    const resolvedPath = dbPath ?? join(__dirname, '..', '..', 'data', 'database.db');
    const db = new Database(resolvedPath, { readonly: true });
    const server = new Server({ name: 'international-cybersecurity-law-mcp', version: '0.1.0' }, { capabilities: { tools: {} } });
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
            return {
                content: [
                    {
                        type: 'text',
                        text: `Error: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
                isError: true,
            };
        }
    });
    return {
        server,
        db,
        getTools: () => TOOL_DEFINITIONS,
        callTool: (name, args) => {
            const result = handleToolCall(db, name, args);
            return result;
        },
        close: () => db.close(),
    };
}
// Main entry point (stdio mode)
const isMain = process.argv[1] && (process.argv[1].endsWith('index.js') ||
    process.argv[1].endsWith('index.ts'));
if (isMain) {
    const instance = createServer();
    const transport = new StdioServerTransport();
    instance.server.connect(transport).catch((err) => {
        console.error('Failed to connect:', err);
        process.exit(1);
    });
}
