import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  
  // 🎯 Turbopack dla Next 16
  turbopack: {},  // Wyłącz warning
  
  transpilePackages: ['three', '@react-three/fiber'],
  
  webpack(config) {
    config.module?.rules.push({
      test: /\.(glb|gltf)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/[hash][ext]'
      }
    })
    return config
  }
};

export default nextConfig;
