'use client'

import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Info } from 'lucide-react'

interface ConversionOptionsProps {
  breaks: boolean
  gfm: boolean
  sanitize: boolean
  onBreaksChange: (checked: boolean) => void
  onGfmChange: (checked: boolean) => void
  onSanitizeChange: (checked: boolean) => void
}

export function ConversionOptions({
  breaks,
  gfm,
  sanitize,
  onBreaksChange,
  onGfmChange,
  onSanitizeChange,
}: ConversionOptionsProps) {
  return (
    <div className='bg-muted/20 border-b px-4 py-2'>
      <TooltipProvider>
        <div className='grid grid-cols-2 gap-3 text-xs'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1.5'>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <div className='flex items-center gap-1.5'>
                    <Label htmlFor='breaks' className='cursor-pointer text-xs font-normal'>
                      Quebras de linha
                    </Label>
                    <Info className='text-muted-foreground h-3 w-3 cursor-help' />
                  </div>
                </TooltipTrigger>
                <TooltipContent side='right' className='max-w-xs px-3 py-2 text-xs'>
                  <p>
                    Converte quebras de linha simples (<code className='text-[10px]'>\n</code>) em
                    tags HTML <code className='text-[10px]'>&lt;br&gt;</code>. Útil para preservar a
                    formatação de parágrafos.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Switch id='breaks' checked={breaks} onCheckedChange={onBreaksChange} />
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1.5'>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <div className='flex items-center gap-1.5'>
                    <Label htmlFor='gfm' className='cursor-pointer text-xs font-normal'>
                      GitHub Flavored
                    </Label>
                    <Info className='text-muted-foreground h-3 w-3 cursor-help' />
                  </div>
                </TooltipTrigger>
                <TooltipContent side='right' className='max-w-xs px-3 py-2 text-xs'>
                  <p>
                    Ativa o suporte ao GitHub Flavored Markdown (GFM), que adiciona recursos extras
                    como tabelas, checkboxes, strikethrough, autolinks e mais. Ideal para converter
                    documentos do GitHub.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Switch id='gfm' checked={gfm} onCheckedChange={onGfmChange} />
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1.5'>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <div className='flex items-center gap-1.5'>
                    <Label htmlFor='sanitize' className='cursor-pointer text-xs font-normal'>
                      Sanitizar HTML
                    </Label>
                    <Info className='text-muted-foreground h-3 w-3 cursor-help' />
                  </div>
                </TooltipTrigger>
                <TooltipContent side='right' className='max-w-xs px-3 py-2 text-xs'>
                  <p>
                    Remove scripts, estilos inline perigosos e atributos de eventos (como{' '}
                    <code className='text-[10px]'>onclick</code>) do HTML gerado. Recomendado para
                    maior segurança ao exibir conteúdo de fontes não confiáveis.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Switch id='sanitize' checked={sanitize} onCheckedChange={onSanitizeChange} />
          </div>
        </div>
      </TooltipProvider>
    </div>
  )
}
