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

interface HtmlEditorProps {
  value: string
  onChange: (value: string) => void
}

export function HtmlEditor({ value, onChange }: HtmlEditorProps) {
  return (
    <div className='flex h-full w-full flex-col overflow-hidden'>
      <Editor
        height='100%'
        defaultLanguage='html'
        language='html'
        value={value}
        theme='vs-dark'
        onChange={(val) => onChange(val || '')}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: 'var(--font-mono)',
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          renderLineHighlight: 'line',
          wordWrap: 'on',
          tabSize: 2,
        }}
      />
    </div>
  )
}
