import type { Metadata } from 'next'
import { Suspense } from 'react'
import { GeneratorView } from './_components/view'

export const metadata: Metadata = {
  title: 'Palette Generator - Color Studio',
  description:
    'Generate beautiful color palettes with ease. Lock colors, press spacebar to generate, and share via URL.',
}

export default function GeneratePage() {
  return (
    <Suspense
      fallback={
        <div className='flex h-screen items-center justify-center'>
          <div className='text-muted-foreground'>Loading...</div>
        </div>
      }>
      <GeneratorView />
    </Suspense>
  )
}
