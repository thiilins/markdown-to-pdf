'use client'

import { CodeFormatterEditor } from '@/app/(tools)/_components/code-formatter-editor'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, FileJson, Sparkles } from 'lucide-react'
import { EXAMPLE_SPECS } from './utils'

interface OpenApiInputProps {
  value: string
  onChange: (value: string) => void
}

export function OpenApiEditor({ value, onChange }: OpenApiInputProps) {
  const examples = [
    {
      id: 'petstore',
      label: 'Pet Store API',
      description: 'API completa com múltiplos endpoints e schemas',
      icon: Sparkles,
    },
    {
      id: 'simple',
      label: 'API Simples (YAML)',
      description: 'Exemplo minimalista em formato YAML',
      icon: FileJson,
    },
  ]

  return (
    <div className='flex h-full flex-col'>
      {/* Informação no topo */}
      <div className='border-b border-blue-500/20 bg-blue-500/10 p-4'>
        <div className='flex gap-3'>
          <AlertCircle className='h-5 w-5 shrink-0 text-blue-500' />
          <div className='space-y-1'>
            <p className='text-sm font-medium'>Suporte OpenAPI 3.0+</p>
            <p className='text-muted-foreground text-xs leading-relaxed'>
              Suporta OpenAPI 3.0+. A validação é automática. Referências locais ($ref) são
              resolvidas internamente.
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue='editor' className='flex flex-1 flex-col overflow-hidden'>
        <div className='border-b p-4'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='editor'>
              <FileJson className='mr-2 h-4 w-4' />
              Editor
            </TabsTrigger>
            <TabsTrigger value='examples'>
              <Sparkles className='mr-2 h-4 w-4' />
              Exemplos
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value='editor' className='flex-1 overflow-hidden p-0'>
          <div className='h-full'>
            <CodeFormatterEditor value={value} onChange={onChange} language='json' />
          </div>
        </TabsContent>

        <TabsContent value='examples' className='flex-1 overflow-hidden'>
          <ScrollArea className='h-full'>
            <div className='space-y-3 p-4'>
              <p className='text-muted-foreground text-sm'>
                Clique em um exemplo para carregar no editor
              </p>

              {examples.map((example) => {
                const Icon = example.icon
                return (
                  <Button
                    key={example.id}
                    variant='outline'
                    className='h-auto w-full justify-start gap-3 p-4 text-left'
                    onClick={() =>
                      onChange(EXAMPLE_SPECS[example.id as keyof typeof EXAMPLE_SPECS])
                    }>
                    <div className='bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg'>
                      <Icon className='h-5 w-5' />
                    </div>
                    <div className='flex-1'>
                      <div className='font-medium'>{example.label}</div>
                      <div className='text-muted-foreground text-sm'>{example.description}</div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
