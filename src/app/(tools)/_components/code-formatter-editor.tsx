'use client'

import type { OnMount } from '@monaco-editor/react'
import { Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRef } from 'react'
import { toast } from 'sonner'
import { getJsonPathFromSelection } from './json-path-utils'

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

interface CodeFormatterEditorProps {
  value: string
  onChange: (value: string) => void
  language: 'html' | 'css' | 'javascript' | 'sql' | 'json' | 'plaintext'
  onJsonPathChange?: (path: string | null) => void // Callback para tracking de JSON Path
}

export function CodeFormatterEditor({ value, onChange, language, onJsonPathChange }: CodeFormatterEditorProps) {
  const editorRef = useRef<any | null>(null)

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor

    // Smart JSONPath Tracking - apenas para JSON
    if (language === 'json' && onJsonPathChange) {
      const updateJsonPath = () => {
        const selection = editor.getSelection()
        if (!selection) {
          onJsonPathChange(null)
          return
        }

        const model = editor.getModel()
        if (!model) {
          onJsonPathChange(null)
          return
        }

        const selectedText = model.getValueInRange(selection)
        const selectionStart = model.getOffsetAt(selection.getStartPosition())

        try {
          const jsonPath = getJsonPathFromSelection(value, selectedText, selectionStart)
          onJsonPathChange(jsonPath)
        } catch {
          onJsonPathChange(null)
        }
      }

      // Atualizar quando cursor ou seleção mudar
      editor.onDidChangeCursorPosition(updateJsonPath)
      editor.onDidChangeCursorSelection(updateJsonPath)
    }

    // Adicionar menu de contexto customizado apenas para JSON
    if (language === 'json') {
      // Adicionar ação ao menu de contexto
      editor.addAction({
        id: 'copy-json-path',
        label: 'Copiar JSON Path',
        contextMenuGroupId: 'navigation',
        contextMenuOrder: 1.5,
        run: async (ed) => {
          const selection = ed.getSelection()
          if (!selection) return

          const model = ed.getModel()
          if (!model) return

          // Obter texto selecionado ou texto na posição do cursor
          const selectedText = model.getValueInRange(selection)
          const selectionStart = model.getOffsetAt(selection.getStartPosition())

          try {
            const jsonPath = getJsonPathFromSelection(value, selectedText, selectionStart)

            if (jsonPath) {
              await navigator.clipboard.writeText(jsonPath)
              toast.success(`JSON Path copiado: ${jsonPath}`)
            } else {
              toast.error('Não foi possível determinar o JSON Path')
            }
          } catch (error) {
            toast.error('Erro ao copiar JSON Path')
          }
        },
      })

      // Adicionar atalho de teclado (Ctrl+Shift+P ou Cmd+Shift+P)
      editor.addCommand(
        monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP,
        async () => {
          const selection = editor.getSelection()
          if (!selection) return

          const model = editor.getModel()
          if (!model) return

          const selectedText = model.getValueInRange(selection)
          const selectionStart = model.getOffsetAt(selection.getStartPosition())

          try {
            const jsonPath = getJsonPathFromSelection(value, selectedText, selectionStart)

            if (jsonPath) {
              await navigator.clipboard.writeText(jsonPath)
              toast.success(`JSON Path copiado: ${jsonPath}`)
            } else {
              toast.error('Não foi possível determinar o JSON Path')
            }
          } catch (error) {
            toast.error('Erro ao copiar JSON Path')
          }
        },
      )
    }
  }

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
        onMount={handleEditorDidMount}
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
