'use client'

import dynamic from 'next/dynamic'

// Carrega o componente apenas no cliente para evitar erro de SSR com Prettier
const JavascriptFormatterView = dynamic(() => import('./_components/view'), {
  ssr: false,
  loading: () => (
    <div className='flex h-[calc(100vh-4rem)] items-center justify-center'>
      <div className='text-muted-foreground'>Carregando formatador...</div>
    </div>
  ),
})

export default function JavascriptFormatterPage() {
  return <JavascriptFormatterView />
}
