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
      preserveMetadata: {
        type: 'array',
        description: 'The metadata to preserve in the image file',
        items: {
          type: 'string',
          enum: ['copyright', 'creation', 'location'],
        },
      },
    },
    required: ['imagePath'],
  },
};

const COMPRESS_REMOTE_IMAGE_TOOL: Tool = {
  name: 'compress_remote_image',
  description: 'Compress a remote image file by giving the URL of the image',
  inputSchema: {
    type: 'object',
    properties: {
      imageUrl: {
        type: 'string',
        description: 'The URL of the image file to compress',
        example: 'https://example.com/image.jpg',
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
    required: ['imageUrl'],
  },
};

const RESIZE_IMAGE_TOOL: Tool = {
  name: 'resize_image',
  description: 'Resize an image file',
  inputSchema: {
    type: 'object',
    properties: {
      imagePath: {
        type: 'string',
        description: 'The ABSOLUTE path to the image file to resize',
        example: '/Users/user/Downloads/image.jpg',
      },
      outputPath: {
        type: 'string',
        description: 'The ABSOLUTE path to save the resized image file',
        example: '/Users/user/Downloads/image_thumbnail.jpg',
      },
      method: {
        type: 'string',
        description: 'The method describes the way your image will be resized.',
        enum: ['scale', 'fit', 'cover', 'thumb'],
        default: 'fit',
        example: 'fit',
      },
      width: {
        type: 'number',
        description: 'The width to resize the image to',
        example: 1024,
      },
      height: {
        type: 'number',
        description: 'The height to resize the image to',
        example: 1024,
      },
    },
    required: ['imagePath', 'width', 'height'],
  },
};

export const TOOLS = [COMPRESS_LOCAL_IMAGE_TOOL, COMPRESS_REMOTE_IMAGE_TOOL, RESIZE_IMAGE_TOOL];

async function handleCompressLocalImageTool({
  imagePath,
  outputPath,
  outputFormat,
  preserveMetadata,
}: {
  imagePath: string;
  outputPath?: string;
  outputFormat?: SupportedImageTypes;
  preserveMetadata?: string[];
}) {
  const originalSize = fs.statSync(imagePath).size;
  tinify.key = config.apiKey!;
  let source = tinify.fromFile(imagePath);

  if (preserveMetadata?.length) {
    source = source.preserve(...preserveMetadata);
  }

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

async function handleCompressRemoteImageTool({
  imageUrl,
  outputPath,
  outputFormat,
}: {
  imageUrl: string;
  outputPath?: string;
  outputFormat?: SupportedImageTypes;
}) {
  tinify.key = config.apiKey!;
  const source = tinify.fromUrl(imageUrl);
  let ext = path.extname(imageUrl).slice(1);

  if (outputFormat) {
    source.convert({
      type: outputFormat,
    });
    ext = outputFormat.split('/')[1];
  }

  let dest = outputPath;
  if (!dest) {
    const dir = path.dirname(imageUrl);
    const basename = path.basename(imageUrl, path.extname(imageUrl));
    dest = path.join(dir, `${basename}.${ext}`);
  }

  await source.toFile(dest);

  const originalSize = (await fetch(imageUrl).then((res) => res.arrayBuffer())).byteLength;
  const compressedSize = fs.statSync(dest).size;
  const compressionRatio = (originalSize - compressedSize) / originalSize;

  return {
    originalSize,
    compressedSize,
    compressionRatio,
  };
}

async function handleResizeImageTool({
  imagePath,
  outputPath,
  width,
  height,
  method,
}: {
  imagePath: string;
  outputPath?: string;
  width: number;
  height: number;
  method?: 'scale' | 'fit' | 'cover' | 'thumb';
}) {
  const source = tinify.fromFile(imagePath);
  const resized = source.resize({
    method: method || 'fit',
    width,
    height,
  });

  let dest = outputPath;
  if (!dest) {
    const dir = path.dirname(imagePath);
    const basename = path.basename(imagePath, path.extname(imagePath));
    const ext = path.extname(imagePath).slice(1);
    dest = path.join(dir, `${basename}_${width}x${height}.${ext}`);
  }
  await resized.toFile(dest);
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
  compress_remote_image: async (request) => {
    const result = await handleCompressRemoteImageTool(
      request.params.arguments as {
        imageUrl: string;
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
  resize_image: async (request) => {
    await handleResizeImageTool(
      request.params.arguments as {
        imagePath: string;
        outputPath?: string;
        width: number;
        height: number;
        method: 'scale' | 'fit' | 'cover' | 'thumb';
      },
    );
    return {
      content: [
        {
          type: 'text',
          text: 'Image resized successfully',
        },
      ],
      metadata: {},
    };
  },
};
