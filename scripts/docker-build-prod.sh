#!/bin/bash

echo "🐳 Building Tesla SC production Docker image..."
echo ""

# Enable BuildKit for better performance
export DOCKER_BUILDKIT=1

# Build the production image
echo "📦 Building production image..."
if docker build -f Dockerfile.prod -t tesla-sc:latest .; then
    echo "✅ Production image built successfully"
else
    echo "❌ Failed to build production image"
    exit 1
fi

# Show image info
echo ""
echo "📊 Image information:"
docker images tesla-sc:latest

# Test the image
echo ""
echo "🧪 Testing the production image..."
docker run --rm -d --name tesla-sc-test -p 3001:3000 tesla-sc:latest

# Wait for container to start
echo "⏳ Waiting for container to start..."
sleep 5

# Check health endpoint
echo "🏥 Checking health endpoint..."
if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ Health check passed"
    
    # Get health response
    echo ""
    echo "📋 Health check response:"
    curl -s http://localhost:3001/api/health | jq .
else
    echo "❌ Health check failed"
fi

# Cleanup test container
echo ""
echo "🧹 Cleaning up test container..."
docker stop tesla-sc-test

echo ""
echo "✅ Production build complete!"
echo ""
echo "To run in production:"
echo "  docker-compose -f docker-compose.prod.yml up -d"
echo ""
echo "Or run directly:"
echo "  docker run -d -p 3000:3000 -e NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key tesla-sc:latest"