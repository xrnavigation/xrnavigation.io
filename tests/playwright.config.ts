import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  timeout: 30 * 60_000, // 30 minutes — baseline capture hits ~86 pages x 2 viewports
  retries: 1,
  use: {
    browserName: 'chromium',
    headless: true,
  },
});
