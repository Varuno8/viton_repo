/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { appDir: true },
  images: {
    domains: ['localhost', 'images.unsplash.com'],
  },
};
export default nextConfig;
