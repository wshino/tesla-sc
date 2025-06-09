# Tesla Supercharger Finder - TODO List

## Completed ✅

- [x] Select tech stack (Next.js full-stack)
- [x] Docker environment setup (Dockerfile, docker-compose)
- [x] Next.js project initial setup
- [x] Map display implementation (Leaflet)
- [x] Supercharger data static JSON file creation
- [x] Current location and nearest charger display
- [x] Test environment setup (Vitest, Testing Library)
- [x] Display supercharger markers on map
- [x] Connect current location to nearest charger calculation
- [x] Google Places API nearby facility search
- [x] Search and filter functionality
- [x] Responsive design support
- [x] E2E tests (Playwright)
- [x] Integration of all features on main page

## Phase 1 - New Features 🚀

### Favorites Feature

- [ ] Add favorite button to charger items
- [ ] Store favorites in localStorage
- [ ] Create favorites filter/view
- [ ] Show favorite chargers at top of list (optional)
- [ ] Add/remove animation for favorites
- [ ] Tests for favorites functionality

### Charging Timer Feature

- [ ] Add charging timer component
- [ ] Allow users to set expected charging time
- [ ] Show countdown timer
- [ ] Browser notification when charging complete
- [ ] Suggest activities based on remaining time
- [ ] Persist timer state in localStorage
- [ ] Tests for timer functionality

### Native Ads Feature

- [ ] Create sponsored content component
- [ ] Insert ads every 5 items in charger list
- [ ] Add "Sponsored" or "Ad" label to ads
- [ ] Style ads to blend naturally but be distinguishable
- [ ] Track ad impressions/clicks
- [ ] Create ad content management system
- [ ] Ensure ads don't break existing functionality
- [ ] Tests for ad display logic

## Phase 2 - Future Features 🔄

- [ ] Simple route planning with charging stops
- [ ] Charger rating system (5-star)
- [ ] Context-aware ads based on charging time
- [ ] Charging history tracking

## Phase 3 - Advanced Features 🔮

- [ ] Community features (photos, comments)
- [ ] Crowd-sourced availability prediction
- [ ] Advanced ad optimization

## Implementation Details

### Next.js Project Initial Setup

- Create Next.js app with TypeScript
- Configure Tailwind CSS
- Set up ESLint and Prettier
- Create basic folder structure
- Switch from npm to pnpm

### Map Display Implementation

- Install react-map-gl and mapbox-gl
- Create Map component
- Add Mapbox token configuration
- Implement basic map controls

### Supercharger Data

- Create JSON schema for charger data
- Add sample data for major cities
- Implement data loading utility

### Current Location Features

- Use browser Geolocation API
- Add location permission handling
- Calculate nearest chargers
- Show distance from current location

### Nearby Facility Search

- Implement Google Places API integration
- Add search radius configuration
- Filter by place types (restaurants, shopping, etc.)
- Cache API responses

### Filter Functionality

- Filter by distance
- Filter by charger availability
- Filter by amenities
- Save filter preferences

### Responsive Design

- Mobile-first approach
- Touch-friendly controls
- Optimize for different screen sizes
- Progressive Web App features

### Vercel Deployment

- Configure environment variables
- Set up CI/CD pipeline
- Optimize build performance
- Configure custom domain

## Git Worktree Branches for Phase 1

- `main` - Main development branch
- `feature/favorites` - Favorites functionality implementation
- `feature/charging-timer` - Charging timer and notifications
- `feature/native-ads` - Native advertising integration

### Worktree Setup Commands

```bash
# Create worktrees directory (already in .gitignore)
mkdir -p worktrees

# Create feature branches and worktrees
git worktree add worktrees/favorites -b feature/favorites
git worktree add worktrees/charging-timer -b feature/charging-timer
git worktree add worktrees/native-ads -b feature/native-ads
```

### Development Workflow

1. Each feature is developed in its own worktree
2. Changes are committed to feature branches
3. Pull requests are created for code review
4. Features are merged to main after testing
5. Worktrees are removed after merge:
   ```bash
   git worktree remove worktrees/[feature-name]
   git branch -d feature/[feature-name]
   ```
