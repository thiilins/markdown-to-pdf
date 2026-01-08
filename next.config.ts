import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Pacotes que devem ser externos no servidor (não bundlados)
  serverExternalPackages: ['prettier'],

  turbopack: {},
}

export default nextConfig
