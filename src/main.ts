import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { TOOLS, TOOL_HANDLERS } from './tools.js';
import { log } from './utils/helpers.js';

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
  return { tools: TOOLS };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const toolName = request.params.name;
  log('Received call tool request, toolName:', toolName);

  try {
    return await TOOL_HANDLERS[toolName](request);
  } catch (error) {
    log('Error handling tool call:', error);
    return {
      toolResult: {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      },
    };
  }
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
