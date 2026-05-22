/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // face-api.js -> @tensorflow/tfjs-core -> node-fetch references the
    // optional `encoding` package. Stub it out on both bundles so the build
    // doesn't emit a missing-module warning.
    config.resolve.fallback = {
      ...config.resolve.fallback,
      encoding: false,
    };
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
};

export default nextConfig;