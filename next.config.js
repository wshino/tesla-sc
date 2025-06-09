// Validate environment variables at build time
if (process.env.NODE_ENV !== 'test') {
  const { validateEnvironmentVariables } = require('./src/lib/env-validation')
  validateEnvironmentVariables()
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  // Docker environment configuration
  webpack: (config, { dev, isServer }) => {
    // Enable hot reload in Docker
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  },
}

module.exports = nextConfig
