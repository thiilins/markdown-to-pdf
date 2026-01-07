'use client'

import { AlertCircle, Code2 } from 'lucide-react'
import React, { ReactNode, useState } from 'react'
import { CodeFormatterEditor } from './code-formatter-editor'
import { JsonEditorToolbar } from './json-editor-toolbar'

interface FormatterEditorPanelProps {
  value: string
  onChange: (value: string) => void
  language: 'html' | 'css' | 'javascript' | 'sql' | 'json'
  validation?: {
    isValid: boolean
    errors: string[]
    warnings: string[]
  }
  icon?: React.ElementType
  label?: string
  footer?: ReactNode
  showJsonToolbar?: boolean
  onCopy?: () => void
  onClear?: () => void
  onReset?: () => void
  defaultValue?: string
  onJsonPathChange?: (path: string | null) => void
}

export function FormatterEditorPanel({
  value,
  onChange,
  language,
  validation,
  icon: Icon = Code2,
  label = 'Código',
  footer,
  showJsonToolbar = false,
  onCopy,
  onClear,
  onReset,
  defaultValue,
  onJsonPathChange,
}: FormatterEditorPanelProps) {
  const [currentJsonPath, setCurrentJsonPath] = useState<string | null>(null)

  const handleJsonPathChange = (path: string | null) => {
    setCurrentJsonPath(path)
    onJsonPathChange?.(path)
  }

  return (
    <div className='bg-background flex h-full flex-col'>
      {/* Editor Header */}
      <div className='bg-muted/30 flex shrink-0 items-center justify-between border-b px-4 py-2.5'>
        <div className='flex items-center gap-2'>
          <Icon className='text-muted-foreground h-4 w-4' />
          <span className='text-sm font-semibold'>{label}</span>
        </div>
        <div className='flex items-center gap-3'>
          {/* JSON Path Tracking */}
          {language === 'json' && currentJsonPath && (
            <div className='text-muted-foreground flex items-center gap-2 font-mono text-xs'>
              <span className='text-muted-foreground/50'>Path:</span>
              <span className='text-primary font-semibold'>{currentJsonPath}</span>
            </div>
          )}
          {value.trim() && (
            <div className='text-muted-foreground flex items-center gap-2 text-xs'>
              <span>{value.split('\n').length} linhas</span>
              <span className='text-muted-foreground/50'>•</span>
              <span>{value.length.toLocaleString()} caracteres</span>
            </div>
          )}
        </div>
      </div>

      {/* JSON Toolbar */}
      {showJsonToolbar && language === 'json' && (
        <JsonEditorToolbar
          value={value}
          onValueChange={onChange}
          onCopy={onCopy}
          onClear={onClear}
          onReset={onReset}
          defaultValue={defaultValue}
          validation={validation}
        />
      )}

      {/* Editor */}
      <div className='flex-1 overflow-hidden'>
        <CodeFormatterEditor
          value={value}
          onChange={onChange}
          language={language}
          onJsonPathChange={handleJsonPathChange}
        />
      </div>

      {/* Validation Errors */}
      {validation && validation.errors.length > 0 && (
        <div className='bg-destructive/10 border-destructive/20 shrink-0 border-t'>
          <div className='px-4 py-3'>
            <div className='flex items-start gap-2.5'>
              <AlertCircle className='text-destructive mt-0.5 h-4 w-4 shrink-0' />
              <div className='min-w-0 flex-1'>
                <p className='text-destructive mb-1.5 text-xs font-semibold'>
                  {validation.errors.length} erro(s) encontrado(s)
                </p>
                <ul className='text-destructive/90 space-y-1 text-xs'>
                  {validation.errors.map((error, idx) => (
                    <li key={idx} className='flex items-start gap-1.5'>
                      <span className='text-destructive/60 mt-0.5'>•</span>
                      <span className='flex-1'>{error}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warnings */}
      {validation && validation.warnings.length > 0 && (
        <div className='shrink-0 border-t border-yellow-500/20 bg-yellow-500/10'>
          <div className='px-4 py-2.5'>
            <div className='flex items-start gap-2.5'>
              <AlertCircle className='mt-0.5 h-3.5 w-3.5 shrink-0 text-yellow-600 dark:text-yellow-500' />
              <div className='min-w-0 flex-1'>
                <p className='mb-1 text-xs font-medium text-yellow-700 dark:text-yellow-400'>
                  {validation.warnings.length} aviso(s)
                </p>
                <ul className='space-y-0.5 text-xs text-yellow-600/90 dark:text-yellow-500/90'>
                  {validation.warnings.map((warning, idx) => (
                    <li key={idx} className='flex items-start gap-1.5'>
                      <span className='mt-0.5 text-yellow-600/60'>•</span>
                      <span className='flex-1'>{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Footer */}
      {footer}
    </div>
  )
}
