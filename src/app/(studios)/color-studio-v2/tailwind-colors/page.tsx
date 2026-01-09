import { Suspense } from 'react'
import { TailwindColorsView } from './_components/view'
export default function TailwindColorsPage() {
  return (
    <Suspense
      fallback={
        <div className='flex h-screen items-center justify-center'>
          <div className='text-muted-foreground'>Loading...</div>
        </div>
      }>
      <TailwindColorsView />
    </Suspense>
  )
}
