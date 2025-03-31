## MCP server for TinyPNG
[![smithery badge](https://smithery.ai/badge/@aiyogg/tinypng-mcp-server)](https://smithery.ai/server/@aiyogg/tinypng-mcp-server)

### Usage

### Use `bun` or `node` to run the server

1. Install dependencies and build

```bash
pnpm i
pnpm build
```

2. Edit the `mcp.json` file

```json
{
  "mcpServers": {
    "tinypng": {
      "command": "bun", // or "node"
      "args": ["/path/to/tinypng-mcp-server/src/index.ts"], // or "dist/index.js"
      "env": {
        "TINYPNG_API_KEY": "your-tinypng-api-key"
      }
    }
  }
}
```

### Installing via Smithery

To install TinyPNG MCP Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@aiyogg/tinypng-mcp-server):

```bash
npx -y @smithery/cli install @aiyogg/tinypng-mcp-server --client claude
```

### Tools

1. Compress local image

```js
{
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
}
```

2. Compress remote image

```js
{
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
}
```
