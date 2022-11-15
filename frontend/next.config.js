/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      'placeimg.com',
      'res.cloudinary.com'
    ],
  },
}

module.exports = nextConfig
