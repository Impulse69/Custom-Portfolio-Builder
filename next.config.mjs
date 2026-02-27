/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        https: false,
        http: false,
        url: false,
        "node:fs": false,
        "node:net": false,
        "node:tls": false,
        "node:https": false,
        "node:http": false,
        "node:url": false,
        "node:util": false,
        "node:stream": false,
        "node:zlib": false,
      };
      config.resolve.alias = {
        ...config.resolve.alias,
        "node:https": false,
        "node:http": false,
        "node:fs": false,
        "node:net": false,
        "node:tls": false,
        "node:url": false,
        "node:stream": false,
        "node:zlib": false,
        "node:util": false,
      };
    }
    return config
  },
}

export default nextConfig
