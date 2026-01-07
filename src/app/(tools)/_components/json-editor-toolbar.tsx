'use client'

import { IconButtonTooltip } from '@/components/custom-ui/tooltip'
import { Separator } from '@/components/ui/separator'
import {
  CheckCircle2,
  Copy,
  FileCode,
  RotateCcw,
  Sparkles,
  Trash2,
  Wand2,
  ArrowLeftRight,
} from 'lucide-react'
import { formatJson, minifyJson, validateJson, fixJson } from './json-formatter-utils'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { convertFormat, type FormatType } from './format-converter-utils'

interface JsonEditorToolbarProps {
  value: string
  onValueChange: (value: string) => void
  onCopy?: () => void
  onClear?: () => void
  onReset?: () => void
  defaultValue?: string
  validation?: {
    isValid: boolean
    errors: string[]
    warnings: string[]
  }
}

export function JsonEditorToolbar({
  value,
  onValueChange,
  onCopy,
  onClear,
  onReset,
  defaultValue,
  validation,
}: JsonEditorToolbarProps) {
  const handleFormat = () => {
    if (!value.trim()) {
      return
    }
    try {
      const formatted = formatJson(value)
      onValueChange(formatted)
    } catch (error: any) {
      // Erro já será mostrado pela validação
    }
  }

  const handleMinify = () => {
    if (!value.trim()) {
      return
    }
    try {
      const minified = minifyJson(value)
      onValueChange(minified)
    } catch (error: any) {
      // Erro já será mostrado pela validação
    }
  }

  const handleValidate = () => {
    if (!value.trim()) {
      return
    }
    const result = validateJson(value)
    if (!result.isValid) {
      // A validação já é mostrada visualmente
      return
    }
  }

  const handleFixJson = () => {
    if (!value.trim()) {
      return
    }
    try {
      const { fixed, changes } = fixJson(value)
      if (changes.length > 0) {
        onValueChange(fixed)
        toast.success(`JSON corrigido: ${changes.join(', ')}`)
      } else {
        toast.info('Nenhuma correção necessária')
      }
    } catch (error: any) {
      toast.error(error?.message || 'Erro ao corrigir JSON')
    }
  }

  const handleConvertFormat = async (toFormat: FormatType) => {
    if (!value.trim()) {
      return
    }
    try {
      const converted = convertFormat(value, 'json', toFormat)
      onValueChange(converted)
      toast.success(`Convertido para ${toFormat.toUpperCase()}`)
    } catch (error: any) {
      toast.error(error?.message || `Erro ao converter para ${toFormat}`)
    }
  }

  const handleCopy = () => {
    if (onCopy) {
      onCopy()
    } else {
      navigator.clipboard.writeText(value)
    }
  }

  const hasContent = value.trim().length > 0
  const isValid = validation?.isValid ?? true

  return (
    <div className='bg-muted/30 border-b shrink-0 flex items-center justify-between px-3 py-1.5'>
      <div className='flex items-center gap-1'>
        {/* Formatar */}
        <IconButtonTooltip
          variant='ghost'
          icon={Sparkles}
          onClick={handleFormat}
          content='Formatar JSON'
          disabled={!hasContent}
          className={{
            button: 'h-7 w-7',
          }}
        />

        {/* Minificar */}
        <IconButtonTooltip
          variant='ghost'
          icon={FileCode}
          onClick={handleMinify}
          content='Minificar JSON'
          disabled={!hasContent}
          className={{
            button: 'h-7 w-7',
          }}
        />

        {/* Validar */}
        <IconButtonTooltip
          variant='ghost'
          icon={CheckCircle2}
          onClick={handleValidate}
          content={isValid ? 'JSON válido' : 'JSON inválido'}
          disabled={!hasContent}
          className={{
            button: `h-7 w-7 ${isValid ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`,
          }}
        />

        {/* JSON Fixer */}
        <IconButtonTooltip
          variant='ghost'
          icon={Wand2}
          onClick={handleFixJson}
          content='Corrigir JSON automaticamente'
          disabled={!hasContent}
          className={{
            button: 'h-7 w-7',
          }}
        />

        {/* Conversão de Formatos */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className='hover:bg-accent text-muted-foreground hover:text-foreground flex h-7 w-7 items-center justify-center rounded-md transition-colors disabled:opacity-50 disabled:pointer-events-none'
              disabled={!hasContent || !isValid}
              title='Converter formato'>
              <ArrowLeftRight className='h-4 w-4' />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start'>
            <DropdownMenuItem onClick={() => handleConvertFormat('xml')}>
              Converter para XML
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleConvertFormat('yaml')}>
              Converter para YAML
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleConvertFormat('csv')}>
              Converter para CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation='vertical' className='mx-1 h-5' />

        {/* Copiar */}
        {onCopy && (
          <IconButtonTooltip
            variant='ghost'
            icon={Copy}
            onClick={handleCopy}
            content='Copiar JSON'
            disabled={!hasContent}
            className={{
              button: 'h-7 w-7',
            }}
          />
        )}

        {/* Limpar */}
        {onClear && (
          <IconButtonTooltip
            variant='ghost'
            icon={Trash2}
            onClick={onClear}
            content='Limpar editor'
            disabled={!hasContent}
            className={{
              button: 'h-7 w-7 text-destructive hover:text-destructive',
            }}
          />
        )}

        {/* Resetar */}
        {onReset && defaultValue && (
          <IconButtonTooltip
            variant='ghost'
            icon={RotateCcw}
            onClick={onReset}
            content='Resetar para exemplo'
            className={{
              button: 'h-7 w-7',
            }}
          />
        )}
      </div>

      {/* Status de validação */}
      {hasContent && validation && (
        <div className='flex items-center gap-2'>
          {validation.isValid ? (
            <span className='text-green-600 text-xs font-medium dark:text-green-400'>
              ✓ Válido
            </span>
          ) : (
            <span className='text-destructive text-xs font-medium'>
              ✗ {validation.errors.length} erro(s)
            </span>
          )}
        </div>
      )}
    </div>
  )
}

