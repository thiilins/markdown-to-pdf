'use client'

import { cn } from '@/lib/utils'
import type { EditorConfig } from '@/types/config'
import Editor, { OnMount } from '@monaco-editor/react'
import { useEffect, useRef, useState } from 'react'
import { MarkdownToolbar } from './markdown-toolbar'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string | undefined) => void
  config: EditorConfig
  className?: string
}

export function MarkdownEditor({ value, onChange, config, className }: MarkdownEditorProps) {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null)
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

    if (config.theme === 'auto' && typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        setTheme(e.matches ? 'vs-dark' : 'light')
      }

      // Adiciona listener para mudanças no tema do sistema
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
      } else {
        // Fallback para navegadores antigos
        mediaQuery.addListener(handleChange)
        return () => mediaQuery.removeListener(handleChange)
      }
    }
  }, [config.theme])

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor
    setEditorReady(true)
  }

  return (
    <div className={cn('flex h-full w-full flex-col', className)}>
      {editorReady && <MarkdownToolbar editor={editorRef.current} />}
      <div className='flex-1 overflow-hidden'>
        <Editor
          height='100%'
          defaultLanguage='markdown'
          value={value}
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
            insertSpaces: true,
            formatOnPaste: true,
            formatOnType: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            quickSuggestions: true,
            fixedOverflowWidgets: true,
            fontFamily: 'var(--font-mono)',
            fontLigatures: true,
          }}
        />
      </div>
    </div>
  )
}
