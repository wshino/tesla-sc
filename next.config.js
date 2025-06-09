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
  transpilePackages: ['react-leaflet', '@react-leaflet/core'],
  
  // Performance optimizations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Experimental features for better performance
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: [],
  },
  
  // Docker environment configuration
  webpack: (config, { dev, isServer }) => {
    // Enable hot reload in Docker
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    
    // Optimize bundle size
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name: 'lib',
              priority: 10,
              reuseExistingChunk: true,
            },
            leaflet: {
              test: /[\\/]node_modules[\\/](leaflet|react-leaflet)[\\/]/,
              name: 'leaflet',
              priority: 20,
            },
          },
        },
      }
    }
    
    return config
  },
}

module.exports = nextConfig
