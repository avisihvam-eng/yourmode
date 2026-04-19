/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/today',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
