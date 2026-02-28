import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { TOOL_DEFINITIONS, handleToolCall } from '../src/tools/registry.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

let db: import('better-sqlite3').Database | null = null;

function getDb(): import('better-sqlite3').Database {
  if (!db) {
    const tmpDir = '/tmp/international-cybersecurity-law-mcp';
    const tmpDb = join(tmpDir, 'database.db');

    if (!existsSync(tmpDb)) {
      if (!existsSync(tmpDir)) {
        mkdirSync(tmpDir, { recursive: true });
      }
      const sourceDb = join(__dirname, '..', 'data', 'database.db');
      copyFileSync(sourceDb, tmpDb);
    }

    const Database = require('better-sqlite3');
    db = new Database(tmpDb, { readonly: true });
  }
  return db!;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      server: 'international-cybersecurity-law-mcp',
      transport: 'streamable-http',
      tools: TOOL_DEFINITIONS.length,
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body;
  if (!body || !body.method) {
    return res.status(400).json({ error: 'Invalid JSON-RPC request' });
  }

  try {
    const database = getDb();

    if (body.method === 'initialize') {
      return res.status(200).json({
        jsonrpc: '2.0',
        id: body.id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: { tools: {} },
          serverInfo: { name: 'international-cybersecurity-law-mcp', version: '0.1.0' },
        },
      });
    }

    if (body.method === 'tools/list') {
      return res.status(200).json({
        jsonrpc: '2.0',
        id: body.id,
        result: { tools: TOOL_DEFINITIONS },
      });
    }

    if (body.method === 'tools/call') {
      const { name, arguments: args } = body.params;
      const result = handleToolCall(database, name, args ?? {});
      return res.status(200).json({
        jsonrpc: '2.0',
        id: body.id,
        result: {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        },
      });
    }

    return res.status(200).json({
      jsonrpc: '2.0',
      id: body.id,
      error: { code: -32601, message: `Method not found: ${body.method}` },
    });
  } catch (error) {
    return res.status(200).json({
      jsonrpc: '2.0',
      id: body?.id,
      error: {
        code: -32603,
        message: error instanceof Error ? error.message : String(error),
      },
    });
  }
}
