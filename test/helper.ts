import { expect } from 'vitest';

export interface MockCallToolRequest {
  jsonrpc: string;
  id: string;
  method: 'tools/call';
  params: {
    name: string;
    _meta?: any;
    arguments?: Record<string, any>;
  };
}

export interface ToolResultContentItem {
  type: string;
  text: string;
}

export interface ToolResponse {
  isError?: boolean;
  content: ToolResultContentItem[];
}

/**
 * Creates a mock MCP tool request
 * @param toolName Name of the tool to call
 * @param input Input parameters for the tool
 * @returns A mock CallToolRequest object
 */
export function createMockToolRequest(toolName: string, input: Record<string, any>): MockCallToolRequest {
  return {
    jsonrpc: '2.0',
    id: 'test-id',
    method: 'tools/call',
    params: {
      name: toolName,
      arguments: input,
    },
  };
}

/**
 * Creates a mock API error response
 * @param message Error message
 * @param code HTTP status code (default: 400)
 * @returns A mock error response object
 */
export function createErrorResponse(message: string, code = 400) {
  return {
    success: false,
    error: [{ message, code }],
    message: [],
    result: null,
  };
}

/**
 * Verify the structure of a tool response
 * @param response The response to verify
 * @param isError Whether the response should be an error
 * @param skipIsErrorCheck Whether to skip checking the isError property
 */
export function verifyToolResponse(response: any, isError = false, skipIsErrorCheck = false): void {
  // Type assertion - assume this structure for testing purposes
  const toolResponse = response as ToolResponse;

  expect(toolResponse).toHaveProperty('content');
  expect(Array.isArray(toolResponse.content)).toBe(true);

  // Only check isError if we're not skipping that check
  if (!skipIsErrorCheck) {
    if (isError) {
      expect(toolResponse.isError).toBe(true);
    } else {
      expect(toolResponse.isError).toBeFalsy();
    }
  }
}
