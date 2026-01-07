import { Suspense } from 'react'
import { CodeSnapshotView } from './_component/view'

export default function CodeSnapPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Carregando...</div>}>
      <CodeSnapshotView />
    </Suspense>
  )
}
