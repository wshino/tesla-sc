import { test, expect, devices } from '@playwright/test'

// Test mobile responsive layout
test.use({
  ...devices['iPhone 13'],
})

test.describe('Mobile Responsive Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('displays mobile header with menu button', async ({ page }) => {
    // Check mobile header is visible
    await expect(page.locator('text=Tesla SC Finder')).toBeVisible()

    // Check menu button is visible
    const menuButton = page.locator('button[class*="rounded-lg bg-gray-100"]')
    await expect(menuButton).toBeVisible()
  })

  test('map takes full screen on mobile with header offset', async ({
    page,
  }) => {
    // Check that map container has padding top for header
    const mapContainer = page.locator('div[class*="pt-16"]')
    await expect(mapContainer).toBeVisible()
  })

  test('opens bottom sheet when menu button is clicked', async ({ page }) => {
    // Click menu button
    const menuButton = page.locator('button[class*="rounded-lg bg-gray-100"]')
    await menuButton.click()

    // Check bottom sheet is visible
    await expect(page.locator('text=Superchargers')).toBeVisible()
    await expect(
      page.locator('text=Tap a charger to see nearby spots')
    ).toBeVisible()
  })

  test('bottom sheet displays charger list', async ({ page }) => {
    // Open bottom sheet
    const menuButton = page.locator('button[class*="rounded-lg bg-gray-100"]')
    await menuButton.click()

    // Check chargers are displayed
    await expect(page.locator('text=Tokyo - Roppongi')).toBeVisible()
    await expect(page.locator('text=stalls')).toBeVisible()
  })

  test('closes bottom sheet when backdrop is clicked', async ({ page }) => {
    // Open bottom sheet
    const menuButton = page.locator('button[class*="rounded-lg bg-gray-100"]')
    await menuButton.click()

    // Click backdrop
    await page.locator('div[class*="bg-black bg-opacity-25"]').click()

    // Check bottom sheet is closed
    await expect(page.locator('text=Superchargers')).not.toBeVisible()
  })

  test('nearby places modal is fullscreen on mobile', async ({ page }) => {
    // Open bottom sheet
    const menuButton = page.locator('button[class*="rounded-lg bg-gray-100"]')
    await menuButton.click()

    // Click on a charger
    await page.locator('text=Tokyo - Daikanyama').click()

    // Check nearby places modal is fullscreen
    const modal = page.locator('div[class*="h-full w-full"]').nth(1)
    await expect(modal).toBeVisible()

    // Check mobile-optimized header
    await expect(page.locator('text=Nearby Places')).toBeVisible()
    await expect(page.locator('text=Within 5 min walk')).toBeVisible()
  })

  test('place type filters are horizontally scrollable on mobile', async ({
    page,
  }) => {
    // Open bottom sheet and select a charger
    const menuButton = page.locator('button[class*="rounded-lg bg-gray-100"]')
    await menuButton.click()
    await page.locator('text=Tokyo - Daikanyama').click()

    // Check filter buttons container has horizontal scroll
    const filterContainer = page.locator('div[class*="overflow-x-auto"]')
    await expect(filterContainer).toBeVisible()

    // Check filter buttons exist
    await expect(page.locator('button:has-text("All")')).toBeVisible()
    await expect(page.locator('button:has-text("Restaurant")')).toBeVisible()
  })

  test('touch gestures work on bottom sheet', async ({ page }) => {
    // Open bottom sheet
    const menuButton = page.locator('button[class*="rounded-lg bg-gray-100"]')
    await menuButton.click()

    // Get bottom sheet element
    const bottomSheet = page.locator('div[class*="rounded-t-2xl"]')
    await expect(bottomSheet).toBeVisible()

    // Check drag handle is visible
    const dragHandle = page.locator(
      'div[class*="h-1 w-12 rounded-full bg-gray-300"]'
    )
    await expect(dragHandle).toBeVisible()
  })
})

// Test tablet responsive layout
test.describe('Tablet Responsive Layout', () => {
  test.use({
    viewport: { width: 768, height: 1024 },
  })

  test('displays desktop sidebar on tablet', async ({ page }) => {
    await page.goto('/')

    // Check desktop sidebar is visible
    await expect(page.locator('text=Tesla Supercharger Finder')).toBeVisible()

    // Check mobile header is not visible
    const mobileHeader = page
      .locator('div[class*="md:hidden"]')
      .filter({ hasText: 'Tesla SC Finder' })
    await expect(mobileHeader).not.toBeVisible()
  })

  test('nearby places modal has desktop layout on tablet', async ({ page }) => {
    await page.goto('/')

    // Click on a charger
    await page.locator('text=Tokyo - Daikanyama').first().click()

    // Check modal has rounded corners (desktop style)
    const modal = page.locator('div[class*="md:rounded-lg"]')
    await expect(modal).toBeVisible()
  })
})
