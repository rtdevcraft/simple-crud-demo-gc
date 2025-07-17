import { Pool, PoolConfig } from 'pg'

declare global {
  var pool: Pool | undefined
}

let pool: Pool

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error(
    'DATABASE_URL environment variable is not defined. Please check your .env.local file or your deployment environment variables.'
  )
}

// Base configuration that will be used in all environments.
const config: PoolConfig = {
  connectionString,
}

// When running on Google Cloud Run (in production), the connection to Cloud SQL
// is handled through a secure Unix socket. The DATABASE_URL is automatically
// configured by the deployment workflow, and SSL is not needed.
// For any other environment (like local development with Neon/Vercel),
// we add the SSL configuration.
if (process.env.NODE_ENV !== 'production') {
  config.ssl = {
    // This is necessary for connecting to services like Neon that use self-signed certificates.
    rejectUnauthorized: false,
  }
}

// In development, we use a global variable to preserve the connection pool across
// module reloads caused by Hot Module Replacement (HMR). This prevents a new pool
// from being created on every code change.
// In production, we always create a new pool.
if (process.env.NODE_ENV === 'production') {
  pool = new Pool(config)
} else {
  if (!global.pool) {
    global.pool = new Pool(config)
  }
  pool = global.pool
}

export default pool
