import { Suspense } from 'react'
import { ColorPickerView } from './_components/view'

export default function ColorPickerPage() {
  return (
    <Suspense
      fallback={
        <div className='flex h-screen items-center justify-center'>
          <div className='text-muted-foreground'>Loading...</div>
        </div>
      }>
      <ColorPickerView />
    </Suspense>
  )
}
