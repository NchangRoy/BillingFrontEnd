

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard', // Change this to your desired page
        permanent: true,
      },
    ];
  },
};

export default nextConfig;