/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configuración optimizada para Amplify
  images: {
    unoptimized: true,
    domains: [
      'sandbox.d3ts6pwgn7uyyh.amplifyapp.com',
      'production.d3ts6pwgn7uyyh.amplifyapp.com',
      'd3ts6pwgn7uyyh.amplifyapp.com',
      's3.amazonaws.com',
      'cloudfront.amazonaws.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: '*.amplifyapp.com',
      }
    ]
  },
  
  // Variables de entorno
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_CLIENTS_API_URL: process.env.NEXT_PUBLIC_CLIENTS_API_URL,
  },
  
  // Headers para CORS
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
