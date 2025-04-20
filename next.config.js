/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // !! WARN !!
    // For demo purposes, ignore TypeScript errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // For demo purposes, ignore ESLint errors
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    // Provide mock modules for demo purposes
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'stream-chat': false,
      'stream-chat-react': false,
      'stream-chat-react/dist/css/index.css': false,
    };
    
    return config;
  },
  experimental: {
    // Enable experimental features to improve build performance
    serverComponentsExternalPackages: ['next', 'react', 'react-dom']
  },
  images: {
    domains: ['placehold.co'],
  },
}

module.exports = nextConfig
