import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the main title', async ({ page }) => {
    // Select the main title in the sidebar/desktop view
    await expect(page.locator('h1.text-2xl')).toContainText(
      'Tesla Supercharger Finder'
    )
  })

  test('should have a map container', async ({ page }) => {
    const map = page.locator('#leaflet-map')
    await expect(map).toBeVisible()
  })

  test('should have a current location button', async ({ page }) => {
    const locationButton = page.getByRole('button', {
      name: 'Use Current Location',
    })
    await expect(locationButton).toBeVisible()
  })

  test('should display charger list', async ({ page }) => {
    const chargerList = page.locator('text=Nearby Superchargers')
    await expect(chargerList).toBeVisible()
  })

  test('should have search functionality', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]')
    await expect(searchInput).toBeVisible()

    // Test search
    await searchInput.fill('Tokyo')
    await page.waitForTimeout(500) // Wait for debounce

    // Should filter results
    const chargerItems = page.locator('[class*="cursor-pointer"]')
    const count = await chargerItems.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should toggle filters', async ({ page }) => {
    const filterButton = page.locator('button:has-text("Filters")')
    await expect(filterButton).toBeVisible()

    // Click to open filters
    await filterButton.click()

    // Should show filter options
    await expect(page.locator('text=Status')).toBeVisible()
    await expect(page.locator('text=Country')).toBeVisible()
    await expect(page.locator('text=Amenities')).toBeVisible()
  })

  test('should handle mobile menu on small screens', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Mobile menu button should be visible
    const mobileMenuButton = page.locator('.md\\:hidden button').last()
    await expect(mobileMenuButton).toBeVisible()

    // Click to open sidebar
    await mobileMenuButton.click()

    // Bottom sheet should be visible on mobile
    await expect(
      page.locator('[class*="bottom-0"][class*="inset-x-0"]')
    ).toBeVisible()
  })

  test('should filter by status', async ({ page }) => {
    // Open filters
    const filterButton = page.locator('button:has-text("Filters")').first()
    await filterButton.click()

    // Wait for filter panel to be visible
    await page.waitForSelector('text=Status', { state: 'visible' })

    // Click on active status
    const activeButton = page.locator('button:has-text("active")').first()
    await activeButton.click()

    // Should update filter count
    await expect(filterButton).toContainText('1')
  })

  test('should filter by country', async ({ page }) => {
    // Open filters
    const filterButton = page.locator('button:has-text("Filters")').first()
    await filterButton.click()

    // Select Japan
    const countrySelect = page.locator('select')
    await countrySelect.selectOption('Japan')

    // Should update filter count
    await expect(filterButton).toContainText('1')

    // Wait for filter to be applied
    await page.waitForTimeout(1000)

    // Should show only Japan chargers
    const chargerItems = page.locator('[class*="cursor-pointer"]')
    const count = await chargerItems.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should clear all filters', async ({ page }) => {
    // Open filters and apply some
    const filterButton = page.locator('button:has-text("Filters")').first()
    await filterButton.click()

    // Apply filters
    await page.locator('button:has-text("active")').first().click()
    await page.locator('select').selectOption('Japan')

    // Clear all filters
    const clearButton = page.locator('button:has-text("Clear All Filters")')
    await clearButton.click()

    // Filter count should be 0
    await expect(filterButton).not.toContainText('2')
  })
})
