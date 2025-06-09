import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? 'list' : 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Timeout for each test */
    actionTimeout: 10000,
    navigationTimeout: 10000,
  },

  /* Global timeout for CI */
  timeout: 30000,

  /* Configure projects for major browsers */
  projects: process.env.CI
    ? [
        // Run only lightweight Chromium in CI environment
        {
          name: 'chromium',
          use: {
            ...devices['Desktop Chrome'],
            // Chromium settings for Alpine Linux environment
            launchOptions: {
              executablePath:
                process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
            },
          },
        },
      ]
    : [
        {
          name: 'chromium',
          use: {
            ...devices['Desktop Chrome'],
            // Chromium settings for Alpine Linux environment
            launchOptions: {
              executablePath:
                process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
            },
          },
        },

        {
          name: 'firefox',
          use: { ...devices['Desktop Firefox'] },
        },

        {
          name: 'webkit',
          use: { ...devices['Desktop Safari'] },
        },

        /* Test against mobile viewports. */
        {
          name: 'Mobile Chrome',
          use: {
            ...devices['Pixel 5'],
            // Chromium settings for Alpine Linux environment
            launchOptions: {
              executablePath:
                process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
            },
          },
        },
        {
          name: 'Mobile Safari',
          use: { ...devices['iPhone 12'] },
        },

        /* Test against branded browsers. */
        // {
        //   name: 'Microsoft Edge',
        //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
        // },
        // {
        //   name: 'Google Chrome',
        //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
        // },
      ],

  /* Run your local dev server before starting the tests */
  webServer: process.env.CI
    ? {
        command: 'echo "Server already started in CI"',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
      }
    : {
        command: 'pnpm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
      },
})
