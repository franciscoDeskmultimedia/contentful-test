/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    loader: 'custom',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.images.ctfassets.net',
      },
    ],
  },
}
