import { defineConfig, devices, type ReporterDescription } from '@playwright/test';

import { env } from './src/config/env';

const reporters: ReporterDescription[] = [
  ['list'],
  ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ['junit', { outputFile: 'test-results/junit/results.xml' }],
  ['allure-playwright', { outputFolder: 'allure-results', detail: true }],
];

if (env.testRail.enabled) {
  reporters.push(['playwright-testrail-reporter']);
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: env.isCi,
  retries: env.isCi ? 2 : 0,
  workers: env.isCi ? 1 : undefined,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  reporter: reporters,
  outputDir: 'test-results/artifacts',
  use: {
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    testIdAttribute: 'data-test',
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'mobile-chrome',
      grep: /@smoke/,
      use: { ...devices['Pixel 5'] },
    },
  ],
});
