# Contributing to Tesla Supercharger Finder

First off, thank you for considering contributing to Tesla Supercharger Finder! It's people like you that make this project better for everyone.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)
- [Community](#community)

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive criticism
- Accept feedback gracefully
- Prioritize the community's best interests

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Git
- GitHub account
- Basic knowledge of TypeScript and React

### Setting Up Your Development Environment

1. **Fork the repository**
   ```bash
   # Click "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/tesla-sc.git
   cd tesla-sc
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/wshino/tesla-sc.git
   ```

4. **Set up the project**
   ```bash
   cp .env.example .env.local
   docker-compose up
   ```

5. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Process

### Workflow

1. **Stay updated**
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/descriptive-name
   ```

3. **Make changes**
   - Write code
   - Add tests
   - Update documentation

4. **Test your changes**
   ```bash
   docker-compose exec app pnpm test
   docker-compose exec app pnpm lint
   docker-compose exec app pnpm type-check
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/descriptive-name
   ```

7. **Create a Pull Request**

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions or fixes
- `chore/` - Maintenance tasks

Examples:
- `feature/add-route-planning`
- `fix/map-marker-position`
- `docs/update-api-endpoints`

## How to Contribute

### Reporting Bugs

Before submitting a bug report:
1. Check existing issues
2. Verify the bug in the latest version
3. Collect relevant information

Include in your report:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details

### Suggesting Features

We love feature suggestions! Please:
1. Check if already suggested
2. Provide detailed use case
3. Explain the benefits
4. Consider implementation complexity

### Improving Documentation

Documentation is crucial! You can help by:
- Fixing typos or grammar
- Adding examples
- Clarifying confusing sections
- Translating documentation

### Contributing Code

1. **Find an issue** - Look for "good first issue" labels
2. **Comment** - Let others know you're working on it
3. **Ask questions** - We're here to help
4. **Submit PR** - Follow our guidelines

## Coding Standards

### TypeScript/JavaScript

```typescript
// Use meaningful variable names
const userLocation = await getCurrentLocation();

// Prefer const over let
const MAX_RETRIES = 3;

// Use async/await over promises
async function fetchChargers() {
  try {
    const response = await fetch('/api/tesla-superchargers');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch chargers:', error);
    throw error;
  }
}

// Avoid any type
interface ChargerData {
  id: string;
  name: string;
  location: Coordinates;
}

// Use optional chaining
const city = charger?.address?.city ?? 'Unknown';
```

### React Components

```typescript
// Use functional components with hooks
export function ChargerCard({ charger }: ChargerCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Handle events properly
  const handleClick = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);
  
  return (
    <div className="charger-card" onClick={handleClick}>
      {/* Component content */}
    </div>
  );
}

// Define prop types
interface ChargerCardProps {
  charger: Charger;
  onSelect?: (charger: Charger) => void;
}
```

### CSS/Tailwind

```typescript
// Use Tailwind classes
<div className="flex items-center justify-between p-4">

// Avoid inline styles except for dynamic values
<div style={{ transform: `translateX(${offset}px)` }}>

// Group related classes
<button className="
  px-4 py-2
  bg-blue-500 hover:bg-blue-600
  text-white font-medium
  rounded-lg shadow-md
  transition-colors duration-200
">
```

### File Organization

```
src/
├── app/                 # Next.js pages and API routes
├── components/          # Reusable React components
│   ├── common/         # Generic components
│   ├── features/       # Feature-specific components
│   └── layout/         # Layout components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and libraries
├── types/              # TypeScript type definitions
└── styles/             # Global styles
```

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Test additions or fixes
- `chore` - Maintenance tasks

### Examples
```bash
feat(map): add clustering for dense marker areas

fix(charger-list): correct distance calculation for overseas locations

docs(api): update endpoint documentation with new parameters

refactor(components): extract shared logic into custom hook

test(e2e): add tests for mobile responsive behavior
```

### Commit Message Rules
1. Use imperative mood ("add" not "added")
2. Don't capitalize first letter
3. No period at the end
4. Keep subject under 50 characters
5. Separate subject from body with blank line
6. Wrap body at 72 characters
7. Explain what and why, not how

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] Added/updated tests as needed
- [ ] Updated documentation
- [ ] Performed self-review
- [ ] Checked for breaking changes

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Manually tested

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] My code follows style guidelines
- [ ] I've performed self-review
- [ ] I've commented complex code
- [ ] I've updated documentation
- [ ] My changes generate no warnings
- [ ] I've added tests for my changes
- [ ] All tests pass locally
```

### Review Process

1. **Automated checks** - CI/CD runs tests
2. **Code review** - Maintainers review code
3. **Feedback** - Address review comments
4. **Approval** - Get required approvals
5. **Merge** - Maintainer merges PR

### What to Expect

- Reviews within 48 hours
- Constructive feedback
- Possible requests for changes
- Help if you get stuck

## Testing

### Running Tests

```bash
# Unit tests
docker-compose exec app pnpm test

# Unit tests with coverage
docker-compose exec app pnpm test:coverage

# E2E tests
docker-compose exec app pnpm test:e2e

# E2E tests for CI
docker-compose exec app pnpm test:e2e:ci

# Linting
docker-compose exec app pnpm lint

# Type checking
docker-compose exec app pnpm type-check
```

### Writing Tests

#### Unit Tests (Vitest)
```typescript
import { describe, it, expect } from 'vitest';
import { calculateDistance } from '@/lib/location';

describe('calculateDistance', () => {
  it('should calculate distance between two points', () => {
    const point1 = { lat: 35.6762, lng: 139.6503 };
    const point2 = { lat: 35.6595, lng: 139.7276 };
    
    const distance = calculateDistance(point1, point2);
    
    expect(distance).toBeCloseTo(6.89, 1);
  });
});
```

#### E2E Tests (Playwright)
```typescript
import { test, expect } from '@playwright/test';

test('should display charger list', async ({ page }) => {
  await page.goto('/');
  
  const chargerList = page.getByTestId('charger-list');
  await expect(chargerList).toBeVisible();
  
  const chargers = chargerList.getByRole('button');
  await expect(chargers).toHaveCount.greaterThan(0);
});
```

### Test Guidelines

1. **Write tests first** (TDD approach)
2. **Test behavior, not implementation**
3. **Keep tests simple and focused**
4. **Use descriptive test names**
5. **Avoid testing external services**
6. **Mock external dependencies**

## Documentation

### Code Documentation

```typescript
/**
 * Calculates the distance between two geographic points using Haversine formula
 * @param point1 - First coordinate point
 * @param point2 - Second coordinate point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  point1: Coordinates,
  point2: Coordinates
): number {
  // Implementation
}
```

### Component Documentation

```typescript
/**
 * ChargerList Component
 * 
 * Displays a filterable list of Tesla Supercharger locations
 * with distance calculations from user's current position.
 * 
 * @example
 * <ChargerList
 *   chargers={chargerData}
 *   userLocation={currentLocation}
 *   onChargerSelect={handleSelect}
 * />
 */
```

### API Documentation

- Document all endpoints in `API.md`
- Include request/response examples
- Specify error conditions
- Note rate limits

## Community

### Getting Help

- **GitHub Issues** - For bugs and features
- **Discussions** - For questions and ideas
- **Code Reviews** - Learn from feedback

### Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes
- Special mentions for significant contributions

## Additional Resources

- [Project Architecture](ARCHITECTURE.md)
- [API Documentation](API.md)
- [Development Setup](README.md#development)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Next.js Documentation](https://nextjs.org/docs)

---

Thank you for contributing to Tesla Supercharger Finder! Your efforts help make electric vehicle charging more accessible to everyone. 🚗⚡