import { test, expect } from '@playwright/test'

test.describe('Map Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Wait for map to load
    await page.waitForSelector('#leaflet-map', { state: 'visible' })
  })

  test('should display map with markers', async ({ page }) => {
    // Wait for markers to load
    await page.waitForTimeout(1000)

    // Check for supercharger markers
    const markers = page.locator('.supercharger-marker')
    const markerCount = await markers.count()
    expect(markerCount).toBeGreaterThan(0)
  })

  test.skip('should show popup on marker click', async ({ page }) => {
    // Wait for markers to load
    await page.waitForTimeout(1000)

    // Click on first marker
    const firstMarker = page.locator('.supercharger-marker').first()
    await firstMarker.click()

    // Should show popup
    const popup = page.locator('.leaflet-popup')
    await expect(popup).toBeVisible()

    // Popup should contain charger info
    await expect(popup).toContainText('Stalls:')
    await expect(popup).toContainText('Status:')
  })

  test.skip('should show charger details panel', async ({ page }) => {
    // Wait for markers to load
    await page.waitForTimeout(1000)

    // Click on first marker
    const firstMarker = page.locator('.supercharger-marker').first()
    await firstMarker.click()

    // Should show details panel
    const detailsPanel = page.locator('.absolute.bottom-4.left-4')
    await expect(detailsPanel).toBeVisible()

    // Should have close button
    const closeButton = detailsPanel.locator('button:has-text("✕")')
    await expect(closeButton).toBeVisible()

    // Click close button
    await closeButton.click()
    await expect(detailsPanel).not.toBeVisible()
  })

  test.skip('should handle location permission', async ({ page, context }) => {
    // Grant location permission
    await context.grantPermissions(['geolocation'])
    await context.setGeolocation({ latitude: 35.6762, longitude: 139.6503 }) // Tokyo

    // Click location button
    const locationButton = page.getByRole('button', {
      name: 'Use Current Location',
    })
    await locationButton.click()

    // Should show user location marker
    await page.waitForTimeout(1000)
    const userMarker = page.locator('.user-location-marker')
    await expect(userMarker).toBeVisible()
  })

  test('should zoom controls work', async ({ page }) => {
    // Find zoom controls
    const zoomIn = page.locator('.leaflet-control-zoom-in')
    const zoomOut = page.locator('.leaflet-control-zoom-out')

    await expect(zoomIn).toBeVisible()
    await expect(zoomOut).toBeVisible()

    // Test zoom in
    await zoomIn.click()
    await page.waitForTimeout(300)

    // Test zoom out
    await zoomOut.click()
    await page.waitForTimeout(300)
  })
})
