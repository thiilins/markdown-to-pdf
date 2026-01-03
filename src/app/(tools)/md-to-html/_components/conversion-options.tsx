'use client'

import { TooltipProvider } from '@/components/ui/tooltip'
import { OptionSwitch } from '../../_components/option-switch'

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
          <OptionSwitch
            id='breaks'
            label='Quebras de linha'
            description="Converte quebras de linha simples (<code className='text-[10px]'>\n</code>) em tags HTML <code className='text-[10px]'>&lt;br&gt;</code>. Útil para preservar a formatação de parágrafos."
            checked={breaks}
            onCheckedChange={onBreaksChange}
          />

          <OptionSwitch
            id='gfm'
            label='GitHub Flavored'
            description='Ativa o suporte ao GitHub Flavored Markdown (GFM), que adiciona recursos extras como tabelas, checkboxes, strikethrough, autolinks e mais. Ideal para converter documentos do GitHub.'
            checked={gfm}
            onCheckedChange={onGfmChange}
          />

          <OptionSwitch
            id='sanitize'
            label='Sanitizar HTML'
            description="Remove scripts, estilos inline perigosos e atributos de eventos (como <code className='text-[10px]'>onclick</code>) do HTML gerado. Recomendado para maior segurança ao exibir conteúdo de fontes não confiáveis."
            checked={sanitize}
            onCheckedChange={onSanitizeChange}
          />
        </div>
      </TooltipProvider>
    </div>
  )
}
