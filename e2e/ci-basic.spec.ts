import { test, expect } from '@playwright/test'

test.describe('CI Basic Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load home page', async ({ page }) => {
    await expect(page).toHaveTitle(/Tesla/)
    await expect(page.locator('#leaflet-map')).toBeVisible()
  })

  test('should display charger list', async ({ page }) => {
    await page.waitForSelector('[class*="cursor-pointer"]')
    const chargers = page.locator('[class*="cursor-pointer"]')
    const count = await chargers.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should search for chargers', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]')
    await searchInput.fill('Tokyo')
    await page.waitForTimeout(300)

    const chargers = page.locator('[class*="cursor-pointer"]')
    const count = await chargers.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should filter chargers', async ({ page }) => {
    const filterButton = page.locator('button:has-text("Filters")').first()
    await filterButton.click()

    await page.waitForSelector('text=Status', { state: 'visible' })

    const countrySelect = page.locator('select')
    await countrySelect.selectOption('Japan')

    await page.waitForTimeout(300)

    const chargers = page.locator('[class*="cursor-pointer"]')
    const count = await chargers.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should select charger', async ({ page }) => {
    await page.waitForSelector('[class*="cursor-pointer"]')

    const firstCharger = page.locator('[class*="cursor-pointer"]').first()
    await firstCharger.click()

    // Check for selected state
    await expect(firstCharger).toHaveClass(/bg-blue-50/)
  })

  test('should handle location permission', async ({ page, context }) => {
    await context.grantPermissions(['geolocation'])
    await context.setGeolocation({ latitude: 35.6762, longitude: 139.6503 })

    const locationButton = page.getByRole('button', {
      name: 'Use Current Location',
    })
    await locationButton.click()

    await page.waitForTimeout(500)

    // Should show distance
    const distanceText = page.locator('text=/\\d+\\.\\d+ km/')
    await expect(distanceText.first()).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    // Mobile menu should be visible
    const mobileMenuButton = page.locator('.md\\:hidden button').last()
    await expect(mobileMenuButton).toBeVisible()

    // Click to open bottom sheet
    await mobileMenuButton.click()

    // Bottom sheet should be visible
    await expect(
      page.locator('[class*="bottom-0"][class*="inset-x-0"]')
    ).toBeVisible()
  })
})
