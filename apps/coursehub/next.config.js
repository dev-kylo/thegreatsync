/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      'placeimg.com',
      'res.cloudinary.com',
      'the-great-sync.s3.amazonaws.com',
      'the-great-sync-bucket.s3.amazonaws.com'
    ],
  },
}

module.exports = nextConfig



