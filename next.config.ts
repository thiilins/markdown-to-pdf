import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Transpilar pacotes que podem ter problemas com o bundler
  transpilePackages: ['prettier'],

  turbopack: {},
}

export default nextConfig
