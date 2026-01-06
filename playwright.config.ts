import { defineConfig, devices } from '@playwright/test';

module.exports = defineConfig({
  //globalSetup: './global-setup',
  testDir: './tests/e2e/journeys',
  /* Run tests in files in parallel */
 // fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
 // forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: parseInt(process.env.RETRIES || '1'), // Set the number of retries for all projects

  timeout: 8 * 60 * 1000,
  expect: {
    timeout: 60 * 1000,
  },

  /* Opt out of parallel tests on CI. */
  workers: parseInt(process.env.FUNCTIONAL_TESTS_WORKERS_COUNT || '5'),
  reporter: process.env.CI ? 'html' : 'list',
  use: {
    navigationTimeout: 45 * 1000,
    actionTimeout: 30 * 1000,
    trace: 'on-first-retry',
    screenshot: { mode: 'only-on-failure', fullPage: true },
  },
  projects: [
    // Setup project
    {
      name: "authentication",
      testDir: "./setup",
      use: {
        baseURL: 'https://xui-ia-case-api-pr-2887.preview.platform.hmcts.net',
      },
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'smokeChromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        viewport: {width: 1929, height: 959},
      },
      testDir: './tests/e2e',
    },
    {
      name: 'chromium',
      use: {
        storageState: './.auth/authentication.json',
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        viewport: { width: 1929, height: 959 },
        launchOptions: {
          //slowMo: 1000,
        },
      },
      dependencies: ["authentication"],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'MobileChrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'MobileSafari',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'MicrosoftEdge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
  ],
});
