export function log(...args: any[]) {
  const msg = `[DEBUG ${new Date().toISOString()}] ${args.join(' ')}\n`;
  process.stderr.write(msg);
}

export const config = {
  apiKey: process.env.TINYPNG_API_KEY,
};

export { version as mcpTinyPngVersion } from '../../package.json';
