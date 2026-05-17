/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
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
