import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { log } from './helpers.js';

const server = new Server(
  {
    name: 'tinypng',
    version: '1.0.0',
  },
  {
    capabilities: { tools: {} },
  },
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  log('Received list tools request');
  return { tools: [] };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  log('Received call tool request', request);
  return { result: 'success' };
});

export async function main() {
  log('Starting server...');
  try {
    const transport = new StdioServerTransport();
    log('Transport created');
    await server.connect(transport);
    log('Server connected');
  } catch (error) {
    log('Fatal error', error);
    process.exit(1);
  }
}
