/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ['192.168.56.1'],
  async redirects() {
    return [
      {
        source: '/photos',
        destination: '/gallery',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
