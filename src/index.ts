#!/usr/bin/env node
import { log } from './helpers.js';
import { main } from './main.js';

// Handle process events
process.on('unhandledRejection', (error) => {
  log('Unhandled Rejection:', error);
});

process.on('uncaughtException', (error) => {
  log('Uncaught Exception:', error);
});

// Start the server
main();
