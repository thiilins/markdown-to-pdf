import { Suspense } from 'react'
import { ContrastCheckerView } from './_components/view'

export default function ContrastCheckerPage() {
  return (
    <Suspense
      fallback={
        <div className='flex h-screen items-center justify-center'>
          <div className='text-muted-foreground'>Loading...</div>
        </div>
      }>
      <ContrastCheckerView />
    </Suspense>
  )
}
