/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['aws-sdk', '@aws-sdk/client-dynamodb', '@aws-sdk/client-s3']
  },
  images: {
    domains: ['localhost', 's3.amazonaws.com', 'cloudfront.amazonaws.com', 'sandbox.d3ts6pwgn7uyyh.amplifyapp.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
    ],
  },
  output: 'standalone',
  trailingSlash: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
