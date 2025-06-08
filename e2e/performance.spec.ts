import { test, expect } from '@playwright/test'

test.describe('Performance', () => {
  test('should load page within acceptable time', async ({ page }) => {
    const startTime = Date.now()

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const loadTime = Date.now() - startTime

    // Page should load within 5 seconds (more lenient for CI)
    expect(loadTime).toBeLessThan(5000)
  })

  test('should render interactive elements quickly', async ({ page }) => {
    await page.goto('/')

    // Measure time to interactive
    const startTime = Date.now()

    // Wait for key interactive elements
    await Promise.all([
      page.waitForSelector('#leaflet-map', { state: 'visible' }),
      page.waitForSelector('[class*="cursor-pointer"]', { state: 'visible' }),
      page.waitForSelector('input[placeholder*="Search"]', {
        state: 'visible',
      }),
    ])

    const timeToInteractive = Date.now() - startTime

    // Should be interactive within 2 seconds
    expect(timeToInteractive).toBeLessThan(2000)
  })

  test('should handle large datasets efficiently', async ({ page }) => {
    await page.goto('/')

    // Search to get many results
    const searchInput = page.locator('input[placeholder*="Search"]')
    await searchInput.fill('') // Clear to show all

    // Measure scroll performance
    const chargerList = page.locator('[class*="overflow-y-auto"]').first()

    // Scroll to bottom
    await chargerList.evaluate((el) => (el.scrollTop = el.scrollHeight))

    // Should maintain smooth scrolling (no frozen UI)
    await expect(chargerList).toBeVisible()

    // Scroll back to top
    await chargerList.evaluate((el) => (el.scrollTop = 0))

    // UI should still be responsive
    await searchInput.fill('Tokyo')
    await expect(searchInput).toHaveValue('Tokyo')
  })

  test('should lazy load map markers efficiently', async ({ page }) => {
    await page.goto('/')

    // Wait for initial map load
    await page.waitForSelector('#leaflet-map', { state: 'visible' })

    // Check that markers are rendered
    const markers = page.locator('.leaflet-marker-icon')
    const markerCount = await markers.count()

    // Should have rendered some markers
    expect(markerCount).toBeGreaterThan(0)

    // Zoom in to reduce visible markers
    const zoomInButton = page.locator('.leaflet-control-zoom-in')
    await zoomInButton.click()
    await zoomInButton.click()

    // Should still be responsive
    await expect(page.locator('#leaflet-map')).toBeVisible()
  })

  test('should handle rapid user interactions', async ({ page }) => {
    await page.goto('/')

    // Rapidly click multiple chargers
    const chargers = page.locator('[class*="cursor-pointer"]')
    const count = Math.min(5, await chargers.count())

    for (let i = 0; i < count; i++) {
      await chargers.nth(i).click()
      // Don't wait between clicks
    }

    // UI should still be functional
    await expect(page.locator('.bg-blue-50')).toBeVisible()

    // Rapidly toggle filters
    const filterButton = page.locator('button:has-text("Filters")')
    for (let i = 0; i < 5; i++) {
      await filterButton.click()
    }

    // Should handle without errors
    await expect(filterButton).toBeVisible()
  })
})
