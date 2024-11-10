/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'placeimg.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'the-great-sync.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'the-great-sync-bucket.s3.amazonaws.com',
      },
    ],
  },
}

module.exports = nextConfig