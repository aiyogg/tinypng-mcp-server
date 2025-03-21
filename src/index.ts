#!/usr/bin/env node
import { main } from './main';
import { config, log } from './utils/helpers';

// Handle process events
process.on('unhandledRejection', (error) => {
  log('Unhandled Rejection:', error);
});

process.on('uncaughtException', (error) => {
  log('Uncaught Exception:', error);
});

const [apiKey] = process.argv.slice(2);

if (!apiKey && !process.env.TINYPNG_API_KEY) {
  throw new Error('Missing API key. Set TINYPNG_API_KEY environment variable or pass it as an argument.');
}

config.apiKey = apiKey || process.env.TINYPNG_API_KEY;

main();
