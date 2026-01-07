'use client'

import { cn } from '@/lib/utils'
import { DEFAULT_CODE } from '@/shared/constants/snap-code'
import { useCodeSnapshot } from '@/shared/contexts/codeSnapshotContext'
import Editor, { OnMount } from '@monaco-editor/react'
import { ArrowDown, Eraser, GitCompare } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { getThemeBackground } from './utils'

interface SnapshotDiffEditorProps {
  onScroll?: (percentage: number) => void
  editorRef?: React.RefObject<any>
}

const DEFAULT_ORIGINAL = `// Código original (antes)
function hello() {
  console.log("Hello");
}`

export function SnapshotDiffEditor({
  onScroll,
  editorRef: externalEditorRef,
}: SnapshotDiffEditorProps) {
  const { code, setCode, config, updateConfig } = useCodeSnapshot()
  const modifiedEditorRef = useRef<any | null>(null)
  const originalEditorRef = useRef<any | null>(null)
  const rafIdRef = useRef<number | null>(null)
  const onScrollRef = useRef(onScroll)

  // Código original do config ou default
  const originalCode = config.diffOriginalCode || DEFAULT_ORIGINAL

  useEffect(() => {
    onScrollRef.current = onScroll
  }, [onScroll])

  useEffect(() => {
    if (externalEditorRef && modifiedEditorRef.current) {
      externalEditorRef.current = modifiedEditorRef.current
    }
  }, [externalEditorRef])

  const handleScrollSync = useCallback((editor: any) => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current)
    }

    rafIdRef.current = requestAnimationFrame(() => {
      if (onScrollRef.current && editor) {
        const scrollHeight = editor.getScrollHeight()
        const scrollTop = editor.getScrollTop()
        const clientHeight = editor.getLayoutInfo().height
        const scrollableHeight = scrollHeight - clientHeight
        if (scrollableHeight > 0) {
          const percentage = scrollTop / scrollableHeight
          onScrollRef.current(percentage)
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

  const handleModifiedEditorMount: OnMount = (editor, monaco) => {
    modifiedEditorRef.current = editor
    if (externalEditorRef) {
      externalEditorRef.current = editor
    }

    monaco.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#00000000',
      },
    })
    monaco.editor.setTheme('custom-dark')

    if (onScroll) {
      editor.onDidScrollChange(() => {
        handleScrollSync(editor)
      })
    }
  }

  const handleOriginalEditorMount: OnMount = (editor, monaco) => {
    originalEditorRef.current = editor

    monaco.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#00000000',
      },
    })
    monaco.editor.setTheme('custom-dark')
  }

  const handleModifiedChange = (value: string | undefined) => {
    setCode(value || '')
  }

  const handleOriginalChange = (value: string | undefined) => {
    updateConfig('diffOriginalCode', value || '')
  }

  const themeBackground = useMemo(() => getThemeBackground(config.theme), [config.theme])

  useEffect(() => {
    if (modifiedEditorRef.current) {
      modifiedEditorRef.current.updateOptions({ fontLigatures: config.fontLigatures })
    }
    if (originalEditorRef.current) {
      originalEditorRef.current.updateOptions({ fontLigatures: config.fontLigatures })
    }
  }, [config.fontLigatures])

  const handleReset = () => {
    updateConfig('diffOriginalCode', DEFAULT_ORIGINAL)
    setCode(DEFAULT_CODE)
  }

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 13,
    fontFamily: config.fontFamily || 'var(--font-mono)',
    fontLigatures: config.fontLigatures,
    lineNumbers: 'on' as const,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    padding: { top: 16, bottom: 16 },
    renderLineHighlight: 'line' as const,
    contextmenu: true,
    overviewRulerBorder: false,
    wordWrap: 'on' as const,
    scrollbar: {
      vertical: 'auto' as const,
      horizontal: 'auto' as const,
      useShadows: false,
    },
  }

  return (
    <div
      className={cn('flex h-full w-full min-w-[40dvw] flex-col items-center')}
      style={{ backgroundColor: themeBackground, transition: 'background-color 0.3s ease' }}>
      <div className='flex h-full w-full flex-col' style={{ backgroundColor: themeBackground }}>
        {/* Header */}
        <div className='flex h-11 shrink-0 items-center justify-between border-b border-white/5 bg-zinc-950/80 px-4 backdrop-blur-sm'>
          <div className='flex items-center gap-2'>
            <div className='flex h-5 w-5 items-center justify-center rounded border border-emerald-500/30 bg-emerald-500/20'>
              <GitCompare className='h-3 w-3 text-emerald-500' />
            </div>
            <span className='text-[10px] font-bold tracking-widest text-zinc-400 uppercase'>
              Diff Editor
            </span>
          </div>
          <div className='flex items-center gap-2 text-[10px] font-bold tracking-widest text-zinc-400 uppercase'>
            <span className='text-emerald-400'>Modificado</span>
            <ArrowDown className='h-3 w-3 text-zinc-600' />
            <span className='text-red-400'>Original</span>
            <div
              className='group cursor-pointer rounded-md border border-zinc-400 p-1 hover:bg-zinc-400'
              onClick={handleReset}
              title='Limpar ambos'>
              <Eraser className='h-4 w-4 text-zinc-400 group-hover:text-black' />
            </div>
          </div>
        </div>

        {/* Split Vertical - Dois Editores */}
        <div className='flex flex-1 flex-col overflow-hidden'>
          {/* Editor Modificado (Topo) */}
          <div className='flex flex-1 flex-col border-b border-white/10'>
            <div className='flex h-8 shrink-0 items-center justify-between border-b border-emerald-500/20 bg-emerald-500/10 px-3'>
              <span className='text-[10px] font-bold tracking-widest text-emerald-400 uppercase'>
                Modificado (Novo)
              </span>
              <span className='text-[10px] text-emerald-400/60'>
                {code.split('\n').length} linhas
              </span>
            </div>
            <div className='relative flex-1 overflow-hidden'>
              <Editor
                height='100%'
                language={config.language}
                value={code}
                onChange={handleModifiedChange}
                theme='vs-dark'
                onMount={handleModifiedEditorMount}
                options={editorOptions}
              />
            </div>
          </div>

          {/* Editor Original (Baixo) */}
          <div className='flex flex-1 flex-col'>
            <div className='flex h-8 shrink-0 items-center justify-between border-b border-red-500/20 bg-red-500/10 px-3'>
              <span className='text-[10px] font-bold tracking-widest text-red-400 uppercase'>
                Original (Antigo)
              </span>
              <span className='text-[10px] text-red-400/60'>
                {originalCode.split('\n').length} linhas
              </span>
            </div>
            <div className='relative flex-1 overflow-hidden'>
              <Editor
                height='100%'
                language={config.language}
                value={originalCode}
                onChange={handleOriginalChange}
                theme='vs-dark'
                onMount={handleOriginalEditorMount}
                options={editorOptions}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
