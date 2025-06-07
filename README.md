# Tesla Supercharger Finder

A web application to find Tesla Superchargers near you with real-time location tracking and nearby facilities information.

## Features

- 🗺️ Interactive map showing Tesla Supercharger locations
- 📍 Automatic user location detection
- 📏 Distance calculation from your current location
- 🔍 Real-time search and filtering (coming soon)
- 🏪 Nearby facilities information (coming soon)
- 📱 Responsive design (coming soon)
- 🚀 No API key required (using OpenStreetMap/Leaflet)

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Map**: Leaflet (open-source, no API key needed)
- **Styling**: Tailwind CSS
- **Testing**: Vitest, React Testing Library
- **Development**: Docker, pnpm
- **Deployment**: Vercel (coming soon)

## Getting Started

### Prerequisites

- Docker and Docker Compose installed
- Git

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/wshino/tesla-sc.git
cd tesla-sc

# 2. Start with Docker
docker-compose up

# 3. Open in browser
# http://localhost:3000
```

That's it! No API keys or complex setup required.

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
