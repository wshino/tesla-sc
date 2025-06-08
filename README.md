# Tesla Supercharger Finder

A web application to find Tesla Superchargers near you with real-time location tracking and nearby facilities information.

## Features

- 🗺️ Interactive map showing Tesla Supercharger locations
- 📍 Automatic user location detection
- 📏 Distance calculation from your current location
- 🔍 Real-time search and filtering by status, amenities, country, and stall count
- 🏪 Nearby entertainment spots and facilities (restaurants, cafes, shopping, etc.)
- 📱 Responsive design with mobile-friendly sidebar
- 🚀 Free map display (using OpenStreetMap/Leaflet)

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Map**: Leaflet (open-source, no API key needed)
- **Nearby Places**: Google Places API (optional)
- **Styling**: Tailwind CSS
- **Testing**: Vitest, React Testing Library, Playwright (E2E)
- **Development**: Docker, pnpm
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Docker and Docker Compose installed
- Git

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/wshino/tesla-sc.git
cd tesla-sc

# 2. (Optional) Set up Google Places API for nearby places
cp .env.example .env.local
# Edit .env.local and add your Google Maps API key

# 3. Start with Docker
docker-compose up

# 4. Open in browser
# http://localhost:3000
```

The app works without any API keys. To enable the nearby places feature, you'll need a Google Maps API key with Places API enabled.

## Development

### Running locally without Docker

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

### Docker Commands

```bash
# Enter container shell
docker-compose exec app sh

# Install new packages
docker-compose exec app pnpm add <package-name>

# Run type check
docker-compose exec app pnpm type-check

# Run linter
docker-compose exec app pnpm lint

# Run tests
docker-compose exec app pnpm test

# Format code
docker-compose exec app pnpm format
```

### Testing

```bash
# Unit tests
docker-compose exec app pnpm test

# E2E tests (requires Playwright browsers)
docker-compose exec app pnpm test:e2e

# E2E tests for CI (uses system Chromium)
docker-compose exec app pnpm test:e2e:ci

# Basic E2E tests only (faster, for CI)
docker-compose exec app pnpm test:e2e:ci:basic
```

**Note on E2E Tests:**

Some E2E tests require external API keys:

- Nearby places functionality tests (requires Google Maps API key)
- Map integration tests that require real map data
- Location-based features that need geocoding services

**Local Development:** All tests will run if you have API keys configured in `.env.local`
**CI Environment:** Tests requiring API keys are skipped to prevent failures. The app itself works without API keys, only the nearby places feature is affected.

## Project Structure

```
tesla-sc/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── api/            # API routes
│   │   └── page.tsx        # Main page
│   ├── components/         # React components
│   │   ├── LeafletMap.tsx  # Map component
│   │   ├── ChargerList.tsx # Charger list sidebar
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── data/               # Static data
│   └── types/              # TypeScript types
├── public/                 # Static assets
├── docker-compose.yml      # Docker configuration
├── Dockerfile.dev          # Development Dockerfile
└── ...
```

## Available Supercharger Data

Currently includes data for:

- **Japan**: Tokyo (Roppongi, Odaiba, Daikanyama, Akasaka, Akihabara, Yaesu), Osaka, Kyoto, Yokohama, Nagoya, Kobe, Fukuoka
- **USA**: Los Angeles, San Francisco, New York, Chicago, Las Vegas, Seattle, Miami, Austin, Boston, Denver, Portland, Phoenix, Nashville, San Diego, Atlanta, Washington DC, Dallas

## Troubleshooting

### Port 3000 is already in use

Edit `docker-compose.yml`:

```yaml
ports:
  - '3001:3000' # Access via port 3001
```

### Docker build issues

```bash
docker-compose down
docker volume prune
docker-compose up --build
```

### pnpm version mismatch

The project uses pnpm 10.11.1. If you see version warnings:

```bash
COREPACK_ENABLE_STRICT=0 pnpm install
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Tesla Supercharger location data
- OpenStreetMap for map tiles
- Leaflet for map rendering
