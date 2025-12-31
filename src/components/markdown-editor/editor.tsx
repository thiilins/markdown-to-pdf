'use client'

import { cn } from '@/lib/utils'
import { OnMount } from '@monaco-editor/react'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState } from 'react'

import { useApp } from '@/shared/contexts/appContext'
import { useMarkdown } from '@/shared/contexts/markdownContext'
import { MarkdownStatusBar } from './status-bar'
import { MarkdownToolbar } from './toolbar'

const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div className='bg-muted h-full w-full animate-pulse' />,
})

interface MarkdownEditorProps {
  onScroll?: (percentage: number) => void // Nova prop para Scroll Sync
  className?: string
  onResetMarkdown?: () => void
}

export function MarkdownEditor({ onScroll, className, onResetMarkdown }: MarkdownEditorProps) {
  const { markdown, onUpdateMarkdown } = useMarkdown()
  const { config: generalConfig } = useApp()

  const config = generalConfig.editor
  const editorRef = useRef<any | null>(null)
  const [theme, setTheme] = useState<'light' | 'vs-dark'>('light')
  const [editorReady, setEditorReady] = useState(false)

  const rafIdRef = useRef<number | null>(null)
  const onScrollRef = useRef(onScroll)

  useEffect(() => {
    onScrollRef.current = onScroll
  }, [onScroll])

  useEffect(() => {
    const getTheme = () => {
      if (config.theme === 'auto') {
        if (typeof window !== 'undefined') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'vs-dark' : 'light'
        }
        return 'light'
      }
      return config.theme === 'dark' ? 'vs-dark' : 'light'
    }

    setTheme(getTheme())
  }, [config.theme])

  const handleScrollSync = useCallback((editor: any) => {
    // Cancela frame anterior para garantir apenas 1 execução por frame
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

          // Porcentagem de 0 a 1
          const percentage = scrollTop / (scrollHeight - clientHeight)
          onScrollRef.current(percentage)
        }
      }
      rafIdRef.current = null
    })
  }, [])

  // Cleanup do requestAnimationFrame no unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [])

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor
    setEditorReady(true)

    // Lógica de Scroll Sync com throttle via requestAnimationFrame
    editor.onDidScrollChange(() => {
      handleScrollSync(editor)
    })
  }

  return (
    <div
      className={cn('bg-background flex h-full w-full flex-col overflow-hidden border', className)}>
      {editorReady && (
        <MarkdownToolbar
          editor={editorRef.current}
          onResetEditorData={() => onResetMarkdown?.()}
          onResetMarkdown={onResetMarkdown}
        />
      )}

      <div className='flex-1 overflow-hidden'>
        <Editor
          height='100%'
          defaultLanguage='markdown'
          value={markdown?.content}
          language='markdown'
          onChange={(value) => onUpdateMarkdown(value || ' ')}
          onMount={handleEditorDidMount}
          theme={theme}
          options={{
            fontSize: config.fontSize,
            wordWrap: config.wordWrap,
            minimap: { enabled: config.minimap },
            lineNumbers: config.lineNumbers,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            renderWhitespace: 'selection',
            tabSize: 2,
            fontFamily: 'var(--font-mono)',
          }}
        />
      </div>

      {/* Item 2: Status Bar adicionada ao rodapé do editor */}
      <MarkdownStatusBar value={markdown?.content || ''} />
    </div>
  )
}
