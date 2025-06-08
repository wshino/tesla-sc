# Docker Production Deployment Guide

This guide explains how to deploy the Tesla Supercharger Finder app using Docker in production.

## Prerequisites

- Docker Engine installed (version 20.10+)
- Docker Compose installed (version 2.0+)
- Server with at least 1GB RAM
- Domain name (optional but recommended)

## Quick Start

```bash
# Clone the repository
git clone https://github.com/wshino/tesla-sc.git
cd tesla-sc

# Create environment file
echo "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here" > .env.production

# Build and run with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

## Detailed Setup

### 1. Environment Configuration

Create a `.env.production` file:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
# Add other production environment variables as needed
```

### 2. Build Production Image

```bash
# Build the production Docker image
docker build -f Dockerfile.prod -t tesla-sc:latest .

# Or use Docker Compose
docker-compose -f docker-compose.prod.yml build
```

### 3. Run the Container

#### Using Docker Compose (Recommended)

```bash
# Start the service
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

#### Using Docker directly

```bash
# Run the container
docker run -d \
  --name tesla-sc \
  -p 3000:3000 \
  -e NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key \
  --restart unless-stopped \
  tesla-sc:latest
```

### 4. Health Check

The application includes a health check endpoint:

```bash
# Check if the app is healthy
curl http://localhost:3000/api/health
```

Expected response:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-10T12:00:00.000Z",
  "uptime": 3600
}
```

## Production Deployment on Cloud Providers

### Deploy on AWS EC2

1. Launch EC2 instance (t3.small or larger)
2. Install Docker:

   ```bash
   sudo yum update -y
   sudo yum install docker -y
   sudo service docker start
   sudo usermod -a -G docker ec2-user
   ```

3. Install Docker Compose:

   ```bash
   sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

4. Deploy the application:
   ```bash
   git clone https://github.com/wshino/tesla-sc.git
   cd tesla-sc
   # Create .env.production
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Deploy on Google Cloud Run

1. Build and push to Google Container Registry:

   ```bash
   # Configure Docker for GCR
   gcloud auth configure-docker

   # Build and tag
   docker build -f Dockerfile.prod -t gcr.io/YOUR_PROJECT_ID/tesla-sc:latest .

   # Push
   docker push gcr.io/YOUR_PROJECT_ID/tesla-sc:latest
   ```

2. Deploy to Cloud Run:
   ```bash
   gcloud run deploy tesla-sc \
     --image gcr.io/YOUR_PROJECT_ID/tesla-sc:latest \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key
   ```

### Deploy on DigitalOcean App Platform

1. Push your code to GitHub
2. Create new App in DigitalOcean
3. Select Docker as the build type
4. Configure environment variables
5. Deploy

## Nginx Reverse Proxy Setup

For production, use Nginx as a reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## SSL/HTTPS Setup with Let's Encrypt

```bash
# Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

## Monitoring and Logging

### View Container Logs

```bash
# Real-time logs
docker-compose -f docker-compose.prod.yml logs -f

# Last 100 lines
docker-compose -f docker-compose.prod.yml logs --tail=100
```

### Container Stats

```bash
# Monitor resource usage
docker stats tesla-sc
```

### Setup Log Rotation

Create `/etc/logrotate.d/docker-tesla-sc`:

```
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    size 10M
    missingok
    delaycompress
}
```

## Backup and Recovery

### Backup Strategy

Since the app uses static data and external APIs, backups are minimal:

```bash
# Backup environment configuration
cp .env.production .env.production.backup

# Backup Docker volumes if any
docker run --rm -v tesla-sc_data:/data -v $(pwd):/backup alpine tar czf /backup/backup.tar.gz /data
```

## Updating the Application

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

## Performance Optimization

### 1. Enable BuildKit

```bash
export DOCKER_BUILDKIT=1
docker build -f Dockerfile.prod -t tesla-sc:latest .
```

### 2. Multi-stage Build Caching

The Dockerfile.prod already uses multi-stage builds for optimal image size.

### 3. Resource Limits

Add to docker-compose.prod.yml:

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Verify build
docker-compose -f docker-compose.prod.yml build --no-cache
```

### High Memory Usage

```bash
# Check memory usage
docker stats tesla-sc

# Restart container
docker-compose -f docker-compose.prod.yml restart
```

### Network Issues

```bash
# Inspect network
docker network ls
docker network inspect tesla-sc_default
```

## Security Best Practices

1. **Keep Docker Updated**

   ```bash
   sudo apt update && sudo apt upgrade docker-ce
   ```

2. **Use Non-root User** (already configured in Dockerfile)

3. **Limit Container Capabilities**

   ```yaml
   security_opt:
     - no-new-privileges:true
   ```

4. **Regular Security Scans**
   ```bash
   docker scan tesla-sc:latest
   ```

## Useful Commands

```bash
# Stop the service
docker-compose -f docker-compose.prod.yml down

# Remove all containers and volumes
docker-compose -f docker-compose.prod.yml down -v

# Rebuild without cache
docker-compose -f docker-compose.prod.yml build --no-cache

# Scale horizontally (requires load balancer)
docker-compose -f docker-compose.prod.yml up -d --scale app=3
```
