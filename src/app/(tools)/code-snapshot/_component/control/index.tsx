'use client'

import { Separator } from '@/components/ui/separator'
import { createShareableUrl } from '@/lib/routing'
import { useCodeSnapshot } from '@/shared/contexts/codeSnapshotContext'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  CanvasBackgroundControl,
  CanvasConfigControl,
  CanvasFooterControl,
  CanvasHeaderControl,
  CanvasSizeControl,
  CanvasStyleControl,
  ControlHeader,
  DiffControl,
  LineHighlightControl,
  NotesControl,
} from './component'
import { GistImport } from './component/gist-import'

export function SnapshotControls({ compact = false }: { compact?: boolean }) {
  const { code, config, updateConfig, resetConfig } = useCodeSnapshot()
  const [showGistImport, setShowGistImport] = useState(false)

  const handleShare = async () => {
    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin + '/code-snapshot' : ''
      const state = { code, ...config }

      // Para conteúdo extenso, sempre usa serialização base64
      const useSerialized = code.length > 500
      const url = createShareableUrl(state, baseUrl, useSerialized)

      await navigator.clipboard.writeText(url)
      toast.success('URL copiada para a área de transferência!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao copiar URL')
    }
  }

  return (
    <aside className='flex h-full w-full max-w-[390px] min-w-[390px] transition-all duration-300'>
      <div className='bg-card flex h-full w-full flex-col overflow-hidden'>
        <ControlHeader handleShare={handleShare} resetConfig={resetConfig} />
        <main className='scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-primary/10 gap-4 space-y-4 overflow-y-auto rounded-lg p-4'>
          <GistImport />
          <Separator />
          <CanvasConfigControl />
          <Separator />
          <CanvasSizeControl />
          <Separator />
          <CanvasStyleControl />
          <Separator />
          <CanvasHeaderControl />
          <Separator />
          <CanvasFooterControl />
          <Separator />
          <CanvasBackgroundControl />
          <Separator />
          <DiffControl />
          <Separator />
          <LineHighlightControl />
          <Separator />
          <NotesControl />
        </main>
      </div>
    </aside>
  )
}
