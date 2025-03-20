#!/usr/bin/env node
import { main } from './main.js';
import { log } from './utils/helpers.js';

// Handle process events
process.on('unhandledRejection', (error) => {
  log('Unhandled Rejection:', error);
});

process.on('uncaughtException', (error) => {
  log('Uncaught Exception:', error);
});

// Start the server
main();
