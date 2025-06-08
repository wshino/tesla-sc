import { test, expect } from '@playwright/test'

test.describe('Integration Tests', () => {
  test('complete user journey: find charger with amenities', async ({
    page,
    context,
  }) => {
    // Requires Google Maps API key - will be skipped in CI if not available
    test.skip(
      !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      'Skipping: Google Maps API key not available'
    )
    // Grant location permission
    await context.grantPermissions(['geolocation'])
    await context.setGeolocation({ latitude: 35.6762, longitude: 139.6503 }) // Tokyo

    await page.goto('/')

    // 1. Use current location
    const locationButton = page.getByRole('button', {
      name: 'Use Current Location',
    })
    await locationButton.click()
    await page.waitForTimeout(1000)

    // 2. Search for specific area
    const searchInput = page.locator('input[placeholder*="Search"]')
    await searchInput.fill('Shibuya')
    await page.waitForTimeout(500)

    // 3. Apply filters
    const filterButton = page.locator('button:has-text("Filters")')
    await filterButton.click()

    // Filter by amenities
    const restaurantsCheckbox = page.locator(
      'input[type="checkbox"][value="restaurants"]'
    )
    await restaurantsCheckbox.check()

    // 4. Select a charger
    const firstCharger = page.locator('[class*="cursor-pointer"]').first()
    await firstCharger.click()

    // 5. View nearby places
    const nearbyButton = page.locator('button:has-text("Nearby Entertainment")')
    await nearbyButton.click()

    // Should show nearby places modal
    await expect(page.locator('text=Nearby Places')).toBeVisible()

    // 6. Filter nearby places
    const restaurantTab = page.locator('button:has-text("restaurant")')
    await restaurantTab.click()

    // Should show restaurant results
    await expect(page.locator('[class*="grid"] > div').first()).toBeVisible()
  })

  test('multi-device sync simulation', async ({ browser }) => {
    // Create two contexts (simulating two devices)
    const context1 = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
    })
    const context2 = await browser.newContext({
      viewport: { width: 375, height: 667 },
    })

    const desktop = await context1.newPage()
    const mobile = await context2.newPage()

    // Load both pages
    await desktop.goto('/')
    await mobile.goto('/')

    // Apply filter on desktop
    const desktopFilterButton = desktop.locator('button:has-text("Filters")')
    await desktopFilterButton.click()
    await desktop.locator('select').selectOption('Japan')

    // Reload mobile page (simulating sync)
    await mobile.reload()

    // Mobile should show same filtered results
    const mobileChargers = mobile.locator('[class*="cursor-pointer"]')
    const chargerCount = await mobileChargers.count()
    expect(chargerCount).toBeGreaterThan(0)

    // Cleanup
    await context1.close()
    await context2.close()
  })

  test('data persistence across navigation (requires external navigation)', async ({
    page,
  }) => {
    // This test navigates to external site and back
    await page.goto('/')

    // Apply some filters
    const filterButton = page.locator('button:has-text("Filters")')
    await filterButton.click()
    await page.locator('button:has-text("operational")').first().click()

    // Search for location
    const searchInput = page.locator('input[placeholder*="Search"]')
    await searchInput.fill('Tokyo')
    await page.waitForTimeout(500)

    // Select a charger
    const firstCharger = page.locator('[class*="cursor-pointer"]').first()
    const chargerName = await firstCharger.locator('h3').textContent()
    await firstCharger.click()

    // Navigate away and back (using browser navigation)
    await page.goto('https://www.google.com')
    await page.goBack()

    // Should maintain selection
    await expect(page.locator('.bg-blue-50')).toBeVisible()
    await expect(page.locator('.bg-blue-50 h3')).toContainText(
      chargerName || ''
    )
  })

  test('responsive behavior transition', async ({ page }) => {
    await page.goto('/')

    // Start with desktop view
    await page.setViewportSize({ width: 1920, height: 1080 })

    // Desktop should show sidebar
    await expect(page.locator('.hidden.md\\:block')).toBeVisible()

    // Transition to tablet
    await page.setViewportSize({ width: 768, height: 1024 })

    // Should still show sidebar on tablet
    await expect(page.locator('.hidden.md\\:block')).toBeVisible()

    // Transition to mobile
    await page.setViewportSize({ width: 375, height: 667 })

    // Should hide sidebar and show mobile menu
    await expect(page.locator('.hidden.md\\:block')).not.toBeVisible()
    await expect(page.locator('button.md\\:hidden').first()).toBeVisible()

    // Open mobile menu
    await page.locator('button.md\\:hidden').first().click()

    // Should show bottom sheet
    await expect(
      page.locator('[class*="bottom-0"][class*="inset-x-0"]')
    ).toBeVisible()
  })

  test('real-time updates simulation', async ({ page }) => {
    await page.goto('/')

    // Initial charger count
    const initialChargers = page.locator('[class*="cursor-pointer"]')
    const initialCount = await initialChargers.count()

    // Simulate data update by changing filters
    const filterButton = page.locator('button:has-text("Filters")')
    await filterButton.click()
    await page.locator('select').selectOption('United States')

    // Wait for update
    await page.waitForTimeout(500)

    // Count should change
    const updatedChargers = page.locator('[class*="cursor-pointer"]')
    const updatedCount = await updatedChargers.count()

    expect(updatedCount).not.toBe(initialCount)

    // UI should remain responsive
    await updatedChargers.first().click()
    await expect(page.locator('.bg-blue-50')).toBeVisible()
  })
})
