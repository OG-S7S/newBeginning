/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove ignoreBuildErrors for production - fix TypeScript errors instead
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
