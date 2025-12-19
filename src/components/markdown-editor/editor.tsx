'use client'

import { cn } from '@/lib/utils'
import { OnMount } from '@monaco-editor/react'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

import { MarkdownStatusBar } from './status-bar'
import { MarkdownToolbar } from './toolbar'

const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div className='bg-muted h-full w-full animate-pulse' />,
})

interface MarkdownEditorProps {
  value: string
  onChange: (value: string | undefined) => void
  onScroll?: (percentage: number) => void // Nova prop para Scroll Sync
  config: EditorConfig
  className?: string
}

export function MarkdownEditor({
  value,
  onChange,
  onScroll,
  config,
  className,
}: MarkdownEditorProps) {
  const editorRef = useRef<any | null>(null)
  const [theme, setTheme] = useState<'light' | 'vs-dark'>('light')
  const [editorReady, setEditorReady] = useState(false)

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

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor
    setEditorReady(true)

    // Lógica de Scroll Sync: calcula a porcentagem e envia para o pai
    editor.onDidScrollChange(() => {
      if (onScroll) {
        const visibleRanges = editor.getVisibleRanges()
        if (visibleRanges.length > 0) {
          const scrollHeight = editor.getScrollHeight()
          const scrollTop = editor.getScrollTop()
          const clientHeight = editor.getLayoutInfo().height

          // Porcentagem de 0 a 1
          const percentage = scrollTop / (scrollHeight - clientHeight)
          onScroll(percentage)
        }
      }
    })
  }

  return (
    <div
      className={cn(
        'bg-background flex h-full w-full flex-col overflow-hidden rounded-md border',
        className,
      )}>
      {editorReady && <MarkdownToolbar editor={editorRef.current} />}

      <div className='flex-1 overflow-hidden'>
        <Editor
          height='100%'
          defaultLanguage='markdown'
          value={value}
          language='markdown'
          onChange={onChange}
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
      <MarkdownStatusBar value={value} />
    </div>
  )
}
