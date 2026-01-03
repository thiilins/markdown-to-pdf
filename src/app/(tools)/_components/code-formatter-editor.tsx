'use client'

import { Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'

const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className='bg-muted/10 flex h-full w-full items-center justify-center'>
      <Loader2 className='text-muted-foreground h-6 w-6 animate-spin' />
    </div>
  ),
})

interface CodeFormatterEditorProps {
  value: string
  onChange: (value: string) => void
  language: 'html' | 'css' | 'javascript' | 'sql' | 'json' | 'plaintext'
}

const languageMap: Record<string, string> = {
  html: 'html',
  css: 'css',
  javascript: 'javascript',
  sql: 'sql',
  json: 'json',
  plaintext: 'plaintext',
}

export function CodeFormatterEditor({ value, onChange, language }: CodeFormatterEditorProps) {
  return (
    <div className='flex h-full! w-full flex-col overflow-hidden bg-[#1e1e1e]'>
      <Editor
        height='100%'
        className='h-full! w-full! bg-[#1e1e1e]!'
        defaultLanguage={languageMap[language]}
        language={languageMap[language]}
        value={value}
        theme='vs-dark'
        onChange={(val) => onChange(val || '')}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: 'var(--font-mono)',
          fontLigatures: true,
          lineNumbers: 'on',
          lineNumbersMinChars: 3,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 20, bottom: 20 },
          renderLineHighlight: 'line',
          wordWrap: 'on',
          tabSize: 2,
          insertSpaces: true,
          detectIndentation: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          bracketPairColorization: {
            enabled: true,
          },
          guides: {
            bracketPairs: true,
            indentation: true,
          },
          suggest: {
            showKeywords: true,
            showSnippets: true,
          },
          quickSuggestions: {
            other: true,
            comments: false,
            strings: false,
          },
          formatOnPaste: false,
          formatOnType: false,
          codeLens: false,
          colorDecorators: true,
          contextmenu: true,
          mouseWheelZoom: false,
          multiCursorModifier: 'ctrlCmd',
        }}
      />
    </div>
  )
}
