'use client'

import { cn } from '@/lib/utils'
import { OnMount } from '@monaco-editor/react'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState } from 'react'

import { MarkdownStatusBar } from '@/components/markdown-editor/status-bar'
import { MarkdownToolbar } from '@/components/markdown-editor/toolbar'
import { useApp } from '@/shared/contexts/appContext'
import { useMarkdown } from '@/shared/contexts/markdownContext'
import { Loader2 } from 'lucide-react'

const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className='bg-muted/10 flex h-full w-full items-center justify-center'>
      <Loader2 className='text-muted-foreground h-6 w-6 animate-spin' />
    </div>
  ),
})

interface MarkdownEditorProps {
  onScroll?: (percentage: number) => void
  className?: string
  onResetMarkdown?: () => void
}

export function EditorComponent({ onScroll, className, onResetMarkdown }: MarkdownEditorProps) {
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
          const percentage = scrollTop / (scrollHeight - clientHeight)
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

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor
    setEditorReady(true)
    editor.onDidScrollChange(() => {
      handleScrollSync(editor)
    })
  }

  return (
    <div className={cn('bg-background flex h-full w-full flex-col', className)}>
      {/* Toolbar fixa no topo */}
      <div className='bg-background/95 z-10 border-b backdrop-blur'>
        <MarkdownToolbar
          editor={editorRef.current}
          onResetEditorData={() => onResetMarkdown?.()}
          onResetMarkdown={onResetMarkdown}
        />
      </div>

      {/* Editor ocupando espaço flexível */}
      <div className='relative min-h-0 flex-1'>
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
            padding: { top: 16, bottom: 16 },
          }}
        />
      </div>

      {/* Status bar fixa no rodapé */}
      <div className='border-t'>
        <MarkdownStatusBar value={markdown?.content || ''} />
      </div>
    </div>
  )
}
