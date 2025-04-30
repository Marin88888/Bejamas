import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 600000,
  workers: 50,
  globalSetup: require.resolve('./globalSetup'),
  use: {
    browserName: 'chromium',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  reporter: [['html', { htmlReport: 'playwright-report', open: 'never' }]],
  
});
