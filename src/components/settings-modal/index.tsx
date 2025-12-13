'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useConfig } from '@/shared/contexts/configContext'
import { useMDToPdfValid } from '@/shared/contexts/mdToPdfContext'
import { RotateCcw } from 'lucide-react'
import { EditorConfigComponent } from './editor'
import { PageSizeConfigComponent } from './page-size'
import { ThemeConfigComponent } from './theme'
import { TypographyConfigComponent } from './typography'

export function SettingsDialog({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const hasContext = useMDToPdfValid()
  if (!hasContext) return null
  const { resetConfig } = useConfig()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side='right' className='w-full overflow-y-auto px-4'>
        <SheetHeader>
          <SheetTitle>Configurações do Documento</SheetTitle>
          <SheetDescription>
            Personalize o tamanho da página, tipografia e outras opções de formatação.
          </SheetDescription>
        </SheetHeader>
        <Tabs defaultValue='page' className='w-full'>
          <TabsList className='grid w-full grid-cols-4'>
            <TabsTrigger value='page' className='cursor-pointer'>
              Página
            </TabsTrigger>
            <TabsTrigger value='typography' className='cursor-pointer'>
              Tipografia
            </TabsTrigger>
            <TabsTrigger value='theme' className='cursor-pointer'>
              Tema
            </TabsTrigger>
            <TabsTrigger value='editor' className='cursor-pointer'>
              Editor
            </TabsTrigger>
          </TabsList>
          <PageSizeConfigComponent value='page' />
          <TypographyConfigComponent value='typography' />
          <ThemeConfigComponent value='theme' />
          <EditorConfigComponent value='editor' />
        </Tabs>
        <Separator />
        <div className='flex items-center justify-between'>
          <Button variant='outline' onClick={resetConfig}>
            <RotateCcw className='mr-2 h-4 w-4' />
            Restaurar Padrões
          </Button>
          <Button onClick={() => setOpen(false)}>Salvar</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
