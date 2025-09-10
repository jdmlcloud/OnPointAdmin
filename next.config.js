/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Evita que el build falle por ESLint en CI. Lint corre en jobs previos.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Evita que el build falle por TS en CI. Type-check corre en jobs previos.
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['aws-sdk', '@aws-sdk/client-dynamodb', '@aws-sdk/client-s3']
  },
  images: {
    domains: ['https://sandbox.d3ts6pwgn7uyyh.amplifyapp.com', 's3.amazonaws.com', 'cloudfront.amazonaws.com', 'sandbox.d3ts6pwgn7uyyh.amplifyapp.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
      }
    ]
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
