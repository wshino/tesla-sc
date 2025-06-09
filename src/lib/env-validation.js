/**
 * Environment variable validation
 * This module validates required environment variables at startup
 */

const REQUIRED_ENV_VARS = [
  {
    name: 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
    description: 'Google Maps API key for map functionality',
    required: false, // Optional for development
  },
]

function validateEnvironmentVariables() {
  const errors = []
  const warnings = []

  REQUIRED_ENV_VARS.forEach((envVar) => {
    const value = process.env[envVar.name]

    if (!value && envVar.required) {
      errors.push(
        `Missing required environment variable: ${envVar.name} - ${envVar.description}`
      )
    } else if (!value && !envVar.required) {
      warnings.push(
        `Optional environment variable not set: ${envVar.name} - ${envVar.description}`
      )
      if (envVar.defaultValue) {
        process.env[envVar.name] = envVar.defaultValue
      }
    }
  })

  // Log warnings
  if (warnings.length > 0) {
    console.warn('Environment variable warnings:')
    warnings.forEach((warning) => console.warn(`  - ${warning}`))
  }

  // Throw error if required variables are missing
  if (errors.length > 0) {
    console.error('Environment variable errors:')
    errors.forEach((error) => console.error(`  - ${error}`))
    throw new Error(
      'Missing required environment variables. Please check your .env.local file.'
    )
  }

  console.log('Environment variables validated successfully')
}

// Helper function to get env var with fallback
function getEnvVar(name, fallback) {
  return process.env[name] || fallback || ''
}

module.exports = {
  validateEnvironmentVariables,
  getEnvVar,
}
