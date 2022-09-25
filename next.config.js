/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      'next-kylo-reddit.s3.eu-central-1.amazonaws.com',
      'next-kylo-reddit.s3.amazonaws.com',
      'placeimg.com'
    ],
  },
}

module.exports = nextConfig
