import { CallToolRequestSchema, Result } from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';

export type ToolHandlers = Record<string, (request: z.infer<typeof CallToolRequestSchema>) => Promise<Result>>;
