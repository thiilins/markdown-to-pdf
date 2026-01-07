'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import {
  AlertCircle,
  ArrowLeftRight,
  CheckCircle2,
  Copy,
  Download,
  FileCode,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { ReactNode } from 'react'

interface FormatterHeaderProps {
  icon: React.ElementType
  title: string
  description: string
  validation?: {
    isValid: boolean
    errors: string[]
    warnings: string[]
  }
  stats?: {
    lines: number
    chars: number
    charsFormatted: number
  }
  isProcessing?: boolean
  formatMode: 'beautify' | 'minify'
  onFormatModeChange: (mode: 'beautify' | 'minify') => void
  onCopy?: () => void
  onDownload?: () => void
  onClear?: () => void
  canCopy?: boolean
  canDownload?: boolean
  extraActions?: ReactNode
  onConvertFormat?: (format: 'xml' | 'yaml' | 'csv' | 'toml' | 'toon') => void
  canConvert?: boolean
}

export function FormatterHeader({
  icon: Icon,
  title,
  description,
  validation,
  stats,
  isProcessing = false,
  formatMode,
  onFormatModeChange,
  onCopy,
  onDownload,
  onClear,
  canCopy = false,
  canDownload = false,
  extraActions,
  onConvertFormat,
  canConvert = false,
}: FormatterHeaderProps) {
  const hasCode = stats && stats.lines > 0

  return (
    <div className='from-card to-card/95 shrink-0 border-b bg-linear-to-b shadow-sm'>
      {/* Main Header */}
      <div className='px-4 py-3 sm:px-6 sm:py-4'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          {/* Title Section */}
          <div className='flex items-center gap-3'>
            <div className='bg-primary/10 ring-primary/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 sm:h-12 sm:w-12'>
              <Icon className='text-primary h-5 w-5 sm:h-6 sm:w-6' />
            </div>
            <div className='min-w-0 flex-1'>
              <h1 className='text-lg font-bold tracking-tight sm:text-xl'>{title}</h1>
              <p className='text-muted-foreground mt-0.5 text-xs sm:text-sm'>{description}</p>
            </div>
          </div>

          {/* Actions Section */}
          <div className='flex items-center gap-2'>
            {/* Validation Status */}
            {validation && hasCode && (
              <Badge
                variant={validation.isValid ? 'default' : 'destructive'}
                className='gap-1.5 px-2.5 py-1'>
                {validation.isValid ? (
                  <>
                    <CheckCircle2 className='h-3.5 w-3.5' />
                    <span className='font-medium'>Válido</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className='h-3.5 w-3.5' />
                    <span className='font-medium'>{validation.errors.length} erro(s)</span>
                  </>
                )}
              </Badge>
            )}

            {/* Stats */}
            {hasCode && (
              <div className='bg-muted/50 hidden items-center gap-2 rounded-lg px-3 py-1.5 text-xs sm:flex'>
                <span className='text-muted-foreground font-medium'>{stats.lines}</span>
                <span className='text-muted-foreground/50'>linhas</span>
                <Separator orientation='vertical' className='h-3' />
                <span className='text-muted-foreground font-medium'>
                  {stats.chars.toLocaleString()}
                </span>
                <span className='text-muted-foreground/50'>chars</span>
                {stats.charsFormatted > 0 && (
                  <>
                    <Separator orientation='vertical' className='h-3' />
                    <span className='text-primary font-semibold'>
                      {stats.charsFormatted.toLocaleString()}
                    </span>
                    <span className='text-muted-foreground/50'>formatado</span>
                  </>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className='flex items-center gap-1'>
              <Button
                variant='ghost'
                size='sm'
                onClick={onCopy}
                disabled={!canCopy || isProcessing}
                className='h-9 w-9 p-0'>
                <Copy className='h-4 w-4' />
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={onDownload}
                disabled={!canDownload || isProcessing}
                className='h-9 w-9 p-0'>
                <Download className='h-4 w-4' />
              </Button>
              {onClear && (
                <Button variant='ghost' size='sm' onClick={onClear} className='h-9 w-9 p-0'>
                  <RotateCcw className='h-4 w-4' />
                </Button>
              )}
              {extraActions}
            </div>
          </div>
        </div>
      </div>

      {/* Format Mode Bar */}
      <div className='bg-muted/20 border-t px-4 py-2.5 sm:px-6'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Sparkles className='text-muted-foreground h-4 w-4' />
            <span className='text-sm font-medium'>Modo de Formatação</span>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant={formatMode === 'beautify' ? 'default' : 'outline'}
              size='sm'
              onClick={() => onFormatModeChange('beautify')}
              className='h-8 gap-1.5 px-3 text-xs font-medium'
              disabled={isProcessing}>
              <Sparkles className='h-3.5 w-3.5' />
              Embelezar
            </Button>
            <Button
              variant={formatMode === 'minify' ? 'default' : 'outline'}
              size='sm'
              onClick={() => onFormatModeChange('minify')}
              className='h-8 gap-1.5 px-3 text-xs font-medium'
              disabled={isProcessing}>
              <FileCode className='h-3.5 w-3.5' />
              Minificar
            </Button>
            {onConvertFormat && canConvert && (
              <>
                <Separator orientation='vertical' className='h-5' />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='outline'
                      size='sm'
                      className='h-8 gap-1.5 px-3 text-xs font-medium'
                      disabled={isProcessing}>
                      <ArrowLeftRight className='h-3.5 w-3.5' />
                      Converter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem onClick={() => onConvertFormat('xml')}>
                      <FileCode className='mr-2 h-4 w-4' />
                      Converter para XML
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onConvertFormat('yaml')}>
                      <FileCode className='mr-2 h-4 w-4' />
                      Converter para YAML
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onConvertFormat('csv')}>
                      <FileCode className='mr-2 h-4 w-4' />
                      Converter para CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onConvertFormat('toml')}>
                      <FileCode className='mr-2 h-4 w-4' />
                      Converter para TOML
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onConvertFormat('toon')}>
                      <FileCode className='mr-2 h-4 w-4' />
                      Converter para TOON
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
