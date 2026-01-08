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
import { cn } from '@/lib/utils'
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
    <div className='border-primary/10 flex shrink-0 flex-col border-b bg-white'>
      {/* Seção Superior: Identidade e Exportação */}
      <div className='px-6 py-6 sm:px-8'>
        <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
          {/* Lado Esquerdo: Branding e Título com Foco no Primary */}
          <div className='flex items-center gap-5'>
            <div className='bg-primary text-primary-foreground shadow-primary/20 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-lg'>
              <Icon className='h-6 w-6' />
            </div>

            <div className='flex flex-col gap-1'>
              <div className='flex items-center gap-3'>
                <h1 className='text-xl font-bold tracking-tight text-slate-900'>{title}</h1>
                {validation && hasCode && (
                  <Badge
                    variant={validation.isValid ? 'default' : 'destructive'}
                    className={cn(
                      'h-5 border-none px-2 text-[10px] font-bold uppercase',
                      validation.isValid
                        ? 'bg-primary hover:bg-primary'
                        : 'bg-destructive hover:bg-destructive',
                    )}>
                    {validation.isValid ? (
                      <span className='flex items-center gap-1'>
                        <CheckCircle2 className='h-3 w-3' /> Válido
                      </span>
                    ) : (
                      <span className='flex items-center gap-1'>
                        <AlertCircle className='h-3 w-3' /> Erro
                      </span>
                    )}
                  </Badge>
                )}
              </div>
              <p className='text-sm font-medium text-slate-500'>{description}</p>
            </div>
          </div>

          {/* Lado Direito: Stats (Labels Primary) e Ações Globais */}
          <div className='flex flex-wrap items-center gap-4 lg:justify-end'>
            {hasCode && (
              <div className='flex items-center gap-5 text-[11px] font-bold tracking-wider uppercase'>
                <div className='flex flex-col items-end'>
                  <span className='text-primary'>{stats.lines}</span>
                  <span className='text-slate-400'>Linhas</span>
                </div>
                <Separator orientation='vertical' className='bg-primary/10 h-8' />
                <div className='flex flex-col items-end'>
                  <span className='text-primary'>{stats.chars.toLocaleString()}</span>
                  <span className='text-slate-400'>Chars</span>
                </div>
                {stats.charsFormatted > 0 && (
                  <>
                    <Separator orientation='vertical' className='bg-primary/10 h-8' />
                    <div className='flex flex-col items-end'>
                      <span className='text-primary-foreground bg-primary rounded-sm px-1.5'>
                        {stats.charsFormatted.toLocaleString()}
                      </span>
                      <span className='text-primary/60'>Final</span>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Ações de Exportação */}
            <div className='bg-primary/5 ring-primary/10 ml-2 flex items-center gap-1.5 rounded-xl p-1 ring-1'>
              <Button
                variant='ghost'
                size='icon'
                onClick={onCopy}
                disabled={!canCopy || isProcessing}
                className='text-primary hover:bg-primary hover:text-primary-foreground h-9 w-9'>
                <Copy className='h-4 w-4' />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                onClick={onDownload}
                disabled={!canDownload || isProcessing}
                className='text-primary hover:bg-primary hover:text-primary-foreground h-9 w-9'>
                <Download className='h-4 w-4' />
              </Button>
              {onClear && (
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={onClear}
                  className='text-primary hover:bg-destructive h-9 w-9 hover:text-white'>
                  <RotateCcw className='h-4 w-4' />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Processamento: Predomínio do Primary */}
      <div className='bg-primary/5 border-primary/10 border-t px-6 py-3 sm:px-8'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-center gap-2'>
            <div className='bg-primary h-2 w-2 animate-pulse rounded-full' />
            <span className='text-primary text-[10px] font-bold tracking-[0.15em] uppercase'>
              Modo de Operação
            </span>
          </div>

          <div className='flex items-center gap-3'>
            <div className='border-primary/20 inline-flex rounded-xl border bg-white p-1 shadow-sm'>
              <Button
                variant={formatMode === 'beautify' ? 'default' : 'ghost'}
                size='sm'
                onClick={() => onFormatModeChange('beautify')}
                className={cn(
                  'h-8 gap-2 px-4 text-xs font-bold transition-all',
                  formatMode !== 'beautify' && 'text-primary hover:bg-primary/10',
                )}
                disabled={isProcessing}>
                <Sparkles className='h-3.5 w-3.5' />
                Beautify
              </Button>
              <Button
                variant={formatMode === 'minify' ? 'default' : 'ghost'}
                size='sm'
                onClick={() => onFormatModeChange('minify')}
                className={cn(
                  'h-8 gap-2 px-4 text-xs font-bold transition-all',
                  formatMode !== 'minify' && 'text-primary hover:bg-primary/10',
                )}
                disabled={isProcessing}>
                <FileCode className='h-3.5 w-3.5' />
                Minify
              </Button>
            </div>

            {onConvertFormat && canConvert && (
              <>
                <Separator orientation='vertical' className='bg-primary/20 h-6' />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='outline'
                      size='sm'
                      className='border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground h-9 gap-2 text-xs font-bold'
                      disabled={isProcessing}>
                      <ArrowLeftRight className='h-3.5 w-3.5' />
                      Converter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end' className='border-primary/10 w-52 p-2'>
                    <div className='text-primary px-2 py-1.5 text-[10px] font-bold uppercase opacity-60'>
                      Escolha o formato
                    </div>
                    {['xml', 'yaml', 'csv', 'toml', 'toon'].map((format) => (
                      <DropdownMenuItem
                        key={format}
                        onClick={() => onConvertFormat(format as any)}
                        className='focus:bg-primary focus:text-primary-foreground cursor-pointer rounded-lg text-xs font-bold text-slate-700 uppercase'>
                        Para {format}
                      </DropdownMenuItem>
                    ))}
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
