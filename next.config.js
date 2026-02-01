/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Suppress source map warnings from @mediapipe
  webpack: (config, { isServer }) => {
    config.ignoreWarnings = [
      { module: /node_modules\/@mediapipe/ },
    ];
    return config;
  },
};

module.exports = nextConfig;
