# Testing Improvement TODOs

## Critical - Fix Current Test Issues

### 1. Fix Test Coverage (Currently 9.49%)

- [ ] Target: Achieve at least 80% coverage
- [ ] Run coverage report: `docker-compose exec app pnpm test:coverage`
- [ ] Focus on critical business logic first

### 2. Fix Skipped Tests

- [ ] Fix Map component tests (2 skipped tests)
  - `should display chargers from context`
  - `should handle click on charger`
- [ ] Investigate why tests are being skipped
- [ ] Ensure all tests are running in CI

### 3. Fix React Testing Library Warnings

- [ ] Resolve `act()` warnings in multiple test files
- [ ] Properly await async operations
- [ ] Update test utilities to handle async state updates

## High Priority - Component Testing

### 4. Add Missing Component Tests

- [ ] ChargerList.tsx (0% coverage)
  - Test charger rendering
  - Test sorting functionality
  - Test filter application
  - Test mobile responsiveness
- [ ] LeafletMap.tsx (0% coverage)

  - Test map initialization
  - Test marker rendering
  - Test user location display
  - Test map interactions

- [ ] MobileBottomSheet.tsx (Low coverage)

  - Test open/close behavior
  - Test gesture handling
  - Test content rendering
  - Test accessibility

- [ ] NearbyPlaces.tsx (0% coverage)

  - Test place rendering
  - Test loading states
  - Test error handling
  - Test empty states

- [ ] SearchFilter.tsx (0% coverage)
  - Test filter input
  - Test filter application
  - Test reset functionality

## Medium Priority - Integration Testing

### 5. API Route Testing

- [ ] Test /api/tesla-superchargers

  - Success responses
  - Error handling
  - Data validation

- [ ] Test /api/places/nearby

  - Mock Google Places API
  - Test parameter validation
  - Test error scenarios

- [ ] Test /api/health
  - Health check responses
  - Environment info

### 6. Hook Testing

- [ ] Improve useGeolocation tests

  - Test permission denied
  - Test location updates
  - Test error scenarios

- [ ] Test useTeslaSuperchargers
  - Data fetching
  - Error handling
  - Loading states

### 7. E2E Test Improvements

- [ ] Fix flaky tests

  - Investigate timeout issues
  - Add proper wait conditions
  - Improve test stability

- [ ] Add missing E2E scenarios
  - Complete user journey tests
  - Cross-browser testing
  - Mobile device testing

## Low Priority - Testing Infrastructure

### 8. Test Utilities

- [ ] Create test data factories
- [ ] Add custom render functions
- [ ] Create mock providers
- [ ] Add test helpers for common scenarios

### 9. Performance Testing

- [ ] Add performance benchmarks
- [ ] Test component render times
- [ ] Monitor bundle size
- [ ] Add Lighthouse CI integration

### 10. Visual Regression Testing

- [ ] Set up visual testing tool
- [ ] Add screenshot tests for key components
- [ ] Test responsive designs
- [ ] Test dark mode (when implemented)

## Testing Best Practices

### 11. Testing Guidelines

- [ ] Document testing standards
- [ ] Create testing checklist
- [ ] Add pre-commit hooks for tests
- [ ] Enforce minimum coverage for new code

### 12. Continuous Integration

- [ ] Ensure all tests run in CI
- [ ] Add coverage reporting to PRs
- [ ] Block merges if tests fail
- [ ] Add test result badges to README

## Test Commands Reference

```bash
# Run all tests
docker-compose exec app pnpm test

# Run tests in watch mode
docker-compose exec app pnpm test:watch

# Run coverage report
docker-compose exec app pnpm test:coverage

# Run E2E tests
docker-compose exec app pnpm test:e2e

# Run E2E tests with UI
docker-compose exec app pnpm test:e2e:ui
```

## Notes

- Prioritize tests for business-critical features
- Write tests before fixing bugs
- Keep tests simple and focused
- Use TDD for new features
