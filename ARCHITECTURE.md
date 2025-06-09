# Architecture Documentation

## System Overview

The Tesla Supercharger Finder is a modern web application built with Next.js 14, utilizing a client-server architecture with server-side rendering capabilities.

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Browser                        │
├─────────────────────────────────────────────────────────────┤
│                    Next.js Frontend (React)                  │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Pages     │  │  Components  │  │  Custom Hooks    │  │
│  │  - Home     │  │  - Map       │  │  - useGeolocation│  │
│  │            │  │  - ChargerList│  │  - useChargers   │  │
│  └─────────────┘  └──────────────┘  └──────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    API Layer (Route Handlers)                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────┐  │
│  │ /api/health     │  │ /api/places     │  │ /api/tesla │  │
│  │                 │  │     /nearby     │  │-superchargers│ │
│  └─────────────────┘  └─────────────────┘  └────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                      External Services                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────┐  │
│  │  Google Places  │  │  OpenStreetMap  │  │   Future:  │  │
│  │      API        │  │    (Leaflet)    │  │ Tesla API  │  │
│  └─────────────────┘  └─────────────────┘  └────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Leaflet** - Open-source map library

### Backend
- **Next.js API Routes** - Serverless functions
- **Node.js** - JavaScript runtime

### Development
- **Docker** - Containerization
- **pnpm** - Fast, disk space efficient package manager
- **Vitest** - Unit testing
- **Playwright** - E2E testing

### Deployment
- **Vercel** - Hosting platform (primary)
- **Docker** - Self-hosting option

## Component Architecture

### Core Components

```
src/components/
├── LeafletMap.tsx         # Main map component using Leaflet
├── ChargerList.tsx        # List view of chargers with filtering
├── Header.tsx             # App header with branding
├── SearchFilter.tsx       # Search and filter controls
├── NearbyPlaces.tsx       # Display nearby facilities
├── CurrentLocationButton.tsx  # GPS location control
└── MobileBottomSheet.tsx  # Mobile-friendly bottom sheet
```

### Component Relationships

```
App (page.tsx)
├── Header
├── Container
│   ├── SearchFilter
│   ├── ChargerList
│   │   └── NearbyPlaces
│   └── LeafletMap
│       └── CurrentLocationButton
└── MobileBottomSheet (mobile only)
```

## Data Flow

### 1. Initial Load
```
User visits site
    ↓
Next.js SSR renders initial page
    ↓
Client hydrates React components
    ↓
useTeslaSuperchargers hook fetches data
    ↓
Map and list components render chargers
```

### 2. Location Detection
```
User clicks "Current Location"
    ↓
useGeolocation hook requests permission
    ↓
Browser provides coordinates
    ↓
Map centers on location
    ↓
Distance calculations update
```

### 3. Nearby Places Search
```
User selects a charger
    ↓
NearbyPlaces component triggers API call
    ↓
/api/places/nearby proxies to Google Places
    ↓
Results displayed in UI
```

## State Management

The application uses React's built-in state management:

- **Local State**: Component-specific state using `useState`
- **Shared State**: Prop drilling for parent-child communication
- **Server State**: API data fetched via custom hooks

### Key State Areas

1. **Charger Data**
   - List of superchargers
   - Filtered/sorted results
   - Selected charger

2. **User Location**
   - Current coordinates
   - Location permission status
   - Distance calculations

3. **UI State**
   - Filter visibility
   - Mobile sheet open/closed
   - Loading states

## API Design

### RESTful Endpoints

All APIs follow REST conventions:

- `GET /api/health` - Health check
- `GET /api/tesla-superchargers` - Charger list
- `GET /api/places/nearby` - Nearby places

### Response Format

Consistent JSON structure:

```json
{
  "data": {},      // Success response
  "error": "",     // Error message
  "status": ""     // Status code
}
```

## Security Considerations

### API Key Protection
- Server-side API calls only
- Environment variables for secrets
- No client-side API key exposure

### Input Validation
- Query parameter validation
- Type checking with TypeScript
- Sanitization of user inputs

### CORS Configuration
- Restricted origins in production
- Proper headers for API responses

## Performance Optimizations

### Code Splitting
- Dynamic imports for heavy components
- Route-based code splitting via Next.js

### Caching Strategy
- Static data cached for 1 hour
- API responses cached appropriately
- Browser caching for assets

### Image Optimization
- Next.js Image component for optimization
- Lazy loading for off-screen images
- Appropriate image formats

### Map Performance
- Marker clustering for many points
- Viewport-based rendering
- Debounced user interactions

## Scalability Considerations

### Horizontal Scaling
- Stateless application design
- Vercel automatic scaling
- Docker Swarm/Kubernetes ready

### Data Scaling
- Currently static JSON data
- Ready for database integration
- API pagination prepared

### Geographic Scaling
- Multi-region deployment capable
- CDN for static assets
- Edge functions for API routes

## Monitoring and Observability

### Current Implementation
- Basic health check endpoint
- Console logging for errors
- Browser error boundaries

### Future Enhancements
- Sentry error tracking
- Performance monitoring
- User analytics
- API metrics

## Development Workflow

### Local Development
```
Docker Compose
    ↓
Hot Module Replacement
    ↓
TypeScript Compilation
    ↓
Browser Auto-reload
```

### Testing Pipeline
```
Unit Tests (Vitest)
    ↓
Integration Tests
    ↓
E2E Tests (Playwright)
    ↓
Build Verification
```

### Deployment Pipeline
```
Git Push
    ↓
CI/CD (GitHub Actions)
    ↓
Automated Tests
    ↓
Vercel Deployment
    ↓
Production
```

## Future Architecture Considerations

### Microservices
- Separate charger data service
- User management service
- Route planning service

### Real-time Features
- WebSocket for live updates
- Server-sent events for availability
- Push notifications

### Data Layer
- PostgreSQL for structured data
- Redis for caching
- Elasticsearch for search

### Mobile Apps
- React Native code sharing
- API-first design
- Progressive Web App

## Decision Log

### Why Next.js 14?
- Server-side rendering for SEO
- API routes for backend
- Excellent developer experience
- Vercel integration

### Why Leaflet over Google Maps?
- No API key required
- Open source
- Full control over styling
- Cost-effective

### Why TypeScript?
- Type safety
- Better IDE support
- Self-documenting code
- Fewer runtime errors

### Why Docker?
- Consistent environments
- Easy deployment
- Local development parity
- Team collaboration