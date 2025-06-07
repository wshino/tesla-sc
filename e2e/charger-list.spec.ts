import { test, expect } from '@playwright/test'

test.describe('Charger List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display charger list with items', async ({ page }) => {
    // Wait for chargers to load
    await page.waitForSelector('[class*="cursor-pointer"]')

    const chargerItems = page.locator('[class*="cursor-pointer"]')
    const count = await chargerItems.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should show charger details in list item', async ({ page }) => {
    const firstCharger = page.locator('[class*="cursor-pointer"]').first()

    // Should have name
    const name = firstCharger.locator('h3')
    await expect(name).toBeVisible()

    // Should have address
    const address = firstCharger.locator('p').first()
    await expect(address).toBeVisible()

    // Should have stalls info
    await expect(firstCharger).toContainText('stalls')

    // Should have status indicator
    const statusIndicator = firstCharger.locator('[class*="rounded-full"]')
    await expect(statusIndicator).toBeVisible()
  })

  test('should highlight selected charger', async ({ page }) => {
    const firstCharger = page.locator('[class*="cursor-pointer"]').first()

    // Click charger
    await firstCharger.click()

    // Should have selected style
    await expect(firstCharger).toHaveClass(/bg-blue-50/)
  })

  test('should show distance when location is available', async ({
    page,
    context,
  }) => {
    // Grant location permission
    await context.grantPermissions(['geolocation'])
    await context.setGeolocation({ latitude: 35.6762, longitude: 139.6503 }) // Tokyo

    // Click location button
    const locationButton = page.getByRole('button', {
      name: 'Use Current Location',
    })
    await locationButton.click()

    // Wait for location to be processed
    await page.waitForTimeout(1000)

    // Should show distance
    const distanceText = page.locator('text=/\\d+\\.\\d+ km/')
    await expect(distanceText.first()).toBeVisible()
  })

  test('should show amenities', async ({ page }) => {
    const firstCharger = page.locator('[class*="cursor-pointer"]').first()

    // Should show amenity tags
    const amenityTags = firstCharger.locator(
      '[class*="rounded-full"][class*="bg-gray-100"]'
    )
    const amenityCount = await amenityTags.count()
    expect(amenityCount).toBeGreaterThan(0)
  })

  test('should sync selection with map', async ({ page }) => {
    // Wait for map to load
    await page.waitForSelector('#leaflet-map', { state: 'visible' })
    await page.waitForTimeout(1000)

    // Click a charger in the list
    const firstCharger = page.locator('[class*="cursor-pointer"]').first()
    const chargerName = await firstCharger.locator('h3').textContent()
    await firstCharger.click()

    // Should show details panel on map
    const detailsPanel = page.locator('.absolute.bottom-4.left-4')
    await expect(detailsPanel).toBeVisible()
    await expect(detailsPanel).toContainText(chargerName || '')
  })
})
