import { Tool } from '@modelcontextprotocol/sdk/types.js';
import fs from 'node:fs';
import path from 'path';
import tinify from 'tinify';
import { SupportedImageTypes } from 'tinify/lib/tinify/Source';
import { config } from './utils/helpers';
import { ToolHandlers } from './utils/types';

const SUPPORTED_IMAGE_TYPES: SupportedImageTypes[] = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
  'image/avif',
];

const COMPRESS_LOCAL_IMAGE_TOOL: Tool = {
  name: 'compress_local_image',
  description: 'Compress a local image file',
  inputSchema: {
    type: 'object',
    properties: {
      imagePath: {
        type: 'string',
        description: 'The ABSOLUTE path to the image file to compress',
        example: '/Users/user/Downloads/image.jpg',
      },
      outputPath: {
        type: 'string',
        description: 'The ABSOLUTE path to save the compressed image file',
        example: '/Users/user/Downloads/image_compressed.jpg',
      },
      outputFormat: {
        type: 'string',
        description: 'The format to save the compressed image file',
        enum: SUPPORTED_IMAGE_TYPES,
        example: 'image/jpeg',
      },
    },
    required: ['imagePath'],
  },
};

export const TOOLS = [COMPRESS_LOCAL_IMAGE_TOOL];

async function handleCompressLocalImageTool({
  imagePath,
  outputPath,
  outputFormat,
}: {
  imagePath: string;
  outputPath?: string;
  outputFormat?: SupportedImageTypes;
}) {
  const originalSize = fs.statSync(imagePath).size;
  tinify.key = config.apiKey!;
  const source = tinify.fromFile(imagePath);

  let ext = path.extname(imagePath).slice(1);

  if (outputFormat) {
    source.convert({
      type: outputFormat,
    });
    ext = outputFormat.split('/')[1];
  }

  let dest = outputPath;
  if (!dest) {
    const dir = path.dirname(imagePath);
    const basename = path.basename(imagePath, path.extname(imagePath));
    dest = path.join(dir, `${basename}.${ext}`);
  }

  // add _compressed to the filename
  const destDir = path.dirname(dest);
  const destBasename = path.basename(dest, path.extname(dest));
  if (!destBasename.endsWith('_compressed')) {
    dest = path.join(destDir, `${destBasename}_compressed.${ext}`);
  }

  await source.toFile(dest);

  const compressedSize = fs.statSync(dest).size;
  const compressionRatio = (originalSize - compressedSize) / originalSize;

  return {
    originalSize,
    compressedSize,
    compressionRatio,
  };
}

export const TOOL_HANDLERS: ToolHandlers = {
  compress_local_image: async (request) => {
    const result = await handleCompressLocalImageTool(
      request.params.arguments as {
        imagePath: string;
        outputPath?: string;
        outputFormat?: SupportedImageTypes;
      },
    );
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
      metadata: {},
    };
  },
};
