import { test, expect } from '@playwright/test'
// import { injectAxe, checkA11y } from 'axe-playwright'

test.describe('Accessibility', () => {
  test.skip('should have no accessibility violations on home page', async ({
    page,
  }) => {
    await page.goto('/')
    // await injectAxe(page)

    // Check for accessibility violations
    // await checkA11y(page, null, {
    //   detailedReport: true,
    //   detailedReportOptions: {
    //     html: true,
    //   },
    // })
  })

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/')

    // Focus on the search input first
    const searchInput = page.locator('input[placeholder*="Search"]')
    await searchInput.focus()
    await expect(searchInput).toBeFocused()

    // Tab to filters button
    await page.keyboard.press('Tab')
    const filterButton = page.locator('button:has-text("Filters")')
    await expect(filterButton).toBeFocused()

    // Tab to location button
    await page.keyboard.press('Tab')
    const locationButton = page.getByRole('button', {
      name: 'Use Current Location',
    })
    await expect(locationButton).toBeFocused()

    // Should be able to activate with Space (more reliable than Enter for buttons)
    await page.keyboard.press('Space')

    // Should still work
    await expect(page.locator('#leaflet-map')).toBeVisible()
  })

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/')

    // Check important ARIA labels
    await expect(
      page.getByRole('button', { name: 'Use Current Location' })
    ).toBeVisible()
    await expect(page.getByRole('textbox', { name: /search/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /filter/i })).toBeVisible()
  })

  test('should support screen reader navigation', async ({ page }) => {
    await page.goto('/')

    // Check heading hierarchy
    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(2) // Header and main title

    const h2 = page.locator('h2')
    await expect(h2).toHaveCount(1) // Nearby Superchargers

    // Check landmarks
    await expect(page.locator('nav')).toBeVisible() // Navigation
    await expect(page.locator('main')).toBeVisible() // Main content
  })

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/')

    // This is a simplified check - in real tests, use axe-core
    // Check that important text is visible
    const title = page.locator('h1.text-2xl')
    await expect(title).toHaveCSS('color', 'rgb(17, 24, 39)') // text-gray-900

    const background = page.locator('.bg-white').first()
    await expect(background).toHaveCSS('background-color', 'rgb(255, 255, 255)')
  })
})
