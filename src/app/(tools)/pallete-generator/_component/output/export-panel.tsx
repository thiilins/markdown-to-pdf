'use client'

import { CodeFormatterEditor } from '@/app/(tools)/_components/code-formatter-editor'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Copy, Download, Edit2, RotateCcw, Terminal } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { EXPORT_FORMATS, type ExportFormat } from '../constants'

import { exportPalette } from '../palette-utils'

interface ExportPanelProps {
  colors: ColorInfo[]
}

const DEFAULT_SEMANTIC_NAMES = ['primary', 'secondary', 'accent', 'muted', 'destructive']

export function ExportPanel({ colors }: ExportPanelProps) {
  const [format, setFormat] = useState<ExportFormat>('css')
  const [code, setCode] = useState('')
  const [semanticNames, setSemanticNames] = useState<string[]>([])
  const [isEditingNames, setIsEditingNames] = useState(false)

  // Inicializa nomes semânticos
  useEffect(() => {
    if (colors.length > 0 && semanticNames.length === 0) {
      const names = colors.map((_, i) => DEFAULT_SEMANTIC_NAMES[i] || `color-${i + 1}`)
      setSemanticNames(names)
    }
  }, [colors, semanticNames.length])

  useEffect(() => {
    if (colors.length > 0 && semanticNames.length > 0) {
      const exported = exportPalette(colors, format, semanticNames)
      setCode(exported)
    }
  }, [colors, format, semanticNames])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code)
    toast.success('Código copiado!')
  }, [code])

  const handleDownload = useCallback(() => {
    if (!code) return
    const extensions: Record<string, string> = {
      shadcn: 'css',
      css: 'css',
      scss: 'scss',
      tailwind: 'js',
      figma: 'json',
      json: 'json',
      swift: 'swift',
      xml: 'xml',
    }
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `palette.${extensions[format] || 'txt'}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Código exportado!')
  }, [code, format])

  const handleResetNames = useCallback(() => {
    const names = colors.map((_, i) => DEFAULT_SEMANTIC_NAMES[i] || `color-${i + 1}`)
    setSemanticNames(names)
    setIsEditingNames(false)
    toast.success('Nomes resetados!')
  }, [colors])

  const handleNameChange = useCallback((index: number, newName: string) => {
    setSemanticNames((prev) => {
      const updated = [...prev]
      updated[index] = newName.toLowerCase().replace(/\s+/g, '-')
      return updated
    })
  }, [])

  return (
    <>
      {/* Editor de Nomes Semânticos */}
      {colors.length > 0 && (
        <Card className='mb-4'>
          <CardContent className='p-4'>
            <div className='mb-3 flex items-center justify-between'>
              <div>
                <Label className='text-sm font-semibold'>Nomes Semânticos das Cores</Label>
                <p className='text-muted-foreground mt-1 text-xs'>
                  Personalize os nomes das variáveis para exportação
                </p>
              </div>
              <div className='flex items-center gap-2'>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => setIsEditingNames(!isEditingNames)}
                  className='gap-2'>
                  <Edit2 className='h-3 w-3' />
                  {isEditingNames ? 'Concluir' : 'Editar'}
                </Button>
                {isEditingNames && (
                  <Button size='sm' variant='ghost' onClick={handleResetNames} className='gap-2'>
                    <RotateCcw className='h-3 w-3' />
                    Resetar
                  </Button>
                )}
              </div>
            </div>
            <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
              {colors.map((color, index) => (
                <div key={index} className='flex items-center gap-2'>
                  <div
                    className='h-8 w-8 shrink-0 rounded border'
                    style={{ backgroundColor: color.hex }}
                  />
                  {isEditingNames ? (
                    <Input
                      value={semanticNames[index] || ''}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      className='h-8 flex-1 font-mono text-xs'
                      placeholder={`color-${index + 1}`}
                    />
                  ) : (
                    <span className='text-muted-foreground flex-1 font-mono text-xs'>
                      {semanticNames[index] || `color-${index + 1}`}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Panel */}
      <Card className='overflow-hidden border-none shadow-sm ring-1 ring-slate-200 dark:ring-slate-800'>
        {/* Toolbar do Editor */}
        <div className='bg-muted/30 flex items-center justify-between border-b px-4 py-2'>
          <div className='flex items-center gap-2'>
            <Terminal className='text-muted-foreground h-4 w-4' />
            <span className='text-muted-foreground text-xs font-medium'>Export Preview</span>
          </div>
          <div className='flex items-center gap-2'>
            <Select value={format} onValueChange={(v) => setFormat(v as ExportFormat)}>
              <SelectTrigger className='h-8 w-[140px] text-xs'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXPORT_FORMATS.map((fmt) => (
                  <SelectItem key={fmt.value} value={fmt.value} className='text-xs'>
                    {fmt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className='h-4 w-px bg-slate-200 dark:bg-slate-700' />

            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8'
              onClick={handleCopy}
              title='Copiar'>
              <Copy className='h-3.5 w-3.5' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8'
              onClick={handleDownload}
              title='Baixar'>
              <Download className='h-3.5 w-3.5' />
            </Button>
          </div>
        </div>

        <CardContent className='p-0'>
          <div className='h-[400px]'>
            <CodeFormatterEditor
              value={code}
              onChange={() => {}}
              language={format === 'json' ? 'json' : format === 'tailwind' ? 'javascript' : 'css'}
            />
          </div>
        </CardContent>
      </Card>
    </>
  )
}
