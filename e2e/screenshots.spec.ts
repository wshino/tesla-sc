import { test } from '@playwright/test'

test.describe('Screenshots for README', () => {
  test('capture desktop view screenshot', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 })

    // Navigate to the app
    await page.goto('/')

    // Wait for the page to load completely
    await page.waitForLoadState('networkidle')

    // Wait for app to initialize and render
    await page.waitForTimeout(5000)

    // Take screenshot
    await page.screenshot({
      path: 'screenshots/desktop-view.png',
      fullPage: false,
    })
  })

  test('capture mobile view screenshot', async ({ page }) => {
    // Set mobile viewport (iPhone size)
    await page.setViewportSize({ width: 375, height: 667 })

    // Navigate to the app
    await page.goto('/')

    // Wait for the page to load completely
    await page.waitForLoadState('networkidle')

    // Wait for app to initialize and render
    await page.waitForTimeout(5000)

    // Take screenshot
    await page.screenshot({
      path: 'screenshots/mobile-view.png',
      fullPage: false,
    })
  })
})
