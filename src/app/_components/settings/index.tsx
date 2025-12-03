'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { AppConfig, MarginPreset, Orientation, PageSize, ThemePreset } from '@/types/config'
import { MARGIN_PRESETS, THEME_PRESETS } from '@/types/config'
import { RotateCcw, Settings } from 'lucide-react'
import { useState } from 'react'
import { EditorConfigComponent } from './editor'
import { PageSizeConfigComponent } from './page-size'
import { ThemeConfigComponent } from './theme'
import { TypographyConfigComponent } from './typography'

interface SettingsDialogProps {
  config: AppConfig
  onConfigChange: (config: Partial<AppConfig>) => void
  onPageSizeChange: (size: PageSize) => void
  onOrientationChange: (orientation: Orientation) => void
  onReset: () => void
  onApplyMarginPreset: (preset: MarginPreset) => void
  onApplyThemePreset: (preset: ThemePreset) => void
}

export function SettingsDialog({
  config,
  onConfigChange,
  onPageSizeChange,
  onOrientationChange,
  onReset,
  onApplyMarginPreset,
  onApplyThemePreset,
}: SettingsDialogProps) {
  const [open, setOpen] = useState(false)

  // Detecta qual preset de margem está ativo
  const getCurrentMarginPreset = (): MarginPreset => {
    const current = config.page.margin
    for (const [key, preset] of Object.entries(MARGIN_PRESETS)) {
      if (key === 'custom') continue
      if (
        preset.margin.top === current.top &&
        preset.margin.right === current.right &&
        preset.margin.bottom === current.bottom &&
        preset.margin.left === current.left
      ) {
        return key as MarginPreset
      }
    }
    return 'custom'
  }

  // Detecta qual preset de tema está ativo
  const getCurrentThemePreset = (): ThemePreset => {
    if (!config.theme) return 'modern'
    const current = config.theme
    for (const [key, preset] of Object.entries(THEME_PRESETS)) {
      if (key === 'custom') continue
      if (
        preset.background === current.background &&
        preset.textColor === current.textColor &&
        preset.headingColor === current.headingColor
      ) {
        return key as ThemePreset
      }
    }
    return 'custom'
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant='outline' size='sm'>
          <Settings className='mr-2 h-4 w-4' />
          Configurações
        </Button>
      </SheetTrigger>
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

          <PageSizeConfigComponent
            value='page'
            config={config}
            onPageSizeChange={onPageSizeChange}
            onOrientationChange={onOrientationChange}
            onApplyMarginPreset={onApplyMarginPreset}
            getCurrentMarginPreset={getCurrentMarginPreset}
            onConfigChange={onConfigChange}
          />
          <TypographyConfigComponent
            value='typography'
            config={config}
            onConfigChange={onConfigChange}
          />

          <ThemeConfigComponent
            value='theme'
            config={config}
            onConfigChange={onConfigChange}
            getCurrentThemePreset={getCurrentThemePreset}
            onApplyThemePreset={onApplyThemePreset}
          />

          <EditorConfigComponent value='editor' config={config} onConfigChange={onConfigChange} />
        </Tabs>

        <Separator />

        <div className='flex items-center justify-between'>
          <Button variant='outline' onClick={onReset}>
            <RotateCcw className='mr-2 h-4 w-4' />
            Restaurar Padrões
          </Button>
          <Button onClick={() => setOpen(false)}>Salvar</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
