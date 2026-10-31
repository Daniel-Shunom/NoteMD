/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['pbs.twimg.com'], // Add your external image domains here
      },
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:5000/api/:path*', // Proxy to Backend
        },
      ];
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true
    }
};


export default nextConfig;
