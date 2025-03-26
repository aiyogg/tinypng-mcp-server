import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { TOOL_HANDLERS } from '../src/tools';
import { createMockToolRequest, verifyToolResponse } from './helper';
import './setup';

describe('compress_local_image', () => {
  it('should compress the image', async () => {
    const request = createMockToolRequest('compress_local_image', {
      imagePath: path.join(__dirname, 'mocks/images/original.png'),
      outputPath: path.join(__dirname, 'mocks/output/original_compressed.png'),
    });
    const result = await TOOL_HANDLERS.compress_local_image(request);
    verifyToolResponse(result);
    // @ts-ignore
    expect(result.content).toHaveLength(1);
    // @ts-ignore
    expect(result.content[0].type).toBe('text');
    // @ts-ignore
    expect(result.content[0].text).toContain('compressionRatio');
  }, 10000);

  it('should compress the image and format with webp', async () => {
    const request = createMockToolRequest('compress_local_image', {
      imagePath: path.join(__dirname, 'mocks/images/original.png'),
      outputFormat: 'webp',
      outputPath: path.join(__dirname, 'mocks/output/original_compressed.webp'),
    });
    const result = await TOOL_HANDLERS.compress_local_image(request);
    verifyToolResponse(result);
    // @ts-ignore
    expect(result.content).toHaveLength(1);
    // @ts-ignore
    expect(result.content[0].type).toBe('text');
    // @ts-ignore
    expect(result.content[0].text).toContain('compressionRatio');
    // @ts-ignore
    expect(path.extname(path.join(__dirname, 'mocks/images/original_compressed.webp'))).toBe('.webp');
  }, 10000);
});
