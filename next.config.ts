import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  // Melhora o hot reload e reduz erros durante desenvolvimento
  reactStrictMode: true,
  // Configuração do Turbopack (Next.js 16+ usa Turbopack por padrão)
  // Turbopack já é otimizado para hot reload, não precisa de configuração adicional
  turbopack: {},
  // Headers para melhorar a experiência durante hot reload
}

export default nextConfig
