import { Suspense } from 'react'
import { ImagePickerView } from './_components/view'

export default function ImagePickerPage() {
  return (
    <Suspense
      fallback={
        <div className='flex h-screen items-center justify-center'>
          <div className='text-muted-foreground'>Loading...</div>
        </div>
      }>
      <ImagePickerView />
    </Suspense>
  )
}
