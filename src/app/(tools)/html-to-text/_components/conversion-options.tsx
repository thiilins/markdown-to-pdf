'use client'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { ChevronDown, Settings2 } from 'lucide-react'
import { useState } from 'react'
import { OptionSwitch } from '../../_components/option-switch'

interface ConversionOptions {
  preserveLineBreaks: boolean
  removeExtraSpaces: boolean
  trimLines: boolean
  removeLinks: boolean
  removeEmojis: boolean
  removeHtmlInCode: boolean
  formatText: boolean
}

interface ConversionOptionsProps {
  options: ConversionOptions
  onOptionsChange: (options: Partial<ConversionOptions>) => void
  editorComponent?: React.ReactNode
}

interface OptionItem {
  id: keyof ConversionOptions
  label: string
  description: string
}

const OPTIONS: OptionItem[] = [
  {
    id: 'preserveLineBreaks',
    label: 'Preservar quebras de linha',
    description: 'Mantém as quebras de linha do HTML original no texto extraído',
  },
  {
    id: 'removeExtraSpaces',
    label: 'Remover espaços extras',
    description: 'Remove múltiplos espaços consecutivos e quebras de linha duplicadas',
  },
  {
    id: 'trimLines',
    label: 'Remover espaços das linhas',
    description: 'Remove espaços em branco no início e fim de cada linha',
  },
  {
    id: 'removeLinks',
    label: 'Remover links',
    description:
      'Remove todas as URLs e links (http://, https://, www., mailto:, etc.) do texto extraído',
  },
  {
    id: 'removeEmojis',
    label: 'Remover emojis',
    description: 'Remove todos os emojis e símbolos Unicode do texto extraído',
  },
  {
    id: 'removeHtmlInCode',
    label: 'Remover HTML em code/pre',
    description:
      'Remove tags HTML dentro de elementos <code> e <pre>, extraindo apenas o texto puro',
  },
  {
    id: 'formatText',
    label: 'Formatar texto (Prettier)',
    description:
      'Formata o texto extraído para melhorar a legibilidade, adicionando quebras de linha apropriadas e organizando parágrafos',
  },
]

export function ConversionOptions({
  options,
  onOptionsChange,
  editorComponent,
}: ConversionOptionsProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='flex h-full w-full flex-col'>
      <div className='bg-muted/20 shrink-0 border-b'>
        {/* Desktop: Grid de 2 colunas */}
        <div className='hidden px-4 py-3 md:block'>
          <TooltipProvider>
            <div className='grid grid-cols-2 gap-3'>
              {OPTIONS.map((option) => (
                <OptionSwitch
                  key={option.id}
                  description={option.description}
                  id={option.id}
                  label={option.label}
                  checked={options[option.id]}
                  onCheckedChange={(checked) => onOptionsChange({ [option.id]: checked })}
                />
              ))}
            </div>
          </TooltipProvider>
        </div>

        {/* Mobile: Collapsible */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className='md:hidden'>
          <CollapsibleTrigger className='hover:bg-muted/30 flex w-full items-center justify-between px-4 py-3 transition-colors'>
            <div className='flex items-center gap-2'>
              <Settings2 className='text-muted-foreground h-4 w-4' />
              <span className='text-sm font-medium'>Opções de Conversão</span>
              <span className='text-muted-foreground text-xs'>
                ({Object.values(options).filter(Boolean).length} ativas)
              </span>
            </div>
            <ChevronDown
              className={cn(
                'text-muted-foreground h-4 w-4 transition-transform duration-200',
                isOpen && 'rotate-180',
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className='px-4 pb-3'>
            <TooltipProvider>
              <div className='flex flex-col gap-3 border-t pt-2'>
                {OPTIONS.map((option) => (
                  <OptionSwitch
                    key={option.id}
                    description={option.description}
                    id={option.id}
                    label={option.label}
                    checked={options[option.id]}
                    onCheckedChange={(checked) => onOptionsChange({ [option.id]: checked })}
                  />
                ))}
              </div>
            </TooltipProvider>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Editor Component */}
      {editorComponent && (
        <div className='min-h-0 w-full flex-1 overflow-hidden'>{editorComponent}</div>
      )}
    </div>
  )
}
