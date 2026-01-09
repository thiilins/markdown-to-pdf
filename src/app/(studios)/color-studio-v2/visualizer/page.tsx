import { Suspense } from 'react'
import { VisualizerView } from './_components/view'

export default function VisualizerPage() {
  return (
    <Suspense
      fallback={
        <div className='flex h-screen items-center justify-center'>
          <div className='text-muted-foreground'>Loading...</div>
        </div>
      }>
      <VisualizerView />
    </Suspense>
  )
}
