'use client'

import { cn } from '@/lib/utils'
import { DEFAULT_CODE } from '@/shared/constants/snap-code'
import { useCodeSnapshot } from '@/shared/contexts/codeSnapshotContext'
import Editor, { OnMount } from '@monaco-editor/react'
import { Eraser } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { getThemeBackground } from './utils'

interface SnapshotEditorProps {
  onScroll?: (percentage: number) => void
  editorRef?: React.RefObject<any>
}

export function SnapshotEditor({ onScroll, editorRef: externalEditorRef }: SnapshotEditorProps) {
  const { code, setCode, config } = useCodeSnapshot()
  const internalEditorRef = useRef<any | null>(null)
  const rafIdRef = useRef<number | null>(null)
  const onScrollRef = useRef(onScroll)
  useEffect(() => {
    onScrollRef.current = onScroll
  }, [onScroll])

  // Sincronizar ref interna com ref externa
  useEffect(() => {
    if (externalEditorRef && internalEditorRef.current) {
      externalEditorRef.current = internalEditorRef.current
    }
  }, [externalEditorRef])

  const handleScrollSync = useCallback((editor: any) => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current)
    }

    rafIdRef.current = requestAnimationFrame(() => {
      if (onScrollRef.current) {
        const visibleRanges = editor.getVisibleRanges()
        if (visibleRanges.length > 0) {
          const scrollHeight = editor.getScrollHeight()
          const scrollTop = editor.getScrollTop()
          const clientHeight = editor.getLayoutInfo().height
          const scrollableHeight = scrollHeight - clientHeight
          if (scrollableHeight > 0) {
            const percentage = scrollTop / scrollableHeight
            onScrollRef.current(percentage)
          }
        }
      }
      rafIdRef.current = null
    })
  }, [])

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [])

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    internalEditorRef.current = editor
    if (externalEditorRef) {
      externalEditorRef.current = editor
    }
    monaco.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#00000000', // Transparente para usar o bg do container
      },
    })
    monaco.editor.setTheme('custom-dark')

    // Sincronizar scroll
    if (onScroll) {
      editor.onDidScrollChange(() => {
        handleScrollSync(editor)
      })
    }
  }

  // Obtém o background do tema atual
  const themeBackground = useMemo(() => getThemeBackground(config.theme), [config.theme])

  // Atualizar ligaduras quando a configuração mudar
  useEffect(() => {
    if (internalEditorRef.current) {
      internalEditorRef.current.updateOptions({
        fontLigatures: config.fontLigatures,
      })
    }
  }, [config.fontLigatures])

  return (
    <div
      className={cn('flex h-full w-full min-w-[40dvw] flex-col items-center')}
      style={{ backgroundColor: themeBackground, transition: 'background-color 0.3s ease' }}>
      <div className='flex h-full w-full flex-col' style={{ backgroundColor: themeBackground }}>
        <div className='flex h-11 shrink-0 items-center justify-between border-b border-white/5 bg-zinc-950/80 px-4 backdrop-blur-sm'>
          <div className='flex items-center gap-2'>
            <div className='bg-primary/20 border-primary/30 flex h-5 w-5 items-center justify-center rounded border'>
              <div className='bg-primary h-2 w-2 rounded-full' />
            </div>
            <span className='text-[10px] font-bold tracking-widest text-zinc-400 uppercase'>
              Editor
            </span>
          </div>
          <div className='flex items-center gap-2 text-[10px] font-bold tracking-widest text-zinc-400 uppercase'>
            {config.language}
            <div
              className='group cursor-pointer rounded-md border border-zinc-400 p-1 group-hover:text-black hover:bg-zinc-400'
              onClick={() => setCode(DEFAULT_CODE)}>
              <Eraser className='h-4 w-4 text-zinc-400 group-hover:text-black' />
            </div>
          </div>
        </div>
        <div className='relative flex-1 overflow-hidden'>
          <Editor
            height='100%'
            defaultLanguage={config.language}
            language={config.language}
            value={code}
            theme='vs-dark'
            onChange={(value) => setCode(value || '')}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: config.fontFamily || 'var(--font-mono)',
              fontLigatures: config.fontLigatures,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 20, bottom: 20 },
              renderLineHighlight: 'line',
              contextmenu: true,
              overviewRulerBorder: false,
              hideCursorInOverviewRuler: true,
              wordWrap: 'on',
              scrollbar: {
                vertical: 'auto',
                horizontal: 'auto',
                useShadows: false,
                verticalHasArrows: false,
                horizontalHasArrows: false,
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}
