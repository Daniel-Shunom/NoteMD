/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['assets.aceternity.com'],
      },
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:5000/api/:path*', // Proxy to Backend
        },
      ];
    },
};


export default nextConfig