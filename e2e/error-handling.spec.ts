import { test, expect } from '@playwright/test'

test.describe('Error Handling', () => {
  test('should handle empty search results gracefully', async ({ page }) => {
    await page.goto('/')

    // Search for something that doesn't exist
    const searchInput = page.locator('input[placeholder*="Search"]')
    await searchInput.fill('NonexistentLocationXYZ123')
    await page.waitForTimeout(500)

    // Should still show the interface without errors
    await expect(page.locator('text=Nearby Superchargers')).toBeVisible()
    await expect(page.locator('text=0 locations found')).toBeVisible()
  })

  test('should handle geolocation permission denial', async ({
    page,
    context,
  }) => {
    // Deny location permission
    await context.clearPermissions()
    await page.goto('/')

    // Try to use location button
    const locationButton = page.getByRole('button', {
      name: 'Use Current Location',
    })
    await locationButton.click()

    // Should handle gracefully without breaking the UI
    await expect(page.locator('#leaflet-map')).toBeVisible()
    await expect(
      page.locator('[class*="cursor-pointer"]').first()
    ).toBeVisible()
  })

  test('should handle network errors for nearby places', async ({ page }) => {
    // Requires Google Maps API key - will be skipped in CI if not available
    test.skip(
      !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      'Skipping: Google Maps API key not available'
    )
    await page.goto('/')

    // Wait for chargers to load
    await page.waitForSelector('[class*="cursor-pointer"]')

    // Click a charger
    const firstCharger = page.locator('[class*="cursor-pointer"]').first()
    await firstCharger.click()

    // Mock network error for places API before clicking button
    await page.route('**/api/places/nearby*', (route) => {
      route.abort('failed')
    })

    // Click nearby places button
    const nearbyButton = page.locator('button:has-text("Nearby Entertainment")')
    await nearbyButton.click()

    // Should show error state - be more specific about the error
    await expect(
      page.locator('text="Failed to load nearby places. Please try again."')
    ).toBeVisible({ timeout: 10000 })
  })

  test('should handle invalid filter combinations', async ({ page }) => {
    await page.goto('/')

    // Open filters
    const filterButton = page.locator('button:has-text("Filters")')
    await filterButton.click()

    // Apply conflicting filters (e.g., country that has no operational chargers)
    await page.locator('select').selectOption('Australia')

    // Should show no results message
    await page.waitForTimeout(500)
    await expect(
      page.locator('text=/0 locations found|No chargers found/')
    ).toBeVisible()
  })
})
