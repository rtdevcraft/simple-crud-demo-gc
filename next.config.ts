import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // This option is crucial for Docker deployments.
  // It creates a minimal server with only the necessary files to run the app,
  // which is what our Dockerfile is designed to use.
  output: 'standalone',
}

export default nextConfig
