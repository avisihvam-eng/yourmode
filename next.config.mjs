/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/today', destination: '/', permanent: true },
      { source: '/dashboard', destination: '/trend', permanent: true },
    ];
  },
};

export default nextConfig;
