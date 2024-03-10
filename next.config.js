/** @type {import('next').NextConfig} */

const server= {
  experimental: {
    serverActions: true,
    instrumentationHook: true,
  },
  reactStrictMode: false, 
  webpack: (config) => {
    config.resolve.fallback = {
      "mongodb-client-encryption": false,
      "aws4": false
    };
    

    return config;
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}


module.exports = async (phase, { defaultConfig }) => {
  const nextConfig = {...server}
  return nextConfig
}
