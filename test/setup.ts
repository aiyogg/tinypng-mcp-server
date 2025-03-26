import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach } from 'vitest';
import { config } from '../src/utils/helpers';

dotenv.config({ path: path.join(__dirname, '.env.test') });

beforeEach(() => {
  config.apiKey = process.env.TINYPNG_API_KEY;
});

afterEach(() => {
  // Clear all files in the output directory
  const outputDir = path.join(__dirname, 'mocks/output');
  if (fs.existsSync(outputDir)) {
    fs.readdirSync(outputDir).forEach((file) => {
      if (file !== '.gitkeep') {
        fs.unlinkSync(path.join(outputDir, file));
      }
    });
  }
});
