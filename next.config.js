/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['localhost', 'be-ingco.store', 'api-ingco-service.win'],
  },
};

module.exports = nextConfig;
