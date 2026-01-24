

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login', // Change this to your desired page
        permanent: true,
      },
    ];
  },
};

export default nextConfig;